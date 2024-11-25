import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const params = { page: 0, size: 10, sort: "createdAt,desc" }; // 페이지네이션 파라미터 추가
        const data = await listAllTogethers(params);
        setPosts(data.content);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  useEffect(() => {
    if (posts.length > 0) {
      posts.forEach((post, index) => {
        if (post.imageUrls && post.imageUrls.length > 0) {
          console.log(`Post ${index} Image URL: ${post.imageUrls[0]}`);
        } else {
          console.log(`Post ${index} has no images`);
        }
      });
    }
  }, [posts]);

  const handleRegister = () => {
    navigate("/togethercreate");
  };

  const handleCardClick = (post) => {
    navigate("/togetherdetail", { state: { post } });
  };

  const getRecruitmentStatus = (post) => {
    const currentApplicants = post.currentApplicants || 0;
    return currentApplicants >= post.people ? "completed" : "active";
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading posts: {error.message}</p>;

  return (
    <div className="together-list-page">
      <Header
        showMenu={true}
        showSearch={true}
        location="양주동"
        showSetting={false}
      />
      <FilterBar onFilterSelect={(filter) => console.log(filter)} />

      <div className="together-list-container">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div
              className="together-card"
              key={index}
              onClick={() => handleCardClick(post)}
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
                  ? `${new Date(
                      post.selectedDate
                    ).toLocaleDateString()} ${new Date(
                      post.selectedDate
                    ).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
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
      <RegisterButton onClick={handleRegister} />
      <Footer />
    </div>
  );
};

export default TogetherList;
