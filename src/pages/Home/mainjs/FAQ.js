import React, { useEffect, useState } from "react";
import "../maincss/FAQ.css"; // CSS 파일 import
import { useNavigate } from "react-router-dom";
import { listAllFaqs } from "../../../api/faqApi"; // listAllFaqs 함수 import

const FAQ = () => {
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [faqs, setFaqs] = useState([]); // FAQ 목록 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const pageable = { page: 0, size: 10, sort: "createdAt,desc" }; // 페이지네이션 설정
        const data = await listAllFaqs(pageable); // FAQ 목록 불러오기
        setFaqs(data.content); // FAQ 목록 상태 설정
      } catch (error) {
        setError(error); // 에러 상태 설정
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchFaqs();
  }, []);

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시
  if (error) return <p>Error loading FAQs: {error.message}</p>; // 에러 발생 시 표시

  return (
    <div className="faq-container">
      <header className="faq-header">
        <button className="back-button" onClick={() => navigate(-1)}>
          ◀
        </button>{" "}
        {/* 뒤로가기 버튼 */}
        <h1>자주 묻는 질문</h1>
      </header>
      <div className="faq-list">
        {faqs.map((faq) => (
          <div
            key={faq.id}
            className="faq-item"
            onClick={() => navigate(`/faq/${faq.id}`)} // 클릭 시 상세 페이지로 이동
          >
            <h2 className="faq-question">{faq.title}</h2>
            <hr className="faq-divider" /> {/* 항목 사이에 선 추가 */}
          </div>
        ))}
      </div>
      <div className="faq-footer">
        <p>원하는 답변이 없으신가요?</p>
        <button className="inquiry-button" onClick={() => navigate("/inquiry")}>
          1:1 문의하기
        </button>
        <button
          className="my-inquiries-button"
          onClick={() => navigate("/my-inquiries")}
        >
          내가한 문의
        </button>
      </div>
    </div>
  );
};

export default FAQ;
