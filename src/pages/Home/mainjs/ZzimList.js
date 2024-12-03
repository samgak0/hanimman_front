import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../maincss/ZzimList.css";
import { ReactComponent as HeartIcon } from "../../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/chat.svg";
import { listFavoriteTogethers } from "../../../api/togetherApi";
import { listFavoriteShares } from "../../../api/shareApi";

const ZzimList = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("together"); // 현재 활성화된 탭 상태
  const navigate = useNavigate();

  useEffect(() => {
    fetchFavoriteTogethers();
  }, []);

  const fetchFavoriteTogethers = async () => {
    try {
      const response = await listFavoriteTogethers();
      setPosts(response.content); // Assuming the API returns a paginated response
    } catch (error) {
      console.error("Failed to fetch favorite togethers:", error);
    }
  };

  const fetchFavoriteShare = async () => {
    try {
      const response = await listFavoriteShares();
      setPosts(response.content); // Assuming the API returns a paginated response
    } catch (error) {
      console.error("Failed to fetch favorite shares:", error);
    }
  };

  const handleItemClick = (id) => {
    navigate(`/togetherdetail/${id}`);
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    if (tab === "together") {
      fetchFavoriteTogethers();
    } else if (tab === "share") {
      fetchFavoriteShare();
    }
  };

  return (
    <div className="mobile-container">
      <div className="zzim-list">
        <header className="zzim-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ◀
          </button>
          <h1>관심목록</h1>
        </header>
        <div className="zzim-tabs">
          <button
            className={`zzim-tab ${activeTab === "together" ? "active" : ""}`}
            onClick={() => handleTabClick("together")}
          >
            같이가요
          </button>
          <button
            className={`zzim-tab ${activeTab === "share" ? "active" : ""}`}
            onClick={() => handleTabClick("share")}
          >
            나눠요
          </button>
        </div>
        {posts.length === 0 ? (
          <p className="no-posts">찜한 게시물이 없습니다</p>
        ) : (
          posts.map((item) => (
            <div
              key={item.id}
              className="zzim-item"
              onClick={() => handleItemClick(item.id)}
            >
              {item.imageIds[0] ? (
                <img
                  src={`http://localhost:8080/api/v1/together/download?id=${item.imageIds[0]}`}
                  alt={item.title}
                  className="together-card-image"
                />
              ) : (
                <div className="no-image">이미지 없음</div>
              )}
              <div className="item-details">
                <h2 className="item-title">{item.title}</h2>
                <p className="item-location">{item.address}</p>
                <div className="item-status-price">
                  <span className="item-status">
                    {item.isEnd ? "마감" : "모집중"}
                  </span>
                  <span className="item-price">수량 {item.quantity}</span>
                </div>
                <div className="item-icons">
                  <span className="item-comments">
                    <CommentIcon /> {item.comments}
                  </span>
                  <span className="item-likes">
                    <HeartIcon /> ❤️{item.favoriteCount}
                  </span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ZzimList;
