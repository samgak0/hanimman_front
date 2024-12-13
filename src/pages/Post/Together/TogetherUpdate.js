import React, { useState, useEffect, useRef, useContext } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import "./TogetherCreate.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CameraIcon } from "../../../assets/icons/camera.svg";
import { ReactComponent as QuestionMark } from "../../../assets/icons/questionmark.svg";
import DateSelect from "../../../components/DateSelect";
import { DataContext } from "../../../context/DataContext";
import { updateTogether } from "../../../api/togetherApi";

const TogetherUpdate = () => {
  const { id } = useParams();
  const location = useLocation();
  const post = location.state?.post || {};
  const navigate = useNavigate();
  const { setTogetherCreateState } = useContext(DataContext);

  const [images, setImages] = useState([]);
  const [title, setTitle] = useState(post.title || "");
  const [item, setItem] = useState(post.item || "");
  const [price, setPrice] = useState(post.price || "");
  const [people, setPeople] = useState(post.quantity || 1);
  const [description, setDescription] = useState(post.content || "");
  const [showDateSelect, setShowDateSelect] = useState(false);
  const [selectedDate, setSelectedDate] = useState(post.meetingAt || "");
  const [selectedCategory, setSelectedCategory] = useState(
    post.selectedCategory || null
  );
  const [marketCategory, setMarketCategory] = useState(
    post.marketCategory || ""
  );
  const [marketName, setMarketName] = useState(post.marketName || "");
  const [locationName, setLocationName] = useState(post.locationName || "");
  const [addressDTO, setAddressDTO] = useState(post.addressDTO || {});
  const [latitude, setLatitude] = useState(post.latitude || "");
  const [longitude, setLongitude] = useState(post.longitude || "");
  const [address, setAddress] = useState(post.address || "");
  const [isPriceDisabled, setIsPriceDisabled] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const { update } = useContext(DataContext);

  const { setPosts } = useContext(DataContext);

  const handleImageUpload = (event) => {
    const files = Array.from(event.target.files).slice(0, 10 - images.length);
    if (files.length + images.length > 10) {
      alert("이미지는 최대 10개까지만 업로드 가능합니다.");
      return;
    }
    setImages((prevImages) => [...prevImages, ...files]);
    event.target.value = "";
  };

  const handleImageReplace = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      setImages((prevImages) =>
        prevImages.map((img, i) => (i === index ? file : img))
      );
      event.target.value = "";
    }
  };

  const handleImageRemove = (index) => {
    setImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    // 유효성 검사
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
        toast.error("가격은 정수로 입력해주세요.");
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
      views: post.views,
      createdAt: post.createdAt,
      meetingLocation: null,
      meetingAt: new Date(selectedDate).toISOString(),
      item: item,
      price: isPriceDisabled ? null : price,
      quantity: people,
      isEnd: post.isEnd,
      imageUrls: post.imageUrls || [],
      marketCategory,
      marketName,
      address: locationName,
      addressDTO,
      latitude,
      longitude,
    };

    formData.append(
      "togetherDTO",
      new Blob([JSON.stringify(togetherDTO)], { type: "application/json" })
    );
    images.forEach((image, index) => {
      formData.append("files", image);
    });

    try {
      await updateTogether(id, formData);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.id === id ? { ...p, ...togetherDTO } : p))
      );
      navigate(`/togetherdetail/${id}`);
      toast.success("게시글이 성공적으로 수정되었습니다.");
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("게시글 수정 중 오류가 발생했습니다.");
      }
      console.error("Error updating post:", error);
      toast.error("게시글 수정 중 오류가 발생했습니다.");

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
      isUpdate: true, // 수정 모드임을 표시
      postId: id,
    });
    navigate("/locationselect");
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.toISOString());
    setShowDateSelect(false);
  };

  const handlePriceCheckboxChange = (e) => {
    setIsPriceDisabled(e.target.checked);
    if (e.target.checked) {
      setPrice("");
    }
  };

  const handleClose = () => {
    navigate(`/togetherdetail/${id}`);
  };

  // 이미지 드래그 앤 슬라이드 기능
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
    e.preventDefault();
    const x = e.pageX - sliderRef.current.offsetLeft;
    const walk = (x - startX.current) * 2;
    sliderRef.current.scrollLeft = scrollLeft.current - walk;
  };

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
          <h1>게시글 수정</h1>
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
                    min="1"
                    max="99"
                  />
                  <label className="people-font">개</label>
                </div>
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
              수정완료
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
export default TogetherUpdate;