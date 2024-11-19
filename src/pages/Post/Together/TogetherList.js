import React, { useContext } from "react";
import { DataContext } from "../../../context/DataContext";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "./TogetherList.css"; // 스타일 파일 추가

const TogetherList = () => {
  const { posts } = useContext(DataContext);

  const handleRegister = () => {
    window.location.href = "/togethercreate";
  }

  return (
    <div className="together-list-page">
      {/* 헤더 컴포넌트 */}
      <Header />

      <div className="together-list-container">
        {posts.length > 0 ? (
          posts.map((post, index) => (
            <div className="together-card" key={index}>
              {/* 이미지 영역 */}
              <div className="card-image-container">
                {post.images.length > 0 ? (
                  <img
                    src={URL.createObjectURL(post.images[0])} // 첫 번째 이미지를 표시
                    alt={post.title}
                    className="card-image"
                  />
                ) : (
                  <div className="no-image">이미지 없음</div>
                )}
              </div>

              {/* 텍스트 영역 */}
              <div className="card-content">
                <h2 className="card-title">{post.title}</h2>
                <p className="card-category">{post.selectedCategory || "카테고리 없음"}</p>
                <div className="card-meta">
                  <span>날짜: {post.selectedDate || "지정 안됨"}</span>
                  <br />
                  <span>인원수: {post.people}명</span>
                </div>
                <div className="card-actions">
                  <span>❤️ {post.likes || 0}</span>
                  <span>💬 {post.comments || 0}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="no-posts">등록된 게시물이 없습니다.</p>
        )}

        <button className="register-button" onClick={handleRegister}>
          +
        </button>
      </div>
      <Footer />
    </div>

 
  );
};

export default TogetherList;
