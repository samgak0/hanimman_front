import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DateSelect.css";

const DateSelect = ({ onClose, onSelectDate }) => {
  const [date, setDate] = useState(new Date()); // 기본값 : 오늘 날짜
  const [hour, setHour] = useState("00"); // 시간
  const [minute, setMinute] = useState("00"); // 분

  const handleDateChange = (selectedDate) => {
    setDate(selectedDate); // 문자열을 Date 객체로 변환
  };

  const handleConfirm = () => {
    const selectedDateTime = new Date(date);
    selectedDateTime.setHours(hour);
    selectedDateTime.setMinutes(minute);
    onSelectDate(selectedDateTime); // 상위 컴포넌트로 선택된 날짜와 시간 전달
    onClose(); // 모달 닫기
  };

  const today = new Date();
  const maxDate = new Date();
  maxDate.setDate(today.getDate() + 7);

  return (
    <div className="date-select-modal">
      <div className="date-select-container">
        <header className="date-header">
          <h4 className="date-header-title">날짜 선택</h4>
          <button className="date-close-button" onClick={onClose}>
            닫기
          </button>
        </header>
        <Calendar
          onChange={handleDateChange}
          value={date}
          calendarType="gregory"
          locale="es-US" // 언어 설정
          className="custom-calendar" // 커스텀 스타일 적용
          formatShortWeekday={(locale, date) =>
            ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
          } // 요일을 한국어로 설정
          formatMonthYear={(locale, date) =>
            `${date.getFullYear()}년 ${date.getMonth() + 1}월`
          } // 월/연도 텍스트 직접 설정
          tileDisabled={({ date, view }) =>
            view === "month" &&
            (date < today.setHours(0, 0, 0, 0) || date > maxDate)
          } // 현재 일 이전과 이후 7일 이후 날짜 비활성화
          tileClassName={({ date, view }) => {
            if (
              view === "month" &&
              (date < today.setHours(0, 0, 0, 0) || date > maxDate)
            ) {
              return "disabled-tile";
            }
            if (view === "month" && date.getDay() === 0) {
              return "sunday-tile";
            }
            return null;
          }}
        />
        <div className="time-select-container">
          <label>
            시간:
            <select
              value={hour}
              onChange={(e) => setHour(e.target.value)}
              className="time-select"
            >
              {Array.from({ length: 24 }, (_, i) => (
                <option key={i} value={i.toString().padStart(2, "0")}>
                  {i.toString().padStart(2, "0")}시
                </option>
              ))}
            </select>
          </label>
          <label>
            분:
            <select
              value={minute}
              onChange={(e) => setMinute(e.target.value)}
              className="time-select"
            >
              {Array.from({ length: 6 }, (_, i) => (
                <option key={i} value={(i * 10).toString().padStart(2, "0")}>
                  {(i * 10).toString().padStart(2, "0")}분
                </option>
              ))}
            </select>
          </label>
        </div>
        <button className="date-confirm-button" onClick={handleConfirm}>
          {`${date.getMonth() + 1}월 ${date.getDate()}일(${
            ["일", "월", "화", "수", "목", "금", "토"][date.getDay()]
          }) 선택`}
        </button>
      </div>
    </div>
  );
};

export default DateSelect;
