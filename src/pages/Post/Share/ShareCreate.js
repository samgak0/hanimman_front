import React, { useContext, useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify"; // react-toastify 임포트
import "./ShareCreate.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CameraIcon } from "../../../assets/icons/camera.svg";
import { ReactComponent as QuestionMark } from "../../../assets/icons/questionmark.svg";
import ShareDateSelect from "../../../components/DateSelect";
import ShareCategorySelect from "../../../components/CategorySelect";
import ShareLocation from "../../../components/ShareLocation";
import { DataContext } from "../../../context/DataContext";
import { createShare } from "../../../api/shareApi"; // createShare API 함수 가져오기
import { useLocation } from "react-router-dom";

const ShareCreate = () => {
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
  const [quantity, setQuantity] = useState(post.quantity || 1);
  const [description, setDescription] = useState(post.description || "");
  const [showDateSelect, setShowDateSelect] = useState(false);
  const [selectedDate, setSelectedDate] = useState(post.meetingAt || "");
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(
    post.selectedCategory || null
  );
  const [locationData, setLocationData] = useState({
    locationName,
    addressDTO,
    latitude,
    longitude,
  });
  const [errorMessage, setErrorMessage] = useState("");
  const [showLocationSelect, setShowLocationSelect] = useState(false);
  const [currentPosition, setCurrentPosition] = useState(null);

  const {
    setPosts,
    setShareCreateState,
    shareCreateState = {},
  } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (Object.keys(shareCreateState).length > 0) {
      setTitle(shareCreateState.title || "");
      setItem(shareCreateState.item || "");
      setPrice(shareCreateState.price || "");
      setQuantity(shareCreateState.quantity || 1);
      setDescription(shareCreateState.description || "");
      setImages(shareCreateState.images || []);
      setSelectedDate(shareCreateState.selectedDate || "");
      setSelectedCategory(shareCreateState.selectedCategory || null);
      setLocationData(shareCreateState.location || {});
    }
  }, [shareCreateState]);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setCurrentPosition(userPosition);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          toast.error("위치 정보를 사용할 수 없습니다.", {
            position: "bottom-center",
          });
        }
      );
    } else {
      toast.error("Geolocation을 지원하지 않는 브라우저입니다.", {
        position: "bottom-center",
      });
    }
  }, []);

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
    if (title === "") {
      toast.error("제목을 입력해주세요.");
      return;
    }
    if (item === "") {
      toast.error("제품명을 입력해주세요.");
      return;
    }
    if (locationData.latitude === "") {
      toast.error("장소를 선택해주세요.");
      return;
    }
    if (selectedDate === "") {
      toast.error("날짜를 선택해주세요.");
      return;
    }

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

    if (quantity < 1) {
      toast.error("수량을 1개 이상의 숫자로 입력해주세요.");
      return;
    }
    if (!Number.isInteger(Number(quantity)) || isNaN(Number(quantity))) {
      toast.error("수량을 1개 이상의 숫자로 입력해주세요.");
      return;
    }

    if (description === "") {
      toast.error("내용을 입력해주세요.");
      return;
    }
    const formData = new FormData();
    const shareDTO = {
      title,
      content: description,
      views: 0,
      createdAt: new Date().toISOString(),
      deletedAt: null,
      addressId: 1111015100,
      meetingLocation: null,
      locationDate: new Date(selectedDate).toISOString(),
      item,
      quantity,
      isEnd: false,
      imageUrls: [],
      address: locationData.locationName,
      price,
      marketCategory,
      marketName,
      locationName: locationData.locationName,
      latitude: locationData.latitude,
      longitude: locationData.longitude,
      addressDTO: locationData.addressDTO,
    };

    formData.append(
      "shareDTO",
      new Blob([JSON.stringify(shareDTO)], { type: "application/json" })
    );
    images.forEach((image, index) => {
      formData.append("files", image);
    });

    try {
      const response = await createShare(formData);
      setPosts((prevPosts) => [...prevPosts, shareDTO]);
      setShareCreateState({});
      const postId = response.data.id;
      navigate(`/sharedetail/${postId}`);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message);
      } else {
        setErrorMessage("게시글 작성 중 오류가 발생했습니다.");
      }
      console.error("Error creating post:", error);
      toast.error("게시글 작성 중 오류가 발생했습니다.");

      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date.toISOString());
    setShowDateSelect(false);
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
    <div className="mobile-container">
      <div className="registration-page">
        <header className="list-header">
          <button
            onClick={() => navigate("/sharelist")}
            className="close-icon-button"
          >
            <CloseIcon />
          </button>
          <span class="tooltip">
            <p className="together-tutorial">
              <QuestionMark className="question-icon" />
            </p>
            <span class="tooltip-text">
              '나눠요'는 코스트코, 트레이더스 등 대형 마트에서 구매한 제품의
              양이 너무 많아서 주변 사람들과 나누고 싶은 경우에 사용하는
              서비스입니다. <br />
              <br />
              제목, 제품명, 장소, 날짜, 수량, 내용은 필수 입력사항입니다. <br />
              <br />
              만나는 날짜는 지금 시간으로부터 1시간 후, 그리고 7일 이내에 설정할
              수 있습니다.
            </span>
          </span>
        </header>

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
          <h4>가격</h4>
          <input
            type="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="₩ 100,000"
          />
        </div>

        <div className="share-button-group">
          <div className="share-button-specify">
            <button
              className="locationSelect-button"
              onClick={() => setShowLocationSelect(true)}
            >
              장소지정
            </button>
            {showLocationSelect && (
              <ShareLocation
                onClose={() => setShowLocationSelect(false)}
                onComplete={(location) => {
                  setLocationData(location);
                  setShowLocationSelect(false);
                }}
              />
            )}
            <button
              className="DateSelect-button"
              onClick={() => setShowDateSelect(true)}
            >
              날짜지정
            </button>
            {showDateSelect && (
              <ShareDateSelect
                onClose={() => setShowDateSelect(false)}
                onSelectDate={handleDateSelect}
              />
            )}
          </div>
          <div className="share-quantity">
            <p className="share-quantity-text">수량</p>
            <input
              className="share-quantity-input"
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
              min="1"
              max="99"
            />
            <p className="share-quantity-text">개</p>
          </div>
        </div>
        <div className="form-group-select">
          {locationData.latitude && (
            <div className="selected-date">
              선택된 장소: {locationData.locationName}
            </div>
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
      </div>
    </div>
  );
};

export default ShareCreate;
