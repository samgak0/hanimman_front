import React, { useEffect } from "react";

const KakaoMapDetail = ({ latitude, longitude }) => {
  useEffect(() => {
    // 지도 초기화
    if (latitude && longitude) {
      const script = document.createElement("script");
      script.src =
        "https://dapi.kakao.com/v2/maps/sdk.js?appkey=1ace1b4b41905a8ace6db543650ac2bb&libraries=services";
      script.async = true;
      script.onload = () => {
        const container = document.getElementById("map");
        const options = {
          center: new window.kakao.maps.LatLng(latitude, longitude),
          level: 3,
        };
        const map = new window.kakao.maps.Map(container, options);
        const markerPosition = new window.kakao.maps.LatLng(
          latitude,
          longitude
        );
        const marker = new window.kakao.maps.Marker({
          position: markerPosition,
        });
        marker.setMap(map);
      };
      document.head.appendChild(script);
    }
  }, [latitude, longitude]);

  return <div id="map" style={{ width: "100%", height: "200px" }}></div>;
};

export default KakaoMapDetail;
