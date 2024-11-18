import React from 'react';
import '../maincss/Announcement.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom'; // useNavigate import

const announcements = [
  {
    id: 1,
    title: '[새소식] 당근 분쟁 조정 사례집 발간 소식을 전해드려요',
    date: '2024.11.18',
  },
  {
    id: 2,
    title: '[공지] 당근페이 개인정보처리방침이 개정될 예정이에요',
    date: '2024.10.28',
  },
  {
    id: 3,
    title: '[공지] 건강기능식품 개인간 거래 방법 및 주의사항 안내',
    date: '2024.09.12',
  },
  {
    id: 4,
    title: '[공지] 보이스피싱 피해 예방과 주의 당부 안내',
    date: '2024.09.04',
  },
  {
    id: 5,
    title: '[내 근처 종료 안내] 앞으로 동네지도에서 만나요!',
    date: '2024.09.04',
  },
  {
    id: 6,
    title: '[공지] 더 좋은 서비스 제공을 위해 당근 이용약관이 변경될 예정이에요.',
    date: '2024.08.26',
  },
  {
    id: 7,
    title: '[공지] 당근페이 서비스 이용약관 등 2건이 개정될 예정이에요.',
    date: '2024.08.20',
  },
  {
    id: 8,
    title: '[공지] 티몬·위메프 미정산 사태로 인한 거래금지 안내',
    date: '2024.07.31',
  },
];

const Announcement = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용

  return (
    <div className="announcement-container">
      <header className="announcement-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button> {/* 뒤로가기 버튼 */}
        <h1>공지사항</h1>
      </header>
      <ul className="announcement-list">
        {announcements.map((announcement) => (
          <li key={announcement.id} className="announcement-item">
            <h2 className="announcement-title">{announcement.title}</h2>
            <p className="announcement-date">{announcement.date}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Announcement;