// src/App.js
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoadingScreen from './pages/Auth/beforemainjs/LoadingScreen';
import LoginPage from './pages/Auth/beforemainjs/LoginPage'
import MainPage from './pages/Home/mainjs/MainPage'
import KeyNoti from './pages/Home/mainjs/KeyNoti';
import LocationPage from './pages/Auth/beforemainjs/LocationPage'
import VertificationPage from './pages/Auth/beforemainjs/VertificationPage'
import Notification from './pages/Home/mainjs/Notification'
import MyPage from './pages/User/mypage/MyPage'
import TogetherList from './pages/Post/TogetherList';
import TogetherCreate from './pages/Post/TogetherCreate';
import ZzimList from './pages/Home/mainjs/ZzimList';

import "./App.css"

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
        <Route path="/keynoti" element={<KeyNoti/>} />
        <Route path="/mypage" element={<MyPage/>} />
        <Route path='/togetherlist' element={<TogetherList/>} />
        <Route path='/togetherCreate' element={<TogetherCreate/>} />
        <Route path="/zzimlist" element={<ZzimList/>} />
      </Routes>
    </Router>
  );
};

export default App;