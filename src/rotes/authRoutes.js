import React from "react";
import { Route } from "react-router-dom";
import LoginPage from "../pages/Auth/beforemainjs/LoginPage";
import LocationPage from "../pages/Auth/beforemainjs/LocationPage";
import VertificationPage from "../pages/Auth/beforemainjs/VertificationPage";

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/location", element: <LocationPage /> },
  { path: "/vertification", element: <VertificationPage /> },
];

export default authRoutes;