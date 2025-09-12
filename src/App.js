import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AppProvider } from './contexts/AppContext';
import Sidebar from './components/Layout/Sidebar';
import RightSidebar from './components/Layout/RightSidebar';
import BottomNavigation from './components/Layout/BottomNavigation';
import FloatingActionButton from './components/Layout/FloatingActionButton';
import Home from './pages/Home';
import Map from './pages/Map';
import Report from './pages/Report';
import Profile from './pages/Profile';

function App() {
  return (
    <LanguageProvider>
      <AppProvider>
        <Router>
          <div className="App">
            <Sidebar />
            <RightSidebar />
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/map" element={<Map />} />
              <Route path="/report" element={<Report />} />
              <Route path="/profile" element={<Profile />} />
            </Routes>
            <BottomNavigation />
            <FloatingActionButton />
          </div>
        </Router>
      </AppProvider>
    </LanguageProvider>
  );
}

export default App;