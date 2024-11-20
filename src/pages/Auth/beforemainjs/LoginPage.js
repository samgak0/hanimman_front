import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../beforemaincss/LoginPage.css';

const LoginPage = () => {
  const navigate = useNavigate();

  // "로그인" 버튼 클릭 시 VerificationPage로 이동하는 함수
  const handleLoginRedirect = () => {
    navigate('/verification');
  };

  // "시작하기" 버튼 클릭 시 LocationPage로 이동
  const handleStart = () => {
    navigate('/location');
  };

  return (
    <div className="login-container">
      <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt="Loading Logo" className="logo" />
      <button className="start-button" onClick={handleStart}>시작하기</button>
      <div className="login-prompt">
        이미 계정이 있나요? <button className="login-button" onClick={handleLoginRedirect}>로그인</button>
      </div>
    </div>
  );
};

export default LoginPage;