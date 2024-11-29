import React, { useState } from "react";
import "./ShareDetailSlider.css";

const ShareDetailSlider = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  // 다음 슬라이드로 이동
  const nextSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // 이전 슬라이드로 이동
  const prevSlide = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  if (!images || images.length === 0) {
    return <p>이미지가 없습니다.</p>;
  }

  return (
    <div className="sharedetail-slider">
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

      {/* 슬라이더 컨트롤 버튼 */}
      <button className="slider-button prev" onClick={prevSlide}>
        &#8249;
      </button>
      <button className="slider-button next" onClick={nextSlide}>
        &#8250;
      </button>
    </div>
  );
};

export default ShareDetailSlider;
