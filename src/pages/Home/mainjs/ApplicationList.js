import React, { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import "../maincss/ApplicationList.css";
import {
  listAllByParentId as listTogetherApplications,
  acceptParticipant,
  rejectParticipant,
  completeParticipant,
} from "../../../api/togetherParticipantApi";
import { listAllByParentId as listShareApplications } from "../../../api/shareParticipantApi";
import { createReview } from "../../../api/togetherReviewApi";
import { toast } from "react-toastify";

const ApplicationList = () => {
  const { parentId } = useParams();
  const location = useLocation();
  const post = location.state?.post;

  const [applications, setApplications] = useState([]);
  const [activeTab, setActiveTab] = useState("together");
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [reviewContent, setReviewContent] = useState("");
  const [reviewRating, setReviewRating] = useState(1);
  const navigate = useNavigate();
  const observer = useRef();

  useEffect(() => {
    setApplications([]);
    setPage(0);
    setHasMore(true);
    console.log("post", post);
    if (activeTab === "together") {
      fetchTogetherApplications(0);
    } else {
      fetchShareApplications(0);
    }
  }, [activeTab, parentId]);

  const fetchTogetherApplications = async (currentPage) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await listTogetherApplications(post.id);
      console.log(response);
      if (response && response.length > 0) {
        setApplications((prevApplications) => {
          if (currentPage === 0) return response;

          const uniqueApplications = [...prevApplications];
          response.forEach((newApplication) => {
            if (
              !uniqueApplications.find(
                (application) => application.id === newApplication.id
              )
            ) {
              uniqueApplications.push(newApplication);
            }
          });
          return uniqueApplications;
        });
        setHasMore(response.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch together applications:", error);
      setHasMore(false);
    } finally {
      setLoading(false);
    }
  };

  const fetchShareApplications = async (currentPage) => {
    if (!hasMore || loading) return;

    setLoading(true);
    try {
      const response = await listShareApplications(post.id);
      console.log(response);
      if (response && response.length > 0) {
        setApplications((prevApplications) => {
          if (currentPage === 0) return response;

          const uniqueApplications = [...prevApplications];
          response.forEach((newApplication) => {
            if (
              !uniqueApplications.find(
                (application) => application.id === newApplication.id
              )
            ) {
              uniqueApplications.push(newApplication);
            }
          });
          return uniqueApplications;
        });
        setHasMore(response.length === 10);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch share applications:", error);
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
      setApplications([]);
      setPage(0);
      setHasMore(true);
    }
  };

  const lastApplicationElementRef = useCallback(
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
        fetchTogetherApplications(page);
      } else {
        fetchShareApplications(page);
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

  const handleAccept = async (id) => {
    try {
      await acceptParticipant(id);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, accepted: true, rejected: null }
            : application
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to accept participant:", error);
    }
  };

  const handleReject = async (id) => {
    try {
      await rejectParticipant(id);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, accepted: null, rejected: true }
            : application
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to reject participant:", error);
    }
  };

  const handleComplete = async (id) => {
    try {
      await completeParticipant(id);
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application.id === id
            ? { ...application, complete: true }
            : application
        )
      );
      setShowModal(false);
    } catch (error) {
      console.error("Failed to complete participant:", error);
    }
  };

  const handleReviewSubmit = async () => {
    const reviewDTO = {
      content: reviewContent,
      rating: reviewRating,
      parentId: post.id,
      targetId: selectedApplication.userId,
    };

    try {
      await createReview(reviewDTO);
      setShowModal(false);
      setReviewContent("");
      setReviewRating(1);
    } catch (error) {
      console.error("Failed to create review:", error);
      toast.error("이미 후기를 작성했습니다.");
    }
  };

  const handleMoreClick = (application) => {
    setSelectedApplication(application);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedApplication(null);
  };

  return (
    <div className="mobile-container">
      <div className="application-list">
        <header className="application-header">
          <button
            className="application-back-button"
            onClick={() => navigate(-1)}
          >
            ◀
          </button>
          <h1>받은 신청 목록</h1>
        </header>
        <div className="application-tabs">
          <button
            className={`application-tab ${
              activeTab === "together" ? "active" : ""
            }`}
            onClick={() => handleTabClick("together")}
          >
            같이가요
          </button>
          <button
            className={`application-tab ${
              activeTab === "share" ? "active" : ""
            }`}
            onClick={() => handleTabClick("share")}
          >
            나눠요
          </button>
        </div>
        {applications.length === 0 ? (
          <p className="no-applications">받은 신청이 없습니다</p>
        ) : (
          applications.map((item, index) => (
            <div
              key={`${activeTab}-${item.id}`}
              className="application-item"
              onClick={() => handleItemClick(item.id)}
              ref={
                index === applications.length - 1
                  ? lastApplicationElementRef
                  : null
              }
            >
              {item.imageIds && item.imageIds[0] ? (
                <img
                  src={`http://localhost:8080/api/v1/${activeTab}/download?id=${item.imageIds[0]}`}
                  alt={item.title}
                  className="application-card-image"
                />
              ) : (
                <img
                  src="/images/noimage.png"
                  alt={item.title}
                  className="application-card-image"
                />
              )}
              <div className="item-details">
                <h2 className="item-title">{post.title}</h2>
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
        {loading && <p>Loading more applications...</p>}
      </div>
      {showModal && selectedApplication && (
        <div className="modal">
          <div className="modal-content">
            <h2>신청 관리</h2>
            {getStatus(selectedApplication) === "pending" && (
              <>
                <button
                  className="modal-button"
                  onClick={() => handleAccept(selectedApplication.id)}
                >
                  신청받기
                </button>
                <button
                  className="modal-button"
                  onClick={() => handleReject(selectedApplication.id)}
                >
                  거절하기
                </button>
              </>
            )}
            {getStatus(selectedApplication) === "accepted" && (
              <button
                className="modal-button"
                onClick={() => handleComplete(selectedApplication.id)}
              >
                완료하기
              </button>
            )}
            {getStatus(selectedApplication) === "completed" && (
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

export default ApplicationList;
