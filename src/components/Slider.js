import React, { useState } from 'react';
import './Slider.css';

const Slider = ({ items }) => {
  const [currentPage, setCurrentPage] = useState(0);
  const imagesPerPage = 2; // 한 번에 보여줄 이미지 수 (2개 반)
  const totalPages = Math.ceil(items.length / imagesPerPage);

  return (
    <div className="slider">
      <div
        className="slider-track"
        style={{
          transform: `translateX(-${currentPage * 100 / imagesPerPage}%)`,
        }}
      >
        {items.map((item, index) => (
          <div className="slide" key={index}>
            <img src={item.image} alt={item.title} className="slide-image" />
            <div className="slide-info">
              <h3>{item.title}</h3>
              <p>{item.quantity} {item.members}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="slider-controls">
        {Array.from({ length: totalPages }).map((_, idx) => (
          <button
            key={idx}
            className={`indicator ${idx === currentPage ? 'active' : ''}`}
            onClick={() => setCurrentPage(idx)}
          ></button>
        ))}
      </div>
    </div>
  );
};

export default Slider;
