import React, { useState, useEffect } from 'react';
import { useSwipeable } from 'react-swipeable';
import './Slider.css';

const Slider = ({ items }) => {
  const imagesPerPage = 2; // 한 번에 보여줄 이미지 수
  const totalPages = Math.ceil(items.length / imagesPerPage); // 총 페이지 수
  const [currentIndex, setCurrentIndex] = useState(0);

  // 자동 슬라이드 기능
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) =>
        (prevIndex + imagesPerPage) % (totalPages * imagesPerPage)
      );
    }, 4000);
    return () => clearInterval(interval); // 클린업
  }, [items]);

  // 스와이프 핸들러
  const handlers = useSwipeable({
    onSwipedLeft: () => {
      setCurrentIndex((prevIndex) =>
        Math.min(prevIndex + imagesPerPage, (totalPages - 1) * imagesPerPage)
      );
    },
    onSwipedRight: () => {
      setCurrentIndex((prevIndex) =>
        Math.max(prevIndex - imagesPerPage, 0)
      );
    },
  });

  return (
    <div className="slider" {...handlers}>
      <div
        className="slider-track"
        style={{
          transform: `translateX(-${(currentIndex / imagesPerPage) * 100}%)`,
          transition: 'transform 1s ease-in-out',
        }}
      >
        {items.map((item, index) => (
          <div
            className="slide"
            key={index}
            style={{ flex: `0 0 calc(100% / ${imagesPerPage})` }}
          >
            <img src={item.image} alt={item.title} className="slide-image" />
            <div className="slide-info">
              <h4 className="item-titlefont">{item.title}</h4>
              <p className="item-subfont">
                {item.quantity} {item.members}
              </p>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-controls">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === Math.floor(currentIndex / imagesPerPage) ? 'active' : ''}`}
            onClick={() => setCurrentIndex(idx * imagesPerPage)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
