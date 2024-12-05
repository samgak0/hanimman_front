import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import "../maincss/FAQDetail.css"; // CSS 파일 import
import { readFaq } from "../../../api/faqApi"; // readFaq 함수 import
import { toast } from "react-toastify"; // 토스트 import

const FAQDetail = () => {
  const { id } = useParams(); // URL에서 id를 가져옴
  const navigate = useNavigate(); // useNavigate 훅 사용
  const [faq, setFaq] = useState(null); // FAQ 상태 추가
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  useEffect(() => {
    const fetchFaq = async () => {
      try {
        const data = await readFaq(id); // FAQ 상세 내용 불러오기
        setFaq(data); // FAQ 상태 설정
      } catch (error) {
        setError(error); // 에러 상태 설정
        toast.error(`FAQ 불러오기 실패: ${error.message}`); // 실패 시 토스트 메시지
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchFaq();
  }, [id]);

  if (loading) return <p>Loading...</p>; // 로딩 중일 때 표시
  if (error) return <p>Error loading FAQ: {error.message}</p>; // 에러 발생 시 표시
  if (!faq) return <p>FAQ not found</p>; // FAQ가 없을 때 표시

  return (
    <div className='mobile-container'>
      <div className="faq-detail-container">
        <header className="faq-detail-header">
          <button className="back-button" onClick={() => navigate(-1)}>
            ◀
          </button>{" "}
          {/* 뒤로가기 버튼 */}
          <h1>자주 묻는 질문</h1>
        </header>
        <div className="faq-detail-content">
          <h2 className="faq-detail-title">{faq.title}</h2>
          <div className="faq-detail-images">
            {faq.imageIds &&
              faq.imageIds.map((id) => (
                <img
                  key={id}
                  src={`http://localhost:8080/api/v1/faq/download?id=${id}`}
                  alt="FAQ 이미지"
                  className="faq-detail-image"
                />
              ))}
          </div>
          <p className="faq-detail-text">{faq.content}</p>
        </div>
      </div>
    </div>
  );
};

export default FAQDetail;