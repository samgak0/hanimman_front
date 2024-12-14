import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../beforemaincss/LoginPage.css';

const LoginPage = () => {
  
  const navigate = useNavigate();
  const [token, setToken] = useState(null);

   // 토큰이 있으면 메인페이지로 넘어가기 
  useEffect(() => {
    const storedToken = localStorage.getItem("authToken");
    setToken(storedToken);
    if (storedToken) {
      navigate("/main");
    }
  }, [navigate]); // navigate를 의존성 배열에 추가하여 안전하게 사용

  // "로그인" 버튼 클릭 시 VerificationPage로 이동하는 함수
  const handleLoginRedirect = () => {
    navigate('/verification');
  };

  // "시작하기" 버튼 클릭 시 LocationPage로 이동
  const handleStart = () => {
    navigate('/verification');
  };

  return (
    <div className='mobile-container'>
    <div className="login-container">
      <img src={`${process.env.PUBLIC_URL}/mangologo.png`} alt="Loading Logo" className="logo" />
      <button className="start-button" onClick={handleStart}>시작하기</button>
      <div className="login-prompt">
        이미 계정이 있나요? <button className="login-button" onClick={handleLoginRedirect}>로그인</button>
      </div>
    </div>
    </div>
  );
};

export default LoginPage;