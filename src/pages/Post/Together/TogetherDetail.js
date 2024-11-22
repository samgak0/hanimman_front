import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./TogetherDetail.css";
import { ReactComponent as BackIcon } from "../../../assets/icons/back.svg";
import { ReactComponent as HeartEmptyIcon } from "../../../assets/icons/heartEmpty.svg"

const TogetherDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { post } = location.state || {}; // 전달된 게시글 데이터

  if (!post) {
    navigate("/togetherlist"); // 데이터가 없으면 리스트 페이지로 리다이렉트
    return null;
  }

  return (
    <div className="together-detail-page">
      {/* Header */}
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <BackIcon/>
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
      <div className="detail-location">
        <p> 🗓️ {post.location?.name || "위치 정보 없음"} 11/2(토) 오후 3:00 👁️ 13 ❤️ 10</p>
        <div className="meta-info">
          <span className="detail-date-info"> </span>
        </div>
      </div>
      <div className="detail-info">
        <h2>상세정보</h2>
        <div className="detail-info-category"><strong>카테고리 </strong> <p>{post.selectedCategory || "카테고리 없음"}</p></div>
        <div className="detail-info-category"><strong>현재인원 </strong> <p>{post.people}명 </p></div>
        <div className="detail-info-category"><strong>출발일 </strong> <p>{post.selectedDate || "날짜 정보 없음"} </p></div> 
      </div>
      <div className="detail-text">
        {post.description || "내용 없음"}
      </div>

      {/* Footer Buttons */}
      <div className="detail-actions">
        <HeartEmptyIcon className="heart-icon"/>
        <button className="chat-button">채팅</button>
        <button className="apply-button">신청</button>
      </div>
    </div>
  );
};

export default TogetherDetail;
