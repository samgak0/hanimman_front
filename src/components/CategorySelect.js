import React, {useState} from "react";
import "./CategorySelect.css";

const categories = [
  { name: "항공권", icon: "✈️" },
  { name: "롱스테이", icon: "🏠" },
  { name: "투어·티켓", icon: "🎟️" },
  { name: "국내숙소", icon: "🏨" },
  { name: "호캉스", icon: "🍽️" },
  { name: "렌터카", icon: "🚗" },
  { name: "패키지", icon: "📦" },
  { name: "한인민박", icon: "🏡" },
  { name: "키즈", icon: "👶" },
  { name: "할인혜택", icon: "💰" },
  { name: "물놀이 특가", icon: "🏊" },
  { name: "해외호텔", icon: "🏢" },
  { name: "플러스", icon: "🛳️" },
  { name: "가까운 여행", icon: "🚴" },
  { name: "여행자 보험", icon: "📜" },
  { name: "해외교통", icon: "🚕" },
  { name: "커뮤니티", icon: "👥" },
];
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
    <div className="category-select-container">
      <header className="category-header">
        <h3>카테고리 선택</h3>
        <button className="close-button" onClick={onClose}>
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
            <span className="category-icon">{category.icon}</span>
            <span className="category-name">{category.name}</span>
          </div>
        ))}
      </div>
      <button className="confirm-button" onClick={handleConfirm}>
        선택 완료
      </button>
    </div>
  </div>
);
};

export default CategorySelect;