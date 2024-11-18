import React from "react";
import MyPage from "../pages/User/mypage/MyPage";
import ZzimList from "../pages/Home/mainjs/ZzimList";


const userRoutes = [
  { path: "/mypage", element: <MyPage /> },          // 마이페이지
  { path: "/zzimlist", element: <ZzimList /> },      // 찜 목록

];

export default userRoutes;