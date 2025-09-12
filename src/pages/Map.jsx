import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import Header from '../components/Layout/Header';
import MapComponent from '../components/Map/MapComponent';
import BottomSheet from '../components/Map/BottomSheet';

const Map = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 md:pb-0 pb-20">
      <Header title="Hazard Map" />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex md:ml-64 lg:mr-80">
        <div className="flex-1 relative" style={{ height: 'calc(100vh - 0px)' }}>
          <MapComponent />
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden relative" style={{ height: 'calc(100vh - 140px)' }}>
        <MapComponent />
        <BottomSheet />
        
        {/* Floating Upload Button - Mobile only, desktop uses sidebar */}
        <button
          onClick={() => navigate('/report')}
          className="absolute bottom-6 right-6 bg-primary-500 hover:bg-primary-600 text-white p-4 rounded-full shadow-lg transition-all duration-200 hover:shadow-xl z-20 md:hidden"
        >
          <Plus size={24} />
        </button>
      </div>
    </div>
  );
};

export default Map;