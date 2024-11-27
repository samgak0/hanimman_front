import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import { ReactComponent as FilterModalCloseIcon } from "../assets/icons/close.svg";
import "./FilterModal.css";

const FilterModal = ({ onClose, onComplete, isShareList }) => {
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onComplete({ category }); // 선택된 카테고리를 상위로 전달
    onClose(); // 모달 닫기
  };

  // ShareList 페이지의 경우 카테고리 선택만 표시
  if (isShareList) {
    return (
      <div className="filter-modal">
        <div className="filter-header">
          <h3>카테고리를 선택해주세요</h3>
          <button className="filter-close-button" onClick={onClose}>
            <FilterModalCloseIcon />
          </button>
        </div>
        <CategorySelect
          onClose={onClose}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      </div>
    );
  }

  // 기본 FilterModal (ShareList가 아닌 경우)
  return (
    <div className="filter-modal">
      <div className="filter-header">
        <h3>기본 필터 모달</h3>
        <button className="filter-close-button" onClick={onClose}>
          <FilterModalCloseIcon />
        </button>
      </div>
      <p>기타 필터링 단계가 여기에 표시됩니다.</p>
    </div>
  );
};

export default FilterModal;
