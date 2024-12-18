import React, { useState, useEffect } from "react"; // useState, useEffect 추가
import "./MyProfile.css";
import { useNavigate } from "react-router-dom";
import jwtAxios from "../../../api/jwtAxios";

const MyProfile = () => {
  const navigate = useNavigate();
  const [mannerScore, setMannerScore] = useState(null); // 매너 당도 예시 값 (1~50)
  const [nickname, setNickname] = useState(null);
  const [profileImage, setProfileImage] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    // API 호출
    jwtAxios
      .get("http://localhost:8080/users/myprofile")
      .then((response) => {
        // 성공적으로 응답이 오면 처리
        console.log(response);
        setNickname(response.data.nickname);
        setMannerScore(response.data.brix);
        const imageUrl = response.data.profileImage
          ? `http://localhost:8080/images/${response.data.profileImage}` // 이미지 경로 생성
          : "/images/noprofileimage.png"; // 기본 이미지
        setProfileImage(imageUrl);
      })
      .catch((error) => {
        // 오류 처리
        if (error.response) {
          // 서버가 응답했지만 상태 코드가 2xx 범위를 벗어난 경우
          console.error("오류 상태:", error.response.status);
          console.error("오류 메시지:", error.response.data);
        } else if (error.request) {
          // 요청이 전송되었지만 응답이 없는 경우
          console.error("응답 없음:", error.request);
        } else {
          // 요청을 설정하는 중에 문제가 발생한 경우
          console.error("요청 오류:", error.message);
        }
      });
  }, []); // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 호출되도록 함

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
      <div className="profile-container">
        <header className="profile-header">
          <button className="back-button" onClick={() => navigate("/mypage")}>
            ◀
          </button>
          <h1>프로필</h1>
        </header>

        <div className="profile-main">
          <div className="profile-info">
            {/* images/default-avatar.png */}
            <img
              className="profile-avatar"
              src={profileImage ? profileImage : "/images/noprofileimage.jpg"}
              alt="프로필 사진"
            />
            <div className="profile-details">
              <h2>
                {nickname}
                <span>#5039366</span>
              </h2>
              <button
                className="edit-profile-btn"
                onClick={() => navigate("/editprofile")}
              >
                프로필 수정
              </button>
            </div>
          </div>

          <div className="profile-stats">
            <div className="stat-item">
              <span>매너 당도</span>
              <span>{mannerScore}Brix</span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill"
                style={{
                  width: `${(mannerScore / 50) * 100}%`, // 당도 비율로 너비 계산
                  backgroundColor: getDynamicColor(mannerScore), // 당도에 따른 색상 적용
                }}
              ></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyProfile;
