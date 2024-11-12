// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoadingScreen from './beforemainjs/LoadingScreen';
import MainPage from './MainPage';
import LoginPage from './beforemainjs/LoginPage';
import LocationPage from './beforemainjs/LocationPage';
import VertificationPage from './beforemainjs/VertificationPage';
import Notification from './mainjs/Notification'
import KeyNoti from './mainjs/KeyNoti'

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/main" element={<MainPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/location" element={<LocationPage />} />
        <Route path="/vertification" element={<VertificationPage />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/keynoti" element={<KeyNoti />} />
      </Routes>
    </Router>
  );
};

export default App;