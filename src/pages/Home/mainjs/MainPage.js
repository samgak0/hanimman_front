import { useNavigate } from "react-router-dom";
import "../maincss/MainPage.css";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";
import data from "../../../data/togetherAndShareItems.json";
import Slider from "../../../components/Slider";

const MainPage = () => {
  const { togetherItems, shareItems } = data;

  return (
    <div className="mobile-container">
      <div className="main-page">
        {/* Header에 MainPage 전용 설정 전달 */}
        <Header
          showBack={false}
          showLeft={true} // 위치 표시 활성화
          showLogo={false} // 로고 비활성화 (메인 페이지에서는 로고를 안 보이게 할 수 있음)
          showMenu={true} // 햄버거 버튼 활성화
          showSearch={true} // 검색 버튼 활성화
          showBell={false} // 알림 버튼 비활성화
        />
        <div className="main-content">
          <section className="category">
            {/* 카테고리 섹션 (추후 내용 추가 가능) */}
          </section>
          <section className="together-slider">
            <h3 className="neighborhood-font">우리 동네 같이가요</h3>
            <Slider items={togetherItems} className="together-slider-card" />
          </section>
          <section className="share-slider">
            <h3 className="neighborhood-font">우리 동네 나눠요</h3>
            <Slider items={shareItems} className="share-slider-card" />
          </section>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default MainPage;