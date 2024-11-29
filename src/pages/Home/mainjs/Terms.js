import React from 'react';
import '../maincss/Terms.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom';

const termsData = [
  {
    id: 1,
    title: '서비스 이용약관',
    content: `제1조 (목적)
이 약관은 본 서비스 이용에 관한 권리, 의무 및 책임 사항을 규정합니다.`,
  },
  {
    id: 2,
    title: '개인정보 처리방침',
    content: `제1조 (개인정보 수집 목적)
서비스 제공에 필요한 최소한의 개인정보를 수집합니다.`,
  },
  {
    id: 3,
    title: '전자상거래 이용약관',
    content: `제1조 (전자상거래 정의)
전자상거래는 본 서비스를 통해 이루어지는 상품 거래를 의미합니다.`,
  },
];

const Terms = () => {
  const navigate = useNavigate();

  return (
    <div className='mobile-container'>
    <div className="terms-container">
      <header className="terms-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button>
        <h1>약관 및 정책</h1>
      </header>
      <div className="terms-list">
        {termsData.map((term) => (
          <div key={term.id} className="terms-item">
            <h2 className="terms-title">{term.title}</h2>
            <p className="terms-content">{term.content}</p>
          </div>
        ))}
      </div>
    </div>
    </div>
  );
};

export default Terms;