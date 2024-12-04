// src/pages/Auth/beforemainjs/LocationPage.js
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../beforemaincss/LocationPage.css";
import jwtAxios from "../../../api/jwtAxios";
import { toast } from "react-toastify"; // toast 추가

const LocationPage = () => {
  const [location, setLocation] = useState(null);
  const navigate = useNavigate();

  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;

          try {
            const response = await fetch(
              `http://localhost:8080/api/location/administrative?latitude=${latitude}&longitude=${longitude}`,
              {
                method: "GET",
                headers: {
                  "Content-Type": "application/json",
                },
              }
            );

            if (response.ok) {
              const data = await response.json();
              const addressId = data.id;
              const neighborhood = data.neighborhoodName;

              const userConfirmed = window.confirm(
                `${data.cityName}\n${data.districtName}\n${neighborhood}\n법정 코드: ${addressId}\n현재주소로 등록 하시겠습니까?`
              );

              if (userConfirmed) {
                const saveResponse = await jwtAxios.post("/api/user-address", {
                  primaryAddressId: addressId,
                  neighborhood: neighborhood,
                });

                if (saveResponse.status === 200) {
                  toast.success("주소가 성공적으로 저장되었습니다!");
                  navigate("/main");
                } else {
                  toast.error("주소 저장에 실패했습니다.");
                }
              }
            } else {
              toast.error("법정 코드 가져오는 데 실패했습니다.");
            }
          } catch (error) {
            toast.error(
              `API 호출 중 오류가 발생했습니다: ${
                error.response?.data?.message || "알 수 없는 오류"
              }`
            );
          }
        },
        (error) => {
          toast.error("위치 정보를 가져오는 데 실패했습니다.");
        }
      );
    } else {
      toast.error("GPS를 지원하지 않는 브라우저입니다.");
    }
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