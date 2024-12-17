import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { toast } from "react-toastify";
import "react-datepicker/dist/react-datepicker.css";
import "./MainSettings.css";
import { useNavigate } from "react-router-dom";
import jwtAxios from '../../../api/jwtAxios';

const MainSettings = () => {
  const navigate = useNavigate();

  const [isLogoutModalOpen, setLogoutModalOpen] = useState(false); // 로그아웃 모달 상태 관리
  const [isTimeSettingModalOpen, setTimeSettingModalOpen] = useState(false); // 시간설정 모달 상태 관리
  const [startTime, setStartTime] = useState(new Date()); // 시작 시간 상태
  const [endTime, setEndTime] = useState(new Date()); // 종료 시간 상태}
  const [timeType, setTimeType] = useState(""); // "시작 시간" 또는 "종료 시간
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
    console.log(
      `${timeType}: ${
        timeType === "시작 시간"
          ? startTime.toLocaleTimeString()
          : endTime.toLocaleTimeString()
      } 설정 완료`
    );
    closeTimeSettingModal();
  };

  // 버튼 클릭 시 로그아웃
  const handleLogout = () => {
    closeLogoutModal();
    localStorage.removeItem('authToken');
    navigate("/login");
  };

  const handleSignout = () => {
    const result = window.confirm("정말 탈퇴하시겠습니까?");
    if(result){
      jwtAxios.post("http://localhost:8080/users/delete",{
      }).then(() =>{
        localStorage.removeItem("authToken");
        localStorage.removeItem("refreshToken");
        toast.success("탈퇴 완료했습니다.", { position: "bottom-center" });
        navigate("/login");
      }).catch(error => {
        console.error("로그아웃 실패:", error);
      });
    }
  }

  return (
    <div className='mobile-container'>
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
        <div className="settings-item time-setting" onClick={() => openTimeSettingModal("시작 시간")}>
          <span>시작 시간</span>
          <span className="time-value">
            {startTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
        <div className="settings-item time-setting" onClick={() => openTimeSettingModal("종료 시간")}>
          <span>종료 시간</span>
          <span className="time-value">
            {endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      <div className="settings-section account">
        <h2>사용자 설정</h2>
        <div className="settings-item" onClick={() => navigate("/user/account")}>
          <span>계정 / 정보 관리</span>
        </div>
        <div
          className="settings-item blocked"
        >
          <span>차단 사용자 관리</span>
        </div>
      </div>

      <div className="settings-section reset-cache">
        <div className="settings-item">
          <span>캐시 데이터 삭제</span>
        </div>
        <div className="settings-item version">
          <span>현재 버전</span>
          <span className="version-value">24.45.2 (244502)</span>
        </div>
        <div className="settings-item logout" onClick={openLogoutModal}>
          <span>로그아웃</span>
        </div>
        <div
          className="settings-item delete-account"
          onClick={handleSignout}
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
      <div className="time-picker-container">
        {/* AM/PM 선택 */}
        <select
          value={(timeType === "시작 시간" ? startTime : endTime).getHours() >= 12 ? "PM" : "AM"}
          onChange={(e) => {
            const isPM = e.target.value === "PM";
            const currentHour =
              timeType === "시작 시간"
                ? startTime.getHours()
                : endTime.getHours();

            const updatedHour = isPM
              ? currentHour < 12
                ? currentHour + 12
                : currentHour
              : currentHour >= 12
              ? currentHour - 12
              : currentHour;

            if (timeType === "시작 시간") {
              setStartTime(new Date(startTime.setHours(updatedHour)));
            } else {
              setEndTime(new Date(endTime.setHours(updatedHour)));
            }
          }}
          className="time-select am-pm-select"
        >
          <option value="AM">AM</option>
          <option value="PM">PM</option>
        </select>

        {/* 시간 선택 */}
        <select
          value={(timeType === "시작 시간" ? startTime : endTime).getHours() % 12 || 12}
          onChange={(e) => {
            const newHour = parseInt(e.target.value, 10);
            const currentDate =
              timeType === "시작 시간" ? startTime : endTime;
            const isPM = currentDate.getHours() >= 12;
            const adjustedHour = isPM ? newHour + 12 : newHour;

            if (timeType === "시작 시간") {
              setStartTime(new Date(startTime.setHours(adjustedHour % 24)));
            } else {
              setEndTime(new Date(endTime.setHours(adjustedHour % 24)));
            }
          }}
          className="time-select hour-select"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              {i + 1}
            </option>
          ))}
        </select>

        {/* 분 선택 */}
        <select
          value={(timeType === "시작 시간" ? startTime : endTime).getMinutes()}
          onChange={(e) => {
            const newMinute = parseInt(e.target.value, 10);
            if (timeType === "시작 시간") {
              setStartTime(new Date(startTime.setMinutes(newMinute)));
            } else {
              setEndTime(new Date(endTime.setMinutes(newMinute)));
            }
          }}
          className="time-select minute-select"
        >
          {[...Array(12)].map((_, i) => (
            <option key={i * 5} value={i * 5}>
              {i * 5 < 10 ? `0${i * 5}` : i * 5}
            </option>
          ))}
        </select>
      </div>

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
    </div>
  );
};

export default MainSettings;