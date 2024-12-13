import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // react-toastify 임포트
import "./TogetherCreate.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CameraIcon } from "../../../assets/icons/camera.svg";
import { ReactComponent as QuestionMark } from "../../../assets/icons/questionmark.svg";
import DateSelect from "../../../components/DateSelect";
import CategorySelect from "../../../components/CategorySelect";
import { DataContext } from "../../../context/DataContext";
import { createTogether } from "../../../api/togetherApi";
import { useLocation } from "react-router-dom";

const TogetherCreate = () => {
  const location = useLocation();
  const post = location.state?.post || {};
  const marketCategory = location.state?.marketCategory || "";
  const marketName = location.state?.marketName || "";
  const locationName = location.state?.locationName || "";
  const addressDTO = location.state?.addressDTO || {};
  const latitude = location.state?.latitude || "";
  const longitude = location.state?.longitude || "";

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState(post.title || "");
  const [item, setItem] = useState(post.item || "");
  const [price, setPrice] = useState(post.price || "");
  const [people, setPeople] = useState(post.people || 1);
  const [description, setDescription] = useState(post.content || "");
  const [showDateSelect, setShowDateSelect] = useState(false); // 날짜 선택 모달 표시 여부
  const [selectedDate, setSelectedDate] = useState(post.meetingAt || ""); // 선택된 날짜
  const [showCategoryModal, setShowCategoryModal] = useState(false); // 모달 상태
  const [selectedCategory, setSelectedCategory] = useState(null); // 선택된 카테고리
  const [address, setAddress] = useState(post.address || ""); // 주소 상태 추가
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가
  const [isPriceDisabled, setIsPriceDisabled] = useState(false); // 가격 입력 비활성화 상태 추가

  const {
    setPosts,
    setTogetherCreateState,
    togetherCreateState,
    selectedLocation,
  } = useContext(DataContext);
  const navigate = useNavigate();

  // 기존 상태 복원
  useEffect(() => {
    if (Object.keys(togetherCreateState).length > 0) {
      setTitle(togetherCreateState.title || "");
      setItem(togetherCreateState.item || "");
      setPrice(togetherCreateState.price || "");
      setPeople(togetherCreateState.people || 1);
      setDescription(togetherCreateState.description || "");
      setImages(togetherCreateState.images || []);
      setSelectedDate(togetherCreateState.selectedDate || "");
      setSelectedCategory(togetherCreateState.selectedCategory || null);
      setAddress(togetherCreateState.address || ""); // 주소 상태 복원
    }
  }, [togetherCreateState]);

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files).slice(0, 10); // 최대 10개의 파일만 선택 가능
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

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index)); // 특정 인덱스의 이미지를 삭제
  };

  const handleSubmit = async () => {
    if (title === "") {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (item === "") {
      toast.error("제품명을 입력해주세요.");
      return;
    }
    if (marketCategory === "" && latitude === "") {
      toast.error("장소를 선택해주세요.");
      return;
    }
    if (selectedDate === "") {
      toast.error("날짜를 선택해주세요.");
      return;
    }
    if (isPriceDisabled === false) {
      if (price === "") {
        toast.error("가격을 입력해주세요.");
        return;
      }
      if (price < 1) {
        toast.error("가격을 1 이상의 숫자로 입력해주세요.");
        return;
      }
      if (!Number.isInteger(Number(price)) || isNaN(Number(price))) {
        toast.error("가격을 1 이상의 숫자로 입력해주세요.");
        return;
      }
    }

    if (people < 1) {
      toast.error("수량을 1개 이상의 숫자로 입력해주세요.");
      return;
    }
    if (!Number.isInteger(Number(people)) || isNaN(Number(people))) {
      toast.error("수량을 1개 이상의 숫자로 입력해주세요.");
      return;
    }

    if (description === "") {
      toast.error("내용을 입력해주세요.");
      return;
    }

    const formData = new FormData();
    const togetherDTO = {
      title,
      content: description,
      views: 0,
      createdAt: new Date().toISOString(),
      meetingLocation: null,
      meetingAt: new Date(selectedDate).toISOString(), // Instant 형식으로 변환
      item: item,
      price: price,
      quantity: people,
      isEnd: false,
      imageUrls: [], // 이미지 URL은 서버에서 처리
      marketCategory, // marketCategory 추가
      marketName, // marketName 추가
      address: locationName, // locationName 추가
      addressDTO,
      latitude,
      longitude,
    };

    console.log("togetherDTO", togetherDTO);
    formData.append(
      "togetherDTO",
      new Blob([JSON.stringify(togetherDTO)], { type: "application/json" })
    );
    images.forEach((image, index) => {
      formData.append("files", image);
    });

    try {
      await createTogether(formData); // 서버로 데이터 전송
      setPosts((prevPosts) => [...prevPosts, togetherDTO]);
      setTogetherCreateState({}); // 상태 초기화
      navigate("/togetherlist");
      toast.success("게시글이 성공적으로 등록되었습니다."); // 성공 메시지
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // 서버에서 반환된 에러 메시지 설정
      } else {
        setErrorMessage("게시글 작성 중 오류가 발생했습니다."); // 일반적인 에러 메시지 설정
      }
      console.error("Error creating post:", error);
      toast.error("게시글 작성 중 오류가 발생했습니다."); // 에러 메시지 처리

      // 5초 후에 에러 메시지 지우기
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const openLocationPage = () => {
    setTogetherCreateState({
      title,
      price,
      item,
      people,
      description,
      images,
      selectedDate,
      selectedCategory,
      address,
      marketCategory,
      locationName,
      marketName,
      addressDTO,
      latitude,
      longitude,
    });
    navigate("/locationselect");
  };

  /* 날짜선택 */
  const handleDateSelect = (date) => {
    setSelectedDate(date.toISOString()); // Instant 형식으로 변환
    setShowDateSelect(false);
  };

  const handlePriceCheckboxChange = (e) => {
    setIsPriceDisabled(e.target.checked);
    if (e.target.checked) {
      setPrice(""); // 체크박스가 체크되면 가격 초기화
    }
  };

  const handleClose = () => {
    navigate("/togetherlist"); // 이전 페이지로 이동
  };

  // 이미지 드래그 앤 슬라이드 기능
  const sliderRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const scrollLeft = useRef(0);
  // 드래그 시작
  const handleMouseDown = (e) => {
    isDragging.current = true;
    sliderRef.current.classList.add("dragging");
    startX.current = e.pageX - sliderRef.current.offsetLeft;
    scrollLeft.current = sliderRef.current.scrollLeft;
  };
  // 드래그 중
  const handleMouseMove = (e) => {
    if (!isDragging.current) return; // 드래그 상태가 아니면 무시
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2; // 스크롤 속도 조절
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };
  // 드래그 종료
  const handleMouseUpOrLeave = () => {
    isDragging.current = false;
    sliderRef.current.classList.remove("dragging");
  };

  return (
    <div className="mobile-container">
      <div className="registration-page">
        <header className="list-header">
          <button onClick={handleClose} className="close-icon-button">
            <CloseIcon />
          </button>

          <span class="tooltip">
            <p className="together-tutorial">
              <QuestionMark className="question-icon" />
            </p>
            <span class="tooltip-text">
              '같이가요'는 코스트코, 트레이더스 등 대형 마트에 같이 찾아가서
              물건을 구매하는 서비스 입니다. <br />
              <br />
              제목, 제품명, 장소, 날짜, 수량, 내용은 필수 입력사항입니다. 가격을
              모르면 '현장확인' 체크박스에 체크를 해주세요.
              <br />
              <br />
              만나는 날짜는 지금 시간으로부터 1시간 후, 그리고 7일 이내에 설정할
              수 있습니다.
            </span>
          </span>
        </header>

        {!showDateSelect ? (
          <>
            {errorMessage && (
              <div className="error-message-container">
                <p className="error-message">{errorMessage}</p>
              </div>
            )}
            <div
              className="image-slider-container"
              style={{ position: "relative" }}
            >
              <div
                ref={sliderRef}
                className="image-upload-container"
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUpOrLeave}
                onMouseLeave={handleMouseUpOrLeave}
              >
                {Array.from({ length: 10 }).map((_, index) => (
                  <div key={index} className="image-upload-box">
                    {images[index] ? (
                      <>
                        <img
                          src={URL.createObjectURL(images[index])}
                          alt={`uploaded-${index}`}
                          className="uploaded-image"
                          onClick={() =>
                            document
                              .getElementById(`file-input-${index}`)
                              .click()
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
                      images.length < 10 && (
                        <label>
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            style={{ display: "none" }}
                            onChange={handleImageUpload}
                          />
                          <div className="add-image">
                            {index === 0 ? (
                              <>
                                <CameraIcon className="camera-icon" />
                                <p className="camera-text">사진등록</p>
                              </>
                            ) : (
                              "+"
                            )}
                          </div>
                        </label>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div className="form-group">
              <h4>제목</h4>
              <input
                type="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="제목을 입력하세요"
              />
            </div>
            <div className="form-group">
              <h4>제품명</h4>
              <input
                type="title"
                value={item}
                onChange={(e) => setItem(e.target.value)}
                placeholder="제품명을 입력하세요"
              />
            </div>

            <div className="form-group">
              <div className="price-group">
                <h4>가격</h4>
                <input
                  type="checkbox"
                  className="price-checkbox"
                  onChange={handlePriceCheckboxChange}
                  checked={isPriceDisabled}
                />
                <p className="price-check-comment">현장확인</p>
              </div>
              <input
                className="price-input"
                type="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="₩ 100,000"
                disabled={isPriceDisabled}
              />
            </div>
            <div className="button-group">
              <button
                className="locationSelect-button"
                onClick={openLocationPage}
              >
                장소지정
              </button>
              <button
                className="DateSelect-button"
                onClick={() => setShowDateSelect(true)}
              >
                날짜지정
              </button>

              <div className="people-group">
                <div className="people-group-num">
                  <label className="people-font">수량</label>
                  <input
                    className="people-input"
                    type="number"
                    value={people}
                    onChange={(e) => setPeople(e.target.value)}
                    defaultValue={1}
                    min="1"
                    max="99"
                  />
                  <label className="people-font">개</label>
                </div>
                {/* <label className="people-nolimit">
                  제한없음
                  <input type="checkbox" className="people-checkbox"></input>
                </label> */}
              </div>
            </div>
            <div className="form-group-select">
              {marketName && (
                <div className="selected-date">선택된 장소: {marketName}</div>
              )}

              {latitude && (
                <div className="selected-date">선택된 장소: {locationName}</div>
              )}
            </div>
            <div className="form-group-select">
              {selectedDate && (
                <div className="selected-date">
                  선택된 날짜: {new Date(selectedDate).toLocaleString()}
                </div>
              )}
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
    </div>
  );
};

export default TogetherCreate;
