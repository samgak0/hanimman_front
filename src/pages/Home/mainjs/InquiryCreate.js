import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../maincss/InquiryCreate.css";
import { ReactComponent as CloseIcon } from "../../../assets/icons/close.svg";
import { ReactComponent as CameraIcon } from "../../../assets/icons/camera.svg";
import { createInquiry } from "../../../api/inquiryApi"; // createInquiry API 함수 가져오기

const InquiryCreate = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [email, setEmail] = useState("");
  const [errorMessage, setErrorMessage] = useState(""); // 에러 메시지 상태 추가

  const navigate = useNavigate();

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
    const formData = new FormData();
    const inquiryDTO = {
      title,
      content: description + "\n이메일: " + email,
      createdAt: new Date().toISOString(),
      modifiedAt: new Date().toISOString(),
      deletedAt: null,
      views: 1,
      userId: 1, // 예시로 사용자 ID를 1로 설정
      imageUrls: [], // 이미지 URL은 서버에서 처리
    };

    formData.append(
      "inquiryDTO",
      new Blob([JSON.stringify(inquiryDTO)], { type: "application/json" })
    );
    images.forEach((image, index) => {
      formData.append("files", image);
    });

    try {
      await createInquiry(formData); // 서버로 데이터 전송
      navigate(-1);
    } catch (error) {
      if (error.response && error.response.data) {
        setErrorMessage(error.response.data.message); // 서버에서 반환된 에러 메시지 설정
      } else {
        setErrorMessage("문의 작성 중 오류가 발생했습니다."); // 일반적인 에러 메시지 설정
      }
      console.error("Error creating inquiry:", error);

      // 5초 후에 에러 메시지 지우기
      setTimeout(() => {
        setErrorMessage("");
      }, 5000);
    }
  };

  const handleClose = () => {
    navigate(-1); // 이전 페이지로 이동
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
    <div className='mobile-container'>
    <div className="inquiry-registration-page">
      <header className="inquiry-list-header">
        <button onClick={handleClose} className="inquiry-close-icon-button">
          <CloseIcon />
        </button>
      </header>
      {errorMessage && (
        <div className="inquiry-error-message-container">
          <p className="inquiry-error-message">{errorMessage}</p>
        </div>
      )}{" "}
      {/* 에러 메시지 표시 */}
      <div
        className="inquiry-image-slider-container"
        style={{ position: "relative" }}
      >
        <div
          ref={sliderRef}
          className="inquiry-image-upload-container"
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUpOrLeave}
          onMouseLeave={handleMouseUpOrLeave}
        >
          {Array.from({ length: 10 }).map((_, index) => (
            <div key={index} className="inquiry-image-upload-box">
              {images[index] ? (
                <>
                  <img
                    src={URL.createObjectURL(images[index])} // 미리보기 URL 생성
                    alt={`uploaded-${index}`}
                    className="inquiry-uploaded-image"
                    onClick={() =>
                      document.getElementById(`file-input-${index}`).click()
                    } // 이미지 클릭 시 파일 입력 트리거
                  />
                  <input
                    id={`file-input-${index}`}
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={(event) => handleImageReplace(event, index)} // 이미지 교체
                  />
                  <button
                    className="inquiry-remove-image-button"
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
                      multiple // 여러 파일 선택 가능
                      style={{ display: "none" }}
                      onChange={handleImageUpload} // 새 이미지 추가
                    />
                    <div className="inquiry-add-image">
                      {index === 0 ? (
                        <>
                          <CameraIcon className="inquiry-camera-icon" />
                          <p className="inquiry-camera-text">사진등록</p>
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
      <div className="inquiry-form-group">
        <h4>제목</h4>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="문의 제목을 입력하세요"
        />
      </div>
      <div className="inquiry-form-group">
        <h4>내용</h4>
        <textarea
          className="inquiry-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="문의 내용을 입력하세요"
        ></textarea>
      </div>
      <div className="inquiry-form-group">
        <h4>답변받을 E-Mail</h4>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="답변받을 이메일을 입력하세요"
        />
      </div>
      <button className="inquiry-submit-button" onClick={handleSubmit}>
        등록완료
      </button>
    </div>
    </div>
  );
};

export default InquiryCreate;
