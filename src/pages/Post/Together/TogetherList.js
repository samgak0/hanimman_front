import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FilterBar from "../../../components/FilterBar";
import RegisterButton from "../../../components/RegisterButton";
import "./TogetherList.css";

const TogetherList = () => {
  const { posts, appliedPosts } = useContext(DataContext);
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);
  const [filteredPosts, setFilteredPosts] = useState(posts);

  useEffect(() => {
    const objectUrls = posts.map((post) =>
      post.images.length > 0 ? URL.createObjectURL(post.images[0]) : null
    );
    setUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => url && URL.revokeObjectURL(url));
    };
  }, [posts]);

  const handleRegister = () => {
    navigate("/togethercreate");
  };

  const handleCardClick = (post) => {
    navigate("/togetherdetail", { state: { post } });
  };

  const getRecruitmentStatus = (post) => {
    const currentApplicants = appliedPosts.filter((id) => id === post.id).length;
    return currentApplicants >= post.people ? "completed" : "active";
  };

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

    setFilteredPosts(newFilteredPosts);
  };

  return (
    <div className="together-list-page">
      <Header showMenu={true} showSearch={true} location="양주동" showSetting={false} />
      <FilterBar onFilterUpdate={handleFilterUpdate} onFilterSelect={(filter) => console.log(filter)} />

      <div className="together-list-container">
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post, index) => (
            <div className="together-card" key={index} onClick={() => handleCardClick(post)}>
              <div className="card-image-container">
                {urls[index] ? (
                  <img src={urls[index]} alt={post.title} className="card-image" />
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
                  {getRecruitmentStatus(post) === "completed" ? "모집완료" : "모집중"}
                </div>
              </div>

              <div className="card-dateinfo">
              {post.selectedDate
                      ? `${formatDate(post.selectedDate)} ${formatTime(post.selectedDate)}`
                      : "날짜 없음"}{" "}

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
