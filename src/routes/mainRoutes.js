import React from "react";
import MainPage from "../pages/Home/mainjs/MainPage";
import Notification from "../pages/Home/mainjs/Notification";
import TogetherList from "../pages/Post/Together/TogetherList";
import TogetherCreate from "../pages/Post/Together/TogetherCreate";
import TogetherDetail from "../pages/Post/Together/TogetherDetail";

const mainRoutes = [
  { path: "/main", element: <MainPage /> },
  { path: "/notification", element: <Notification /> },
  { path: "/togetherlist", element: <TogetherList /> },
  { path: "/togethercreate", element: <TogetherCreate /> },
  { path: "/togetherdetail", element: <TogetherDetail/>}
];

export default mainRoutes;