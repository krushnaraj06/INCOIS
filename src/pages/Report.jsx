import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Clock, ArrowLeft, AlertTriangle, CheckCircle, Loader2 } from 'lucide-react';
import Header from '../components/Layout/Header';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { hazardTypes } from '../data/mockData';
import { addGeolocationOverlay, fileToDataUrl, getCurrentLocation, detectFlood } from '../utils/imageUtils';

const Report = () => {
  const navigate = useNavigate();
  const { addPost } = useApp();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1); // 1: capture, 2: details, 3: preview
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    imageWithOverlay: null,
    hazardType: '',
    description: '',
    location: 'Marina Beach, Chennai', // Mock location
    timestamp: new Date().toLocaleString(),
    coordinates: null,
    floodDetection: null,
    isProcessing: false
  });

  const handleImageCapture = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, isProcessing: true }));
      
      try {
        // Convert file to data URL
        const imageDataUrl = await fileToDataUrl(file);
        
        // Get current location
        const coordinates = await getCurrentLocation();
        
        // Add geolocation overlay to image
        const imageWithOverlay = await addGeolocationOverlay(imageDataUrl, coordinates);
        
        // Perform flood detection
        const floodDetection = await detectFlood(imageDataUrl, coordinates);
        
        // Update form data
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: imageDataUrl,
          imageWithOverlay: imageWithOverlay,
          coordinates: coordinates,
          location: `Lat: ${coordinates.latitude.toFixed(4)}, Lng: ${coordinates.longitude.toFixed(4)}`,
          floodDetection: floodDetection,
          isProcessing: false
        }));
        
        setStep(2);
      } catch (error) {
        console.error('Error processing image:', error);
        // Fallback to basic processing
        const reader = new FileReader();
        reader.onload = (e) => {
          setFormData(prev => ({
            ...prev,
            image: file,
            imagePreview: e.target.result,
            imageWithOverlay: e.target.result,
            location: 'Location unavailable',
            coordinates: { latitude: 0, longitude: 0 },
            floodDetection: {
              success: false,
              error: 'Location and flood detection unavailable',
              mock: true
            },
            isProcessing: false
          }));
          setStep(2);
        };
        reader.readAsDataURL(file);
      }
    }
  };


  const handleSubmit = () => {
    const newPost = {
      content: formData.description || `${formData.hazardType} reported at ${formData.location}`,
      image: formData.imageWithOverlay || formData.imagePreview,
      hazardType: formData.hazardType,
      severity: formData.floodDetection?.risk_level?.toLowerCase() || 'medium',
      location: {
        name: formData.location,
        coordinates: formData.coordinates ? [formData.coordinates.latitude, formData.coordinates.longitude] : [13.0827, 80.2707]
      },
      floodDetection: formData.floodDetection
    };
    
    addPost(newPost);
    navigate('/');
  };

  const renderStep1 = () => (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          {formData.isProcessing ? (
            <Loader2 size={48} className="text-primary-500 animate-spin" />
          ) : (
          <Camera size={48} className="text-gray-400" />
          )}
        </div>
        <h2 className="text-xl font-semibold mb-2">
          {formData.isProcessing ? 'Processing Image...' : 'Capture Hazard Report'}
        </h2>
        <p className="text-gray-600">
          {formData.isProcessing 
            ? 'Adding geolocation and analyzing for flood detection...' 
            : 'Take a photo of the ocean hazard you want to report'
          }
        </p>
      </div>
      
      {!formData.isProcessing && (
      <div className="space-y-4">
        {/* Mobile Camera */}
        <label className="btn-primary cursor-pointer inline-block md:hidden">
          <Camera size={20} className="inline mr-2" />
          {t('takePhoto')}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />
        </label>

        {/* Desktop File Upload */}
        <label className="btn-primary cursor-pointer hidden md:inline-block">
          <Camera size={20} className="inline mr-2" />
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageCapture}
            className="hidden"
          />
        </label>
      </div>
      )}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Image Preview with Overlay */}
      <div className="relative">
        <img
          src={formData.imageWithOverlay || formData.imagePreview}
          alt="Captured hazard with geolocation"
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          onClick={() => setStep(1)}
          className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <Camera size={16} />
        </button>
      </div>

      {/* Flood Detection Results */}
      {formData.floodDetection && (
        <div className={`rounded-lg p-4 ${
          formData.floodDetection.is_flooded 
            ? 'bg-red-50 border border-red-200' 
            : 'bg-green-50 border border-green-200'
        }`}>
          <div className="flex items-center space-x-2 mb-2">
            {formData.floodDetection.is_flooded ? (
              <AlertTriangle size={20} className="text-red-500" />
            ) : (
              <CheckCircle size={20} className="text-green-500" />
            )}
            <h3 className="font-semibold text-lg">
              {formData.floodDetection.is_flooded ? 'Flood Detected' : 'No Flood Detected'}
            </h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Confidence:</span>
              <span className="text-sm">{Math.round((formData.floodDetection.confidence || 0) * 100)}%</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Risk Level:</span>
              <span className={`text-sm font-semibold ${
                formData.floodDetection.risk_level === 'High' ? 'text-red-600' :
                formData.floodDetection.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'
              }`}>
                {formData.floodDetection.risk_level || 'Unknown'}
              </span>
            </div>
            
            {formData.floodDetection.prediction && (
              <div className="mt-3">
                <div className="text-sm font-medium mb-2">Detailed Analysis:</div>
                <div className="space-y-1">
                  {Object.entries(formData.floodDetection.prediction).map(([label, confidence]) => (
                    <div key={label} className="flex justify-between items-center">
                      <span className="text-xs">{label}:</span>
                      <span className="text-xs">{Math.round(confidence * 100)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            
            {/* Social Media Analysis */}
            {formData.floodDetection.social_media_analysis && (
              <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <div className="text-sm font-medium mb-2 text-blue-800">📱 Social Media Analysis:</div>
                <div className="space-y-1 text-xs">
                  <div className="flex justify-between">
                    <span>Sentiment Score:</span>
                    <span className="font-medium">{Math.round(formData.floodDetection.social_media_analysis.sentiment_score * 100)}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Posts Analyzed:</span>
                    <span>{formData.floodDetection.social_media_analysis.post_count}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Flood Mentions:</span>
                    <span>{formData.floodDetection.social_media_analysis.mention_count}</span>
                  </div>
                  {formData.floodDetection.social_media_analysis.relevant_keywords && 
                   formData.floodDetection.social_media_analysis.relevant_keywords.length > 0 && (
                    <div className="mt-2">
                      <div className="text-blue-700 font-medium mb-1">Keywords:</div>
                      <div className="flex flex-wrap gap-1">
                        {formData.floodDetection.social_media_analysis.relevant_keywords.map((keyword, index) => (
                          <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs">
                            {keyword}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
          </div>
        </div>
      )}

      {/* Auto-generated info */}
      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin size={16} />
          <span className="text-sm">{formData.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock size={16} />
          <span className="text-sm">{formData.timestamp}</span>
        </div>
      </div>

      {/* Hazard Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('selectHazard')}
        </label>
        <select
          value={formData.hazardType}
          onChange={(e) => setFormData(prev => ({ ...prev, hazardType: e.target.value }))}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        >
          <option value="">Select hazard type</option>
          {hazardTypes.slice(1).map(type => (
            <option key={type.id} value={type.name}>{type.name}</option>
          ))}
        </select>
      </div>

      {/* Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {t('addDescription')}
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what you're seeing..."
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          rows={3}
        />
      </div>

      <button
        onClick={() => setStep(3)}
        disabled={!formData.hazardType}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {t('preview')}
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-center">Preview Report</h2>
      
      {/* Preview Card */}
      <div className="card p-4">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
          <div>
            <h3 className="font-semibold">You</h3>
            <p className="text-sm text-gray-500">@your_handle</p>
          </div>
        </div>
        
        <p className="text-gray-800 mb-3">
          {formData.description || `${formData.hazardType} reported at ${formData.location}`}
        </p>
        
        <img
          src={formData.imageWithOverlay || formData.imagePreview}
          alt="Report preview with geolocation"
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        
        {/* Flood Detection Summary */}
        {formData.floodDetection && (
          <div className={`rounded-lg p-3 mb-3 ${
            formData.floodDetection.is_flooded 
              ? 'bg-red-50 border border-red-200' 
              : 'bg-green-50 border border-green-200'
          }`}>
            <div className="flex items-center space-x-2">
              {formData.floodDetection.is_flooded ? (
                <AlertTriangle size={16} className="text-red-500" />
              ) : (
                <CheckCircle size={16} className="text-green-500" />
              )}
              <span className="font-medium text-sm">
                {formData.floodDetection.is_flooded ? 'Flood Detected' : 'No Flood Detected'} 
                ({Math.round((formData.floodDetection.confidence || 0) * 100)}% confidence)
              </span>
            </div>
          </div>
        )}
        
        <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
          <span className="text-sm font-medium">{formData.hazardType}</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <MapPin size={14} />
            <span className="text-xs">{formData.location}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-3">
        <button
          onClick={() => setStep(2)}
          className="flex-1 btn-secondary"
        >
          <ArrowLeft size={16} className="inline mr-2" />
          Back
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 btn-primary"
        >
          {t('submit')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 md:pb-0 pb-20">
      <Header title={t('uploadReport')} showLanguageToggle={false} />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex md:ml-64 lg:mr-80">
        <div className="flex-1 max-w-2xl mx-auto px-6 py-8">
          {/* Progress Indicator */}
          <div className="flex items-center justify-center mb-8">
            {[1, 2, 3].map((stepNum) => (
              <React.Fragment key={stepNum}>
                <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium ${
                  step >= stepNum
                    ? 'bg-primary-500 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}>
                  {stepNum}
                </div>
                {stepNum < 3 && (
                  <div className={`w-12 h-1 ${
                    step > stepNum ? 'bg-primary-500' : 'bg-gray-200'
                  }`} />
                )}
              </React.Fragment>
            ))}
          </div>

          <div className="bg-white rounded-lg border border-gray-200 p-8">
            {step === 1 && renderStep1()}
            {step === 2 && renderStep2()}
            {step === 3 && renderStep3()}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden max-w-md mx-auto px-4 py-6">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-6">
          {[1, 2, 3].map((stepNum) => (
            <React.Fragment key={stepNum}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                step >= stepNum
                  ? 'bg-primary-500 text-white'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {stepNum}
              </div>
              {stepNum < 3 && (
                <div className={`w-8 h-1 ${
                  step > stepNum ? 'bg-primary-500' : 'bg-gray-200'
                }`} />
              )}
            </React.Fragment>
          ))}
        </div>

        {step === 1 && renderStep1()}
        {step === 2 && renderStep2()}
        {step === 3 && renderStep3()}
      </div>
    </div>
  );
};

export default Report;