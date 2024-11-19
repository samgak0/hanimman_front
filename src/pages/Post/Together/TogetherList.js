import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { DataContext } from "../../../context/DataContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import FilterBar from "../../../components/FilterBar"; // FilterBar 추가
import "./TogetherList.css";

const TogetherList = () => {
  const { posts } = useContext(DataContext);
  const navigate = useNavigate();
  const [urls, setUrls] = useState([]);

  // 이미지 URL 생성 및 정리
  useEffect(() => {
    const objectUrls = posts.map((post) =>
      post.images.length > 0 ? URL.createObjectURL(post.images[0]) : null
    );
    setUrls(objectUrls);

    return () => {
      objectUrls.forEach((url) => url && URL.revokeObjectURL(url)); // 메모리 정리
    };
  }, [posts]);

  const handleRegister = () => {
    navigate("/togethercreate");
  };

  const handleFilterSelect = (filter) => {
    console.log(`Selected filter: ${filter}`);
    // 필터에 따른 정렬 로직 추가 가능
  };

  return (
    <div className="together-list-page">
      {/* SettingIcon 숨기기 */}
      <Header showMenu={true} showSearch={true} location="양주동" showSetting={false} />
      <FilterBar onFilterSelect={handleFilterSelect} />

      {/* 게시글 리스트 */}
      <div className="together-list-container">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div className="together-card" key={post.id}>
              <div className="card-image-container">
                {urls[index] ? (
                  <img src={urls[index]} alt={post.title} className="card-image" />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
              </div>
              <div className="card-content">
                <h2 className="card-title">{post.title}</h2>
                <p className="card-category">{post.selectedCategory || "카테고리 없음"}</p>
                <div className="card-meta">
                  <span>날짜: {post.selectedDate || "지정 안됨"}</span>
                  <br />
                  <span>인원수: {post.people}명</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">등록된 게시물이 없습니다.</p>
        )}
      </div>

      {/* 등록 버튼 */}
      <button className="register-button" onClick={handleRegister}>
        +
      </button>

      {/* 푸터 */}
      <Footer />
    </div>
  );
};

export default TogetherList;
