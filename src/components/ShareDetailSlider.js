import React, { useState } from "react";
import "./ShareDetailSlider.css";

const ShareDetailSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 특정 슬라이드로 이동
  const goToSlide = (index) => {
    setCurrentIndex(index);
  };

  if (!images || images.length === 0) {
    return <p>이미지가 없습니다.</p>;
  }

  return (
    <div className="sharedetail-slider">
      {/* 슬라이드 컨테이너 */}
      <div className="sharedetail-slider-container">
        {images.map((image, index) => (
          <div
            key={index}
            className={`sharedetail-slide ${
              index === currentIndex ? "active" : ""
            }`}
          >
            {index === currentIndex && (
              <img
                src={image}
                alt={`Slide ${index}`}
                className="sharedetail-slide-image"
              />
            )}
          </div>
        ))}
      </div>

      {/* 인디케이터 버튼 */}
      <div className="slider-indicators">
        {images.map((_, index) => (
          <div
            key={index}
            className={`slider-indicator ${
              index === currentIndex ? "active" : ""
            }`}
            onClick={() => goToSlide(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default ShareDetailSlider;
