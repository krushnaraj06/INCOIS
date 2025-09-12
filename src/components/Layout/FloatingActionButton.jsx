import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';

const FloatingActionButton = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Don't show FAB on report page
  if (location.pathname === '/report') return null;

  return (
    <button
      onClick={() => navigate('/report')}
      className="floating-button fixed bottom-20 right-4 md:bottom-6 md:right-6 lg:right-96 z-50 group"
      aria-label="Create new report"
    >
      <Plus size={24} className="group-hover:rotate-90 transition-transform duration-200" />
      
      {/* Tooltip */}
      <div className="absolute bottom-full right-0 mb-2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap">
        Report Hazard
        <div className="absolute top-full right-4 w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-gray-900"></div>
      </div>
    </button>
  );
};

export default FloatingActionButton;