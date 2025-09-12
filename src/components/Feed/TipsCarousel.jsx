import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { mockTips } from '../../data/mockData';

const TipsCarousel = () => {
  const [currentTip, setCurrentTip] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % mockTips.length);
  };

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + mockTips.length) % mockTips.length);
  };

  // Auto-advance tips every 5 seconds
  useEffect(() => {
    const interval = setInterval(nextTip, 5000);
    return () => clearInterval(interval);
  }, []);

  // Touch/swipe handlers
  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleTouchEnd = (e) => {
    if (!isDragging) return;
    
    const endX = e.changedTouches[0].clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) { // Minimum swipe distance
      if (diffX > 0) {
        nextTip();
      } else {
        prevTip();
      }
    }
    
    setIsDragging(false);
  };

  // Mouse handlers for desktop
  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
  };

  const handleMouseUp = (e) => {
    if (!isDragging) return;
    
    const endX = e.clientX;
    const diffX = startX - endX;
    
    if (Math.abs(diffX) > 50) {
      if (diffX > 0) {
        nextTip();
      } else {
        prevTip();
      }
    }
    
    setIsDragging(false);
  };

  return (
    <div className="tips-carousel mb-6 select-none">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-2">
          <span className="text-lg">💡</span>
          <h3 className="font-bold text-gray-900">Safety Tips</h3>
        </div>
        <div className="flex space-x-1">
          {mockTips.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentTip(index)}
              className={`w-2 h-2 rounded-full transition-colors duration-200 ${
                index === currentTip ? 'bg-blue-600' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </div>
      
      <div 
        className="flex items-center space-x-3 cursor-grab active:cursor-grabbing"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={() => setIsDragging(false)}
      >
        <button
          onClick={prevTip}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
        >
          <ChevronLeft size={18} className="text-gray-600" />
        </button>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <span className="text-2xl flex-shrink-0">{mockTips[currentTip].icon}</span>
            <div className="min-w-0">
              <h4 className="font-semibold text-gray-800 truncate">
                {mockTips[currentTip].title}
              </h4>
              <p className="text-sm text-gray-600 mt-1 line-clamp-2">
                {mockTips[currentTip].content}
              </p>
            </div>
          </div>
        </div>
        
        <button
          onClick={nextTip}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200 flex-shrink-0"
        >
          <ChevronRight size={18} className="text-gray-600" />
        </button>
      </div>
    </div>
  );
};

export default TipsCarousel;