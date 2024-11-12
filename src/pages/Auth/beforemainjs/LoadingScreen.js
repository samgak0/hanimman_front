// src/LoadingScreen.js
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // useNavigate로 변경
import '../beforemaincss/LoadingScreen.css';

const LoadingScreen = () => {
  const navigate = useNavigate(); // useNavigate 사용

  useEffect(() => {
    // 로컬 스토리지에서 로그인 기록 확인
    const isLoggedIn = localStorage.getItem('isLoggedIn');

    // 2초 후에 조건에 따라 페이지 이동
    const timer = setTimeout(() => {
      if (isLoggedIn === 'true') {
        navigate('/main');  // 메인 페이지로 이동
      } else {
        navigate('/login');  // 로그인 페이지로 이동
      }
    }, 2000);

    return () => clearTimeout(timer);  // 컴포넌트가 언마운트될 때 타이머 정리
  }, [navigate]);

  return (
    <div className="loading-container">
      <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt="Loading Logo" className="logo" />
    </div>
  );
};

export default LoadingScreen;