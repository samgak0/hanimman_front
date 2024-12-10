import React, { useState, useEffect } from "react";
import "./LocationSettings.css";
import { useNavigate } from 'react-router-dom';
import jwtAxios from "../../../api/jwtAxios";
import { toast } from "react-toastify"; // toast 추가

const LocationSettings = () => {
  const [registeredLocations, setRegisteredLocations] = useState([]); // 초기값을 빈 배열로 설정
  const [searchText, setSearchText] = useState("");
  const [availableLocations, setAvailableLocations] = useState([]); // 검색 결과를 저장
  const navigate = useNavigate();

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(`http://localhost:8080/api/location/administrative?latitude=${latitude}&longitude=${longitude}`, {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
              },
            });

            if (response.ok) {
              const data = await response.json();
              console.log('API Response:', data);

              if (data) {
                const { id, cityName, districtName, neighborhoodName } = data; // ID 추출
                const fullAddress = `${cityName} ${districtName} ${neighborhoodName}`; // 전체 주소 형식화

                // 주소 추가
                setAvailableLocations((prev) => {
                  const newLocation = {
                    id: id, // ID 저장
                    fullAddress: fullAddress // 전체 주소 저장
                  };
                  if (!prev.some(location => location.fullAddress === newLocation.fullAddress)) {
                    return [...prev, newLocation];
                  }
                  return prev;
                });
              } else {
                alert('법정 코드 가져오는 데 실패했습니다.');
              }
            }
          } catch (error) {
            console.error('API 호출 중 오류 발생:', error);
            alert('API 호출 중 오류가 발생했습니다: ' + error.message);
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

  const handleSearch = async () => {
    if (searchText.trim() === "") {
      setAvailableLocations([]);
      return;
    }

    try {
      const response = await fetch(`http://localhost:8080/api/location/search?query=${encodeURIComponent(searchText)}`);
      if (response.ok) {
        const data = await response.json();
        console.log('API Response:', data);
        const formattedLocations = data.map(address => ({
          id: address.id,
          fullAddress: `${address.cityName} ${address.districtName} ${address.neighborhoodName}`
        }));
        setAvailableLocations(formattedLocations);
      } else {
        alert('주소 검색에 실패했습니다.');
      }
    } catch (error) {
      console.error('주소 검색 중 오류 발생:', error);
      alert('주소 검색 중 오류가 발생했습니다.');
    }
  };

  const handleAddLocation = (location) => {
    setRegisteredLocations((prev) => {
      if (prev.length < 2 && !prev.includes(location.fullAddress)) {
        return [...prev, location.fullAddress];
      }
      return prev;
    });
    toast.success(`${location.fullAddress}이(가) 추가되었습니다!`);
  };

  const handleSaveAddresses = async () => {
    // 등록된 주소 ID 가져오기
    const addressId = registeredLocations.map(location => {
      const foundLocation = availableLocations.find(loc => loc.fullAddress === location);
      return foundLocation ? foundLocation.id : null; // ID를 찾고 없으면 null 반환
    }).filter(id => id !== null); // null 제외

    console.log('Saving addresses with IDs:', addressId); // 디버깅 로그

    try {
      const addressDTO = {
        primaryAddressId: addressId[0], // 주소 ID
        secondlyAddressId: addressId[1], // 선택적 필드
        validatedAt: new Date().toISOString(), // 현재 시간
        modifiedAt: new Date().toISOString(), // 현재 시간
        createdAt: new Date().toISOString() // 현재 시간
        }; // ID 배열을 DTO로 변환

      const response = await jwtAxios.post("/api/user-address/save/secondary", addressDTO, {
        secondlyAddressId:addressId,
      });

      if(response.data){
        console.log('Response from server:', response.data); // 서버 응답 로그
      }
      if (response.status === 200) {
        toast.success("주소가 성공적으로 저장되었습니다!");
      } else {
        toast.error("주소 저장에 실패했습니다.");
      }
    } catch (error) {
      console.error('주소 저장 중 오류 발생:', error); // 오류 로그
      toast.error("주소 저장 중 오류가 발생했습니다.");
    }
  };

  useEffect(() => {
    setRegisteredLocations([]);
  }, []);

  return (
    <div className="mobile-container">
      <div className="location-settings">
        <div className="locationsettings-header">
          <button className="back-button" onClick={() => navigate(-1)}>◀</button>
          <h1>내 동네 설정</h1>
        </div>

        <div className="registered-locations">
          {registeredLocations.map((location, index) => (
            <div key={index} className="location-tag">
              {location}
              <button
                className="remove-button"
                onClick={() =>
                  setRegisteredLocations((prev) =>
                    prev.filter((loc) => loc !== location)
                  )
                }
              >
                ✕
              </button>
            </div>
          ))}
          {registeredLocations.length < 2 && (
            <button className="add-location-button">+</button>
          )}
        </div>

        <div className="content">
          <input
            type="text"
            className="search-input"
            placeholder="동명(읍, 면)으로 검색 (ex. 서초동)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch(); // Enter 키를 눌렀을 때 검색
              }
            }}
          />

          <button onClick={fetchLocation} className="location-button">📍 현재위치로 찾기</button>

          <div className="nearby-locations">
            <h2>근처 동네</h2>
            <ul className="location-list">
              {availableLocations.map((location, index) => (
                <li
                  key={index}
                  onClick={() => handleAddLocation(location)} // 클릭 시 주소 추가
                >
                  {location.fullAddress} {/* 전체 주소 표시 */}
                </li>
              ))}
            </ul>
          </div>

          <button className="location-button" style={{ marginTop: '10px' }} onClick={handleSaveAddresses}>
            주소 등록
          </button>
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;
