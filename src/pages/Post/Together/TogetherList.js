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
  const [urls, setUrls] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const observer = useRef();

  const fetchPosts = async (page) => {
    try {
      const params = { page, size: 10, sort: "createdAt,desc" };
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
    fetchPosts(page);
  }, [page]);


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
    console.log(post.id);
    navigate(`/togetherdetail/${post.id}`, { state: { post } });
  };

  const getRecruitmentStatus = (post) => {
    const currentApplicants = post.currentApplicants || 0;
    return currentApplicants >= post.people ? "completed" : "active";
  };

  if (loading && page === 0) return <p>Loading...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

     // 날짜를 '24/11/25' 형식으로 변환
     const formatDate = (date) => {
      const d = new Date(date);
      const year = String(d.getFullYear()).slice(-2); // 연도의 뒤 두 자리
      const month = String(d.getMonth() + 1).padStart(2, "0"); // 두 자리 월
      const day = String(d.getDate()).padStart(2, "0"); // 두 자리 일
      return `${year}/${month}/${day}`;
    };
  
    // 시간을 '09:00' 형식으로 변환
    const formatTime = (date) => {
      const d = new Date(date);
      const hours = String(d.getHours()).padStart(2, "0"); // 두 자리 시간
      const minutes = String(d.getMinutes()).padStart(2, "0"); // 두 자리 분
      return `${hours}:${minutes}`;
    };

  // 필터 데이터 업데이트
  const handleFilterUpdate = (filters) => {
    const { store, location, jumpo, category } = filters;
    let newFilteredPosts = posts;

    if (store) {
      newFilteredPosts = newFilteredPosts.filter((post) => post.location?.store === store);
    }
    if (location) {
      newFilteredPosts = newFilteredPosts.filter((post) => post.location?.location === location);
    }
    if (jumpo) {
      newFilteredPosts = newFilteredPosts.filter((post) => post.location?.jumpo === jumpo);
    }
    if (category) {
      newFilteredPosts = newFilteredPosts.filter((post) => post.category === category);
    }

  }
  return (
    <div className="together-list-page">
      <Header
        showMenu={true}
        showSearch={true}
        location="양주동"
        showSetting={false}
      />
      <FilterBar onFilterUpdate={handleFilterUpdate} onFilterSelect={(filter) => console.log(filter)} />

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
                  <span className="meta-item">❤️ {post.likes || 0}</span>
                </div>
                <div className={`card-tradeEnd ${getRecruitmentStatus(post)}`}>
                  {getRecruitmentStatus(post) === "completed"
                    ? "모집완료"
                    : "모집중"}
                </div>
              </div>

              <div className="card-dateinfo">
              {post.selectedDate
                      ? `${formatDate(post.selectedDate)} ${formatTime(post.selectedDate)}`
                      : "날짜 없음"}{" "}
                {post.location ? (
                  <div className="location-info">
                    <p>{post.location.store || "정보 없음"}</p>
                    <p>{post.location.location || "정보 없음"}</p>
                    <p>{post.location.jumpo || "정보 없음"}</p>
                    {post.location.position && (
                      <p>
                        {post.location.position.lat},{" "}
                        {post.location.position.lng}
                      </p>
                    )}
                    <p>{post.location.name || "정보 없음"}</p>
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
