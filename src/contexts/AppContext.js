import React, { createContext, useContext, useState } from 'react';
import { mockPosts, mockUser } from '../data/mockData';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [posts, setPosts] = useState(mockPosts);
  const [user] = useState(mockUser);
  const [activeFilter, setActiveFilter] = useState('all');

  const addPost = (newPost) => {
    const post = {
      ...newPost,
      id: Date.now(),
      user: user,
      timestamp: new Date().toISOString(),
      likes: 0,
      comments: 0,
      shares: 0,
      verified: false
    };
    setPosts(prevPosts => [post, ...prevPosts]);
  };

  const likePost = (postId) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, likes: post.likes + 1 }
          : post
      )
    );
  };

  const getFilteredPosts = () => {
    if (activeFilter === 'all') return posts;

    const filterMap = {
      'flood': 'Flood',
      'high-waves': 'High Waves',
      'cyclone': 'Cyclone',
      'tsunami': 'Tsunami'
    };

    return posts.filter(post =>
      post.hazardType === filterMap[activeFilter]
    );
  };

  return (
    <AppContext.Provider value={{
      posts,
      user,
      activeFilter,
      setActiveFilter,
      addPost,
      likePost,
      getFilteredPosts
    }}>
      {children}
    </AppContext.Provider>
  );
};