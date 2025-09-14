import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Camera, MapPin, Clock, ArrowLeft, AlertTriangle, X } from 'lucide-react';
import { hazardTypes } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';
import { useLanguage } from '../../contexts/LanguageContext';

const QuickReport = () => {
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
    
    // Reset form
    setFormData({
      image: null,
      imagePreview: null,
      hazardType: '',
      description: '',
      location: 'Marina Beach, Chennai',
      timestamp: new Date().toLocaleString()
    });
    setStep(1);
    
    // Show success message
    alert('Report submitted successfully!');
  };

  const handleDetailedReport = () => {
    navigate('/report');
  };

  const handleClose = () => {
    setStep(1);
    setFormData({
      image: null,
      imagePreview: null,
      hazardType: '',
      description: '',
      location: 'Marina Beach, Chennai',
      timestamp: new Date().toLocaleString()
    });
  };

  const renderStep1 = () => (
    <div className="text-center py-4">
      <div className="mb-4">
        <div className="w-20 h-20 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-3">
          <Camera size={32} className="text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold mb-1">Quick Report</h3>
        <p className="text-sm text-gray-600">Take a photo or use detailed form</p>
      </div>
      
      <div className="space-y-3">
        {/* Mobile Camera */}
        <label className="w-full btn-primary cursor-pointer inline-block md:hidden">
          <Camera size={16} className="inline mr-2" />
          Take Photo
          <input
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleImageCapture}
            className="hidden"
          />
        </label>

        {/* Desktop File Upload */}
        <label className="w-full btn-primary cursor-pointer hidden md:inline-block">
          <Camera size={16} className="inline mr-2" />
          Upload Photo
          <input
            type="file"
            accept="image/*"
            onChange={handleImageCapture}
            className="hidden"
          />
        </label>

        <button
          onClick={handleDetailedReport}
          className="w-full btn-secondary"
        >
          Detailed Report Form
        </button>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Report Details</h3>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>

      {/* Image Preview */}
      <div className="relative">
        <img
          src={formData.imagePreview}
          alt="Captured hazard"
          className="w-full h-32 object-cover rounded-lg"
        />
        <button
          onClick={() => setStep(1)}
          className="absolute top-2 left-2 bg-black bg-opacity-50 text-white p-1 rounded-full"
        >
          <Camera size={14} />
        </button>
      </div>

      {/* Auto-generated info */}
      <div className="bg-gray-50 rounded-lg p-3 space-y-2">
        <div className="flex items-center space-x-2 text-gray-600">
          <MapPin size={14} />
          <span className="text-sm">{formData.location}</span>
        </div>
        <div className="flex items-center space-x-2 text-gray-600">
          <Clock size={14} />
          <span className="text-sm">{formData.timestamp}</span>
        </div>
      </div>

      {/* Hazard Type Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Hazard Type *
        </label>
        <select
          value={formData.hazardType}
          onChange={(e) => setFormData(prev => ({ ...prev, hazardType: e.target.value }))}
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
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
          Description (Optional)
        </label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          placeholder="Describe what you're seeing..."
          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
          rows={2}
        />
      </div>

      <button
        onClick={() => setStep(3)}
        disabled={!formData.hazardType}
        className="w-full btn-primary disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Preview Report
      </button>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Preview Report</h3>
        <button
          onClick={handleClose}
          className="p-1 hover:bg-gray-100 rounded-full"
        >
          <X size={20} className="text-gray-500" />
        </button>
      </div>
      
      {/* Preview Card */}
      <div className="border border-gray-200 rounded-lg p-3">
        <div className="flex items-center space-x-2 mb-2">
          <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
          <div>
            <h4 className="font-semibold text-sm">You</h4>
            <p className="text-xs text-gray-500">@your_handle</p>
          </div>
        </div>
        
        <p className="text-sm text-gray-800 mb-2">
          {formData.description || `${formData.hazardType} reported at ${formData.location}`}
        </p>
        
        <img
          src={formData.imagePreview}
          alt="Report preview"
          className="w-full h-24 object-cover rounded-lg mb-2"
        />
        
        <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
          <span className="text-xs font-medium">{formData.hazardType}</span>
          <div className="flex items-center space-x-1 text-gray-500">
            <MapPin size={10} />
            <span className="text-xs">{formData.location}</span>
          </div>
        </div>
      </div>

      <div className="flex space-x-2">
        <button
          onClick={() => setStep(2)}
          className="flex-1 btn-secondary flex items-center justify-center space-x-1"
        >
          <ArrowLeft size={14} />
          <span>Back</span>
        </button>
        <button
          onClick={handleSubmit}
          className="flex-1 btn-primary"
        >
          Submit Report
        </button>
      </div>
    </div>
  );

  return (
    <div className="card p-4">
      <div className="flex items-center space-x-2 mb-4">
        <AlertTriangle size={18} className="text-orange-600" />
        <h3 className="text-lg font-semibold text-gray-900">Quick Report</h3>
      </div>

      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {step === 1 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg">
          <p className="text-sm text-blue-700">
            <strong>Emergency:</strong> Call 108 immediately for urgent situations.
          </p>
        </div>
      )}
    </div>
  );
};

export default QuickReport;