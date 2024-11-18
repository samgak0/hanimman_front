import React, {useState} from 'react';
import "./TogetherCreate.css";
import { ReactComponent as CloseIcon } from '../../../assets/icons/close.svg'
import { useNavigate } from 'react-router-dom';

const TogetherCreate = () => {
  const [images, setImages] = useState([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
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
      people,
      description,
      images
    });
    alert('등록이 완료되었습니다!');
  };

  const navigate = useNavigate();

  const openLocationPage = () => {
    navigate('/locationselect');
  }

  return (
    <div className="registration-page">
      <header className="list-header">
        <CloseIcon/>
        <button className="save-draft-button">임시저장</button>
      </header>

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
        <button className="locationSelect-button" onClick={openLocationPage}>장소지정</button>
        <button className="DateSelect-button">날짜지정</button>
        <div className="people-group">
          <label className='people-font'>인원수</label>
          <input
            className='people-input'
            type="number"
            value={people}
            onChange={(e) => setPeople(e.target.value)}
            min="1"
            max="99"
          />
          <label className='people-font'>명</label>
          <label className="people-nolimit">
            제한없음
            <input type='checkbox' className='people-checkbox'></input> 
          </label>
        </div>
      </div>

      <div className="form-group">
        <h4>내용</h4>
        <textarea className='textarea'
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