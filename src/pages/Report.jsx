import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Clock, ArrowLeft } from 'lucide-react';
import Header from '../components/Layout/Header';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { hazardTypes } from '../data/mockData';

const Report = () => {
  const navigate = useNavigate();
  const { addPost } = useApp();
  const { t } = useLanguage();
  
  const [step, setStep] = useState(1); // 1: capture, 2: details, 3: preview
  const [formData, setFormData] = useState({
    image: null,
    imagePreview: null,
    hazardType: '',
    description: '',
    location: 'Marina Beach, Chennai', // Mock location
    timestamp: new Date().toLocaleString()
  });

  const handleImageCapture = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          image: file,
          imagePreview: e.target.result
        }));
        // Get geolocation
        getCurrentLocation();
        setStep(2);
      };
      reader.readAsDataURL(file);
    }
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // Mock reverse geocoding - in real app, use geocoding service
          const mockLocationName = `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;
          setFormData(prev => ({
            ...prev,
            location: mockLocationName,
            coordinates: [latitude, longitude]
          }));
        },
        (error) => {
          console.log('Geolocation error:', error);
          // Fallback to mock location
          setFormData(prev => ({
            ...prev,
            location: 'Marina Beach, Chennai',
            coordinates: [13.0827, 80.2707]
          }));
        }
      );
    }
  };

  const handleSubmit = () => {
    const newPost = {
      content: formData.description || `${formData.hazardType} reported at ${formData.location}`,
      image: formData.imagePreview,
      hazardType: formData.hazardType,
      severity: 'medium', // Default severity
      location: {
        name: formData.location,
        coordinates: formData.coordinates || [13.0827, 80.2707]
      }
    };
    
    addPost(newPost);
    navigate('/');
  };

  const renderStep1 = () => (
    <div className="text-center py-8">
      <div className="mb-8">
        <div className="w-32 h-32 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Camera size={48} className="text-gray-400" />
        </div>
        <h2 className="text-xl font-semibold mb-2">Capture Hazard Report</h2>
        <p className="text-gray-600">Take a photo of the ocean hazard you want to report</p>
      </div>
      
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
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      {/* Image Preview */}
      <div className="relative">
        <img
          src={formData.imagePreview}
          alt="Captured hazard"
          className="w-full h-48 object-cover rounded-lg"
        />
        <button
          onClick={() => setStep(1)}
          className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-2 rounded-full"
        >
          <Camera size={16} />
        </button>
      </div>

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
          src={formData.imagePreview}
          alt="Report preview"
          className="w-full h-48 object-cover rounded-lg mb-3"
        />
        
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