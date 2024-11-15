import { useEffect } from "react";

const KakaoMap = ({ currentPosition, setClickedPosition }) => {
  useEffect(() => {
    const initializeMap = () => {
      const container = document.getElementById("map");
      const options = {
        center: currentPosition
          ? new window.kakao.maps.LatLng(currentPosition.lat, currentPosition.lng)
          : new window.kakao.maps.LatLng(37.5665, 126.9780), // 기본값: 서울 시청
        level: 3,
      };

      const map = new window.kakao.maps.Map(container, options);

      const marker = new window.kakao.maps.Marker({
        position: map.getCenter(),
      });
      marker.setMap(map);

      window.kakao.maps.event.addListener(map, "click", function (mouseEvent) {
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);

        setClickedPosition({
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        });
      });
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dced50809ec042e36d26acfdfabca35b";
      script.async = true;
      script.onload = initializeMap;
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [currentPosition, setClickedPosition]);

  return (
    <div id="map"></div>
  );
};

export default KakaoMap;
