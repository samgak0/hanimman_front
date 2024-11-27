import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./TogetherDetail.css";
import { ReactComponent as BackIcon } from "../../../assets/icons/back.svg";
import { ReactComponent as HeartEmptyIcon } from "../../../assets/icons/zzimOff.svg";
import { ReactComponent as HeartFullIcon } from "../../../assets/icons/zzimOn.svg";
import { ReactComponent as NotifyIcon } from "../../../assets/icons/notify.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg";
import { ReactComponent as TogetherUserIcon } from "../../../assets/icons/togetherUserNum.svg";
import { ReactComponent as ViewIcon } from "../../../assets/icons/view.svg";

import { DataContext } from "../../../context/DataContext";
import { readTogether } from "../../../api/togetherApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const TogetherDetail = () => {
  const { id } = useParams(); // URL에서 id를 가져옴
  const navigate = useNavigate();
  const { applyForPost, appliedPosts } = useContext(DataContext);
  const [post, setPost] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await readTogether(id); // readTogether 함수에 id 전달
        setPost(data);
      } catch (error) {
        setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchPost();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading post: {error.message}</p>;
  if (!post) return <p>Post not found</p>;

  // 현재 게시글이 이미 신청되었는지 확인
  const isApplied = appliedPosts.includes(post.id);

  const handleApply = () => {
    if (!isApplied) {
      applyForPost(post.id);
    }
  };

  // 현재 신청된 인원 계산
  const currentApplicants = appliedPosts.filter((id) => id === post.id).length;
  const totalPeople = post.people || 0;

  const toggleFavorite = () => {
    setIsFavorite(!isFavorite);
  };

  // 날짜 포맷 함수
  const formatDate = (dateString) => {
    if (!dateString) return "날짜 정보 없음";
    const date = new Date(dateString);
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      weekday: "short",
      hour: "2-digit",
      minute: "2-digit",
    };
    return date.toLocaleDateString("ko-KR", options);
  };

  // 슬라이더 설정
  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <div className="together-detail-page">
      {/* Header */}
      <header className="detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          <BackIcon />
        </button>
        <button className="notify-button" onClick={() => navigate}>
          <NotifyIcon />
        </button>
      </header>

      {/* Image Section */}
      <div className="detail-image-container">
        {post.imageIds && post.imageIds.length > 0 ? (
          post.imageIds.length === 1 ? (
            <img
              src={`http://localhost:8080/api/v1/together/download?id=${post.imageIds[0]}`}
              alt="상품 이미지"
              className="detail-image"
            />
          ) : (
            <Slider {...settings}>
              {post.imageIds.map((id, index) => (
                <div key={index}>
                  <img
                    src={`http://localhost:8080/api/v1/together/download?id=${id}`}
                    alt={`Slide ${index}`}
                    className="detail-image"
                  />
                </div>
              ))}
            </Slider>
          )
        ) : (
          <p className="no-image">이미지가 없습니다.</p>
        )}
      </div>

      {/* Info Section */}
      <div className="detail-title">
        <h2>{post.title}</h2>
        <p>{post.price}원</p>
      </div>
      <div className="detail-meta">
        <div className="detail-meta-location">
          <CalendarIcon className="calendar-icon" />{" "}
          {post.address || "위치 정보 없음"}
        </div>
        <div className="detail-meta-date">{formatDate(post.createdAt)}</div>
        <div className="detail-meta-count">
          <ViewIcon className="view-count" /> {post.views}{" "}
          <HeartEmptyIcon className="favorite-count" /> {post.favoriteCount}
        </div>
      </div>
      <div className="detail-info">
        <h2>상세정보</h2>
        <div className="detail-info-category">
          <strong>카테고리 </strong>{" "}
          <p>{post.selectedCategory || "카테고리 없음"}</p>
        </div>
        <div className="detail-info-category">
          <strong>출발일 </strong> <p>{formatDate(post.meetingAt)} </p>
        </div>
        <div className="detail-info-category">
          <strong>현재인원 </strong>
          <p>
            {currentApplicants}/{totalPeople}명{" "}
          </p>
        </div>
      </div>
      <div className="detail-text">{post.content || "내용 없음"}</div>

      {/* Footer Buttons */}
      <div className="detail-actions">
        <button className="favorite-button" onClick={toggleFavorite}>
          {isFavorite ? (
            <HeartFullIcon className="zzimOn" />
          ) : (
            <HeartEmptyIcon className="zzimOff" />
          )}
        </button>

        <button className="chat-button">채팅하기</button>
        <button
          className="apply-button"
          onClick={handleApply}
          disabled={isApplied}
        >
          {isApplied ? "신청완료" : "신청하기"}
        </button>
      </div>
    </div>
  );
};

export default TogetherDetail;
