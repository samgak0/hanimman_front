import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';  // useHistory -> useNavigate로 수정
import '../beforemaincss/LocationPage.css';

const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();  // useNavigate 훅 사용
// navigate('/verification')
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 위도와 경도를 백엔드로 전송주소
          try {
            const response = await fetch(`http://localhost:8080/api/location/administrative?latitude=${latitude}&longitude=${longitude}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });


          if (response.ok) {
            const data = await response.json();
            console.log('API Response:', data); // API 응답 확인
            
              // API 응답에서 직접 데이터 사용
              if (data) {
                setLocation(data); // 백엔드에서 받은 데이터를 상태로 설정
              } else {
                alert('유효한 데이터가 없습니다.');
              }
            } else {
              alert('법정 코드 가져오는 데 실패했습니다.');
            }
          } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            alert('API 호출 중 오류가 발생했습니다.');
          }
        },
        (error) => {
          console.error('위치 정보를 가져오지 못했습니다:', error);
          alert('위치 정보를 가져오는 데 실패했습니다.');
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
      {location && (
        <div>
          <p>법정 코드: {location.id}</p>
          <p>시: {location.cityName}</p>
          <p>구: {location.districtName}</p>
          <p>동: {location.neighborhoodName}</p>
        </div>
      )}
    </div>
  );
};

export default LocationPage;