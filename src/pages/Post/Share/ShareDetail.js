import React, { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import "./ShareDetail.css";
import { toast } from "react-toastify"; // react-toastify 추가
import { ReactComponent as BackIcon } from "../../../assets/icons/back.svg";
import { ReactComponent as HeartEmptyIcon } from "../../../assets/icons/zzimOff.svg";
import { ReactComponent as HeartFullIcon } from "../../../assets/icons/zzimOn.svg";
import { ReactComponent as NotifyIcon } from "../../../assets/icons/notify.svg";
import { ReactComponent as CalendarIcon } from "../../../assets/icons/calendar.svg";
import { ReactComponent as ViewIcon } from "../../../assets/icons/view.svg";

import { DataContext } from "../../../context/DataContext";
import { readShare, deleteShare } from "../../../api/shareApi";
import {
  createShareFavorite,
  deleteShareFavorite,
} from "../../../api/shareFavoriteApi";
import { createParticipant } from "../../../api/shareParticipantApi";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

const ShareDetail = () => {
  const { id } = useParams(); // URL에서 id를 가져옴
  const navigate = useNavigate();
  const { applyForPost, appliedPosts } = useContext(DataContext);
  const [post, setPost] = useState(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isWriter, setIsWriter] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showApplyConfirm, setShowApplyConfirm] = useState(false); // 참여 신청 확인 창 상태 추가

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await readShare(id); // readShare 함수에 id 전달
        setPost(data);
        setIsFavorite(data.favorite); // 좋아요 상태 설정
        setIsWriter(data.writer);
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

  const handleApply = async () => {
    if (!isApplied) {
      const shareParticipantDTO = {
        parentId: post.id,
        date: new Date().toISOString(),
        quantity: post.quantity,
      };
      console.log("참여자 생성", shareParticipantDTO);
      try {
        await createParticipant(shareParticipantDTO);
        navigate("/chat"); // 채팅 페이지로 이동
      } catch (error) {
        console.error("참여자 생성 중 에러가 발생했습니다:", error);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await deleteShare(post.id);
      navigate("/sharelist"); // 삭제 후 리스트 페이지로 이동
    } catch (error) {
      console.error("게시글 삭제 중 에러가 발생했습니다:", error);
    }
  };

  const handleEdit = () => {
    try {
      navigate(`/sharecreate`, { state: { post } });
    } catch (error) {
      console.error("게시글 수정 중 에러가 발생했습니다:", error);
    }
  };

  //신고하기
  const handleReport = () => {
    try {
      navigate(`/sharereport`, { state: { post } });
    } catch (error) {
      toast.error("게시글 신고 중 오류가 발생했습니다.");
    }
  };

  const toggleFavorite = async () => {
    const shareDTO = {
      views: 0,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      deletedAt: null,
      addressId: 1111015100,
      meetingLocation: null,
      id: post.id,
    };
    try {
      if (isFavorite) {
        await deleteShareFavorite(shareDTO);
        setIsFavorite(false);
      } else {
        await createShareFavorite(shareDTO);
        setIsFavorite(true);
      }
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
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
    <div className="mobile-container">
      <div className="share-detail-page">
        {/* Header */}
        <header className="detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            <BackIcon />
          </button>
          <button className="notify-button" onClick={handleReport}>
            <NotifyIcon />
          </button>
        </header>

        {/* Image Section */}
        <div className="detail-image-container">
          {post.imageIds && post.imageIds.length > 0 ? (
            post.imageIds.length === 1 ? (
              <img
                src={`http://localhost:8080/api/v1/share/download?id=${post.imageIds[0]}`}
                alt="상품 이미지"
                className="detail-image"
              />
            ) : (
              <Slider {...settings}>
                {post.imageIds.map((id, index) => (
                  <div key={index}>
                    <img
                      src={`http://localhost:8080/api/v1/share/download?id=${id}`}
                      alt={`Slide ${index}`}
                      className="detail-image"
                    />
                  </div>
                ))}
              </Slider>
            )
          ) : (
            <img
              src="/images/noimage.png"
              alt={post.title}
              className="share-card-image"
            />
          )}
        </div>

        {/* Info Section */}
        <div className="detail-title">
          <h2>{post.title}</h2>
          <p>{post.price ? `${post.price}원` : "가격 정보 없음"}</p>
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
            <strong>출발일 </strong> <p>{formatDate(post.locationDate)} </p>
          </div>
          <div className="detail-info-category">
            <strong>나눔장소 </strong>
            <p>{post.location || "위치 정보 없음"}</p>
          </div>

          <div className="detail-info-category">
            <strong>남은 수량 </strong>
            <p>{post.quantity || 0}개</p>
          </div>
        </div>
        <div className="detail-text">{post.content || "내용 없음"}</div>

        {/* Footer Buttons */}
        <div className="detail-actions">
          {isWriter ? (
            <>
              <button
                className="delete-button"
                onClick={() => setShowDeleteConfirm(true)}
              >
                삭제하기
              </button>
              {showDeleteConfirm && (
                <div className="delete-confirm">
                  <p>정말로 삭제하시겠습니까?</p>
                  <button className="confirm-button" onClick={handleDelete}>
                    예
                  </button>
                  <button
                    className="cancel-button"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    아니오
                  </button>
                </div>
              )}
            </>
          ) : (
            <button className="favorite-button" onClick={toggleFavorite}>
              {isFavorite ? (
                <HeartFullIcon className="zzimOn" />
              ) : (
                <HeartEmptyIcon className="zzimOff" />
              )}
            </button>
          )}

          {isWriter ? (
            <button className="edit-button" onClick={handleEdit}>
              수정하기
            </button>
          ) : null}

          <button
            className={`apply-button ${post.isEnd ? "ended" : ""}`}
            onClick={() =>
              post.participant ? navigate("/chat") : setShowApplyConfirm(true)
            } // 참여 신청 확인 창 표시 또는 채팅 페이지로 이동
            disabled={isApplied || post.isEnd}
          >
            {post.isEnd
              ? "마감됨"
              : post.participant
              ? "채팅방이동"
              : isApplied
              ? "신청완료"
              : "신청하기"}
          </button>
          {showApplyConfirm && (
            <div className="apply-confirm">
              <p>참여신청을 하시겠습니까?</p>
              <button className="confirm-button" onClick={handleApply}>
                예
              </button>
              <button
                className="cancel-button"
                onClick={() => setShowApplyConfirm(false)}
              >
                아니오
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShareDetail;
