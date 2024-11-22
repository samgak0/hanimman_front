import React, { useContext, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TogetherDetail.css";
import { ReactComponent as BackIcon } from "../../../assets/icons/back.svg";
import { ReactComponent as HeartEmptyIcon } from "../../../assets/icons/zzimOff.svg"
import { ReactComponent as HeartFullIcon } from "../../../assets/icons/zzimOn.svg"
import { ReactComponent as NotifyIcon } from "../../../assets/icons/notify.svg"
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg"
import { ReactComponent as TogetherUserIcon } from "../../../assets/icons/togetherUserNum.svg"
import { ReactComponent as ViewIcon } from "../../../assets/icons/view.svg"


import { DataContext } from "../../../context/DataContext";


const TogetherDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {}; // 전달된 게시글 데이터
  const { applyForPost, appliedPosts } = useContext(DataContext);
  const [isFavorite, setIsFavorite] = useState(false);

  if (!post) {
    navigate("/togetherlist"); // 데이터가 없으면 리스트 페이지로 리다이렉트
    return null;
  }

  // 현재 게시글이 이미 신청되었는지 확인
   const isApplied = appliedPosts.includes(post.id);

  const handleApply = () => {
    if (!isApplied) {
      applyForPost(post.id);
    }
  }
  //현재 신청된 인원 계산
  const currentApplicants = appliedPosts.filter((id) => id === post.id).length;
  const totalPeople = post.people || 0;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  }

    // 날짜 포맷 함수
    const formatDate = (dateString) => {
      if (!dateString) return "날짜 정보 없음";
      const date = new Date(dateString);
      const options = { year: "numeric", month: "long", day: "numeric", weekday: "short" };
      return date.toLocaleDateString("ko-KR", options);
    };

  return (
    <div className="together-detail-page">
      {/* Header */}
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <BackIcon/>
        </button>
        <button className="notify-button" onClick={()=> navigate}>
          <NotifyIcon/>
        </button>
      </header>

      {/* Image Section */}
      <div className="detail-image-container">
        {post.images && post.images.length > 0 ? (
          <img
            src={URL.createObjectURL(post.images[0])}
            alt={post.title}
            className="detail-image"
          />
        ) : (
          <p className="no-image">이미지가 없습니다.</p>
        )}
      </div>

      {/* Info Section */}
      <div className="detail-title">
        <h2>{post.title}</h2>
        <p>{post.price}원</p>
      </div>
      <div className="detail-meta"> 
        <div className="detail-meta-location">
          <CalendarIcon className="calendar-icon"/> {post.location?.name || "위치 정보 없음"}
        </div>
        <div className="detail-meta-date">
          {formatDate(post.selectedDate)}
        </div>
        <div className="detail-meta-count">
          <ViewIcon className="view-count"/> 13 <HeartEmptyIcon className="favorite-count"/> 10
        </div>
      </div>
      <div className="detail-info">
        <h2>상세정보</h2>
        <div className="detail-info-category"><strong>카테고리 </strong> <p>{post.selectedCategory || "카테고리 없음"}</p></div>
        <div className="detail-info-category"><strong>출발일 </strong> <p>{post.selectedDate || "날짜 정보 없음"} </p></div> 
        <div className="detail-info-category">
          <strong>현재인원 </strong> 
          <p>{currentApplicants}/{totalPeople}명 </p></div>
      </div>
      <div className="detail-text">
        {post.description || "내용 없음"}
      </div>

      {/* Footer Buttons */}
      <div className="detail-actions">
        <button className="favorite-button" onClick={toggleFavorite}>
          {isFavorite? (
            <HeartFullIcon className="zzimOn"/>
          ): (
            <HeartEmptyIcon className="zzimOff" />
          )}
        </button>
       
        <button className="chat-button">채팅하기</button>
        <button 
          className="apply-button"
          onClick={handleApply}
          disabled={isApplied}
        >
          {isApplied ? "신청완료" : "신청하기"}
        </button>
      </div>
    </div>
  );
};

export default TogetherDetail;
