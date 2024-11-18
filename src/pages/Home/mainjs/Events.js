import React from 'react';
import '../maincss/Events.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom'; // useNavigate import

const eventsData = [
  {
    id: 1,
    tag: '진행 중인 이벤트',
    title: '#가을나들이 스토리 해시태그 챌린지',
    description: '가을 나들이 스토리 올리고 선물 받아요',
    period: '2024.11.18 - 2024.12.01',
    bgColor: '#FFEBDB', // 배경색
    icon: '🍂', // 아이콘 대체 (이미지 대신 사용)
  },
  {
    id: 2,
    tag: '진행 중인 이벤트',
    title: '온 동네 독서 대잔치',
    description: '독서 챌린지 시작하고 특별한 선물 받아요',
    period: '2024.11.17 - 2024.12.08',
    bgColor: '#FFEFCF',
    icon: '📖',
  },
  {
    id: 3,
    tag: '진행 중인 이벤트',
    title: '수능끝 첫알바관 오픈',
    description: '첫알바하고 특별 시급 1만원 받아요',
    period: '2024.11.14 - 2024.12.05',
    bgColor: '#DFF6FF',
    icon: '🧑‍🍳',
  },
  {
    id: 4,
    tag: '진행 중인 이벤트',
    title: '동네지도 챌린지',
    description: '동네지도에 후기 쓰고 랜덤머니 받아요',
    period: '2024.11.15 - 2024.12.06',
    bgColor: '#E8F8D7',
    icon: '💬',
  },
];

const Events = () => {
  const navigate = useNavigate(); // useNavigate 훅을 컴포넌트 내부에서 호출

  return (
    <div className="zzim-list">
      <header className="zzim-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button> {/* 이전 페이지로 이동 */}
        <h1>진행중인 이벤트</h1>
      </header>
      <div className="events-container">
        {eventsData.map((event) => (
          <div key={event.id} className="event-card" style={{ backgroundColor: event.bgColor }}>
            <div className="event-tag">{event.tag}</div>
            <div className="event-icon">{event.icon}</div>
            <div className="event-content">
              <h2 className="event-title">{event.title}</h2>
              <p className="event-description">{event.description}</p>
              <p className="event-period">{event.period}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Events;