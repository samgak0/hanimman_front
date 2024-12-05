import { useEffect } from "react";
import { toast } from "react-toastify";

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

      window.kakao.maps.event.addListener(map, "click", async function (mouseEvent) {
        const latlng = mouseEvent.latLng;
        marker.setPosition(latlng);

        const clickedPosition = {
          lat: latlng.getLat(),
          lng: latlng.getLng(),
        };

        setClickedPosition(clickedPosition);

        // 클릭한 위치의 위도와 경도를 백엔드로 전송 (GET 방식)
        try {
          const response = await fetch(`http://localhost:8080/api/location/save?lat=${clickedPosition.lat}&lng=${clickedPosition.lng}`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
            },
          });

          if (response.ok) {
            const data = await response.json();
            // 응답 데이터를 프론트에 출력
            console.log('백엔드 응답:', data);
            toast.success(`위치 저장 완료: 위도 ${data.lat}, 경도 ${data.lng}`, {
              position: "bottom-center",
            });
          } else {
            toast.error('위치 저장 실패', {
              position: "bottom-center",
            });
          }
        } catch (error) {
          console.error('API 호출 중 오류 발생:', error);
          toast.error('API 호출 중 오류가 발생했습니다.', {
            position: "bottom-center",
          });
        }
      });
    };

    if (!window.kakao || !window.kakao.maps) {
      const script = document.createElement("script");
      script.src = "https://dapi.kakao.com/v2/maps/sdk.js?appkey=dced50809ec042e36d26acfdfabca35b";
      script.async = true;
      script.onload = () => {
        if (window.kakao && window.kakao.maps) {
          initializeMap(); // 스크립트가 로드된 후 초기화
        }
      };
      document.head.appendChild(script);
    } else {
      initializeMap();
    }
  }, [currentPosition, setClickedPosition]);

  return (
    <div id="map" style={{ width: '100%', height: "60vh" }}></div>
  );
};

export default KakaoMap;