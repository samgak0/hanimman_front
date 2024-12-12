// src/App.js
import "./App.css";
import React from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { ToastContainer } from "react-toastify"; // ToastContainer 추가
import "react-toastify/dist/ReactToastify.css"; // Toastify 기본 CSS 추가
import LoadingScreen from "./pages/Auth/beforemainjs/LoadingScreen";
import LoginPage from "./pages/Auth/beforemainjs/LoginPage";
import KeyNoti from "./pages/Home/mainjs/KeyNoti";
import LocationPage from "./pages/Auth/beforemainjs/LocationPage";
import VerificationPage from "./pages/Auth/beforemainjs/VerificationPage";
import Notification from "./pages/Home/mainjs/Notification";
import MyPage from "./pages/User/mypage/MyPage";
import ZzimList from "./pages/Home/mainjs/ZzimList";
import Events from "./pages/Home/mainjs/Events";
import Announcement from "./pages/Home/mainjs/Announcement";
import AnnouncementDetail from "./pages/Home/mainjs/AnnouncementDetail";
import FAQ from "./pages/Home/mainjs/FAQ";
import FAQDetail from "./pages/Home/mainjs/FAQDetail";
import InquiryCreate from "./pages/Home/mainjs/InquiryCreate";
import Terms from "./pages/Home/mainjs/Terms";
import authRoutes from "./routes/authRoutes";
import mainRoutes from "./routes/mainRoutes";
import userRoutes from "./routes/userRoutes";
import LocationSelect from "./components/LocationSelect";
import { DataProvider } from "./context/DataContext";
import PrivateRoute from "./routes/privateRoute";
import TogetherList from "./pages/Post/Together/TogetherList";
import TogetherDetail from "./pages/Post/Together/TogetherDetail";
import Search from "./pages/Home/mainjs/Search";
import TogetherReport from "./pages/Post/Together/TogetherReport";
import ShareReport from "./pages/Post/Share/ShareReport";
import ParticipantList from "./pages/Home/mainjs/ParticipantList";

const App = () => {
  return (
    <DataProvider>
      <Router>
        {/* ToastContainer를 최상위에 추가 */}
        <ToastContainer
          position="bottom-center"
          autoClose={3000}
          hideProgressBar
          closeOnClick
          pauseOnHover
        />
        <Routes>
          {/* 기본 경로들 */}
          <Route path="/" element={<LoadingScreen />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verification" element={<VerificationPage />} />
          {authRoutes.map(({ path, element }) => (
            <Route key={path} path={path} element={element} />
          ))}
          <Route
            path="/location"
            element={<PrivateRoute element={<LocationPage />} />}
          />
          <Route
            path="/notification"
            element={<PrivateRoute element={<Notification />} />}
          />
          <Route
            path="/keynoti"
            element={<PrivateRoute element={<KeyNoti />} />}
          />
          <Route
            path="/mypage"
            element={<PrivateRoute element={<MyPage />} />}
          />
          <Route
            path="/zzimlist"
            element={<PrivateRoute element={<ZzimList />} />}
          />
          <Route
            path="/locationselect"
            element={<PrivateRoute element={<LocationSelect />} />}
          />
          <Route
            path="/events"
            element={<PrivateRoute element={<Events />} />}
          />
          <Route
            path="/announcement"
            element={<PrivateRoute element={<Announcement />} />}
          />
          <Route
            path="/announcement/:id"
            element={<PrivateRoute element={<AnnouncementDetail />} />}
          />
          <Route path="/faq" element={<PrivateRoute element={<FAQ />} />} />
          <Route
            path="/faq/:id"
            element={<PrivateRoute element={<FAQDetail />} />}
          />
          <Route path="/terms" element={<PrivateRoute element={<Terms />} />} />
          <Route
            path="/inquiry"
            element={<PrivateRoute element={<InquiryCreate />} />}
          />
          <Route
            path="/search"
            element={<PrivateRoute element={<Search />} />}
          />
          <Route
            path="/togetherreport"
            element={<PrivateRoute element={<TogetherReport />} />}
          />
          <Route
            path="/sharereport"
            element={<PrivateRoute element={<ShareReport />} />}
          />
          <Route
            path="/participantlist"
            element={<PrivateRoute element={<ParticipantList />} />}
          />

          {/* Main 관련 경로 */}
          {mainRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute element={element} />}
            />
          ))}

          {/* User 관련 경로 */}
          {userRoutes.map(({ path, element }) => (
            <Route
              key={path}
              path={path}
              element={<PrivateRoute element={element} />}
            />
          ))}

          <Route path="/togetherlist" element={<TogetherList />} />
          <Route path="/togetherdetail/:id" element={<TogetherDetail />} />
        </Routes>
      </Router>
    </DataProvider>
  );
};

export default App;
