import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "./ShareCreate.css";
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
  const [isShareCategoryModalVisible, setIsShareCategoryModalVisible] = useState(false);
  const [selectedShareCategory, setSelectedShareCategory] = useState(null);
  const [shareLocationData, setShareLocationData] = useState(null);
  const [isShareLocationVisible, setIsShareLocationVisible] = useState(false);

  const {
    setPosts: setSharePosts,
    setShareCreateState: saveShareCreateState,
    shareCreateState = {},
  } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(shareCreateState).length > 0) {
      setShareTitle(shareCreateState.title || "");
      setSharePrice(shareCreateState.price || "");
      setShareQuantity(shareCreateState.quantity || 1);
      setShareDescription(shareCreateState.description || "");
      setShareImages(shareCreateState.images || []);
      setSelectedShareDate(shareCreateState.selectedDate || "");
      setSelectedShareCategory(shareCreateState.selectedCategory || null);
    }
  }, [shareCreateState]);

  const handleShareSubmit = () => {
    if (!shareLocationData) {
      alert("장소를 지정해주세요.");
      return;
    }
    const newSharePost = {
      title: shareTitle,
      price: sharePrice,
      quantity: shareQuantity,
      description: shareDescription,
      location: shareLocationData,
      images: shareImages,
      selectedDate: selectedShareDate,
      selectedCategory: selectedShareCategory,
      id: Date.now(),
    };
    setSharePosts((prevPosts) => [...prevPosts, newSharePost]);
    saveShareCreateState({});
    navigate("/sharelist");
  };

  const handleShareDateSelect = (date) => {
    setSelectedShareDate(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    setIsShareDateSelectVisible(false);
  };

  const handleCategorySelect = (category) => {
    setSelectedShareCategory(category);
    setIsShareCategoryModalVisible(false);
  };

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files).slice(0, 10 - shareImages.length);
    if (files.length + shareImages.length > 10) {
      alert("이미지는 최대 10개까지만 업로드 가능합니다.");
      return;
    }
    setShareImages((prevImages) => [...prevImages, ...files]);
    event.target.value = "";
  };

  const handleImageReplace = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      setShareImages((prevImages) =>
        prevImages.map((img, i) => (i === index ? file : img))
      );
      event.target.value = "";
    }
  };

  const handleImageRemove = (index) => {
    setShareImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);

  const handleMouseDown = (e) => {
    isDragging.current = true;
    sliderRef.current.classList.add("dragging");
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };

  const handleMouseMove = (e) => {
    if (!isDragging.current) return;
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    sliderRef.current.classList.remove("dragging");
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
        <div
           ref={sliderRef}
           className="image-upload-container"
           onMouseDown={handleMouseDown}
           onMouseMove={handleMouseMove}
           onMouseUp={handleMouseUpOrLeave}
           onMouseLeave={handleMouseUpOrLeave}
        >
         {/* 고정된 사진등록 버튼 */}
    <div className="image-upload-box">
      <label>
        <input
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={handleImageUpload}
        />
        <div className="add-image">
          <CameraIcon className="camera-icon" />
          <p className="camera-text">사진등록</p>
        </div>
      </label>
    </div>

    {/* 업로드된 이미지들 */}
    {Array.from({ length: 9 }).map((_, index) => (
      <div key={index} className="image-upload-box">
        {shareImages[index] ? (
          <>
            <img
              src={URL.createObjectURL(shareImages[index])}
              alt={`uploaded-${index}`}
              className="uploaded-image"
              onClick={() =>
                document.getElementById(`file-input-${index}`).click()
              }
            />
            <input
              id={`file-input-${index}`}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(event) => handleImageReplace(event, index)}
            />
            <button
              className="remove-image-button"
              onClick={() => handleImageRemove(index)}
            >
              &times;
            </button>
          </>
        ) : (
          <div className="placeholder-box">+</div> // 빈 박스는 "+"로 표시
        )}
      </div>
    ))}
  </div>
</div>
      <button
        className="category-select-button"
        onClick={() => setIsShareCategoryModalVisible(true)}
      >
        {selectedShareCategory
          ? `선택된 카테고리: ${selectedShareCategory}`
          : "품목선택"}
      </button>
      {isShareCategoryModalVisible && (
        <ShareCategorySelect
          onClose={() => setIsShareCategoryModalVisible(false)}
          onCategorySelect={handleCategorySelect}
        />
      )}
      <div className="form-group">
        <h4>제목</h4>
        <input
          type="title"
          value={shareTitle}
          onChange={(e) => setShareTitle(e.target.value)}
          placeholder="제목을 입력하세요"
        />
      </div>
      <div className="form-group">
        <h4>가격</h4>
        <input
          type="price"
          value={sharePrice}
          onChange={(e) => setSharePrice(e.target.value)}
          placeholder="₩ 100,000"
        />
      </div>
      <div className="share-button-group">
        <div className="share-button-specify">
          <button
            className="locationSelect-button"
            onClick={() => setIsShareLocationVisible(true)}
          >
            장소지정
          </button>
          {isShareLocationVisible && (
            <ShareLocation
              onClose={() => setIsShareLocationVisible(false)}
              onComplete={(location) => setShareLocationData(location)}
            />
          )}
          <button
            className="DateSelect-button"
            onClick={() => setIsShareDateSelectVisible(true)}
          >
            날짜지정
          </button>
          {isShareDateSelectVisible && (
            <ShareDateSelect
              onClose={() => setIsShareDateSelectVisible(false)}
              onSelectDate={handleShareDateSelect}
            />
          )}
        </div>
        <div className="share-quantity">
          <p className="share-quantity-text">수량</p>
          <input
            className="share-quantity-input"
            type="number"
            value={shareQuantity}
            onChange={(e) => setShareQuantity(e.target.value)}
            min="1"
            max="99"
          />
          <p className="share-quantity-text">개</p>
        </div>
      </div>

      <div className="form-group">
        <h4>내용</h4>
        <textarea
          className="textarea"
          value={shareDescription}
          onChange={(e) => setShareDescription(e.target.value)}
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <button className="submit-button" onClick={handleShareSubmit}>
        등록완료
      </button>
    </div>
  );
};

export default ShareCreate;
