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
    navigate("/togetherdetail", { state: { post } }); // 게시글 데이터 전달
  };
  const getRecruitmentStatus = (post) => {
    const currentApplicants = appliedPosts.filter((id) => id === post.id).length; // 현재 신청 인원
    return currentApplicants >= post.people ? "completed" : "active"; // 정원 초과 시 모집완료
  };

  return (
    <div className="together-list-page">
     <Header showMenu={true} showSearch={true} location="양주동" showSetting={false} />
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
                {urls[index] ? (
                  <img src={urls[index]} alt={post.title} className="card-image" />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
              </div>

              {/* 콘텐츠 섹션 */}
              <div className="card-content">
                <div className="card-title">{post.title}</div>
                <div className="card-meta">
                  <span className="meta-item">👥 {post.people}명</span>
                  <span className="meta-item">💬 {post.chats || 0}</span>
                  <span className="meta-item">❤️ {post.likes || 0}</span>
                </div>
                <div 
                  className={`card-tradeEnd ${getRecruitmentStatus(post)}`}>
                  {getRecruitmentStatus(post) === "completed" ? "모집완료" : "모집중"}
                </div>
              </div>

              {/* 날짜 및 위치 정보 섹션 */}
              <div className="card-dateinfo">
                {post.selectedDate
                  ? `${new Date(post.selectedDate).toLocaleDateString()} ${new Date(
                      post.selectedDate
                    ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}`
                  : "날짜 없음"}{" "}
                {post.location ? (
                  <div className="location-info">
                    <p>{post.location.store || "정보 없음"}</p>
                    <p>{post.location.location || "정보 없음"}</p>
                    <p>{post.location.jumpo || "정보 없음"}</p>
                    {post.location.position && (
                      <p>
                        {post.location.position.lat}, {post.location.position.lng}
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
