import React, { useState } from 'react';
import './FilterBar.css'; // 스타일 파일 추가
import { ReactComponent as BurgerIcon } from '../assets/icons/burger.svg';
import CategorySelect from './CategorySelect'; // CategorySelect 컴포넌트 가져오기

const FilterBar = ({ onFilterSelect }) => {
  const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false); // 카테고리 모달 상태

  // 모달 열기
  const handleCategoryMenuClick = () => {
    setIsCategoryModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsCategoryModalOpen(false);
  };

  const handleCategorySelect = (category) => {
    console.log(`Selected category: ${category}`); // 선택된 카테고리 출력
    setIsCategoryModalOpen(false); // 카테고리 선택 후 모달 닫기
  };

  return (
    <div className="filter-bar">
      <button className="category-menu-button" onClick={handleCategoryMenuClick}>
        <BurgerIcon />
      </button>
      <div className="filter-bar-button">
        <button onClick={() => onFilterSelect('최신순')}>최신순</button>
        <button onClick={() => onFilterSelect('좋아요순')}>좋아요순</button>
        <button onClick={() => onFilterSelect('출발임박순')}>출발임박순</button>
      </div>

      {/* 카테고리 모달 */}
      {isCategoryModalOpen && (
        <CategorySelect
          onClose={handleCloseModal} // 모달 닫기 핸들러 전달
          onCategorySelect={handleCategorySelect} // 카테고리 선택 핸들러 전달
        />
      )}
    </div>
  );
};

export default FilterBar;
