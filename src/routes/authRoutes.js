import React from "react";
import LoginPage from "../pages/Auth/beforemainjs/LoginPage";
import LocationPage from "../pages/Auth/beforemainjs/LocationPage";
import VerificationPage from "../pages/Auth/beforemainjs/VerificationPage";
import MobileVerificationPage from "../pages/Auth/beforemainjs/MobileVerificationPage";

const authRoutes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/verification/mobile", element: <MobileVerificationPage/>},
  { path: "/location", element: <LocationPage /> },
  { path: "/verification", element: <VerificationPage /> },
];

export default authRoutes;