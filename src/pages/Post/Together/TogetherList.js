import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FilterBar from "../../../components/FilterBar";
import FilterModal from "../../../components/FilterModal";
import RegisterButton from "../../../components/RegisterButton";
import { listAllTogethers } from "../../../api/togetherApi";

import "./TogetherList.css";

const TogetherList = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [sortBy, setSortBy] = useState("createdAt"); // 정렬 기준 상태 추가
  const [isEnd, setIsEnd] = useState(false); // 마감 상태 추가
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // 필터 모달 상태
  const observer = useRef();

  const fetchPosts = async (page, sortBy, isEnd) => {
    try {
      const params = { page, size: 10, sortBy: sortBy, isEnd: isEnd };
      const data = await listAllTogethers(params);
      setPosts((prevPosts) => [...prevPosts, ...data.content]);
      setHasMore(data.content.length > 0);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(page, sortBy, isEnd);
  }, [page, sortBy, isEnd]);

  const lastPostElementRef = useCallback(
    (node) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  const handleRegister = () => {
    navigate("/togethercreate");
  };

  const handleCardClick = (post) => {
    navigate(`/togetherdetail/${post.id}`, { state: { post } });
  };

  const getRecruitmentStatus = (post) => {
    return post.isEnd ? "completed" : "active";
  };

  const handleFilterSelect = (filter) => {
    if (filter === "최신순") {
      setSortBy("createdAt");
    } else if (filter === "출발임박순") {
      setSortBy("meetingAt");
    }
    setPage(0);
    setPosts([]);
  };

  // Toggle the filter modal
  const handleHamburgerClick = () => {
    setIsFilterModalOpen(true); // 필터 모달 열기
  };

  // Handle filter modal completion
  const handleFilterComplete = (filters) => {
    console.log(filters); // 필터 데이터 확인
    setIsFilterModalOpen(false); // 필터 모달 닫기
  };

  // Handle toggle end
  const handleToggleEnd = (newIsEnd) => {
    setIsEnd(newIsEnd);
    setPage(0);
    setPosts([]);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const options = {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }
    return date.toLocaleDateString("ko-KR", options);
  };

  if (loading && page === 0) return <p>Loading...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
    <div className="mobile-container">
      <div className="together-list-page">
        <Header
          showMenu={true}
          showSearch={true}
          location="양주동"
          showSetting={false}
          showBell={false} // 알림 버튼 비활성화
        />
        <FilterBar
          onFilterSelect={handleFilterSelect}
          onHamburgerClick={handleHamburgerClick} // 햄버거 아이콘 클릭 이벤트 추가
          onToggleEnd={handleToggleEnd} // 마감 버튼 클릭 이벤트 추가
        />
        {isFilterModalOpen && (
          <FilterModal
            mode="together"
            onClose={() => setIsFilterModalOpen(false)} // 필터 모달 닫기
            onComplete={handleFilterComplete} // 필터 완료 시 처리
          />
        )}
        <div className="together-list-container">
          {posts.length > 0 ? (
            posts.map((post, index) => (
              <div
                className="together-card"
                key={index}
                onClick={() => handleCardClick(post)}
                ref={index === posts.length - 1 ? lastPostElementRef : null}
              >
                <div className="together-card-image-container">
                  {post.imageIds[0] ? (
                    <img
                      src={`http://localhost:8080/api/v1/together/download?id=${post.imageIds[0]}`}
                      alt={post.title}
                      className="together-card-image"
                    />
                  ) : (
                    <img
                      src="/images/noimage.png"
                      alt={post.title}
                      className="together-card-image"
                    />
                  )}
                </div>

                <div className="together-card-content">
                  <div className="card-title">{post.title}</div>
                  <div className="card-meta">
                    <div className="location-info">
                      <p>{post.address || "정보 없음"}</p>
                    </div>
                    {post.meetingAt ? formatDate(post.meetingAt) : "날짜 없음"}{" "}
                  </div>
                  <div className="card-status-price">
                    <div
                      className={`card-tradeEnd ${getRecruitmentStatus(post)}`}
                    >
                      {getRecruitmentStatus(post) === "completed"
                        ? "마감"
                        : "모집중"}
                    </div>
                    <div className="card-price">
                      {post.price
                        ? `${new Intl.NumberFormat("ko-KR").format(
                            post.price
                          )}원`
                        : "가격정보없음"}
                      /{post.quantity}개
                    </div>
                  </div>
                  <div className="together-card-chat">
                    {/* <span className="meta-item">👥 {post.people}명</span> */}
                    <span className="meta-item">💬 {post.chats || 0}</span>
                    <span className="meta-item">
                      ❤️ {post.favoriteCount || 0}
                    </span>
                  </div>
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
    </div>
  );
};

export default TogetherList;
