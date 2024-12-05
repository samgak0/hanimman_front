import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../../Home/maincss/ZzimList.css"; // ZzimList.css 파일의 올바른 경로
import { ReactComponent as HeartIcon } from "../../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/chat.svg";
import { listMyTogethers } from "../../../api/togetherApi";
import { listMyShares } from "../../../api/shareApi";

const MyPost = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("together"); // 현재 활성화된 탭 상태
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    fetchMyTogethers(0);
  }, []);

  const fetchMyTogethers = async (page) => {
    setLoading(true);
    try {
      const response = await listMyTogethers({ page, size: 10 });
      setPosts((prevPosts) => [...prevPosts, ...response.content]);
      setHasMore(response.content.length > 0);
    } catch (error) {
      console.error("Failed to fetch my togethers:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyShares = async (page) => {
    setLoading(true);
    try {
      const response = await listMyShares({ page, size: 10 });
      setPosts((prevPosts) => [...prevPosts, ...response.content]);
      setHasMore(response.content.length > 0);
    } catch (error) {
      console.error("Failed to fetch my shares:", error);
    } finally {
      setLoading(false);
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
    setPage(0);
    setPosts([]);
    if (tab === "together") {
      fetchMyTogethers(0);
    } else if (tab === "share") {
      fetchMyShares(0);
    }
  };

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

  useEffect(() => {
    if (page > 0) {
      if (activeTab === "together") {
        fetchMyTogethers(page);
      } else if (activeTab === "share") {
        fetchMyShares(page);
      }
    }
  }, [page, activeTab]);

  return (
    <div className="mobile-container">
      <div className="zzim-list">
        <header className="zzim-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ◀
          </button>
          <h1>내 글</h1>
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
          <p className="no-posts">내가 쓴 게시물이 없습니다</p>
        ) : (
          posts.map((item, index) => (
            <div
              key={item.id}
              className="zzim-item"
              onClick={() => handleItemClick(item.id)}
              ref={index === posts.length - 1 ? lastPostElementRef : null}
            >
              {item.imageIds[0] ? (
                <img
                  src={`http://localhost:8080/api/v1/${activeTab}/download?id=${item.imageIds[0]}`}
                  alt={item.title}
                  className="zzim-card-image"
                />
              ) : (
                <img
                  src="/images/noimage.png"
                  alt={item.title}
                  className="zzim-card-image"
                />
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
        {loading && <p>Loading more posts...</p>}
      </div>
    </div>
  );
};

export default MyPost;
