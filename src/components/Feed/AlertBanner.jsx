import React from 'react';
import { AlertTriangle, X, MapPin, Clock } from 'lucide-react';
import { mockAlerts } from '../../data/mockData';

const AlertBanner = () => {
  const [dismissed, setDismissed] = React.useState(false);
  const activeAlert = mockAlerts.find(alert => alert.active);

  if (!activeAlert || dismissed) return null;

  return (
    <div className="alert-banner mb-6 animate-slide-up">
      <div className="flex items-start space-x-3">
        <AlertTriangle size={20} className="text-white flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <div className="flex items-center space-x-2 mb-1">
            <h3 className="font-bold text-white">{activeAlert.title}</h3>
            <span className="px-2 py-0.5 bg-white/20 rounded-full text-white text-xs font-bold">
              LIVE
            </span>
          </div>
          <p className="text-white/95 text-sm">{activeAlert.message}</p>
          <div className="flex items-center space-x-2 mt-2">
            <div className="flex items-center space-x-1 text-white/90">
              <MapPin size={12} />
              <span className="text-xs">{activeAlert.location}</span>
            </div>
            <span className="text-white/60">•</span>
            <div className="flex items-center space-x-1 text-white/90">
              <Clock size={12} />
              <span className="text-xs">Active Now</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => setDismissed(true)}
          className="flex-shrink-0 p-1 hover:bg-white/20 rounded-lg transition-colors duration-200"
        >
          <X size={16} className="text-white" />
        </button>
      </div>
    </div>
  );
};

export default AlertBanner;