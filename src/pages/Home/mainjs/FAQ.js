import React from 'react';
import '../maincss/FAQ.css'; // CSS 파일 import
import { useNavigate } from 'react-router-dom';

const faqData = [
  {
    id: 1,
    question: '회원 가입은 어떻게 하나요?',
    answer: '회원 가입은 메인 화면의 회원 가입 버튼을 눌러 진행할 수 있습니다.',
  },
  {
    id: 2,
    question: '비밀번호를 잊어버렸어요. 어떻게 복구하죠?',
    answer: '로그인 화면에서 비밀번호 찾기를 통해 이메일로 복구할 수 있습니다.',
  },
  {
    id: 3,
    question: '상품 교환/환불은 어떻게 하나요?',
    answer: '상품 교환 및 환불은 판매자와 직접 협의해야 합니다.',
  },
];

const FAQ = () => {
  const navigate = useNavigate();

  return (
    <div className="faq-container">
      <header className="faq-header">
        <button className="back-button" onClick={() => navigate(-1)}>◀</button>
        <h1>자주 묻는 질문</h1>
      </header>
      <div className="faq-list">
        {faqData.map((item) => (
          <div key={item.id} className="faq-item">
            <h2 className="faq-question">{item.question}</h2>
            <p className="faq-answer">{item.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;