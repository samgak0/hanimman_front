import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./TogetherReport.css";
import { reportCategory, reportTogether } from "../../../api/togetherReportApi";

const TogetherReport = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [showConfirm, setShowConfirm] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const post = location.state?.post;

  useEffect(() => {
    fetchReportCategories();
  }, []);

  const fetchReportCategories = async () => {
    try {
      const response = await reportCategory();
      setCategories(response); // Assuming the API returns an array of categories
    } catch (error) {
      console.error("Failed to fetch report categories:", error);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleReportClick = () => {
    if (!selectedCategory) {
      alert("신고할 카테고리를 선택하세요.");
      return;
    }
    setShowConfirm(true);
  };

  const handleConfirmReport = async () => {
    const togetherReportDTO = {
      reporterId: 1, // 신고자 ID (예시로 1을 사용, 실제로는 로그인된 사용자 ID를 사용)
      reportedId: post.userId, // 신고된 사람 ID (예시로 2를 사용, 실제로는 게시글 작성자 ID를 사용)
      categoryId: selectedCategory.id,
      togetherId: post.id, // 신고된 게시글 ID
      createdAt: new Date().toISOString(),
    };
    try {
      await reportTogether(togetherReportDTO);
      alert("신고가 접수되었습니다.");
      navigate(-1); // 이전 페이지로 이동
    } catch (error) {
      console.error("Failed to submit report:", error);
      alert("신고 접수에 실패했습니다.");
    }
  };

  return (
    <div className="mobile-container">
      <div className="report-page">
        <header className="report-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ◀
          </button>
          <h1>신고 카테고리</h1>
        </header>
        <div className="category-list">
          {categories.map((category) => (
            <div
              key={category.id}
              className={`category-item ${
                selectedCategory?.id === category.id ? "selected" : ""
              }`}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </div>
          ))}
        </div>
        <button className="report-button" onClick={handleReportClick}>
          신고하기
        </button>
        {showConfirm && (
          <div className="confirm-dialog">
            <p>
              해당 게시글을 신고하시겠습니까? 잘못된 신고를 하면 제재 대상이 될
              수 있습니다.
            </p>
            <button className="confirm-button" onClick={handleConfirmReport}>
              예
            </button>
            <button
              className="cancel-button"
              onClick={() => setShowConfirm(false)}
            >
              아니오
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TogetherReport;
