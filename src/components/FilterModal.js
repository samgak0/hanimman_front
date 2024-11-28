import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import { ReactComponent as FilterModalCloseIcon } from "../assets/icons/close.svg";
import "./FilterModal.css";

const FilterModal = ({ onClose, onComplete, isShareList }) => {
  const [activeStep, setActiveStep] = useState("store"); // 현재 단계: store, location, jumpo, category
  const [selectedStore, setSelectedStore] = useState(null); // 선택된 상점
  const [selectedLocation, setSelectedLocation] = useState(null); // 선택된 지역
  const [selectedJumpo, setSelectedJumpo] = useState(null); // 선택된 점포
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리

  const locations = {
    COSTCO: ["서울", "경기", "인천/세종/충남", "대전/대구", "부산/울산/경남"],
    "EMART TRADERS": ["서울", "경기", "인천/충남", "대전/대구", "부산/경남"],
  };

  const jumpos = {
    COSTCO: {
      서울: ["양평점", "양재점", "상봉점", "고척점"],
      경기: ["일산점", "광명점", "의정부점", "공세점", "하남점"],
      "인천/세종/충남": ["송도점", "청라점", "세종점", "천안점"],
      "대전/대구": ["대전점", "대구점", "대구 혁신도시점"],
      "부산/울산/경남": ["부산점", "울산점", "김해점"],
    },
    "EMART TRADERS": {
      서울: ["월계점"],
      경기: [
        "구성점",
        "군포점",
        "동탄점",
        "부천점",
        "수원점",
        "안산점",
        "하남점",
        "킨텍스점",
        "고양점",
        "김포점",
        "위례점",
        "안성점",
        "수원화성점",
      ],
      "인천/충남": ["송림점", "천안아산점"],
      "대전/대구": ["월평점", "비산점"],
      "부산/경남": ["서면점", "연산점", "명지점", "양산점"],
    },
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onComplete({ category }); // 선택된 카테고리를 상위로 전달
    onClose(); // 모달 닫기
  };

  const goToStep = (step) => setActiveStep(step);

  // ShareList 페이지의 경우 카테고리 선택만 표시
  if (isShareList) {
    return (
      <div className="filter-modal-sharelist">
        {!selectedCategory && (
          <CategorySelect
            onClose={onClose}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    );
  }

  // 기본 FilterModal (ShareList가 아닌 경우)
  return (
    <div className="filter-modal-togetherlist">
      <div className="filter-header">
        <h3>
          {activeStep === "store"
            ? "상점을 선택해주세요"
            : activeStep === "location"
            ? "지역을 선택해주세요"
            : activeStep === "jumpo"
            ? "점포를 선택해주세요"
            : "카테고리를 선택해주세요"}
        </h3>
        <button className="filter-close-button" onClick={onClose}>
          <FilterModalCloseIcon />
        </button>
      </div>
      {activeStep === "store" && (
        <div className="filter-step">
          <div className="filter-options">
            {["COSTCO", "EMART TRADERS", "ETC", "전체"].map((store) => (
              <button
                key={store}
                className={`filter-option ${
                  selectedStore === store ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedStore(store);
                  goToStep("location");
                }}
              >
                {store}
              </button>
            ))}
          </div>
        </div>
      )}
      {activeStep === "location" && (
        <div className="filter-step">
          <div className="filter-options">
            {locations[selectedStore]?.map((location) => (
              <button
                key={location}
                className={`filter-option ${
                  selectedLocation === location ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedLocation(location);
                  goToStep("jumpo");
                }}
              >
                {location}
              </button>
            ))}
          </div>
        </div>
      )}
      {activeStep === "jumpo" && (
        <div className="filter-step">
          <div className="filter-options">
            {jumpos[selectedStore]?.[selectedLocation]?.map((jumpo) => (
              <button
                key={jumpo}
                className={`filter-option ${
                  selectedJumpo === jumpo ? "active" : ""
                }`}
                onClick={() => {
                  setSelectedJumpo(jumpo);
                  goToStep("category");
                }}
              >
                {jumpo}
              </button>
            ))}
          </div>
        </div>
      )}
      {activeStep === "category" && (
        <CategorySelect
          onClose={onClose}
          onCategorySelect={handleCategorySelect}
          selectedCategory={selectedCategory}
        />
      )}
    </div>
  );
};

export default FilterModal;
