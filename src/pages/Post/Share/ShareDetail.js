import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShareDetailSlider from "../../../components/ShareDetailSlider"
import "./ShareDetail.css";
import { ReactComponent as BackIcon } from "../../../assets/icons/back.svg";
import { ReactComponent as HeartEmptyIcon } from "../../../assets/icons/zzimOff.svg";
import { ReactComponent as HeartFullIcon } from "../../../assets/icons/zzimOn.svg";
import { ReactComponent as NotifyIcon } from "../../../assets/icons/notify.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg";
import { ReactComponent as ViewIcon } from "../../../assets/icons/view.svg";

import { DataContext } from "../../../context/DataContext";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ShareDetail = () => {
  const navigate = useNavigate();
  const { applyForPost, appliedPosts, shareDetailState } = useContext(DataContext); // DataContext에서 데이터 가져오기
  const post = shareDetailState;

  const [isFavorite, setIsFavorite] = useState(post?.favorite || false);

  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  const isApplied = appliedPosts.includes(post.id); // 현재 게시글이 이미 신청되었는지 확인

  const handleApply = () => {
    if (!isApplied) {
      applyForPost(post.id);
    }
  };

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite); // 좋아요 상태 토글
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    const date = new Date(dateString);
    const year = date.getFullYear().toString().slice(2);
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const hour = date.getHours().toString().padStart(2, "0");
    const minute = date.getMinutes().toString().padStart(2, "0");
    return `${year}/${month}/${day} ${hour}:${minute}`;
  };

 

  return (
    <>
      <header className="share-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <button className="notify-button" onClick={() => alert("신고하기")}>
          <NotifyIcon />
        </button>
      </header>
      <div className="share-detail-page">      
        {/* 새로 만든 슬라이더 사용 */}
        <ShareDetailSlider images={post.images} />
      </div>

        {/* Info Section */}
        <div className="share-detail-title">
          <h2>{post.title || "제목 없음"}</h2>
          <p>{post.price ? `${post.price}원` : "가격 정보 없음"}</p>
        </div>

        <div className="share-detail-meta">
          <div className="share-detail-meta-location">
            <CalendarIcon className="calendar-icon" />{" "}
            {post.address || "위치 정보 없음"}
            {formatDate(post.createdAt)}
          </div>
      
          <div className="share-detail-meta-count">
            <ViewIcon className="view-count" /> {post.views}{" "}
            <HeartEmptyIcon className="favorite-count" /> {post.favoriteCount}
          </div>
        </div>

        <div className="share-detail-info">
          <h3>상세정보</h3>
          <div className="share-detail-info-category">
            <strong>카테고리 </strong>
            <p>{post.selectedCategory || "카테고리 없음"}</p>
          </div>
          <div className="share-detail-info-category">
            <strong>출발일 </strong>
            <p>{formatDate(post.selectedDate)} </p>
          </div>
          <div className="share-detail-info-category">
            <strong>남은 수량 </strong>
            <p>{post.quantity || 0}개</p>
          </div>
        </div>
        <div className="share-detail-text">{post.content || "내용 없음"}</div>

        {/* Footer Buttons */}
        <div className="share-detail-footer">
          <button className="favorite-button" onClick={toggleFavorite}>
            {isFavorite ? (
              <HeartFullIcon className="zzimOn" />
            ) : (
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
  
    </>
  );
};

export default ShareDetail;
