import React from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // 기본 스타일
import './ToastNotification.css'; // 사용자 정의 스타일

const ToastNotification = () => {
  // 알림 메시지 트리거 함수들
  const notifySuccess = () => toast.success("성공적으로 처리되었습니다!", { position: "top-right" });
  const notifyError = () => toast.error("문제가 발생했습니다. 다시 시도하세요!", { position: "top-right" });
  const notifyInfo = () => toast.info("새로운 정보를 확인하세요.", { position: "top-right" });
  const notifyWarning = () => toast.warn("주의가 필요합니다.", { position: "top-right" });

  return (
    <div className="toast-container">
      <button onClick={notifySuccess} className="toast-button success">성공 알림</button>
      <button onClick={notifyError} className="toast-button error">에러 알림</button>
      <button onClick={notifyInfo} className="toast-button info">정보 알림</button>
      <button onClick={notifyWarning} className="toast-button warning">경고 알림</button>
      <ToastContainer />
    </div>
  );
};

export default ToastNotification;