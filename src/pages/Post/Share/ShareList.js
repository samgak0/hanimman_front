import React, { useState, useRef, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FilterBar from "../../../components/FilterBar";
import FilterModal from "../../../components/FilterModal";
import RegisterButton from "../../../components/RegisterButton";
import "./ShareList.css";

const ShareList = () => {
  const navigate = useNavigate();
  const [isFilterModalVisible, setIsFilterModalVisible] = useState(false); // 필터 모달 상태
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리 상태
  const { posts } = useContext(DataContext); // Context에서 posts 가져오기
  const { setShareDetailState } = useContext(DataContext);
  const [loading, setLoading] = useState(false);
  const observer = useRef();

  // 날짜 형식 변경 함수
const formatDate = (dateString) => {
  if (!dateString) return "날짜 없음";
  const date = new Date(dateString);
  const year = date.getFullYear().toString().slice(2); // 연도 두 자리
  const month = (date.getMonth() + 1).toString().padStart(2, "0"); // 월 두 자리
  const day = date.getDate().toString().padStart(2, "0"); // 일 두 자리
  const hours = date.getHours().toString().padStart(2, "0"); // 시간 두 자리
  const minutes = date.getMinutes().toString().padStart(2, "0"); // 분 두 자리
  return `${year}/${month}/${day} ${hours}시${minutes}분`; // 날짜와 시간 반환
};
  const handleOpenFilterModal = () => {
    setIsFilterModalVisible(true); // 필터 모달 열기
  };

  const handleCategoryFilter = (filter) => {
    setSelectedCategory(filter.category); // 선택된 카테고리 저장
    setIsFilterModalVisible(false); // 필터 모달 닫기
  };

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
    setShareDetailState(post);
    navigate(`/sharedetail/${post.id}`); // 공유 상세 페이지로 이동
  };

  const getRecruitmentStatus = (post) => {
    return post.isEnd ? "completed" : "active";
  };



  return (
    <>
      <Header
        showMenu={true}
        showSearch={true}
        location="양주동"
        showSetting={false}
      />
      <FilterBar 
        onFilterSelect={handleOpenFilterModal} 
      />

      {/* FilterModal 표시 */}
      {isFilterModalVisible && (
        <FilterModal
          onClose={() => setIsFilterModalVisible(false)}
          onComplete={handleCategoryFilter}
          isShareList={true} // ShareList 전용
        />
      )}

      <div className="share-list-container">
        {posts.length > 0 ? (
          posts
            .filter(
              (post) =>
                !selectedCategory || post.category === selectedCategory // 선택된 카테고리에 따른 필터링
            )
            .map((post, index) => (
              <div
                className="share-card"
                key={post.id}
                onClick={() => handleCardClick(post)}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
              >
                <div className="share-card-image-container">
                  {post.images && post.images.length > 0 ? (
                    <img
                      src={post.images[0]} // 첫 번째 이미지를 표시
                      alt={post.title}
                      className="share-card-image"
                    />
                  ) : (
                    <div className="no-image">이미지 없음</div>
                  )}
                </div>
                <div className="share-card-content">
                  <div className="share-card-title">{post.title}</div>
                  <div className="share-card-meta">
                    <span className="share-card-meta-item">💰 {post.price || 0}</span>
                    <span className="share-card-meta-item">📦 {post.quantity}</span>
                    {post.isUnlimited && (
                      <span className="share-card-meta-item">🌐 제한없음</span>
                    )}
                  </div>
                  <div className={`share-card-tradeEnd ${getRecruitmentStatus(post)}`}>
                    {getRecruitmentStatus(post) === "completed"
                      ? "마감"
                      : "모집중"}
                  </div>
               
                </div>
             <div className="share-card-dateinfo">
                {post.selectedDate ? (
                  <>
                    <div className="share-date">{formatDate(post.selectedDate).split(" ")[0]}</div>
                    <div className="share-time">{formatDate(post.selectedDate).split(" ")[1]}</div>
                  </>
                ) : (
                  "날짜 없음"
                )}
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
      <>
        {loading && <p>Loading more posts...</p>}
        <RegisterButton onClick={handleRegister} />
        <Footer />
      </>
    </>
  );
};
export default ShareList;