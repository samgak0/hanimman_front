import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useHistory -> useNavigate로 수정
import '../beforemaincss/LocationPage.css';

const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();  // useNavigate 훅 사용

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // Google Maps Geocoding API를 사용하여 위치 정보를 주소로 변환
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`
          );
          const data = await response.json();
          const address = data.results[0]?.formatted_address || '주소를 찾을 수 없습니다';

          // 위치 정보를 DB에 저장하는 API 호출
          const dbResponse = await fetch('/api/save-location', {  // 서버 API 호출 예시
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ latitude, longitude, address }),
          });

          if (dbResponse.ok) {
            // DB에 저장이 성공하면 본인인증 페이지로 이동
            navigate('/verification');  // 본인인증 페이지로 이동
          } else {
            alert('위치 정보 저장에 실패했습니다.');
          }

          setLocation(address);
        },
        (error) => {
          console.error('위치 정보를 가져오지 못했습니다:', error);
        }
      );
    } else {
      alert('GPS를 지원하지 않는 브라우저입니다.');
    }
  };

  return (
    <div className="location-container">
      <h2>위치 정보 페이지</h2>
      <button onClick={fetchLocation} className="location-button">
        현재 위치로 찾기
      </button>
      {location && <p>현재 위치: {location}</p>}
    </div>
  );
};

export default LocationPage;