import React from 'react';
import { AlertTriangle, TrendingUp, Users, MapPin } from 'lucide-react';
import { mockAlerts, mockTips } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

const RightSidebar = () => {
  const { posts } = useApp();
  const recentReports = posts.slice(0, 3);
  const activeAlert = mockAlerts.find(alert => alert.active);

  return (
    <div className="hidden lg:block lg:w-80 lg:fixed lg:right-0 lg:top-0 lg:h-full bg-gray-50 lg:border-l lg:border-gray-200 lg:overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Active Alert */}
        {activeAlert && (
          <div className="alert-banner">
            <div className="flex items-start space-x-3">
              <AlertTriangle size={20} className="text-white flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="font-bold text-white">{activeAlert.title}</h3>
                <p className="text-white/90 text-sm mt-1">{activeAlert.message}</p>
                <div className="flex items-center space-x-1 mt-2 text-white/80">
                  <MapPin size={14} />
                  <span className="text-sm">{activeAlert.location}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Safety Tips */}
        <div className="card-elevated p-5">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <TrendingUp size={18} className="text-blue-600" />
            <span>Safety Tips</span>
          </h3>
          <div className="space-y-3">
            {mockTips.map((tip) => (
              <div key={tip.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg hover:bg-blue-50 transition-colors duration-200">
                <span className="text-xl">{tip.icon}</span>
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-800 text-sm">{tip.title}</h4>
                  <p className="text-xs text-gray-600 mt-1">{tip.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Reports */}
        <div className="card-elevated p-5">
          <h3 className="font-bold text-gray-900 mb-4 flex items-center space-x-2">
            <Users size={18} className="text-blue-600" />
            <span>Recent Reports</span>
          </h3>
          <div className="space-y-3">
            {recentReports.map((post) => (
              <div key={post.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200 cursor-pointer">
                <img
                  src={post.user.avatar}
                  alt={post.user.name}
                  className="w-10 h-10 rounded-lg object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h4 className="font-semibold text-gray-800 text-sm truncate">{post.user.name}</h4>
                    <span className="px-2 py-0.5 bg-blue-100 text-blue-700 text-xs rounded-full font-medium">{post.hazardType}</span>
                  </div>
                  <p className="text-xs text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                  <div className="flex items-center space-x-1 mt-2 text-gray-500">
                    <MapPin size={12} />
                    <span className="text-xs truncate">{post.location.name}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stats */}
        <div className="card-elevated p-5">
          <h3 className="font-bold text-gray-900 mb-4">Today's Activity</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Total Reports</span>
              <span className="font-bold text-gray-900">{posts.length}</span>
            </div>
            <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">High Severity</span>
              <span className="font-bold text-red-600">
                {posts.filter(p => p.severity === 'high').length}
              </span>
            </div>
            <div className="flex justify-between items-center p-3 bg-emerald-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">Active Users</span>
              <span className="font-bold text-emerald-600">156</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RightSidebar;