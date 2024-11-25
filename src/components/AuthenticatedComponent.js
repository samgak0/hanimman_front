import React, { useEffect, useState } from "react";
import axios from '../../axiosInstance'; // axios 인스턴스 설정

const AuthenticatedComponent = () => {
  const [data, setData] = useState(null); // API에서 받아올 데이터 상태
  const [message, setMessage] = useState(""); // 에러 메시지 상태

  useEffect(() => {
    // 데이터 요청을 위한 비동기 함수
    const fetchData = async () => {
      try {
        // 인증된 사용자가 접근할 수 있는 API 엔드포인트로 GET 요청을 보냄
        const response = await axios.get("/secure-endpoint");

        // 성공적으로 데이터를 받으면 상태에 저장
        setData(response.data);
      } catch (error) {
        // 오류가 발생하면 에러 메시지를 상태에 저장
        setMessage(error.message);
      }
    };

    // 컴포넌트가 렌더링된 후 fetchData 호출
    fetchData();
  }, []); // 빈 배열은 컴포넌트가 처음 마운트될 때만 실행되게 만듦

  return (
    <div>
      {/* 데이터가 있으면 출력, 없으면 에러 메시지를 출력 */}
      {data ? <p>Data: {JSON.stringify(data)}</p> : <p>{message}</p>}
    </div>
  );
};

export default AuthenticatedComponent;
