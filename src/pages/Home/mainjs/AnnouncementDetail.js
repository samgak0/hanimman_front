import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../maincss/AnnouncementDetail.css"; // CSS 파일 import
import { readNotice } from "../../../api/noticeApi"; // readNotice 함수 import

const AnnouncementDetail = () => {
  const { id } = useParams(); // URL에서 id를 가져옴
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [announcement, setAnnouncement] = useState(null); // 공지사항 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        const data = await readNotice(id); // 공지사항 상세 내용 불러오기
        setAnnouncement(data); // 공지사항 상태 설정
      } catch (error) {
        setError(error); // 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchAnnouncement();
  }, [id]);

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시
  if (error) return <p>Error loading announcement: {error.message}</p>; // 에러 발생 시 표시
  if (!announcement) return <p>Announcement not found</p>; // 공지사항이 없을 때 표시

  return (
    <div className='mobile-container'>
    <div className="announcement-detail-container">
      <header className="announcement-detail-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>{" "}
        {/* 뒤로가기 버튼 */}
        <h1>공지사항</h1>
      </header>
      <div className="announcement-detail-content">
        <h2 className="announcement-detail-title">{announcement.title}</h2>
        <p className="announcement-detail-date">
          {new Date(announcement.createdAt).toLocaleDateString()}
        </p>
        <div className="announcement-detail-images">
          {announcement.imageIds &&
            announcement.imageIds.map((id) => (
              <img
                key={id}
                src={`http://localhost:8080/api/v1/notice/download?id=${id}`}
                alt="공지사항 이미지"
                className="announcement-detail-image"
              />
            ))}
        </div>
        <p className="announcement-detail-text">{announcement.content}</p>
      </div>
    </div>
    </div>
  );
};

export default AnnouncementDetail;
