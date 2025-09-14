import React from 'react';
import { Settings, Award, MapPin, Calendar } from 'lucide-react';
import Header from '../components/Layout/Header';
import PostCard from '../components/Feed/PostCard';
import { useApp } from '../contexts/AppContext';
import { useLanguage } from '../contexts/LanguageContext';
import { mockUser } from '../data/mockData';

const Profile = () => {
  const { posts } = useApp();
  const { t } = useLanguage();
  
  // Filter posts by current user
  const userPosts = posts.filter(post => post.user.id === mockUser.id);

  // Enhanced badge system based on user stats
  const getUpdatedBadges = () => {
    const updatedBadges = [...mockUser.badges];
    
    // Update badges based on current stats
    updatedBadges.forEach(badge => {
      if (badge.name === "5 Reports Posted" && mockUser.stats.reports >= 5) {
        badge.earned = true;
      }
      if (badge.name === "Verified Reporter" && mockUser.stats.reports >= 10) {
        badge.earned = true;
      }
    });

    // Add new badges
    if (mockUser.stats.reports >= 15) {
      updatedBadges.push({
        id: 5,
        name: "Expert Reporter",
        icon: "🏆",
        earned: true
      });
    }

    return updatedBadges;
  };

  const badges = getUpdatedBadges();

  return (
    <div className="min-h-screen bg-gray-50 md:pb-0 pb-20">
      <Header title={t('myProfile')} />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex md:ml-64 lg:mr-80">
        <div className="flex-1 max-w-4xl mx-auto px-6 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Header */}
              <div className="card p-6 text-center">
                <img
                  src={mockUser.avatar}
                  alt={mockUser.name}
                  className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                />
                <h2 className="text-2xl font-bold text-gray-900">{mockUser.name}</h2>
                <p className="text-gray-500 mb-2">{mockUser.handle}</p>
                <p className="text-sm text-gray-600">{mockUser.email}</p>
                
                <div className="flex items-center justify-center space-x-1 mt-3 text-gray-500">
                  <Calendar size={14} />
                  <span className="text-xs">
                    Joined {new Date(mockUser.joinDate).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-1 gap-4">
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-primary-600">{mockUser.stats.reports}</div>
                  <div className="text-sm text-gray-600">{t('myReports')}</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-primary-600">{mockUser.stats.likes}</div>
                  <div className="text-sm text-gray-600">Likes</div>
                </div>
                <div className="card p-4 text-center">
                  <div className="text-3xl font-bold text-primary-600">{mockUser.stats.comments}</div>
                  <div className="text-sm text-gray-600">Comments</div>
                </div>
              </div>

              {/* Settings */}
              <div className="card p-4">
                <button className="flex items-center space-x-3 w-full p-3 hover:bg-gray-50 rounded-lg transition-colors duration-200">
                  <Settings size={20} className="text-gray-600" />
                  <span className="font-medium text-gray-700">{t('settings')}</span>
                </button>
              </div>
            </div>

            {/* Posts and Badges */}
            <div className="lg:col-span-2 space-y-6">
              {/* Badges */}
              <div className="card p-6">
                <div className="flex items-center space-x-2 mb-6">
                  <Award size={24} className="text-primary-600" />
                  <h3 className="text-xl font-semibold text-gray-900">{t('badges')}</h3>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {badges.map((badge) => (
                    <div
                      key={badge.id}
                      className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                        badge.earned
                          ? 'border-primary-200 bg-primary-50'
                          : 'border-gray-200 bg-gray-50 opacity-50'
                      }`}
                    >
                      <div className="text-center">
                        <div className="text-3xl mb-2">{badge.icon}</div>
                        <div className="text-sm font-medium text-gray-700">
                          {badge.name}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* User Posts */}
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">{t('myReports')}</h3>
                {userPosts.length > 0 ? (
                  <div className="grid grid-cols-1 gap-6">
                    {userPosts.map((post) => (
                      <PostCard key={post.id} post={post} />
                    ))}
                  </div>
                ) : (
                  <div className="card p-12 text-center">
                    <div className="text-gray-400 mb-4">
                      <MapPin size={64} className="mx-auto" />
                    </div>
                    <p className="text-gray-500 text-lg">No reports yet</p>
                    <p className="text-sm text-gray-400 mt-2">
                      Start reporting hazards to help your community
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="md:hidden max-w-md mx-auto px-4 py-6 space-y-6">
        {/* Profile Header */}
        <div className="card p-6 text-center">
          <img
            src={mockUser.avatar}
            alt={mockUser.name}
            className="w-20 h-20 rounded-full mx-auto mb-4 object-cover"
          />
          <h2 className="text-xl font-bold text-gray-900">{mockUser.name}</h2>
          <p className="text-gray-500 mb-2">{mockUser.handle}</p>
          <p className="text-sm text-gray-600">{mockUser.email}</p>
          
          <div className="flex items-center justify-center space-x-1 mt-2 text-gray-500">
            <Calendar size={14} />
            <span className="text-xs">
              Joined {new Date(mockUser.joinDate).toLocaleDateString()}
            </span>
          </div>
        </div>

        

        {/* Badges */}
        <div className="card p-4">
          <div className="flex items-center space-x-2 mb-4">
            <Award size={20} className="text-primary-600" />
            <h3 className="font-semibold text-gray-900">{t('badges')}</h3>
          </div>
          
          <div className="grid grid-cols-2 gap-3">
            {badges.map((badge) => (
              <div
                key={badge.id}
                className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                  badge.earned
                    ? 'border-primary-200 bg-primary-50'
                    : 'border-gray-200 bg-gray-50 opacity-50'
                }`}
              >
                <div className="text-center">
                  <div className="text-2xl mb-1">{badge.icon}</div>
                  <div className="text-xs font-medium text-gray-700">
                    {badge.name}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Settings */}
        <div className="card p-4">
          <button className="flex items-center space-x-3 w-full p-2 hover:bg-gray-50 rounded-lg transition-colors duration-200">
            <Settings size={20} className="text-gray-600" />
            <span className="font-medium text-gray-700">{t('settings')}</span>
          </button>
        </div>

        {/* User Posts */}
        <div>
          <h3 className="font-semibold text-gray-900 mb-4">{t('myReports')}</h3>
          {userPosts.length > 0 ? (
            <div className="space-y-4">
              {userPosts.map((post) => (
                <PostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <div className="card p-8 text-center">
              <div className="text-gray-400 mb-2">
                <MapPin size={48} className="mx-auto" />
              </div>
              <p className="text-gray-500">No reports yet</p>
              <p className="text-sm text-gray-400 mt-1">
                Start reporting hazards to help your community
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;