// src/App.js
import "./App.css"
import React from 'react';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import BlockedUserManagement from './components/BlockedUserManagement';
import LoadingScreen from './pages/Auth/beforemainjs/LoadingScreen';
import KeyNoti from './pages/Home/mainjs/KeyNoti';
import Notification from './pages/Home/mainjs/Notification'
import MyPage from './pages/User/mypage/MyPage'
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



const App = () => {
  return (
    <DataProvider>
    <Router>
      <Routes>
        <Route path="/" element={<LoadingScreen />} />
        <Route path="/user/blocked" element={<BlockedUserManagement />} />
        <Route path="/notification" element={<Notification />} />
        <Route path="/keynoti" element={<KeyNoti />} />
        <Route path="/mypage" element={<MyPage />} />
        <Route path="/zzimlist" element={<ZzimList />} />
        <Route path="/locationselect" element={<LocationSelect />} />
        <Route path="/events" element={<Events />} />
        <Route path="/announcement" element={<Announcement />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/terms" element={<Terms />} />

        {/* Auth 관련 경로 */}
        {authRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* Main 관련 경로 */}
        {mainRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}

        {/* User 관련 경로 */}
        {userRoutes.map(({ path, element }) => (
          <Route key={path} path={path} element={element} />
        ))}
      </Routes>
    </Router>
  </DataProvider>
  );
};

export default App;