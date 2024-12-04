import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "../maincss/Search.css";
import { ReactComponent as HeartIcon } from "../../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/chat.svg";
import { searchTogethers } from "../../../api/togetherApi";
import { searchShares } from "../../../api/shareApi";

const Search = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("together"); // 현재 활성화된 탭 상태
  const navigate = useNavigate();
  const location = useLocation();
  const query = new URLSearchParams(location.search).get("q"); // 검색어 가져오기

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [query, activeTab]);

  const fetchSearchResults = async (query) => {
    try {
      let response;
      if (activeTab === "together") {
        response = await searchTogethers({ keyword: query });
      } else {
        response = await searchShares({ keyword: query });
      }
      setPosts(response.content); // Assuming the API returns a paginated response
    } catch (error) {
      console.error("Failed to fetch search results:", error);
    }
  };

  const handleItemClick = (id) => {
    if (activeTab === "together") {
      navigate(`/togetherdetail/${id}`);
    } else {
      navigate(`/sharedetail/${id}`);
    }
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  useEffect(() => {
    if (query) {
      fetchSearchResults(query);
    }
  }, [activeTab]);

  return (
    <div className="mobile-container">
      <div className="search-list">
        <header className="search-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ◀
          </button>
          <h1>검색 결과</h1>
        </header>
        <div className="search-tabs">
          <button
            className={`search-tab ${activeTab === "together" ? "active" : ""}`}
            onClick={() => handleTabClick("together")}
          >
            같이가요
          </button>
          <button
            className={`search-tab ${activeTab === "share" ? "active" : ""}`}
            onClick={() => handleTabClick("share")}
          >
            나눠요
          </button>
        </div>
        {posts.length === 0 ? (
          <p className="no-posts">검색 결과가 없습니다</p>
        ) : (
          posts.map((item) => (
            <div
              key={item.id}
              className="search-item"
              onClick={() => handleItemClick(item.id)}
            >
              {item.imageIds[0] ? (
                <img
                  src={`http://localhost:8080/api/v1/${activeTab}/download?id=${item.imageIds[0]}`}
                  alt={item.title}
                  className="search-card-image"
                />
              ) : (
                <div className="no-image">이미지 없음</div>
              )}
              <div className="item-details">
                <h2 className="item-title">{item.title}</h2>
                <p className="item-location">{item.address}</p>
                <div className="item-status-price">
                  <span
                    className={`item-status ${
                      item.isEnd ? "completed" : "active"
                    }`}
                  >
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

export default Search;
