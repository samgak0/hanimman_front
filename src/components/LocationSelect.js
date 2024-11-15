import { useState } from "react";
import "./LocationSelect.css";
import KakaoMap from "./KakaoMap";

const LocationSelect = () => {
  const [shopList, setShopList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedJumpo, setSelectedJumpo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);


    // 점포 선택 핸들러
    const handleJumpoSelect = (jumpo) => {
      setSelectedJumpo(jumpo);
    };

    // 상점 선택 핸들러
    const handleStoreSelect = (store) => {
      setSelectedStore(store);
    if (store === "COSTCO") {
      const locationCostco = ["서울", "경기", "인천/세종/충남", "대전/대구", "부산/울산/경남"];
      setLocationList(locationCostco);
      setShopList([]);
    } else if (store === "EMART TRADERS") {
      const locationEmart = ["서울", "경기", "인천/충남", "대전/대구", "부산/경남"];
      setLocationList(locationEmart);
      setShopList([]);
    } else if (store === "ETC") {
      setLocationList([]);
      setShopList([]);
      fetchCurrentPosition(); // 현재 위치 가져오기
    }
  };

 
  const fetchCurrentPosition = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          console.log("Fetched Position:", userPosition);
          setCurrentPosition(userPosition);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          alert("위치 정보를 사용할 수 없습니다.");
        }
      );
    } else {
      alert("Geolocation을 지원하지 않는 브라우저입니다.");
    }
  };
  // 지역 선택 핸들러
  const handleLocationSelect = (local) => {
    setSelectedLocation(local);
    let res;
    if (selectedStore === "COSTCO") {
      if (local === "서울") {
        res = ["양평점", "양재점", "상봉점", "고척점"];
      } else if (local === "경기") {
        res = ["일산점", "광명점", "의정부점", "공세점", "하남점"];
      } else if (local === "인천/세종/충남") {
        res = ["송도점","청라점", "세종점", "천안점"];
      } else if (local === "대전/대구") {
        res = ["대전점", "대구점", "대구 혁신도시점"];
      } else if (local === "부산/울산/경남") {
        res = ["부산점", "울산점", "김해점"];
      } else {
        res = [];
      }
    } else if (selectedStore === "EMART TRADERS") {
      if (local === "서울") {
        res = ["월계점"];
      } else if (local === "경기") {
        res = ["구성점","군포점","동탄점","부천점","수원점","안산점","하남점","킨텍스점","고양점","김포점","위례점","안성점","수원화성점"];
      } else if (local === "인천/충남") {
        res = ["송림점", "천안아산점"];
      } else if (local === "대전/대구") {
        res = ["월평점", "비산점"];
      } else if (local === "부산/경남") {
        res = ["서면점", "연산점", "명지점", "양산점"];
      } else {
        res = [];
      }
    } else {
      res = [];
    }
    setShopList(res);
  };

  return (
    <div className="location-select-page">
      <header className="list-header">
        <button className="select-close-button" onClick={() => window.history.back()}>
          {/* 닫기 버튼 */}
        </button>
      </header>
      <div className="button-store">
        <button
          className={`costco ${selectedStore === "COSTCO" ? "" : "inactive-shop"}`}
          onClick={() => {
            handleStoreSelect("COSTCO");
          }}
        >
          COSTCO
        </button>
        <button
          className={`emart ${selectedStore === "EMART TRADERS" ? "" : "inactive-shop"}`}
          onClick={() => {
            handleStoreSelect("EMART TRADERS");
          }}
        >
          EMART TRADERS
        </button>
        <button
          className={`etc ${selectedStore === "ETC" ? "" : "inactive-shop"}`}
          onClick={() => {
            handleStoreSelect("ETC");
          }}
        >
          ETC.
        </button>
      </div>

      {selectedStore === "ETC" ? (
        <div className="gps-location">
          <h3 className="gps-location-font">원하는 위치를 지정해주세요.</h3>
          <KakaoMap
            currentPosition={currentPosition}
            setClickedPosition={setClickedPosition}
          />
          {clickedPosition && (
            <div id="clickLatlng" className="current-location">
              <p>클릭한 위도: {clickedPosition.lat}</p>
              <p>클릭한 경도: {clickedPosition.lng}</p>
            </div>
          )}
        </div>
      ) : (
        <div className="location-options">
          <div className="font-location-back">
            <h3 className="font-location-title">지역</h3>
          </div>
          <div className="location-select">
            {locationList.map((location, index) => (
            <button
              key={index}
              className={`location ${selectedLocation === location ? "" : "inactive-location"}`}
              onClick={() => handleLocationSelect(location)}
            >
              {location}
            </button>
            ))}
          </div>
        </div>
      )}

      {selectedStore !== "ETC" && (
        <div className="store-options">
          <div className="font-location-back">
            <h3 className="font-location-title">점포</h3>
          </div>
          <div className="store-list scrollable">
            {shopList.map((jumpo, index) => (
              <button 
                key={index}
                className={`jumpo ${selectedJumpo === jumpo ? "" : "inactive-location"}`}
                onClick={()=>handleJumpoSelect(jumpo)}
            >
              {jumpo}
            </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationSelect;
