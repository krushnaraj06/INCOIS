import React from 'react';
import { Heart, MessageCircle, Share, MapPin, Clock, CheckCircle } from 'lucide-react';
import { severityLevels } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

const PostCard = ({ post }) => {
  const { likePost } = useApp();
  const severity = severityLevels[post.severity];
  const [isLiked, setIsLiked] = React.useState(false);

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return date.toLocaleDateString();
  };

  const handleLike = () => {
    setIsLiked(!isLiked);
    likePost(post.id);
  };

  const getHazardIcon = (hazardType) => {
    const icons = {
      'Flood': '🌊',
      'Cyclone': '🌀', 
      'High Waves': '🌊',
      'Tsunami': '🌊'
    };
    return icons[hazardType] || '⚠️';
  };

  return (
    <div className="post-card">
      {/* User Info */}
      <div className="flex items-center space-x-3 mb-4">
        <div className="relative">
          <img
            src={post.user.avatar}
            alt={post.user.name}
            className="w-12 h-12 rounded-full object-cover"
          />
          {post.verified && (
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-blue-600 rounded-full flex items-center justify-center">
              <CheckCircle size={12} className="text-white" />
            </div>
          )}
        </div>
        <div className="flex-1">
          <div className="flex items-center space-x-2">
            <h3 className="font-semibold text-gray-900">{post.user.name}</h3>
            {post.verified && (
              <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                Verified
              </span>
            )}
          </div>
          <div className="flex items-center space-x-2 mt-1">
            <p className="text-sm text-gray-500">{post.user.handle}</p>
            <span className="text-gray-300">•</span>
            <div className="flex items-center space-x-1 text-gray-500">
              <Clock size={12} />
              <span className="text-xs">{formatTime(post.timestamp)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <p className="text-gray-800 mb-4 leading-relaxed">{post.content}</p>

      {/* Image */}
      {post.image && (
        <div className="mb-4 rounded-lg overflow-hidden">
          <img
            src={post.image}
            alt="Hazard report"
            className="w-full h-48 object-cover"
          />
        </div>
      )}

      {/* Hazard Info */}
      <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-xl">{getHazardIcon(post.hazardType)}</span>
          <div>
            <span className="text-sm font-semibold text-gray-800 block">
              {post.hazardType}
            </span>
            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${severity.bgColor} ${severity.textColor}`}>
              {severity.name} Risk
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-1 text-gray-600">
          <MapPin size={14} />
          <span className="text-xs">{post.location.name}</span>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <button
          onClick={handleLike}
          className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors duration-200 ${
            isLiked 
              ? 'bg-red-50 text-red-600' 
              : 'hover:bg-gray-50 text-gray-600'
          }`}
        >
          <Heart size={18} className={isLiked ? 'fill-current' : ''} />
          <span className="text-sm font-medium">{post.likes + (isLiked ? 1 : 0)}</span>
        </button>
        
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors duration-200">
          <MessageCircle size={18} />
          <span className="text-sm font-medium">{post.comments}</span>
        </button>
        
        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-50 text-gray-600 transition-colors duration-200">
          <Share size={18} />
          <span className="text-sm font-medium">{post.shares}</span>
        </button>
      </div>
    </div>
  );
};

export default PostCard;