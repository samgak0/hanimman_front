// src/LoginPage.js
import React from 'react';
import './css/LoginPage.css';

const LoginPage = () => {
  // "로그인" 버튼 클릭 시 네이버로 이동하는 함수
  const handleLoginRedirect = () => {
    window.location.href = 'https://www.naver.com';
  };

  return (
    <div className="login-container">
      <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt="Loading Logo" className="logo" />
      <button className="start-button">시작하기</button>
      <div className="login-prompt">
        이미 계정이 있나요? <button className="login-button" onClick={handleLoginRedirect}>로그인</button>
      </div>
    </div>
  );
};

export default LoginPage;