import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ShareCreate.css";
import FilterModal from "../../../components/FilterModal"; // Import FilterModal
import { ReactComponent as ShareCloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CameraIcon } from "../../../assets/icons/camera.svg";
import ShareDateSelect from "../../../components/DateSelect";
import ShareCategorySelect from "../../../components/CategorySelect";
import ShareLocation from "../../../components/ShareLocation";
import { DataContext } from "../../../context/DataContext";

const ShareCreate = () => {
  const [shareImages, setShareImages] = useState([]);
  const [shareTitle, setShareTitle] = useState("");
  const [sharePrice, setSharePrice] = useState("");
  const [shareQuantity, setShareQuantity] = useState(1);
  const [shareDescription, setShareDescription] = useState("");
  const [isShareDateSelectVisible, setIsShareDateSelectVisible] = useState(false);
  const [selectedShareDate, setSelectedShareDate] = useState("");
  const [selectedShareCategory, setSelectedShareCategory] = useState(null);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false); // 모달 상태 추가

  const navigate = useNavigate();

  const handleCategorySelect = (category) => {
    setSelectedShareCategory(category);
    setIsFilterModalOpen(false); // 모달 닫기
  };

  const handleFilterButtonClick = () => {
    setIsFilterModalOpen(true); // 모달 열기
  };

  return (
    <div className="registration-page">
      <header className="list-header">
        <button onClick={() => navigate("/sharelist")} className="close-icon-button">
          <ShareCloseIcon />
        </button>
        <button className="save-draft-button">임시저장</button>
      </header>

      <div className="image-slider-container" style={{ position: "relative" }}>
        <div className="image-upload-container">
          <div className="image-upload-box">
            <label>
              <input
                type="file"
                accept="image/*"
                multiple
                style={{ display: "none" }}
                onChange={(e) => setShareImages([...shareImages, ...Array.from(e.target.files)])}
              />
              <div className="add-image">
                <CameraIcon className="camera-icon" />
                <p className="camera-text">사진등록</p>
              </div>
            </label>
          </div>

          {shareImages.map((image, index) => (
            <div key={index} className="image-upload-box">
              <img
                src={URL.createObjectURL(image)}
                alt={`uploaded-${index}`}
                className="uploaded-image"
              />
              <button
                className="remove-image-button"
                onClick={() =>
                  setShareImages((prev) => prev.filter((_, imgIndex) => imgIndex !== index))
                }
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <button className="category-select-button" onClick={handleFilterButtonClick}>
        {selectedShareCategory || "품목선택"}
      </button>

      {isFilterModalOpen && (
        <FilterModal
          mode="share" // ShareList에서는 카테고리 필터만 보여줌
          onClose={() => setIsFilterModalOpen(false)}
          onComplete={(filters) => handleCategorySelect(filters)}
        />
      )}

      <div className="form-group">
        <h4>제목</h4>
        <input
          type="text"
          value={shareTitle}
          onChange={(e) => setShareTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </div>
      <div className="form-group">
        <h4>가격</h4>
        <input
          type="number"
          value={sharePrice}
          onChange={(e) => setSharePrice(e.target.value)}
          placeholder="₩ 100,000"
        />
      </div>
      <div className="form-group">
        <h4>내용</h4>
        <textarea
          value={shareDescription}
          onChange={(e) => setShareDescription(e.target.value)}
          placeholder="내용을 입력하세요"
        />
      </div>

      <button className="submit-button" onClick={() => console.log("등록 완료")}>
        등록완료
      </button>
    </div>
  );
};

export default ShareCreate;
