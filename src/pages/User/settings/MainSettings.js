import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MainSettings.css";
import { useNavigate } from "react-router-dom";

const MainSettings = () => {
  const navigate = useNavigate();

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false); // 로그아웃 모달 상태 관리
  const [isTimeSettingModalOpen, setTimeSettingModalOpen] = useState(false); // 시간설정 모달 상태 관리
  const [selectedTime, setSelectedTime] = useState(new Date()); // DatePicker의 선택된 시간
  const [timeType, setTimeType] = useState(""); // "시작 시간" 또는 "종료 시간"

  // 로그아웃 모달
  const openLogoutModal = () => setLogoutModalOpen(true);
  const closeLogoutModal = () => setLogoutModalOpen(false);

  // 시간 설정 모달
  const openTimeSettingModal = (type) => {
    setTimeType(type); // 시간 종류 설정
    setTimeSettingModalOpen(true);
  };
  const closeTimeSettingModal = () => setTimeSettingModalOpen(false);

  const handleTimeConfirm = () => {
    console.log(`${timeType}: ${selectedTime.toLocaleTimeString()} 설정 완료`);
    closeTimeSettingModal();
  };

  const handleLogout = () => {
    console.log("Logged out");
    closeLogoutModal();
    navigate("/login");
  };

  return (
    <div className="settings-container">
      <header className="settings-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>
        <h1>설정</h1>
      </header>

      <div className="settings-section">
        <h2>알림 설정</h2>
        <div className="settings-item">
          <span>알림 수신 설정</span>
          <input type="checkbox" className="toggle-switch" />
        </div>
        <div className="settings-item">
          <span>방해금지 시간 설정</span>
          <input type="checkbox" className="toggle-switch" />
        </div>
        <div className="settings-item time-setting">
          <span>시작 시간</span>
          <span
            className="time-value"
            onClick={() => openTimeSettingModal("시작 시간")}
          >
            {selectedTime.toLocaleTimeString()}
          </span>
        </div>
        <div className="settings-item time-setting">
          <span>종료 시간</span>
          <span
            className="time-value"
            onClick={() => openTimeSettingModal("종료 시간")}
          >
            {selectedTime.toLocaleTimeString()}
          </span>
        </div>
      </div>

      <div className="settings-section">
        <h2>사용자 설정</h2>
        <div className="settings-item" onClick={() => navigate("/user/account")}>
          <span>계정 / 정보 관리</span>
        </div>
        <div
          className="settings-item"
          onClick={() => navigate("/user/collections")}
        >
          <span>모아보기 사용자 관리</span>
        </div>
        <div
          className="settings-item"
          onClick={() => navigate("/user/blocked")}
        >
          <span>차단 사용자 관리</span>
        </div>
      </div>

      <div className="settings-section">
        <div className="settings-item">
          <span>캐시 데이터 삭제</span>
        </div>
        <div className="settings-item">
          <span>최신버전 업데이트</span>
          <span className="version-value">24.45.2 (244502)</span>
        </div>
        <div className="settings-item logout" onClick={openLogoutModal}>
          <span>로그아웃</span>
        </div>
        <div
          className="settings-item delete-account"
          onClick={() => alert("탈퇴하기")}
        >
          <span>탈퇴하기</span>
        </div>
      </div>

      {/* 로그아웃 모달 */}
      {isLogoutModalOpen && (
        <div className="modal-overlay" onClick={closeLogoutModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>로그아웃</h2>
            <p>정말 로그아웃할까요?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleLogout}>
                로그아웃
              </button>
              <button className="cancel-btn" onClick={closeLogoutModal}>
                닫기
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 시간 설정 모달 */}
      {isTimeSettingModalOpen && (
        <div className="modal-overlay" onClick={closeTimeSettingModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{timeType} 설정</h2>
            <DatePicker
              selected={selectedTime}
              onChange={(date) => setSelectedTime(date)}
              showTimeSelect
              showTimeSelectOnly
              timeIntervals={5}
              timeCaption="시간"
              dateFormat="h:mm aa"
              className="time-picker"
            />
            <div className="modal-actions">
              <button className="confirm-btn" onClick={handleTimeConfirm}>
                확인
              </button>
              <button className="cancel-btn" onClick={closeTimeSettingModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MainSettings;