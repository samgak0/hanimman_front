import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../maincss/ZzimList.css";
import { ReactComponent as HeartIcon } from "../../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/chat.svg";
import { listFavoriteTogethers } from "../../../api/togetherApi";
import { listFavoriteShares } from "../../../api/shareApi";

const ZzimList = () => {
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState("together");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setHasMore(true);
    if (activeTab === "together") {
      fetchFavoriteTogethers(0);
    } else {
      fetchFavoriteShares(0);
    }
  }, [activeTab]);

  const fetchFavoriteTogethers = async (currentPage) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await listFavoriteTogethers({
        page: currentPage,
        size: 10,
      });
      if (response.content && response.content.length > 0) {
        setPosts((prevPosts) => {
          if (currentPage === 0) return response.content;

          // 중복 제거를 위해 Set 사용
          const uniquePosts = [...prevPosts];
          response.content.forEach((newPost) => {
            if (!uniquePosts.find((post) => post.id === newPost.id)) {
              uniquePosts.push(newPost);
            }
          });
          return uniquePosts;
        });
        setHasMore(!response.last && response.content.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch favorite togethers:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchFavoriteShares = async (currentPage) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await listFavoriteShares({
        page: currentPage,
        size: 10,
      });
      if (response.content && response.content.length > 0) {
        setPosts((prevPosts) => {
          if (currentPage === 0) return response.content;

          const uniquePosts = [...prevPosts];
          response.content.forEach((newPost) => {
            if (!uniquePosts.find((post) => post.id === newPost.id)) {
              uniquePosts.push(newPost);
            }
          });
          return uniquePosts;
        });
        setHasMore(!response.last && response.content.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch favorite shares:", error);
      setHasMore(false);
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
    if (tab !== activeTab) {
      setActiveTab(tab);
      setPosts([]);
      setPage(0);
      setHasMore(true);
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
        fetchFavoriteTogethers(page);
      } else {
        fetchFavoriteShares(page);
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
          posts.map((item, index) => (
            <div
              key={`${activeTab}-${item.id}`}
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

export default ZzimList;
