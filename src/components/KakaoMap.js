import React, { useEffect } from "react";
import jwtAxios from "../api/jwtAxios"; // jwtAxios 가져오기

const host = `${jwtAxios.defaults.baseURL}/api/location`;

const KakaoMap = ({ currentPosition, setClickedPosition }) => {
  useEffect(() => {
    const fetchAddressDTO = async (position) => {
      try {
        const response = await jwtAxios.get(`${host}/administrative`, {
          params: {
            latitude: position.lat,
            longitude: position.lng,
          },
        });
        return response.data;
      } catch (error) {
        console.error("Error fetching address data:", error);
        return null;
      }
    };

    const initializeMap = async () => {
      const container = document.getElementById("map");
      const options = {
        center: currentPosition
          ? new window.kakao.maps.LatLng(
              currentPosition.lat,
              currentPosition.lng
            )
          : new window.kakao.maps.LatLng(37.5665, 126.978),
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);
      const marker = new window.kakao.maps.Marker({
        position: map.getCenter(),
      });
      marker.setMap(map);

      // 초기 위치에 대한 addressDTO 가져오기
      if (currentPosition) {
        const addressDTO = await fetchAddressDTO(currentPosition);
        if (addressDTO) {
          setClickedPosition({ ...currentPosition, addressDTO });
        }
      }

      window.kakao.maps.event.addListener(
        map,
        "click",
        async function (mouseEvent) {
          const latlng = mouseEvent.latLng;
          marker.setPosition(latlng);

          const clickedPosition = {
            lat: latlng.getLat(),
            lng: latlng.getLng(),
          };

          const addressDTO = await fetchAddressDTO(clickedPosition);
          if (addressDTO) {
            setClickedPosition({ ...clickedPosition, addressDTO });
          }
        }
      );
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dced50809ec042e36d26acfdfabca35b&libraries=services";
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          initializeMap();
        }
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [currentPosition, setClickedPosition]);

  return <div id="map" style={{ width: "100%", height: "60vh" }}></div>;
};

export default KakaoMap;
