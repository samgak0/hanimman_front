import React from "react";
import "./RegisterButton.css"; // 등록 버튼에 대한 별도 스타일

const RegisterButton = ({ onClick }) => {
  return (
    <div className="register-button-container">
      <button 
        className="register-button" 
        onClick={onClick} 
        aria-label="새로운 게시물 등록"
      >
        +
      </button>
    </div>
  );
};

export default RegisterButton;
