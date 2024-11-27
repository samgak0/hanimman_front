import React, { useState } from "react";
import CategorySelect from "./CategorySelect";
import "./FilterModal.css";

const FilterModal = ({ onClose, onComplete }) => {
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

  const goToStep = (step) => setActiveStep(step);

  const handleSelect = (type, value) => {
    if (type === "store") {
      setSelectedStore(value);
      setSelectedLocation(null);
      setSelectedJumpo(null);
      goToStep("location");
    } else if (type === "location") {
      setSelectedLocation(value);
      goToStep("jumpo");
    } else if (type === "jumpo") {
      setSelectedJumpo(value);
      goToStep("category");
    }
  };

  const handleCategorySelect = (category) => {
    setSelectedCategory(category);
    onComplete({
      store: selectedStore,
      location: selectedLocation,
      jumpo: selectedJumpo,
      category,
    });
    onClose();
  };

  return (
    <div className="filter-modal">
      <button className="close-button" onClick={onClose}>
        ✕
      </button>
      {/* <div className="modal-content"> */}
        {/* 상점 선택 단계 */}
        {activeStep === "store" && (
          <div className="filter-step">
            <h4>상점을 선택해주세요</h4>
            <div className="filter-options">
              {["COSTCO", "EMART TRADERS", "ETC", "전체"].map((store) => (
                <button
                  key={store}
                  className={`filter-option ${
                    selectedStore === store ? "active" : ""
                  }`}
                  onClick={() => handleSelect("store", store)}
                >
                  {store}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 지역 선택 단계 */}
        {activeStep === "location" && (
          <div className="filter-step">
            <h4>지역을 선택해주세요</h4>
            <div className="filter-options">
              {locations[selectedStore]?.map((location) => (
                <button
                  key={location}
                  className={`filter-option ${
                    selectedLocation === location ? "active" : ""
                  }`}
                  onClick={() => handleSelect("location", location)}
                >
                  {location}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 점포 선택 단계 */}
        {activeStep === "jumpo" && (
          <div className="filter-step">
            <h4>점포를 선택해주세요</h4>
            <div className="filter-options">
              {jumpos[selectedStore]?.[selectedLocation]?.map((jumpo) => (
                <button
                  key={jumpo}
                  className={`filter-option ${
                    selectedJumpo === jumpo ? "active" : ""
                  }`}
                  onClick={() => handleSelect("jumpo", jumpo)}
                >
                  {jumpo}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* 품목 선택 단계 */}
        {activeStep === "category" && (
          <CategorySelect
            onClose={onClose}
            onCategorySelect={handleCategorySelect}
            selectedCategory={selectedCategory}
          />
        )}
      </div>
    // </div>
  );
};

export default FilterModal;
