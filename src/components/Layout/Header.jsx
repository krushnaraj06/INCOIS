import React from 'react';
import { Globe } from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';

const Header = ({ title, showLanguageToggle = true }) => {
  const { currentLanguage, switchLanguage } = useLanguage();

  return (
    <div className="bg-white border-b border-gray-200 px-4 py-3 sticky top-0 z-40 md:hidden">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        
        {showLanguageToggle && (
          <button
            onClick={() => switchLanguage(currentLanguage === 'en' ? 'hi' : 'en')}
            className="flex items-center space-x-1 px-3 py-1 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors duration-200"
          >
            <Globe size={16} />
            <span className="text-sm font-medium">
              {currentLanguage === 'en' ? 'हिं' : 'EN'}
            </span>
          </button>
        )}
      </div>
    </div>
  );
};

export default Header;