import React, { useState, useEffect } from "react";
import "./MyPage.css";
import Footer from "../../../components/Footer";
import {
  FaCog,
  FaHeart,
  FaClipboardList,
  FaShoppingBag,
  FaStore,
  FaGift,
  FaAd,
  FaLocationArrow,
  FaQuestionCircle,
  FaTag,
  FaFileAlt, // 약관 및 정책 아이콘 변경
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../api/jwtAxios";

function MyPage() {
  const navigate = useNavigate();
  const [profileImage, setProfileImage] = useState(
    "/images/noprofileimage.png"
  );
  const [nickname, setNickname] = useState(null);

  useEffect(() => {
    // API 호출
    jwtAxios
      .get("http://localhost:8080/users/myprofile")
      .then((response) => {
        // 성공적으로 응답이 오면 처리
        console.log(response);
        setNickname(response.data.nickname);
        const imageUrl = response.data.profileImage
          ? `http://localhost:8080/images/${response.data.profileImage}` // 이미지 경로 생성
          : "/images/noprofileimage.png"; // 기본 이미지
        setProfileImage(imageUrl);
      })
      .catch((error) => {
        // 오류 처리
        if (error.response) {
          // 서버가 응답했지만 상태 코드가 2xx 범위를 벗어난 경우
          console.error("오류 상태:", error.response.status);
          console.error("오류 메시지:", error.response.data);
        } else if (error.request) {
          // 요청이 전송되었지만 응답이 없는 경우
          console.error("응답 없음:", error.request);
        } else {
          // 요청을 설정하는 중에 문제가 발생한 경우
          console.error("요청 오류:", error.message);
        }
      });
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 호출되도록 함

  return (
    <div className="mobile-container">
      <div className="myPage">
        <header className="myPage-header">
          <div className="profile">
            <img
              className="profile-avatar"
              src={profileImage}
              alt="프로필 사진"
            />
            <button
              className="profile-btn"
              onClick={() => navigate("/myprofile")}
            >
              {nickname ? nickname : "프로필 보기"}
            </button>
          </div>
          {/* 설정 아이콘 클릭 시 /mainsettings로 이동 */}
          <FaCog
            size={40}
            className="settings-icon"
            onClick={() => navigate("/mainsettings")}
          />
        </header>

        <div className="section">
          <div className="section-title">나의 거래</div>
          <div className="menu">
            <div className="menu-item" onClick={() => navigate("/zzimlist")}>
              <FaHeart /> 관심 목록
            </div>
            <div className="menu-item" onClick={() => navigate("/mypost")}>
              <FaClipboardList /> 내 글
            </div>
            <div
              className="menu-item"
              onClick={() => navigate("/myparticipation")}
            >
              <FaShoppingBag /> 참여 글
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">망고 소식</div>
          <div className="menu">
            <div className="menu-item" onClick={() => navigate("/events")}>
              <FaGift /> 이벤트
            </div>
            <div
              className="menu-item"
              onClick={() => navigate("/announcement")}
            >
              <FaClipboardList /> 공지사항
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">나의 비즈니스</div>
          <div className="menu">
            <div
              className="menu-item"
              onClick={() => navigate("/mybizprofile")}
            >
              <FaStore /> 비즈프로필 관리
            </div>
            <div className="menu-item" onClick={() => navigate("/myads")}>
              <FaAd /> 광고
            </div>
          </div>
        </div>

        <div className="section">
          <div className="section-title">기타</div>
          <div className="menu">
            <div
              className="menu-item"
              onClick={() => navigate("/locationsettings")}
            >
              <FaLocationArrow /> 내 동네 설정
            </div>
            <div className="menu-item" onClick={() => navigate("/keynoti")}>
              <FaTag /> 키워드 알림 설정
            </div>
            <div className="menu-item" onClick={() => navigate("/faq")}>
              <FaQuestionCircle /> 자주 묻는 질문
            </div>
            <div className="menu-item" onClick={() => navigate("/terms")}>
              <FaFileAlt /> 약관 및 정책
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default MyPage;
