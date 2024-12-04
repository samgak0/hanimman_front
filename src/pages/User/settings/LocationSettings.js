import React, { useState, useEffect } from "react";
import "./LocationSettings.css";
import locationData from "../../../data/location.json";
import { useNavigate } from 'react-router-dom';

const LocationSettings = () => {
  const [registeredLocations, setRegisteredLocations] = useState([]);
  const [searchText, setSearchText] = useState("");
  const navigate = useNavigate();
  const [availableLocations, setAvailableLocations] = useState([
    "부산 해운대구 우제2동",
    "부산 수영구 수영동",
    "부산 해운대구 재송제1동",
    "부산 해운대구 재송동",
    "부산 수영구 망미제2동",
    "부산 해운대구 우동",
    "부산 수영구 민락동",
    "부산 수영구 광안제3동",
    "부산 해운대구 우제3동",
    "부산 해운대구 재송제2동",
    "부산 수영구 광안제1동",
    "부산 수영구 망미동",
  ]);

  useEffect(() => {
    // `location.json`에서 등록된 동네 불러오기
    setRegisteredLocations(locationData.locations);
  }, []);

  return (
    <div className="mobile-container">
      <div className="location-settings">
        {/* 헤더 */}
        <div className="locationsettings-header">
          <button className="back-button" onClick={() => navigate(-1)} >◀</button>
          <h1>내 동네 설정</h1>
        </div>
  
        {/* 고정된 등록된 동네 영역 */}
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
  
        {/* 스크롤 가능한 콘텐츠 */}
        <div className="content">
          {/* 검색 입력 */}
          <input
            type="text"
            className="search-input"
            placeholder="동명(읍, 면)으로 검색 (ex. 서초동)"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
  
          {/* 현재 위치 찾기 버튼 */}
          <button className="current-location-button">📍 현재위치로 찾기</button>
  
          {/* 근처 동네 리스트 */}
          <div className="nearby-locations">
            <h2>근처 동네</h2>
            <ul className="location-list">
              {availableLocations
                .filter((location) =>
                  location.toLowerCase().includes(searchText.toLowerCase())
                )
                .map((location, index) => (
                  <li
                    key={index}
                    onClick={() =>
                      setRegisteredLocations((prev) =>
                        prev.length < 2 && !prev.includes(location)
                          ? [...prev, location]
                          : prev
                      )
                    }
                  >
                    {location}
                  </li>
                ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LocationSettings;
