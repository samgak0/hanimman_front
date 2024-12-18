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

  // formatDate 함수 추가
  const formatDate = (dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" };
    return new Date(dateString).toLocaleDateString("ko-KR", options);
  };

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
        <div className="search-list-container">
          {posts.length === 0 ? (
            <p className="no-posts">검색 결과가 없습니다</p>
          ) : (
            posts.map((item, index) => (
              <div
                key={item.id}
                className="search-card"
                onClick={() => handleItemClick(item.id)}
              >
                <div className="search-card-image-container">
                  {item.imageIds[0] ? (
                    <img
                      src={`http://localhost:8080/api/v1/${activeTab}/download?id=${item.imageIds[0]}`}
                      alt={item.title}
                      className="search-card-image"
                    />
                  ) : (
                    <img
                      src="/images/noimage.png"
                      alt="No Image"
                      className="search-card-image"
                    />
                  )}
                </div>
                <div className="search-card-content">
                  <div className="card-title">{item.title}</div>
                  <div className="card-meta">
                    <div className="location-info">
                      <p>{item.address || "정보 없음"}</p>
                    </div>
                    {item.meetingAt ? formatDate(item.meetingAt) : "날짜 없음"}
                  </div>
                  <div className="card-status-price">
                    <div
                      className={`card-tradeEnd ${
                        item.isEnd ? "completed" : "active"
                      }`}
                    >
                      {item.isEnd ? "마감" : "모집중"}
                    </div>
                    <div className="card-price">
                      {item.price
                        ? `${new Intl.NumberFormat("ko-KR").format(
                            item.price
                          )}원`
                        : "가격정보없음"}
                      /{item.quantity}개
                    </div>
                  </div>
                  <div className="search-card-chat">
                    <span className="meta-item">💬 {item.comments || 0}</span>
                    <span className="meta-item">
                      ❤️ {item.favoriteCount || 0}
                    </span>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Search;
