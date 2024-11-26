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

  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [modalType, setModalType] = useState(""); // 모달 유형 ("email", "phone")
  const [newEmail, setNewEmail] = useState(""); // 이메일 입력 필드 값

  useEffect(() => {
    // JSON 데이터를 상태로 설정
    setAccountInfo(initialAccountInfo);
    setNewEmail(initialAccountInfo.email); // 초기 이메일 값 설정
  }, []);

  const handleOpenModal = (type) => {
    setModalType(type);
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
    setModalType("");
    setNewEmail(accountInfo.email); // 초기화
  };

  const handleConfirm = () => {
    if (modalType === "email") {
      // 이메일 업데이트 로직 (추후 백엔드 연동 예정)
      setAccountInfo((prev) => ({ ...prev, email: newEmail }));
    } else if (modalType === "phone") {
      navigate("/verification"); // 휴대폰 번호의 경우 인증 페이지로 이동
    }
    handleCloseModal(); // 모달 닫기
  };

  const handleEmailChange = (e) => {
    setNewEmail(e.target.value);
  };

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
          <button className="change-button" onClick={() => handleOpenModal("email")}>
            변경
          </button>
        </div>
        <div className="account-info-item">
          <span>휴대폰 번호</span>
          <span className="account-info-value">{accountInfo.phone}</span>
          <button className="change-button" onClick={() => handleOpenModal("phone")}>
            변경
          </button>
        </div>
        <div className="account-info-item">
          <span>당근 본인인증</span>
          <span className="account-info-value">{accountInfo.verificationDate}</span>
          <button className="confirm-button">확인</button>
        </div>
      </div>

      {modalVisible && (
        <div className="modal-overlay">
          <div className="modal-content">
            {modalType === "email" ? (
              <>
                <p>변경할 이메일 주소를 입력하세요.</p>
                <input
                  className="email-input"
                  type="email"
                  value={newEmail}
                  onChange={handleEmailChange}
                  placeholder="forkmango@forkmango.com"
                  onFocus={(e) => e.target.select()} // 클릭 시 전체 선택
                />
              </>
            ) : (
              <p>휴대전화 재인증을 진행하시겠습니까?</p>
            )}
            <div className="modal-buttons">
              <button className="modal-confirm-button" onClick={handleConfirm}>
                확인
              </button>
              <button className="modal-cancel-button" onClick={handleCloseModal}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountInfo;