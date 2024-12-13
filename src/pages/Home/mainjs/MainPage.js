import React, { useEffect, useState } from "react";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import { fetchTogetherAndShareItems } from "../../../api/mainApi";  // 통합 API 호출을 위한 함수
import Slider from "../../../components/Slider";
import "../maincss/MainPage.css";  // 스타일 파일 임포트

const MainPage = () => {
  const [items, setItems] = useState([]); // 하나로 합쳐서 관리할 상태

  // 데이터를 가져오는 함수
  useEffect(() => {
    const getItems = async () => {
      try {
        const data = await fetchTogetherAndShareItems(); // 통합 API 호출
        setItems(data); // 가져온 데이터를 상태에 저장
      } catch (error) {
        console.error("Error fetching data: ", error);
      }
    };

    getItems();
  }, []);

  return (
    <div className="mobile-container">
      <div className="main-page">
        <Header
          showBack={false}
          showLeft={true} // 위치 표시 활성화
          showLogo={false} // 로고 비활성화
          showMenu={true} // 햄버거 버튼 활성화
          showSearch={true} // 검색 버튼 활성화
          showBell={false} // 알림 버튼 비활성화
        />
        <div className="main-content">
          <section className="category">
            {/* 카테고리 섹션 (추후 내용 추가 가능) */}
          </section>
          <section className="combined-slider">
            <h3 className="neighborhood-font">우리 동네 같이가요 / 나눠요</h3>
            <Slider items={items} className="combined-slider-card" />
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;