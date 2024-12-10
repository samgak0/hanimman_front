import React, { useContext, useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Slider from "react-slick";
import { toast } from "react-toastify"; // react-toastify 추가
import "./ShareDetail.css";
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
import { useLocalStorage } from "react-use";

const ShareDetail = () => {
  const [mannerScore, setMannerScore] = useState(null); // 당도
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
  const [scrollY] = useLocalStorage("places_list_scroll", 0);
  const [showTooltip, setShowTooltip] = useState(false); // Tooltip 상태 추가
  const tooltipRef = useRef(null);

  useEffect(() => {
    // 기본값이 "0"이기 때문에 스크롤 값이 저장됐을 때에만 window를 스크롤시킨다.
    if (scrollY !== 0) window.scrollTo(0, scrollY);
  }, [scrollY]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const data = await readShare(id); // readShare 함수에 id 전달
        setPost(data);
        setMannerScore(data.brix);
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

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (tooltipRef.current && !tooltipRef.current.contains(event.target)) {
        setShowTooltip(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [tooltipRef]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading post: {error.message}</p>;
  if (!post) return <p>Post not found</p>;

  // 현재 게시글이 이미 신청되었는지 확인
  const isApplied = appliedPosts.includes(post.id);

  // 신청하기
  const handleApply = async () => {
    if (!isApplied) {
      const shareParticipantDTO = {
        parentId: post.id,
        date: new Date().toISOString(),
        quantity: post.quantity,
      };
      try {
        await createParticipant(shareParticipantDTO);
        toast.success("신청이 완료되었습니다.");
        navigate("/chat"); // 채팅 페이지로 이동
      } catch (error) {
        toast.error("참여자 생성 중 오류가 발생했습니다.");
      }
    } else {
      toast.info("이미 신청한 게시글입니다.");
    }
  };

  // 삭제하기
  const handleDelete = async () => {
    try {
      await deleteShare(post.id);
      toast.success("게시글이 삭제되었습니다.");
      navigate("/sharelist"); // 삭제 후 리스트 페이지로 이동
    } catch (error) {
      toast.error("게시글 삭제 중 오류가 발생했습니다.");
    }
  };

  // 수정하기
  const handleEdit = () => {
    try {
      navigate(`/sharecreate`, { state: { post } });
    } catch (error) {
      toast.error("게시글 수정 중 오류가 발생했습니다.");
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
        toast.info("좋아요가 취소되었습니다.");
      } else {
        await createShareFavorite(shareDTO);
        setIsFavorite(true);
        toast.success("좋아요가 추가되었습니다.");
      }
    } catch (error) {
      toast.error("좋아요 처리 중 오류가 발생했습니다.");
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

  // 색상 간 보간(interpolation)을 계산하는 함수
  const interpolateColor = (startColor, endColor, factor) => {
    const result = startColor.map((start, index) =>
      Math.round(start + factor * (endColor[index] - start))
    );
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
  };

  // 당도 점수(1~50)에 따라 동적 색상을 계산하는 함수
  const getDynamicColor = (score) => {
    // 색상 구간 정의 (6개 구간)
    const colors = [
      { range: [1, 5], start: [168, 208, 141], end: [210, 225, 136] }, // 연두빛 (덜 익은 과일)
      { range: [5, 10], start: [210, 225, 136], end: [255, 235, 132] }, // 노랑빛 (조금 익은 과일)
      { range: [10, 15], start: [255, 235, 132], end: [255, 212, 100] }, // 황금빛 (덜 달지만 맛이 나는 과일)
      { range: [15, 20], start: [255, 212, 100], end: [244, 187, 68] }, // 망고빛 (달달함이 시작되는 과일)
      { range: [20, 25], start: [244, 187, 68], end: [255, 152, 0] }, // 밝은 주황 (맛이 깊어진 과일)
      { range: [25, 30], start: [255, 152, 0], end: [255, 120, 85] }, // 복숭아빛 (풍미가 살아나는 과일)
      { range: [30, 35], start: [255, 120, 85], end: [255, 87, 51] }, // 붉은 주황 (과즙이 풍부한 과일)
      { range: [35, 40], start: [255, 87, 51], end: [255, 69, 0] }, // 진한 붉은빛 (거의 완벽한 맛의 과일)
      { range: [40, 45], start: [255, 69, 0], end: [235, 35, 0] }, // 붉은 과일 (완전히 익은 달콤한 과일)
      { range: [45, 50], start: [235, 35, 0], end: [255, 0, 0] }, // 빨간 과일 (최고로 맛있는 과일)
    ];

    // 점수가 해당하는 구간의 색상을 계산
    for (const color of colors) {
      const [min, max] = color.range;
      if (score >= min && score <= max) {
        const factor = (score - min) / (max - min); // 구간 내 점수 비율 (0~1)
        return interpolateColor(color.start, color.end, factor);
      }
    }

    return "rgb(255, 0, 0)"; // 기본값: 최대값 이상은 고정 빨강
  };

  return (
    <div className="mobile-container">
      <div className="share-detail-page">
        {/* Header */}
        <header className="share-detail-header">
          <button className="share-back-button" onClick={() => navigate(-1)}>
            <BackIcon />
          </button>
          <button className="share-notify-button" onClick={handleReport}>
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
          <div className="share-detail-user">
            <div className="share-user-info">
              {post.userProfileImage ? (
                <img
                  src={`http://localhost:8080/api/v1/share/downloadprofile?id=${post.userProfileImage}`}
                  alt={post.userNickname}
                  className="share-user-image"
                />
              ) : (
                <img
                  src="/images/noprofileimage.png"
                  alt={post.userNickname}
                  className="share-user-image"
                />
              )}
              <p>{post.userNickname}</p>
            </div>
            <div className="share-user-brix">
              <p className="share-brix-font">{post.brix}brix</p>
              <div className="share-progress-bar">
                <div
                  className="share-progress-fill"
                  style={{
                    width: `${(mannerScore / 50) * 100}%`, // 당도 비율로 너비 계산
                    backgroundColor: getDynamicColor(mannerScore), // 당도에 따른 색상 적용
                  }}
                ></div>
              </div>
              <p className="share-brix-infomation">
                <span class="tooltip">
                  매너당도
                  <span class="tooltip-text">
                    매너당도는 망고 이용자로부터 받은 칭찬, 비매너평가, 운영자
                    제재 등을 종합해서 만든 매너 지표 입니다.
                  </span>
                </span>
              </p>
            </div>
          </div>
          <div className="share-detail-info">
            <div className="detail-meta">
              <div className="detail-meta-location">
                <CalendarIcon className="calendar-icon" />{" "}
                {post.address || "위치 정보 없음"}
              </div>
              <div className="detail-meta-date">
                {formatDate(post.createdAt)}
              </div>
            </div>
            <div className="detail-metacontainer">
              <div className="detail-meta-count">
                <ViewIcon className="view-count" /> {post.views}{" "}
                <HeartEmptyIcon className="favorite-count" />{" "}
                {post.favoriteCount}
              </div>
            </div>
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

          {isWriter ? (
            <button
              className="apply-button"
              onClick={() => navigate(`/applicationlist/${post.id}`)}
            >
              신청목록
            </button>
          ) : (
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
          )}
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
