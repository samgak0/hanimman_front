import React from 'react';
import './MyPage.css';
import Footer from '../../../components/Footer';
import {
  FaUser,
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
} from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

function MyPage() {
  const navigate = useNavigate();

  return (
    <div className='mobile-container'>
    <div className="myPage">
      <header className="myPage-header">
        <div className="profile">
          <FaUser size={50} className="profile-icon" />
          <button className="profile-btn" onClick={() => navigate('/myprofile')}>프로필 보기</button>
        </div>
        {/* 설정 아이콘 클릭 시 /mainsettings로 이동 */}
        <FaCog
         size={40}
          className="settings-icon"
          onClick={() => navigate('/mainsettings')}
        />
      </header>

      <div className="section">
        <div className="section-title">나의 거래</div>
        <div className="menu">
          <div className="menu-item" onClick={() => navigate('/zzimlist')}>
            <FaHeart /> 관심 목록
          </div>
          <div className="menu-item" onClick={() => navigate('/mypost')}>
            <FaClipboardList /> 내 글
          </div>
          <div className="menu-item" onClick={() => navigate('/myparticipation')}>
            <FaShoppingBag /> 참여 글
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">망고 소식</div>
        <div className="menu">
          <div className="menu-item" onClick={() => navigate('/events')}>
            <FaGift /> 이벤트
          </div>
          <div className="menu-item" onClick={() => navigate('/announcement')}>
            <FaClipboardList /> 공지사항
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">나의 비즈니스</div>
        <div className="menu">
          <div className="menu-item" onClick={() => navigate('/mybizprofile')}>
            <FaStore /> 비즈프로필 관리
          </div>
          <div className="menu-item" onClick={() => navigate('/myads')}>
            <FaAd /> 광고
          </div>
        </div>
      </div>

      <div className="section">
        <div className="section-title">기타</div>
        <div className="menu">
          <div className="menu-item" onClick={() => navigate('/locationsettings')}>
            <FaLocationArrow /> 내 동네 설정
          </div>
          <div className="menu-item" onClick={() => navigate('/keynoti')}>
            <FaTag /> 키워드 알림 설정
          </div>
          <div className="menu-item" onClick={() => navigate('/faq')}>
            <FaQuestionCircle /> 자주 묻는 질문
          </div>
          <div className="menu-item" onClick={() => navigate('/terms')}>
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