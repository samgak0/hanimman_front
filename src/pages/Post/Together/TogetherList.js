import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FilterBar from "../../../components/FilterBar";
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
  const observer = useRef();

  const fetchPosts = async (page, sortBy) => {
    try {
      const params = { page, size: 10, sortBy: sortBy };
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
    fetchPosts(page, sortBy);
  }, [page, sortBy]);

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

  if (loading && page === 0) return <p>Loading...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
    <div className="together-list-page">
      <Header
        showMenu={true}
        showSearch={true}
        location="양주동"
        showSetting={false}
      />
      <FilterBar onFilterSelect={handleFilterSelect} />

      <div className="together-list-container">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              className="together-card"
              key={index}
              onClick={() => handleCardClick(post)}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              <div className="card-image-container">
                {post.imageUrls && post.imageUrls.length > 0 ? (
                  <img
                    src={post.imageUrls[0]}
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
                  <span className="meta-item">👥 {post.people}명</span>
                  <span className="meta-item">💬 {post.chats || 0}</span>
                  <span className="meta-item">
                    ❤️ {post.favoriteCount || 0}
                  </span>
                </div>
                <div className={`card-tradeEnd ${getRecruitmentStatus(post)}`}>
                  {getRecruitmentStatus(post) === "completed"
                    ? "마감"
                    : "모집중"}
                </div>
              </div>

              <div className="card-dateinfo">
                {post.meetingAt
                  ? `${new Date(
                      post.meetingAt
                    ).toLocaleDateString()} ${new Date(
                      post.meetingAt
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                  : "날짜 없음"}{" "}
                {post.address ? (
                  <div className="location-info">
                    <p>{post.address || "정보 없음"}</p>
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

export default TogetherList;
