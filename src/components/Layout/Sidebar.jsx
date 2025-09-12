import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Plus, User, Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t, currentLanguage, switchLanguage } = useLanguage();

  const navItems = [
    { path: '/', icon: Home, label: t('home') },
    { path: '/map', icon: Map, label: t('map') },
    { path: '/report', icon: Plus, label: t('report') },
    { path: '/profile', icon: User, label: t('profile') }
  ];

  return (
    <div className="hidden md:flex md:flex-col md:fixed md:left-0 md:top-0 md:h-full md:w-64 sidebar-clean md:z-40 md:shadow-sm">
      {/* Logo/Header */}
      <div className="p-6 border-b border-gray-100">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-lg">🌊</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Ocean Guard</h1>
            <p className="text-sm text-gray-500">Coastal Safety Network</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 text-left ${
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              <Icon size={20} className={isActive ? 'text-blue-600' : 'text-gray-500'} />
              <span className="font-medium">{label}</span>
            </button>
          );
        })}
      </nav>

      {/* Language Toggle */}
      <div className="p-4 border-t border-gray-100">
        <button
          onClick={() => switchLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <Globe size={20} className="text-gray-600" />
          <span className="font-medium text-gray-700 text-sm">
            {currentLanguage === 'en' ? 'हिंदी में बदलें' : 'Switch to English'}
          </span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;