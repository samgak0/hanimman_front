import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./BlockedUserManagement.css";

const BlockedUserManagement = () => {
  const navigate = useNavigate();

  // 차단된 사용자 상태 관리
  const [blockedUsers, setBlockedUsers] = useState([
    { id: 1, name: "당근왕", location: "부산광역시 기장군" },
    { id: 2, name: "초코토끼", location: "서울특별시 강남구" },
  ]);

  // 모달 상태 관리
  const [modalUser, setModalUser] = useState(null);

  // 차단 해제 처리
  const unblockUser = (userId) => {
    setBlockedUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== userId)
    );
    setModalUser(null); // 모달 닫기
  };

  return (
    <div className="blocked-user-container">
      <header className="blocked-user-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>
        <h1>차단 사용자 관리</h1>
      </header>

      <div className="blocked-user-list">
        {blockedUsers.map((user) => (
          <div className="blocked-user-item" key={user.id}>
            <div className="user-info">
              <div className="user-avatar" />
              <div className="user-details">
                <p className="user-name">{user.name}</p>
                <p className="user-location">{user.location}</p>
              </div>
            </div>
            <button
              className="blocked-status-btn"
              onClick={() => setModalUser(user)}
            >
              차단중
            </button>
          </div>
        ))}
      </div>

      {/* 모달 창 */}
      {modalUser && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              <strong>{modalUser.name}</strong> 유저의 차단을 풀겠습니까?
            </p>
            <div className="modal-buttons">
              <button
                className="modal-confirm-btn"
                onClick={() => unblockUser(modalUser.id)}
              >
                확인
              </button>
              <button
                className="modal-cancel-btn"
                onClick={() => setModalUser(null)}
              >
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlockedUserManagement;