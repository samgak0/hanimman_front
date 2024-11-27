import React, { useState, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FilterBar from "../../../components/FilterBar";
import RegisterButton from "../../../components/RegisterButton";
import { DataContext } from "../../../context/DataContext";

import "./ShareList.css";

const ShareList = () => {
  const navigate = useNavigate();
  const { posts } = useContext(DataContext); // Context에서 posts 가져오기

  const [loading, setLoading] = useState(false);
  const [sortBy, setSortBy] = useState("createdAt"); // 정렬 기준 상태
  const observer = useRef();

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          // 무한 스크롤 로직 (API 호출이 없으므로 빈 함수)
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading]
  );

  const handleRegister = () => {
    navigate("/sharecreate"); // 공유 등록 페이지로 이동
  };

  const handleCardClick = (post) => {
    navigate(`/sharedetail/${post.id}`, { state: { post } }); // 공유 상세 페이지로 이동
  };

  const handleFilterSelect = (filter) => {
    if (filter === "최신순") {
      setSortBy("createdAt");
    } else if (filter === "출발임박순") {
      setSortBy("selectedDate");
    }
  };

  const getRecruitmentStatus = (post) => {
    return post.isEnd ? "completed" : "active";
  };

  return (
    <div className="share-list-page">
      <Header
        showMenu={true}
        showSearch={true}
        location="양주동"
        showSetting={false}
      />
      <FilterBar onFilterSelect={handleFilterSelect} />

      <div className="share-list-container">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              className="share-card"
              key={post.id}
              onClick={() => handleCardClick(post)}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <div className="card-image-container">
                {post.images && post.images.length > 0 ? (
                  <img
                    src={post.images[0]}
                    alt={post.title}
                    className="card-image"
                  />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
              </div>

              <div className="card-content">
                <div className="card-title">{post.title}</div>
                <div className="card-meta">
                  <span className="meta-item">💰 {post.price || 0} 원</span>
                  <span className="meta-item">📦 수량: {post.quantity}개</span>
                  {post.isUnlimited && (
                    <span className="meta-item">🌐 제한없음</span>
                  )}
                </div>
                <div className={`card-tradeEnd ${getRecruitmentStatus(post)}`}>
                  {getRecruitmentStatus(post) === "completed"
                    ? "마감"
                    : "모집중"}
                </div>
              </div>

              <div className="card-dateinfo">
                {post.selectedDate
                  ? `${new Date(post.selectedDate).toLocaleDateString()}`
                  : "날짜 없음"}
                {post.location ? (
                  <div className="location-info">
                    <p>{post.location.name || post.location}</p>
                  </div>
                ) : (
                  "위치 정보 없음"
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">등록된 게시물이 없습니다.</p>
        )}
      </div>
      {loading && <p>Loading more posts...</p>}
      <RegisterButton onClick={handleRegister} />
      <Footer />
    </div>
  );
};

export default ShareList;
