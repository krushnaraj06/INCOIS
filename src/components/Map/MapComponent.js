import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import { mockPosts, severityLevels } from '../../data/mockData';

// Fix for default markers in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

// Custom marker icons based on severity
const createCustomIcon = (severity) => {
  const colors = {
    low: '#22c55e',
    medium: '#f59e0b',
    high: '#ef4444'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      background-color: ${colors[severity]};
      width: 20px;
      height: 20px;
      border-radius: 50%;
      border: 3px solid white;
      box-shadow: 0 2px 4px rgba(0,0,0,0.2);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

const MapComponent = () => {
  // Center map on India's coastline
  const center = [15.2993, 74.1240];
  const zoom = 6;

  return (
    <div className="h-full w-full relative">
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        className="z-10"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {mockPosts.map((post) => (
          <Marker
            key={post.id}
            position={post.location.coordinates}
            icon={createCustomIcon(post.severity)}
          >
            <Popup className="custom-popup">
              <div className="p-2 max-w-xs">
                <div className="flex items-center space-x-2 mb-2">
                  <img
                    src={post.user.avatar}
                    alt={post.user.name}
                    className="w-8 h-8 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-sm">{post.user.name}</h4>
                    <p className="text-xs text-gray-500">{post.hazardType}</p>
                  </div>
                </div>
                
                {post.image && (
                  <img
                    src={post.image}
                    alt="Hazard"
                    className="w-full h-24 object-cover rounded mb-2"
                  />
                )}
                
                <p className="text-sm text-gray-700 mb-2 line-clamp-2">
                  {post.content}
                </p>
                
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    severityLevels[post.severity].bgColor
                  } ${severityLevels[post.severity].textColor}`}>
                    {severityLevels[post.severity].name}
                  </span>
                  <span className="text-xs text-gray-500">
                    {post.location.name}
                  </span>
                </div>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      
      {/* Map Legend */}
      <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-20">
        <h4 className="font-semibold text-sm mb-2">Severity Levels</h4>
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-success-500"></div>
            <span className="text-xs">Low</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-warning-500"></div>
            <span className="text-xs">Medium</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full bg-danger-500"></div>
            <span className="text-xs">High</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MapComponent;