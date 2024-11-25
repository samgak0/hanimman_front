import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./ShareCreate.css";
import { ReactComponent as ShareCloseIcon } from "../../../assets/icons/close.svg";
import ShareDateSelect from "../../../components/DateSelect";
import ShareCategorySelect from "../../../components/CategorySelect";
import ShareLocation from "../../../components/ShareLocation"; // 변경된 컴포넌트 가져오기
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
  const [isShareLocationVisible, setIsShareLocationVisible] = useState(false); // 수정된 부분

  const {
    setPosts: setSharePosts,
    setShareCreateState: saveShareCreateState,
    shareCreateState = {},
  } = useContext(DataContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (shareCreateState && Object.keys(shareCreateState).length > 0) {
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

  return (
    <div className="registration-page">
      {/* 헤더 */}
      <header className="list-header">
        <button onClick={() => navigate("/sharelist")} className="close-icon-button">
          <ShareCloseIcon />
        </button>
        <button className="save-draft-button">임시저장</button>
      </header>

      {/* 등록 폼 */}
      <div>
        {/* 이미지 업로드 */}
        <div className="image-registration">
          <h4>사진등록</h4>
          <div className="image-upload-container">
            {Array.from({ length: 5 }).map((_, index) => (
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
                      onChange={(e) =>
                        setShareImages((prev) =>
                          prev.map((img, i) => (i === index ? e.target.files[0] : img))
                        )
                      }
                    />
                  </>
                ) : (
                  <label>
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) =>
                        setShareImages((prev) => [...prev, ...Array.from(e.target.files)])
                      }
                    />
                    <div className="add-image">+</div>
                  </label>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 품목 선택 */}
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
            onCategorySelect={(category) => setSelectedShareCategory(category)}
            selectedCategory={selectedShareCategory}
          />
        )}

        {/* 제목 입력 */}
        <div className="form-group">
          <h4>제목</h4>
          <input
            type="title"
            value={shareTitle}
            onChange={(e) => setShareTitle(e.target.value)}
            placeholder="제목을 입력하세요"
          />
        </div>

        {/* 가격 입력 */}
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
              onClick={() => setIsShareLocationVisible(true)} // 수정된 부분
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
            <label class="share-quantity-label">수량 :</label>
            <input
              className="share-quantity-input"
              type="number"
              value={shareQuantity}
              onChange={(e) => setShareQuantity(e.target.value)}
              placeholder="1"
              
            />
            <label class="share-quantity-label">개</label>
          </div>
         
        </div>

        {/* 내용 입력 */}
        <div className="form-group">
          <h4>내용</h4>
          <textarea
            className="textarea"
            value={shareDescription}
            onChange={(e) => setShareDescription(e.target.value)}
            placeholder="내용을 입력하세요"
          ></textarea>
        </div>

        {/* 등록 버튼 */}
        <button className="submit-button" onClick={handleShareSubmit}>
          등록완료
        </button>
      </div>
    </div>
  );
};

export default ShareCreate;
