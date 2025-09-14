import React, { useState } from 'react';
import { ChevronUp, ChevronDown, MapPin, Clock } from 'lucide-react';
import { severityLevels } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

const BottomSheet = () => {
  const { posts } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);
  const recentReports = posts.slice(0, 5);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className={`md:hidden fixed bottom-20 left-0 right-0 bg-white rounded-t-2xl shadow-2xl transition-all duration-300 z-30 ${
      isExpanded ? 'h-96' : 'h-24'
    }`}>
      {/* Handle */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between"
      >
        <div className="flex items-center space-x-3">
          <div className="w-1 h-8 bg-gray-300 rounded-full"></div>
          <div>
            <h3 className="font-semibold text-gray-900">Recent Reports</h3>
            <p className="text-sm text-gray-500">{recentReports.length} active reports</p>
          </div>
        </div>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronUp size={20} />}
      </button>

      {/* Content */}
      {isExpanded && (
        <div className="px-4 pb-4 overflow-y-auto" style={{ height: 'calc(100% - 96px)' }}>
          <div className="space-y-3">
            {recentReports.map((post) => {
              const severity = severityLevels[post.severity];
              return (
                <div key={post.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                  <img
                    src={post.image}
                    alt="Report"
                    className="w-12 h-12 rounded-lg object-cover flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2 mb-1">
                      <span className="font-medium text-gray-800 text-sm">{post.hazardType}</span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${severity.bgColor} ${severity.textColor}`}>
                        {severity.name}
                      </span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2 mb-2">{post.content}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <MapPin size={12} />
                        <span className="truncate">{post.location.name}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock size={12} />
                        <span>{formatTime(post.timestamp)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BottomSheet;