import React from 'react';
import './MyProfile.css';
import { useNavigate } from 'react-router-dom';

const MyProfile = () => {
  const navigate = useNavigate();
  const mannerScore = 15; // 매너 당도 예시 값 (0~50)

  // 매너 당도에 따라 색상을 계산하는 함수
  const interpolateColor = (startColor, endColor, factor) => {
    const result = startColor.map((start, index) =>
      Math.round(start + factor * (endColor[index] - start))
    );
    return `rgb(${result[0]}, ${result[1]}, ${result[2]})`;
  };
  
  const getGradientColor = (score) => {
    const colors = [
      { range: [0, 10], start: [255, 235, 132], end: [125, 126, 82] }, // 떫은 과일
      { range: [10, 20], start: [255, 235, 132], end: [255, 204, 148] }, // 평범한 과일
      { range: [20, 30], start: [255, 204, 148], end: [255, 157, 148] }, // 달달한 과일
      { range: [30, 40], start: [255, 157, 148], end: [255, 110, 110] }, // 달콤한 과일
      { range: [40, 49], start: [255, 110, 110], end: [168, 50, 121] }, // 아주 달달한 과일
      { range: [49, 50], start: [168, 50, 121], end: [255, 0, 0] }, // 붉은색
    ];
  
    for (const color of colors) {
      const [min, max] = color.range;
      if (score >= min && score <= max) {
        const factor = (score - min) / (max - min); // 구간 내 비율 (0~1)
        const startColor = color.start;
        const endColor = color.end;
  
        // 자연스러운 경계 처리를 위한 추가 혼합 로직
        const prevColor = colors.find(c => c.range[1] === min)?.end || startColor;
        const nextColor = colors.find(c => c.range[0] === max)?.start || endColor;
  
        let mixedStart, mixedEnd;
  
        if (score - min <= 2) {
          // 초반 경계 혼합
          const transitionFactor = (score - min) / 2; // 부드러운 초반 혼합
          mixedStart = interpolateColor(prevColor, startColor, transitionFactor);
          mixedEnd = interpolateColor(prevColor, endColor, transitionFactor);
        } else if (max - score <= 2) {
          // 후반 경계 혼합
          const transitionFactor = (max - score) / 2; // 부드러운 후반 혼합
          mixedStart = interpolateColor(endColor, nextColor, 1 - transitionFactor);
          mixedEnd = interpolateColor(startColor, nextColor, 1 - transitionFactor);
        } else {
          // 일반 구간 처리
          mixedStart = interpolateColor(startColor, endColor, factor);
          mixedEnd = interpolateColor(startColor, endColor, Math.min(1, factor + 0.1));
        }
  
        return `linear-gradient(to right, ${mixedStart}, ${mixedEnd})`;
      }
    }
  
    return `rgb(255, 0, 0)`; // 기본값: 50 이상은 고정 빨강
  };

  return (
    <div className="profile-container">
      <header className="profile-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button>
        <h1>프로필</h1>
        <button className="share-button">🔗</button>
      </header>

      <div className="profile-main">
        <div className="profile-info">
          <img className="profile-avatar" src="/images/default-avatar.png" alt="프로필 사진" />
          <div className="profile-details">
            <h2>어느새 <span>#5039366</span></h2>
            <button className="edit-profile-btn" onClick={() => navigate('/editprofile')}>프로필 수정</button>
          </div>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span>매너 당도</span>
            <span>{mannerScore}°C 😄</span>
          </div>
          <div className="progress-bar">
            <div
              className="progress-fill"
              style={{
                width: `${(mannerScore / 50) * 100}%`, // 당도 비율로 너비 계산
                background: getGradientColor(mannerScore), // 동적 그라데이션
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;