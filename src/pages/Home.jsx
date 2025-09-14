import React, { useState, useEffect } from 'react';
import { RefreshCw, AlertTriangle } from 'lucide-react';
import Header from '../components/Layout/Header';
import AlertBanner from '../components/Feed/AlertBanner';
import TipsCarousel from '../components/Feed/TipsCarousel';
import FilterBar from '../components/Feed/FilterBar';
import PostCard from '../components/Feed/PostCard';
import { useApp } from '../contexts/AppContext';

const Home = () => {
  const { getFilteredPosts } = useApp();
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredPosts = getFilteredPosts();

  const handleRefresh = async () => {
    setIsRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsRefreshing(false);
  };

  // Calculate dynamic alert based on severity
  const getHighestSeverityAlert = () => {
    const highSeverityPosts = filteredPosts.filter(post => post.severity === 'high');
    if (highSeverityPosts.length >= 3) {
      return {
        title: "Critical Alert",
        message: `Multiple high-severity incidents reported. ${highSeverityPosts.length} critical reports in your area.`,
        severity: "high"
      };
    } else if (highSeverityPosts.length >= 1) {
      return {
        title: "High Alert", 
        message: `${highSeverityPosts.length} high-severity incident(s) reported nearby.`,
        severity: "high"
      };
    }
    return null;
  };

  const dynamicAlert = getHighestSeverityAlert();



  return (
    <div className="min-h-screen bg-gray-50 md:pb-0 pb-20">
      <Header title="Ocean Hazard Feed" />
      
      {/* Desktop Layout */}
      <div className="hidden md:flex md:ml-64 lg:mr-80">
        <div className="flex-1 max-w-2xl mx-auto px-6 py-6">
          {/* Pull to refresh indicator */}
          <div className="flex justify-center mb-6">
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`flex items-center space-x-2 px-6 py-3 rounded-full bg-white shadow-sm border border-gray-200 transition-all duration-200 ${
                isRefreshing ? 'opacity-50' : 'hover:shadow-md'
              }`}
            >
              <RefreshCw size={18} className={`${isRefreshing ? 'animate-spin' : ''} text-gray-600`} />
              <span className="text-sm text-gray-600 font-medium">
                {isRefreshing ? 'Refreshing...' : 'Refresh Feed'}
              </span>
            </button>
          </div>

          {/* Dynamic Alert Banner */}
          {dynamicAlert && (
            <div className="bg-danger-500 text-white p-4 mb-6 rounded-lg animate-slide-up">
              <div className="flex items-start space-x-3">
                <AlertTriangle size={20} className="flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="font-semibold text-sm">{dynamicAlert.title}</h3>
                  <p className="text-sm opacity-90 mt-1">{dynamicAlert.message}</p>
                </div>
              </div>
            </div>
          )}

          <FilterBar />
          
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <PostCard key={post.id} post={post} />
            ))}
            
            {filteredPosts.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No posts found for the selected filter.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Layout */}
      <div 
        className="md:hidden max-w-md mx-auto px-4 py-4 overflow-y-auto"
        style={{ height: 'calc(100vh - 140px)' }}
      >
        {/* Pull to refresh indicator */}
        <div className="flex justify-center mb-4">
          <button
            onClick={handleRefresh}
            disabled={isRefreshing}
            className={`flex items-center space-x-2 px-4 py-2 rounded-full bg-white shadow-sm border border-gray-200 transition-all duration-200 ${
              isRefreshing ? 'opacity-50' : 'hover:shadow-md'
            }`}
          >
            <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''} text-gray-600`} />
            <span className="text-sm text-gray-600">
              {isRefreshing ? 'Refreshing...' : 'Pull to refresh'}
            </span>
          </button>
        </div>

        <AlertBanner />
        <TipsCarousel />
        <FilterBar />
        
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
          
          {filteredPosts.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No posts found for the selected filter.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;