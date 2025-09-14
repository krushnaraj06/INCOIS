import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Home, Map, Plus, User, BarChart3 } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const BottomNavigation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { t } = useLanguage();

  const navItems = [
    { path: '/', icon: BarChart3, label: 'Dashboard' },
    { path: '/feed', icon: Home, label: 'Feed' },
    { path: '/report', icon: Plus, label: t('report') },
    { path: '/map', icon: Map, label: t('map') },
    { path: '/profile', icon: User, label: t('profile') }
  ];

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-4 py-2 z-50 md:hidden">
      <div className="flex justify-around items-center max-w-md mx-auto">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <button
              key={path}
              onClick={() => navigate(path)}
              className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors duration-200 ${
                isActive
                  ? 'text-primary-600 bg-primary-50'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Icon 
                size={24} 
                className={path === '/report' && isActive ? 'bg-primary-600 text-white p-1 rounded-full' : ''}
              />
              <span className="text-xs mt-1 font-medium">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default BottomNavigation;