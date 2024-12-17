import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import "../maincss/MainPage.css";
import { ReactComponent as ShareIcon } from "../../../assets/icons/share.svg";
import { ReactComponent as TogetherIcon } from "../../../assets/icons/together.svg";
import { readMain } from "../../../api/mainApi";

const MainPage = () => {
  const navigate = useNavigate();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();

  const handleTogetherClick = () => {
    navigate("/togetherlist");
  };
  const handleShareClick = () => {
    navigate("/sharelist");
  };
  useEffect(() => {
    const fetchData = async () => {
      const data = await readMain(); // 데이터를 비동기적으로 가져옴
      setItems(data); // 상태 업데이트
      setLoading(false);
    }
    fetchData(); // 비동기 함수 호출
  }, []); // 의존성 배열이 비어있어 컴포넌트 마운트 시 한 번 실행됨

  const handleCardClick = (item) => {
    navigate(`/itemdetail/${item.id}`, { state: { item } }); // 카드 클릭 시 상세 페이지로 이동
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

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const options = {
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    };
    if (date.getFullYear() !== now.getFullYear()) {
      options.year = "numeric";
    }
    return date.toLocaleDateString("ko-KR", options);
  };

  if (loading && page === 0) return <p>로딩 중...</p>;

  return (
    <div className="mobile-container">
      <div className="main-page">
        <Header
          showBack={false}
          showLeft={true} // 위치 표시 활성화
          showLogo={false} // 로고 비활성화
          showMenu={true}
          showSearch={true} // 검색 버튼 활성화
          showBell={false} // 알림 버튼 비활성화
        />
        <div className="main-content">
          <section className="category">
            <div className="category-buttons">
              <button className="category-button" onClick={handleTogetherClick}>
                <TogetherIcon />
                <p className="category-text">같이가요</p>
              </button>
              <button className="category-button" onClick={handleShareClick}>
                <ShareIcon />
                <p className="category-text">나눠요</p>
              </button>
            </div>
          </section>

          <section className="combined-slider">
            <div className="combined-list-container">
              {items.length > 0 ? (
                items.map((item, index) => (
                  <div
                    className="combined-card"
                    key={index}
                    onClick={() => handleCardClick(item)}
                    ref={index === items.length - 1 ? lastPostElementRef : null}
                  >
                    <div className="combined-card-image-container">
                      {item.imageId && (item.type === "share" || item.type === "together") ? (
                        <img
                          src={`http://localhost:8080/api/v1/${item.type === "share" ? "share" : "together"
                            }/download?id=${item.imageId}`}
                          alt={item.title}
                          className="combined-card-image"
                        />
                      ) : (
                        <img
                          src="/images/noimage.png"
                          alt={item.title || "이미지 없음"}
                          className="combined-card-image"
                        />
                      )}
                    </div>



                    <div className="combined-card-content">
                      {/* 카드 제목 */}
                      <div className="combined-card-title">{item.title}</div>
                      <div className="combined-card-meta">
                        <div className="location-info">
                          <p>{item.address || "정보 없음"}</p>
                        </div>
                        {item.dateAt ? formatDate(item.dateAt) : "날짜 없음"}
                      </div>

                      {/* 거래 상태 */}
                      <div className="combined-card-status-price">
                        <div className="left-group">
                          <div className={`category-badge ${item.type}`}>
                            {item.type === "share" ? "나눠요" : "같이가요"}
                          </div>
                          <div className="combined-card-price">
                            {item.price
                              ? `${new Intl.NumberFormat("ko-KR").format(
                                item.price
                              )}원`
                              : "가격정보없음"}
                            /{item.quantity}개
                          </div>
                        </div>

                        <div className="combined-card-chat">
                          <span className="meta-item">
                            💬 {item.participant || 0}
                          </span>
                          <span className="meta-item">
                            ❤️ {item.favorite || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-posts">등록된 게시물이 없습니다.</p>
              )}
            </div>
          </section>
        </div>

        <Footer />
      </div>
    </div>
  );
};

export default MainPage;
