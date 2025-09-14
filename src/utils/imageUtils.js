/**
 * Utility functions for image processing and geolocation overlay
 */

/**
 * Add geolocation overlay to an image
 * @param {string} imageDataUrl - Base64 image data URL
 * @param {Object} coordinates - {latitude, longitude}
 * @returns {Promise<string>} - Base64 image data URL with overlay
 */
export const addGeolocationOverlay = async (imageDataUrl, coordinates) => {
  return new Promise((resolve) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    
    img.onload = () => {
      // Set canvas size to match image
      canvas.width = img.width;
      canvas.height = img.height;
      
      // Draw the original image
      ctx.drawImage(img, 0, 0);
      
      // Add geolocation overlay
      const overlayHeight = 60;
      const overlayY = canvas.height - overlayHeight;
      
      // Semi-transparent background
      ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
      ctx.fillRect(0, overlayY, canvas.width, overlayHeight);
      
      // White text
      ctx.fillStyle = 'white';
      ctx.font = 'bold 16px Arial';
      ctx.textAlign = 'left';
      
      // Location text
      const locationText = `📍 Lat: ${coordinates.latitude.toFixed(4)}, Lng: ${coordinates.longitude.toFixed(4)}`;
      ctx.fillText(locationText, 10, overlayY + 25);
      
      // Timestamp
      const timestamp = new Date().toLocaleString();
      ctx.font = '14px Arial';
      ctx.fillText(`🕒 ${timestamp}`, 10, overlayY + 45);
      
      // Convert back to data URL
      const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
      resolve(dataUrl);
    };
    
    img.src = imageDataUrl;
  });
};

/**
 * Convert file to base64 data URL
 * @param {File} file - Image file
 * @returns {Promise<string>} - Base64 data URL
 */
export const fileToDataUrl = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * Get current geolocation
 * @returns {Promise<Object>} - {latitude, longitude}
 */
export const getCurrentLocation = () => {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation is not supported by this browser'));
      return;
    }
    
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
      },
      (error) => {
        reject(error);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  });
};

/**
 * Call flood detection API
 * @param {string} imageDataUrl - Base64 image data URL
 * @param {Object} coordinates - {latitude, longitude}
 * @returns {Promise<Object>} - Flood detection results
 */
export const detectFlood = async (imageDataUrl, coordinates) => {
  try {
    const response = await fetch('http://localhost:5000/api/flood-detection', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        image: imageDataUrl,
        coordinates: coordinates
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return await response.json();
  } catch (error) {
    console.error('Flood detection error:', error);
    // Return mock data if API is not available
    return {
      success: false,
      error: 'Flood detection service unavailable',
      mock: true,
      prediction: {
        "Flooded Scene": 0.3,
        "Non Flooded": 0.7
      },
      is_flooded: false,
      confidence: 0.7,
      risk_level: "Low"
    };
  }
};
