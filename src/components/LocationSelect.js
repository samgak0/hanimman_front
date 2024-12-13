import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom"; // useNavigate 가져오기
import { toast } from "react-toastify";
import "./LocationSelect.css";
import KakaoMap from "./KakaoMap";
import { DataContext } from "../context/DataContext";
import { fetchCategoryData, searchName } from "../api/marketApi"; // marketApi.js에서 함수 임포트

const LocationSelect = () => {
  const [shopList, setShopList] = useState([]);
  const [locationList, setLocationList] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [selectedJumpo, setSelectedJumpo] = useState(null);
  const [currentPosition, setCurrentPosition] = useState(null);
  const [clickedPosition, setClickedPosition] = useState(null);
  const [locationName, setLocationName] = useState("");
  const [categoryData, setCategoryData] = useState([]); // 카테고리 데이터 상태 추가
  const [marketData, setMarketData] = useState(null); // 마켓 데이터 상태 추가

  const { setSelectedLocation: saveLocation } = useContext(DataContext); // DataContext에서 위치 저장 함수 가져오기
  const navigate = useNavigate(); // useNavigate 추가

  const handleJumpoSelect = async (jumpo) => {
    setSelectedJumpo(jumpo);

    let categoryId;
    if (selectedStore === "COSTCO") {
      categoryId = 1;
    } else if (selectedStore === "EMART TRADERS") {
      categoryId = 2;
    }

    if (categoryId) {
      try {
        const marketDTO = await searchName(categoryId, jumpo);
        setMarketData(marketDTO); // 받아온 데이터 설정
        console.log("Market Data:", marketData);
      } catch (error) {
        console.error("Error fetching market data:", error);
      }
    }
  };

  const handleStoreSelect = async (store) => {
    setSelectedStore(store);

    if (store === "COSTCO") {
      try {
        const data = await fetchCategoryData(1); // fetchCategoryData 함수 호출
        console.log("COSTCO지점 가지고옴? ", data);
        setCategoryData(data); // 받아온 데이터 설정
        const locationCostco = [
          "서울",
          "경기",
          "인천/세종/충남",
          "대전/대구",
          "부산/울산/경남",
        ];
        setLocationList(locationCostco);
        setShopList([]);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
    } else if (store === "EMART TRADERS") {
      try {
        const data = await fetchCategoryData(2); // fetchCategoryData 함수 호출
        console.log("EMART TRADERS 지점 가지고옴? ", data);
        setCategoryData(data); // 받아온 데이터 설정
        const locationEmart = [
          "서울",
          "경기",
          "인천/충남",
          "대전/대구",
          "부산/경남",
        ];
        setLocationList(locationEmart);
        setShopList([]);
      } catch (error) {
        console.error("Error fetching category data:", error);
      }
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
  };

  const handleLocationSelect = (local) => {
    setSelectedLocation(local);
    let res;
    if (selectedStore === "COSTCO") {
      if (local === "서울") {
        res = ["양평점", "양재점", "상봉점", "고척점"];
      } else if (local === "경기") {
        res = ["일산점", "광명점", "의정부점", "공세점", "하남점"];
      } else if (local === "인천/세종/충남") {
        res = ["송도점", "청라점", "세종점", "천안점"];
      } else if (local === "대전/대구") {
        res = ["대전점", "대구점", "대구혁신도시점"];
      } else if (local === "부산/울산/경남") {
        res = ["수영점", "울산점", "김해점"];
      } else {
        res = [];
      }
    } else if (selectedStore === "EMART TRADERS") {
      if (local === "서울") {
        res = ["월계점"];
      } else if (local === "경기") {
        res = [
          "구성점",
          "군포점",
          "동탄점",
          "부천점",
          "수원점",
          "안산점",
          "하남점",
          "킨텍스점",
          "고양점",
          "김포점",
          "위례점",
          "안성점",
          "수원화성점",
        ];
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

  const handleComplete = () => {
    if (!selectedStore) {
      toast.error("상점을 선택해주세요.", { position: "bottom-center" });
      return;
    }

    if (selectedStore !== "ETC" && (!selectedLocation || !selectedJumpo)) {
      toast.error("지역과 점포를 모두 선택해주세요.", {
        position: "bottom-center",
      });
      return;
    }

    // if (selectedStore === "ETC" && !clickedPosition) {
    //   toast.error("위치를 지정해주세요.", { position: "bottom-center" });
    //   return;
    // }

    const locationData = {
      id: marketData?.id,
      category: marketData?.category,
      name: marketData?.name,
      addressDetail: marketData?.addressDetail,
      addressId: marketData?.addressId,
      cityCode: marketData?.cityCode,
      districtCode: marketData?.districtCode,
      latitude: clickedPosition?.lat || currentPosition?.lat,
      longitude: clickedPosition?.lng || currentPosition?.lng,
      neighborhood: marketData?.neighborhood,
      locationName: locationName, // locationName 추가
      addressDTO: clickedPosition?.addressDTO || currentPosition?.addressDTO,
    };
    saveLocation(locationData); // DataContext에 위치 정보 저장
    console.log("latitude:", locationData.latitude);
    console.log("longitude:", locationData.longitude);
    console.log("addressDTO:", locationData.addressDTO);
    navigate("/togetherCreate", {
      state: {
        marketCategory: marketData?.category,
        marketName: marketData?.name,
        locationName: locationName, // locationName 추가
        addressDTO: clickedPosition?.addressDTO || {},
        latitude: clickedPosition?.lat || currentPosition?.lat,
        longitude: clickedPosition?.lng || currentPosition?.lng,
      },
    }); // 이전 페이지로 이동
  };

  return (
    <div className="location-select-page">
      <div className="location-header">
        <button
          className="select-close-button"
          onClick={() => window.history.back()}
        >
          {/* 닫기 버튼 */}
        </button>
        <div className="button-store">
          <button
            className={`costco ${
              selectedStore === "COSTCO" ? "" : "inactive-shop"
            }`}
            onClick={() => {
              handleStoreSelect("COSTCO");
            }}
          >
            COSTCO
          </button>
          <button
            className={`emart ${
              selectedStore === "EMART TRADERS" ? "" : "inactive-shop"
            }`}
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
            ETC
          </button>
        </div>
      </div>

      {selectedStore === "ETC" ? (
        <div className="gps-location">
          <div className="gps-location-back">
            <h3 className="gps-location-font">원하는 위치를 지정해주세요.</h3>
          </div>
          <KakaoMap
            currentPosition={currentPosition}
            setClickedPosition={setClickedPosition}
          />
          <div className="gps-location-name">
            <p>장소명을 입력해주세요</p>
            <input
              className="gps-location-input"
              type="locationName"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="예) 강남역 1번 출구, 다이소 센텀시티점 앞"
            />
          </div>
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
                className={`location ${
                  selectedLocation === location ? "" : "inactive-location"
                }`}
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
                className={`jumpo ${
                  selectedJumpo === jumpo ? "" : "inactive-location"
                }`}
                onClick={() => handleJumpoSelect(jumpo)}
              >
                {jumpo}
              </button>
            ))}
          </div>
        </div>
      )}

      <button className="complete-button" onClick={handleComplete}>
        등록완료
      </button>
    </div>
  );
};

export default LocationSelect;
