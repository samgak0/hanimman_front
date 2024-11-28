import React, { useEffect, useState } from "react";
import "../maincss/Announcement.css"; // CSS 파일 import
import { useNavigate } from "react-router-dom"; // useNavigate import
import { listAllNotices } from "../../../api/noticeApi"; // listAllNotices 함수 import

const Announcement = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [announcements, setAnnouncements] = useState([]); // 공지사항 목록 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const pageable = { page: 0, size: 10, sort: "createdAt,desc" }; // 페이지네이션 설정
        const data = await listAllNotices(pageable); // 공지사항 목록 불러오기
        setAnnouncements(data.content); // 공지사항 목록 상태 설정
      } catch (error) {
        setError(error); // 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchAnnouncements();
  }, []);

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시
  if (error) return <p>Error loading announcements: {error.message}</p>; // 에러 발생 시 표시

  return (
    <div className="announcement-container">
      <header className="announcement-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>{" "}
        {/* 뒤로가기 버튼 */}
        <h1>공지사항</h1>
      </header>
      <ul className="announcement-list">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="announcement-item">
            <h2 className="announcement-title">{announcement.title}</h2>
            <p className="announcement-date">
              {new Date(announcement.createdAt).toLocaleDateString()}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcement;
