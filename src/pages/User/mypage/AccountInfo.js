import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AccountInfo.css";

const AccountInfo = () => {
  const navigate = useNavigate();

  // JSON 데이터를 상단에 선언
  const initialAccountInfo = {
    email: "forkmango@forkmango.com",
    phone: "010 7432 0307",
    verificationDate: "2024.12.20"
  };

  const [accountInfo, setAccountInfo] = useState({
    email: "",
    phone: "",
    verificationDate: ""
  });

  useEffect(() => {
    // JSON 데이터를 상태로 설정
    setAccountInfo(initialAccountInfo);
  }, []);

  return (
    <div className="account-info-container">
      <header className="account-info-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>
        <h1>계정 / 정보 관리</h1>
      </header>

      <div className="account-info-section">
        <div className="account-info-item">
          <span>이메일</span>
          <span className="account-info-value">{accountInfo.email}</span>
          <button className="change-button">변경</button>
        </div>
        <div className="account-info-item">
          <span>휴대폰 번호</span>
          <span className="account-info-value">{accountInfo.phone}</span>
          <button className="change-button">변경</button>
        </div>
        <div className="account-info-item">
          <span>당근 본인인증</span>
          <span className="account-info-value">{accountInfo.verificationDate}</span>
          <button className="confirm-button">확인</button>
        </div>
      </div>
    </div>
  );
};

export default AccountInfo;