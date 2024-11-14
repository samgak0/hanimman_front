import React from 'react';
import './MyPage.css';
import Footer from '../../../components/Footer';
import { FaUser, FaCog, FaHeart, FaClipboardList, FaShoppingBag, FaStore, FaComments, FaHome, FaGift, FaAd, FaLocationArrow, FaQuestionCircle, FaTag } from 'react-icons/fa';

function MyPage() {
  return (
    // <div className="mobile-container">
    <div className="myPage">
      <header className="myPage-header">
        <div className="profile">
          <FaUser size={50} className="profile-icon" />
          <button className="profile-btn">프로필 보기</button>
        </div>
        <FaCog className="settings-icon" />
      </header>

      <div className="section">
        <div className="section-title">나의 거래</div>
        <div className="menu">
          <div className="menu-item"><FaHeart /> 관심목록</div>
          <div className="menu-item"><FaClipboardList /> 내 글</div>
          <div className="menu-item"><FaShoppingBag /> 참여 글</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">망고 소식</div>
        <div className="menu">
          <div className="menu-item"><FaGift /> 이벤트</div>
          <div className="menu-item"><FaClipboardList /> 공지사항</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">나의 비즈니스</div>
        <div className="menu">
          <div className="menu-item"><FaStore /> 비즈프로필 관리</div>
          <div className="menu-item"><FaAd /> 광고</div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">기타</div>
        <div className="menu">
          <div className="menu-item"><FaLocationArrow /> 내 동네 설정</div>
          <div className="menu-item"><FaQuestionCircle /> 동네 인증하기</div>
          <div className="menu-item"><FaTag /> 키워드 알림 설정</div>
          <div className="menu-item"><FaQuestionCircle /> 자주 묻는 질문</div>
          <div className="menu-item"><FaQuestionCircle /> 약관 및 정책</div>
        </div>
      </div>
        <Footer />
    </div>
    // </div>
  );
}

export default MyPage;