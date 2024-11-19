import React from 'react';
import './FilterBar.css'; // 스타일 파일 추가

const FilterBar = ({ onFilterSelect }) => {
  return (
    <div className="filter-bar">
      <button  onClick={() => onFilterSelect('최신순')}>최신순</button>
      <button  onClick={() => onFilterSelect('좋아요순')}>좋아요순</button>
      <button  onClick={() => onFilterSelect('출발임박순')}>출발임박순</button>
    </div>
  );
};

export default FilterBar;
