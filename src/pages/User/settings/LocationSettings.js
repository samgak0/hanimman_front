import React, { useState, useEffect } from "react";
import "./LocationSettings.css";
import { useNavigate } from 'react-router-dom';
import jwtAxios from "../../../api/jwtAxios";
import { toast } from "react-toastify"; // toast 추가

const LocationSettings = () => {
const [registeredLocations, setRegisteredLocations] = useState([]); // 초기값을 빈 배열로 설정
const [searchText, setSearchText] = useState("");
const [availableLocations, setAvailableLocations] = useState([]); // 검색 결과를 저장
const [primaryAddressName, setPrimaryAddressName] = useState("");
const [secondaryAddressName, setSecondAddressName] = useState(""); // 두 번째 주소 상태 추가

const navigate = useNavigate();

//주소 조회
useEffect(() => {
const fetchData = async () => {
  try {
  const response = await jwtAxios.get("http://localhost:8080/api/user-address/select", {
    headers: {
    "Content-Type": "application/json",
    },
  });

    if (response.data) {
      setPrimaryAddressName(response.data.primaryAddressName || "1차주소")
      setSecondAddressName(response.data.secondAddressName || "2차주소")
      setRegisteredLocations(response.data.registeredLocations || []); // 예시로 등록된 주소도 설정
    }
      console.log(response.data);

  } catch (error) {
    console.error("Error fetching data:", error);
  }
};
  fetchData();
}, []);

//위도경도 통해서 주소 정보 추출
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

//주소 등록
const handleSaveAddresses = async () => {
// 등록된 주소 ID 가져오기
const addressId = registeredLocations.map(location => {
const foundLocation = availableLocations.find(loc => loc.fullAddress === location);
  return foundLocation ? foundLocation.id : null; // ID를 찾고 없으면 null 반환
}).filter(id => id !== null); // null 제외


console.log('Saving addresses with IDs:', addressId); // 디버깅 로그

// UserAddressDTO 생성
const userAddressDTO = {
    primaryAddressId: addressId[0], // 주소 ID
    secondlyAddressId: addressId[1] || null, // 선택적 필드
    validatedAt: new Date().toISOString(), // 현재 시간
    modifiedAt: new Date().toISOString(), // 현재 시간
    createdAt: new Date().toISOString(), // 현재 시간
};

console.log('User Address DTO:', userAddressDTO); // DTO 확인

try {
    // 기존 주소가 있는지 확인
    const response = await jwtAxios.get("/api/user-address/select", {
        headers: {
            "Content-Type": "application/json",
        },
    });

    if (response.data && response.data.length > 0) {
        // 기존 주소가 있으면 업데이트 요청
        const existingAddress = response.data[0]; // 첫 번째 주소 데이터 가져오기
        userAddressDTO.id = existingAddress.id; // 기존 주소 ID 추가
        
        console.log('Updating address with ID:', userAddressDTO.id); // ID 확인

        const updateResponse = await jwtAxios.put("/api/user-address/update", userAddressDTO);
        if (updateResponse.status === 200) {
            toast.success("주소가 성공적으로 업데이트되었습니다!");
        } else {
            toast.error("주소 업데이트에 실패했습니다.");
        }
    } else {
        // 기존 주소가 없으면 신규 주소 저장 요청
        const saveResponse = await jwtAxios.post("/api/user-address/save/secondary", userAddressDTO);
        if (saveResponse.status === 200) {
            toast.success("주소가 성공적으로 저장되었습니다!");
        } else {
            toast.error("주소 저장에 실패했습니다.");
        }
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
    <div className="add-location-buttons">
      {registeredLocations.length < 2 && (
        <>
        <div className="location-button-container">
          <button className="add-location-button">{primaryAddressName}</button>
          <button className="add-location-button">1차주소 수정</button>
        </div>

        <br/>
        <div className="location-button-container">
          <button className="add-location-button">{secondaryAddressName}</button>
          <button className="add-location-button">2차주소 수정</button>
        </div>
        </>
      )}
    </div>
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