// src/App.js
import "./App.css";
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import LoadingScreen from './pages/Auth/beforemainjs/LoadingScreen';
import LoginPage from './pages/Auth/beforemainjs/LoginPage';
import KeyNoti from './pages/Home/mainjs/KeyNoti';
import LocationPage from './pages/Auth/beforemainjs/LocationPage';
import VerificationPage from './pages/Auth/beforemainjs/VerificationPage';
import Notification from './pages/Home/mainjs/Notification';
import MyPage from './pages/User/mypage/MyPage';
import ZzimList from './pages/Home/mainjs/ZzimList';
import Events from './pages/Home/mainjs/Events';
import Announcement from './pages/Home/mainjs/Announcement';
import FAQ from './pages/Home/mainjs/FAQ';
import Terms from './pages/Home/mainjs/Terms';
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";
import userRoutes from "./routes/userRoutes";
import LocationSelect from './components/LocationSelect';
import { DataProvider } from "./context/DataContext";
import PrivateRoute from './routes/privateRoute';  // PrivateRoute 컴포넌트 import

const App = () => {
  return (
    <DataProvider>
    <Router>
      <Routes>
        {/* 기본 경로들 */}
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/verification" element={<VerificationPage />} />
        {/* 인증이 필요 없는 경로들 */}
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* 인증이 필요한 경로들 */}
        <Route path="/location" element={<PrivateRoute element={<LocationPage />} />} />
        <Route path="/notification" element={<PrivateRoute element={<Notification />} />} />
        <Route path="/keynoti" element={<PrivateRoute element={<KeyNoti />} />} />
        <Route path="/mypage" element={<PrivateRoute element={<MyPage />} />} />
        <Route path="/zzimlist" element={<PrivateRoute element={<ZzimList />} />} />
        <Route path="/locationselect" element={<PrivateRoute element={<LocationSelect />} />} />
        <Route path="/events" element={<PrivateRoute element={<Events />} />} />
        <Route path="/announcement" element={<PrivateRoute element={<Announcement />} />} />
        <Route path="/faq" element={<PrivateRoute element={<FAQ />} />} />
        <Route path="/terms" element={<PrivateRoute element={<Terms />} />} />

        {/* Main 관련 경로 */}
        {mainRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={<PrivateRoute element={element} />} />
        ))}

        {/* User 관련 경로 */}
        {userRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={<PrivateRoute element={element} />} />
        ))}
      </Routes>
    </Router>
  </DataProvider>
  );
};

export default App;
