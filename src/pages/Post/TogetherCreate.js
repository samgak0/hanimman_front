import React, {useState} from 'react';
import "./TogetherCreate.css";

const TogetherCreate = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [location, setLocation] = useState('');
  const [date, setDate] = useState('');
  const [people, setPeople] = useState(1);
  const [description, setDescription] = useState('');

  const handleImageUpload = (event) => {
    const files = event.target.files;
    const fileArray = Array.from(files).slice(0, 10); // 최대 10개의 파일만 선택 가능
    setImages([...images, ...fileArray]);
  };

  const handleSubmit = () => {
    // 등록 확인 시 제출 로직
    console.log({
      title,
      price,
      location,
      date,
      people,
      description,
      images
    });
    alert('등록이 완료되었습니다!');
  };


  return (
    <div className="registration-page">
      <header className="list-header">
        <button className="close-button">❌</button>
        <button className="save-draft-button">임시저장</button>
      </header>

      <div className="image-registration">
        <h3>사진등록</h3>
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
                    style={{ display: 'none' }}
                  />
                  <div className="add-image">+</div>
                </label>
              )}
            </div>
          ))}
        </div>
        <button className="select-button">품목선택</button>
      </div>

      <div className="form-group">
        <label>제목</label>
        <input
          type="title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="당근 사러가실분"
        />
      </div>

      <div className="form-group">
        <label>가격</label>
        <input
          type="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="₩ 100,000"
        />
      </div>

      <div className="button-group">
        <button className="location-button">장소지정</button>
        <button className="date-button">날짜지정</button>
        <div className="people-group">
          <label>인원수</label>
          <input
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            max="99"
          />
          <span>명</span>
          <button className="restriction-button">제한없음 ♻️</button>
        </div>
      </div>

      {/* <div className="people-group">
        <label>인원수</label>
        <input
          type="number"
          value={people}
          onChange={(e) => setPeople(e.target.value)}
          min="1"
          max="99"
        />
        <span>명</span>
        <button className="restriction-button">제한없음 ♻️</button>
      </div> */}

      <div className="form-group">
        <label>내용</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="내용을 입력하세요"
        ></textarea>
      </div>

      <button className="submit-button" onClick={handleSubmit}>
        등록확인
      </button>
    </div>
  );
};

export default TogetherCreate;