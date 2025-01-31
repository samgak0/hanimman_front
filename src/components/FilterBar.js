import React, { useState } from "react";
import "./FilterBar.css";
import { ReactComponent as BurgerIcon } from "../assets/icons/burger.svg";
import FilterModal from "./FilterModal"; // FilterModal 가져오기

const FilterBar = ({
  onFilterUpdate,
  onFilterSelect,
  isShareList,
  onToggleEnd,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false); // 모달 열림 상태 관리
  const [isEnd, setIsEnd] = useState(false); // 마감 상태 관리

  // 모달 열기
  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 필터 완료 시 데이터 업데이트
  const handleCompleteFilter = (filters) => {
    onFilterUpdate(filters); // 선택된 필터 데이터를 상위 컴포넌트로 전달
    setIsModalOpen(false); // 모달 닫기
  };

  // 마감 버튼 클릭 시 상태 변경 및 상위 컴포넌트로 전달
  const handleToggleEnd = () => {
    const newIsEnd = !isEnd;
    setIsEnd(newIsEnd);
    onToggleEnd(newIsEnd);
  };
  return (
    <div className="filter-bar">

      {/* 마감 여부 */}
      <button
        className={isEnd ? "isend-button2" : "isend-button"}
        onClick={handleToggleEnd}
      >
        마감보기
      </button>

      {/* 정렬 버튼 */}
      <div className="filter-bar-button">
        <button onClick={() => onFilterSelect("최신순")}>최신순</button>
        <button onClick={() => onFilterSelect("좋아요순")}>좋아요순</button>
        <button onClick={() => onFilterSelect("출발임박순")}>출발임박순</button>
      </div>

      {/* 필터 모달 */}
      {isModalOpen && (
        <FilterModal
          className="filter-modal"
          onClose={handleCloseModal} // 모달 닫기 핸들러
          onComplete={handleCompleteFilter} // 필터 완료 핸들러
          isShareList={true}
        />
      )}
    </div>
  );
};

export default FilterBar;
