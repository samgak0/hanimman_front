import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./TogetherCreate.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import DateSelect from "../../../components/DateSelect" // 날짜 선택 컴포넌트 가져오기
import CategorySelect from "../../../components/CategorySelect";
import { DataContext } from "../../../context/DataContext";

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


  const {setPosts, setTogetherCreateState, togetherCreateState, selectedLocation} = useContext(DataContext);
  const navigate = useNavigate();

  // 기존 상태 복원
  useEffect(() => {
    if (Object.keys(togetherCreateState).length > 0) {
      setTitle(togetherCreateState.title || "");
      setPrice(togetherCreateState.price || "");
      setPeople(togetherCreateState.people || 0);
      setDescription(togetherCreateState.description || "");
      setImages(togetherCreateState.images || []);
      setSelectedDate(togetherCreateState.selectedDate || "");
      setSelectedCategory(togetherCreateState.selectedCategory || null);
    }
  }, [togetherCreateState]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files).slice(0, 5); // 최대 10개의 파일만 선택 가능
    setImages((prevImages) => [...prevImages, ...fileArray]); // 기존 이미지에 추가
    event.target.value = ""; // 파일 입력 필드 초기화 (같은 파일 다시 선택 가능)
  };


  const handleImageReplace = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      setImages((prevImages) =>
        prevImages.map((img, i) => (i === index ? file : img))
      ); // 특정 인덱스의 이미지를 교체
      event.target.value = ""; // 파일 입력 초기화
    }
  };


  const handleSubmit = () => {
    const newPost = {
    title,
    price,
    people,
    description,
    location: selectedLocation, 
    images, // 업로드된 이미지 배열
    selectedDate, // 선택된 날짜
    selectedCategory, // 선택된 카테고리
    id: Date.now(), // 고유 ID (현재 시간 기반)
    };
    setPosts((prevPosts) => [...prevPosts, newPost]);
    setTogetherCreateState({}); // 상태 초기화
    navigate("/togetherlist");
  };


  const openLocationPage = () => {
  setTogetherCreateState({
    title,
    price,
    people,
    description,
    images,
    selectedDate,
    selectedCategory,
  });
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

  const handleClose = () => {
    navigate(-1); // 이전 페이지로 이동
  };

  return (
    <div className="registration-page">
      <header className="list-header">
      <button onClick={handleClose} className="close-icon-button">
          <CloseIcon />
        </button>
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
                    <>
                      <img
                        src={URL.createObjectURL(images[index])} // 미리보기 URL 생성
                        alt={`uploaded-${index}`}
                        className="uploaded-image"
                        onClick={() => document.getElementById(`file-input-${index}`).click()} // 이미지 클릭 시 파일 입력 트리거
                      />
                      <input
                        id={`file-input-${index}`}
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(event) => handleImageReplace(event, index)} // 이미지 교체
                      />
                    </>
                  ) : (
                    <label>
                      <input
                        type="file"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={handleImageUpload} // 새 이미지 추가
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

            <div className="people-group">
              <div className="people-group-num">
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
              </div>
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
