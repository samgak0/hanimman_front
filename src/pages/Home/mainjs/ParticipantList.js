import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import "../maincss/ParticipantList.css";
import { ReactComponent as HeartIcon } from "../../../assets/icons/heart.svg";
import { ReactComponent as CommentIcon } from "../../../assets/icons/chat.svg";
import { listAllByUserId as listTogetherParticipants } from "../../../api/togetherParticipantApi";
import { listAllByUserId as listShareParticipants } from "../../../api/shareParticipantApi";
import { createReview } from "../../../api/togetherReviewApi";
import { toast } from "react-toastify";

const ParticipantList = () => {
  const [participants, setParticipants] = useState([]);
  const [activeTab, setActiveTab] = useState("together");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedParticipant, setSelectedParticipant] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(1);
  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    setParticipants([]);
    setPage(0);
    setHasMore(true);
    if (activeTab === "together") {
      fetchTogetherParticipants(0);
    } else {
      fetchShareParticipants(0);
    }
  }, [activeTab]);

  const fetchTogetherParticipants = async (currentPage) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await listTogetherParticipants();
      if (response && response.length > 0) {
        setParticipants((prevParticipants) => {
          if (currentPage === 0) return response;

          const uniqueParticipants = [...prevParticipants];
          response.forEach((newParticipant) => {
            if (
              !uniqueParticipants.find(
                (participant) => participant.id === newParticipant.id
              )
            ) {
              uniqueParticipants.push(newParticipant);
            }
          });
          return uniqueParticipants;
        });
        setHasMore(response.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch together participants:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchShareParticipants = async (currentPage) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await listShareParticipants();
      if (response && response.length > 0) {
        setParticipants((prevParticipants) => {
          if (currentPage === 0) return response;

          const uniqueParticipants = [...prevParticipants];
          response.forEach((newParticipant) => {
            if (
              !uniqueParticipants.find(
                (participant) => participant.id === newParticipant.id
              )
            ) {
              uniqueParticipants.push(newParticipant);
            }
          });
          return uniqueParticipants;
        });
        setHasMore(response.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch share participants:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const handleItemClick = (id) => {
    // 채팅방으로 이동 로직 구현
    // navigate(`/chat/${id}`);
    navigate(`/chats/2`);
  };

  const handleTabClick = (tab) => {
    if (tab !== activeTab) {
      setActiveTab(tab);
      setParticipants([]);
      setPage(0);
      setHasMore(true);
    }
  };

  const lastParticipantElementRef = useCallback(
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
        fetchTogetherParticipants(page);
      } else {
        fetchShareParticipants(page);
      }
    }
  }, [page, activeTab]);

  const getStatus = (item) => {
    if (item.rejected !== null) {
      return "rejected";
    } else if (item.accepted === null && item.rejected === null) {
      return "pending";
    } else if (item.accepted !== null && item.complete === null) {
      return "accepted";
    } else if (item.accepted !== null && item.complete !== null) {
      return "completed";
    } else {
      return "active";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "rejected":
        return "거절됨";
      case "pending":
        return "신청중";
      case "accepted":
        return "참가완료";
      case "completed":
        return "거래완료";
      default:
        return "모집중";
    }
  };

  const handleReviewSubmit = async () => {
    const reviewDTO = {
      content: reviewContent,
      rating: reviewRating,
      parentId: selectedParticipant.parentId,
      targetId: selectedParticipant.userId,
    };

    try {
      await createReview(reviewDTO);
      setShowModal(false);
      setReviewContent("");
      setReviewRating(1);
    } catch (error) {
      toast.error("이미 해당 거래에 대한 후기를 작성하셨습니다.");
      console.error("Failed to create review:", error);
    }
  };

  const handleMoreClick = (participant) => {
    setSelectedParticipant(participant);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedParticipant(null);
  };

  return (
    <div className="mobile-container">
      <div className="participant-list">
        <header className="participant-header">
          <button
            className="participant-back-button"
            onClick={() => navigate(-1)}
          >
            ◀
          </button>
          <h1>참여 목록</h1>
        </header>
        <div className="participant-tabs">
          <button
            className={`participant-tab ${
              activeTab === "together" ? "active" : ""
            }`}
            onClick={() => handleTabClick("together")}
          >
            같이가요
          </button>
          <button
            className={`participant-tab ${
              activeTab === "share" ? "active" : ""
            }`}
            onClick={() => handleTabClick("share")}
          >
            나눠요
          </button>
        </div>
        {participants.length === 0 ? (
          <p className="no-participants">참여한 게시물이 없습니다</p>
        ) : (
          participants.map((item, index) => (
            <div
              key={`${activeTab}-${item.id}`}
              className="participant-item"
              onClick={() => handleItemClick(item.id)}
              ref={
                index === participants.length - 1
                  ? lastParticipantElementRef
                  : null
              }
            >
              {item.imageIds && item.imageIds[0] ? (
                <img
                  src={`http://localhost:8080/api/v1/${activeTab}/download?id=${item.imageIds[0]}`}
                  alt={item.title}
                  className="participant-card-image"
                />
              ) : (
                <img
                  src="/images/noimage.png"
                  alt={item.title}
                  className="participant-card-image"
                />
              )}
              <div className="item-details">
                <h2 className="item-title">{item.title}</h2>
                <p className="item-location">{item.address}</p>
                <div className="item-status-price">
                  <span className={`item-status ${getStatus(item)}`}>
                    {getStatusText(getStatus(item))}
                  </span>
                  <span className="item-nickname">{item.nickname}</span>
                  <button
                    className="more-button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleMoreClick(item);
                    }}
                  >
                    ...
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
        {loading && <p>Loading more participants...</p>}
      </div>
      {showModal && selectedParticipant && (
        <div className="modal">
          <div className="modal-content">
            <h2>참여자 관리</h2>
            {getStatus(selectedParticipant) === "completed" && (
              <>
                <textarea
                  value={reviewContent}
                  onChange={(e) => setReviewContent(e.target.value)}
                  placeholder="후기 내용을 입력하세요 (100자 이내)"
                  maxLength="100"
                />
                <select
                  value={reviewRating}
                  onChange={(e) => setReviewRating(Number(e.target.value))}
                >
                  {[-2, -1, 0, 1, 2].map((rating) => (
                    <option key={rating} value={rating}>
                      {rating + 3}점
                    </option>
                  ))}
                </select>
                <button className="modal-button" onClick={handleReviewSubmit}>
                  후기작성하기
                </button>
              </>
            )}
            <button className="modal-button" onClick={closeModal}>
              닫기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ParticipantList;
