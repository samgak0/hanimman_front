import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../beforemaincss/LocationPage.css";
import jwtAxios from "../../../api/jwtAxios";
import { toast } from "react-toastify"; // toast 추가

const LocationPage = () => {
  const [registeredAddresses, setRegisteredAddresses] = useState([]); // 저장된 주소 목록 상태
  const navigate = useNavigate();

  const handleApiError = (error) => {
    const errorMessage = error.response?.data?.message || error.message || "알 수 없는 오류";
    toast.error(`API 호출 중 오류가 발생했습니다: ${errorMessage}`);
  };

  const saveAddress = async (addressId, fullAddress) => {
    try {
      const saveResponse = await jwtAxios.post("/api/user-address/save", {
        primaryAddressId: addressId,
      });

      if (saveResponse.status === 200) {
        // 저장된 주소를 상태에 추가
        setRegisteredAddresses((prev) => [
          ...prev,
          { id: addressId, fullAddress }, // 주소 추가
        ]);

        // 사용자에게 등록 완료 메시지 표시
        toast.success(`현재 위치가 ${fullAddress}으로 등록되었습니다!`);
        
        navigate("/main"); // 메인 페이지로 이동
      } else {
        toast.error("주소 저장에 실패했습니다.");
      }
    } catch (error) {
      handleApiError(error);
    }
  };

  const fetchLocation = () => {
    if (!navigator.geolocation) {
      return toast.error("GPS를 지원하지 않는 브라우저입니다.");
    }

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          const response = await fetch(
            `http://192.168.100.129:8080/api/location/administrative?latitude=${latitude}&longitude=${longitude}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
              },
            }
          );

          if (response.ok) {
            const data = await response.json();
            const addressId = data.id; // 법정 코드
            const fullAddress = `${data.cityName} ${data.districtName} ${data.neighborhoodName}`; // 전체 주소 형식화
            console.log(data);

            // 주소를 자동으로 저장
            await saveAddress(addressId, fullAddress); // 주소 저장
          } else {
            const errorMessage = await response.text();
            toast.error(`법정 코드 가져오는 데 실패했습니다: ${errorMessage}`);
          }
        } catch (error) {
          handleApiError(error);
        }
      },
      () => {
        toast.error("위치 정보를 가져오는 데 실패했습니다.");
      }
    );
  };

  return (
    <div className="mobile-container">
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
