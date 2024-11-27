import React, {useState} from "react";
import "./CategorySelect.css";
import categories from "../data/categoryList.json"


const CategorySelect = ({ onClose, onCategorySelect, selectedCategory }) => {
  const [activeCategory, setActiveCategory] = useState(selectedCategory || null);

  const handleCategoryClick = (category) => {
    setActiveCategory(category); // 선택된 카테고리 업데이트
  };

  const handleConfirm = () => {
    onCategorySelect(activeCategory); // 상위 컴포넌트로 선택된 카테고리 전달
    onClose(); // 모달 닫기
  };
  
return (
  <div className="category-select-modal">
    {/* <div className="category-select-container"> */}
      <header className="category-header">
        <h4 className="category-header-title">카테고리 선택</h4>
        <button className="category-close-button" onClick={onClose}>
          닫기
        </button>
      </header>
      <div className="category-grid">
        {categories.map((category) => (
          <div
            key={category.name}
            className={`category-item ${
              activeCategory === category.name ? "active" : ""
            }`}
            onClick={() => handleCategoryClick(category.name)}
          >
            <img src={category.icon} alt={category.name} className="category-icon" />
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
      <button className="category-confirm-button" onClick={handleConfirm}>
        선택 완료
      </button>
    </div>
  // </div>
);
};

export default CategorySelect;