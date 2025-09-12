import React from 'react';
import { hazardTypes } from '../../data/mockData';
import { useApp } from '../../contexts/AppContext';

const FilterBar = () => {
  const { activeFilter, setActiveFilter } = useApp();

  const getFilterIcon = (typeId) => {
    const icons = {
      'all': '🌐',
      'flood': '🌊',
      'high-waves': '🌊',
      'cyclone': '🌀',
      'tsunami': '🌊'
    };
    return icons[typeId] || '⚠️';
  };

  return (
    <div className="flex space-x-2 overflow-x-auto pb-2 mb-6 scrollbar-hide">
      {hazardTypes.map((type) => {
        const isActive = activeFilter === type.id;
        return (
          <button
            key={type.id}
            onClick={() => setActiveFilter(type.id)}
            className={`flex-shrink-0 flex items-center space-x-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive
                ? 'bg-blue-600 text-white shadow-sm'
                : 'bg-white hover:bg-gray-50 text-gray-700 border border-gray-200'
            }`}
          >
            <span className="text-base">{getFilterIcon(type.id)}</span>
            <span>{type.name}</span>
          </button>
        );
      })}
    </div>
  );
};

export default FilterBar;