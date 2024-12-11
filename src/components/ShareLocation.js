import React, { useState, useEffect } from "react";
import "./ShareLocation.css";
import KakaoMap from "./KakaoMap";
import { toast } from "react-toastify";
import { ReactComponent as ShareCloseIcon } from "../assets/icons/close.svg";

const ShareLocation = ({ onClose, onComplete }) => {
  const [locationName, setLocationName] = useState(""); // 장소명 입력 상태
  const [selectedPosition, setSelectedPosition] = useState(null); // 지도에서 선택된 위치
  const [currentPosition, setCurrentPosition] = useState(null); // 현재 위치 상태

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(userPosition);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          toast.error("위치 정보를 사용할 수 없습니다.", {
            position: "bottom-center",
          });
        }
      );
    } else {
      toast.error("Geolocation을 지원하지 않는 브라우저입니다.", {
        position: "bottom-center",
      });
    }
  }, []);

  const handleComplete = () => {
    if (!selectedPosition) {
      toast.error("위치를 선택해주세요!");
      return;
    }
    console.log("selectedPosition", selectedPosition);
    onComplete({
      position: selectedPosition,
      name: locationName,
      locationName: locationName, // locationName 추가
      addressDTO: selectedPosition?.addressDTO || {},
      latitude: selectedPosition?.lat || currentPosition?.lat,
      longitude: selectedPosition?.lng || currentPosition?.lng,
    });
    console.log("addressDTO 셀렉트", selectedPosition?.addressDTO);
    onClose(); // 모달 닫기
  };

  return (
    <div className="share-location-overlay">
      <div className="share-location-modal">
        {/* 헤더 부분 */}
        <header className="share-location-header">
          <button className="share-location-close-button" onClick={onClose}>
            <ShareCloseIcon className="share-location-close-icon" />
          </button>
          <h3>원하는 위치를 지정해주세요.</h3>
        </header>

        {/* 지도 컨테이너 */}
        <div className="share-location-map-container">
          <KakaoMap
            currentPosition={currentPosition}
            setClickedPosition={setSelectedPosition}
          />
        </div>

        {/* 장소 입력 컨테이너 */}
        <div className="share-location-input-container">
          <h4>장소이름</h4>
          <input
            className="share-location-input"
            type="text"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            placeholder="예) 강남역 1번 출구, 다이소 센텀시티점 앞"
          />
        </div>

        {/* 등록 완료 버튼 */}
        <button
          className="share-location-complete-button"
          onClick={handleComplete}
        >
          등록완료
        </button>
      </div>
    </div>
  );
};

export default ShareLocation;
