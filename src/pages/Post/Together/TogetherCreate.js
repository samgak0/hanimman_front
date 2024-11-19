import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./TogetherCreate.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import DateSelect from "../../../components/DateSelect" // 날짜 선택 컴포넌트 가져오기
import CategorySelect from "../../../components/CategorySelect";


const TogetherCreate = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [people, setPeople] = useState(0);
  const [description, setDescription] = useState("");
  const [showDateSelect, setShowDateSelect] = useState(false); // 날짜 선택 모달 표시 여부
  const [selectedDate, setSelectedDate] = useState(""); // 선택된 날짜
  const [showCategoryModal, setShowCategoryModal] = useState(false); // 모달 상태
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리



  const navigate = useNavigate();

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files).slice(0, 10); // 최대 10개의 파일만 선택 가능
    setImages([...images, ...fileArray]);
  };

  const handleSubmit = () => {
    console.log({
      title,
      price,
      people,
      description,
      images,
      selectedDate, // 선택된 날짜 추가
    });
    alert("등록이 완료되었습니다!");
  };

  /* 장소지정페이지 렌더링 */
  const openLocationPage = () => {
    navigate("/locationselect");
  };

   /* 날짜선택 */
  const handleDateSelect = (date) => {
    setSelectedDate(`${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`);
    setShowDateSelect(false);
  };

  /* 품목선택 */
  const openCategoryModal = () => setShowCategoryModal(true);
  const closeCategoryModal = () => setShowCategoryModal(false);

  const handleCategorySelect = (category) => {
    setSelectedCategory(category); // 선택된 카테고리 저장
  };

  return (
    <div className="registration-page">
      <header className="list-header">
        <CloseIcon />
        <button className="save-draft-button">임시저장</button>
      </header>

      {!showDateSelect ? (
        <>
          <div className="image-registration">
            <h4>사진등록</h4>
            <div className="image-upload-container">
              {Array.from({ length: 5 }).map((_, index) => (
                <div key={index} className="image-upload-box">
                  {images[index] ? (
                    <img
                      src={URL.createObjectURL(images[index])}
                      alt="uploaded"
                      className="uploaded-image"
                    />
                  ) : (
                    <label>
                      <input
                        type="file"
                        onChange={handleImageUpload}
                        accept="image/*"
                        style={{ display: "none" }}
                      />
                      <div className="add-image">+</div>
                    </label>
                  )}
                </div>
              ))}
            </div>
            <button className="category-select-button" onClick={openCategoryModal}>
              {selectedCategory ? `선택된 카테고리: ${selectedCategory}` : "품목선택"}
            </button>
              {showCategoryModal && (
                <CategorySelect
                  onClose={closeCategoryModal}
                  onCategorySelect={handleCategorySelect}
                  selectedCategory={selectedCategory}
                />
              )}
          </div>

          <div className="form-group">
            <h4>제목</h4>
            <input
              type="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="당근 사러가실분"
            />
          </div>

          <div className="form-group">
            <h4>가격</h4>
            <input
              type="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="₩ 100,000"
            />
          </div>

          <div className="button-group">
            <button className="locationSelect-button" onClick={openLocationPage}>
              장소지정
            </button>
            <button 
              className="DateSelect-button" 
              onClick={() => setShowDateSelect(true)}>
              날짜지정
            </button>

            {showDateSelect && (
              <DateSelect onClose={() => setShowDateSelect(false)} onSelectDate={handleDateSelect} />
              )}

            {selectedDate && <p>선택된 날짜: {selectedDate}</p>}
            <div className="people-group">
              <label className="people-font">인원수</label>
              <input
                className="people-input"
                type="number"
                value={people}
                onChange={(e) => setPeople(e.target.value)}
                min="1"
                max="99"
              />
              <label className="people-font">명</label>
              <label className="people-nolimit">
                제한없음
                <input type="checkbox" className="people-checkbox"></input>
              </label>
            </div>
          </div>

          <div className="form-group">
            <h4>내용</h4>
            <textarea
              className="textarea"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="내용을 입력하세요"
            ></textarea>
          </div>

          <button className="submit-button" onClick={handleSubmit}>
            등록완료
          </button>
        </>
      ) : (
        <DateSelect
          onClose={() => setShowDateSelect(false)}
          onSelectDate={handleDateSelect}
        />
      )}
    </div>
  );
};

export default TogetherCreate;
