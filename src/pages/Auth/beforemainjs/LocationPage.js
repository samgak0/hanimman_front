import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../beforemaincss/LocationPage.css';
import jwtAxios from '../../../api/jwtAxios';

const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          // 위도와 경도를 백엔드로 전송
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


            if (data) {
              const addressId = data.id; // 법정 코드 (주소 ID)
              const neighborhood = data.neighborhoodName; // 동 이름

              // 사용자 ID를 가져오는 방법 (예: 로컬 스토리지 또는 상태에서)
              const userId = localStorage.getItem('userId'); // 예시: 로컬 스토리지에서 가져오기

              // 알림창으로 정보 표시
              const message = `${data.cityName}\n${data.districtName}\n${neighborhood}\n법정 코드: ${addressId}\n현재주소로 등록 하시겠습니까?`;
              const userConfirmed = window.confirm(message);
              
              if (userConfirmed) {
                // DB에 주소 정보를 저장하기 위한 API 호출
                const saveResponse = await fetch('http://localhost:8080/api/user-address', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                  body: JSON.stringify({
                    // userId: userId, // 사용자 ID 추가
                    primaryAddressId: addressId, // 법정 동 코드 (주소 ID)
                    neighborhood: neighborhood, // 동 정보
                    // 추가적으로 필요한 다른 필드도 포함
                  }),
                });

                if (saveResponse.ok) {
                  alert('주소가 성공적으로 저장되었습니다.');
                  navigate('/main'); // 메인 화면으로 이동
                } else {
                  alert('주소 저장에 실패했습니다.');
                }
              }
              // 취소 버튼 클릭 시 현재 페이지에 머무릅니다.
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
    <div className='mobile-container'>
      <div className="location-container">
        <h2>위치 정보 페이지</h2>
        <button onClick={fetchLocation} className="location-button">
          현재 위치로 찾기
        </button>
      </div>
    </div>
  );
};

export default LocationPage;
