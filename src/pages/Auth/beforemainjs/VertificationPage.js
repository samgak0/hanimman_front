import React, { useEffect, useState } from "react";
import "../beforemaincss/VertificationPage.css";
import PortOne from "@portone/browser-sdk/v2";

const VerificationPage = () => {
  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const requestVerification = async () => {
      setLoading(true); // 로딩 시작

      try {
        // 포트원 본인인증 요청 부분은 현재 주석 처리 상태입니다.
        // 본인 인증 API 호출 예시 (포트원 SDK를 활용)
        const response = await PortOne.requestIdentityVerification({
          storeId: "store-302994fc-3ebb-4893-9225-815b7ece31f7",
          identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
          channelKey: "channel-key-d057bd45-bd94-4a77-9988-64084b164fd6",
        });

        // 인증 응답 코드 확인 (주석처리한 부분)
        if (response.code !== undefined) {
          return alert(response.message);
        }
        setVerificationId(response.identityVerificationId);

        // 본인 인증 결과를 서버로 전송 (API 응답 처리 부분)
        const verificationResult = await fetch("http://localhost:8080/identity-verifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identityVerificationId: response.identityVerificationId,
          }),
        });

        if (!verificationResult.ok) {
          throw new Error("본인 인증 결과 조회 실패");
        }

        const resultData = await verificationResult.json();

   
        const token = localStorage.getItem("authToken"); // 기존에 저장된 JWT 토큰 확인

        // 본인 인증 결과를 바탕으로 회원가입/로그인 처리
        const verifyAndSignupOrLogin = await fetch("http://localhost:8080/users/verify", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`, // 기존 토큰을 Authorization 헤더에 포함
          },
          body: JSON.stringify(resultData), // 본인 인증 후 받은 사용자 정보
          credentials: "include", // 쿠키 포함 옵션
        });

        // 모든 헤더 출력
        verifyAndSignupOrLogin.headers.forEach((value, name) => {
        });

        // 회원가입/로그인 처리 결과 확인
        if (verifyAndSignupOrLogin.ok) {
          // 헤더에서 Authorization 토큰을 추출
          const responseToken = verifyAndSignupOrLogin.headers.get("Authorization");

          if (responseToken) {
            // Authorization 토큰이 있을 경우, 'Bearer ' 부분을 제거하고 로컬 스토리지에 저장
            const tokenWithoutBearer = responseToken.replace("Bearer ", "");
            localStorage.setItem("authToken", tokenWithoutBearer); // 로컬 스토리지에 토큰 저장
            setMessage("회원가입 또는 로그인 성공!");
          } else {
            setMessage("Authorization 토큰을 찾을 수 없습니다.");
          }
        } else {
          const errorData = await verifyAndSignupOrLogin.json();
          setMessage(`회원가입 또는 로그인 처리 실패: ${errorData.message}`);
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("본인 인증 중 오류가 발생했습니다.");
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    requestVerification(); // 컴포넌트 마운트 시 본인 인증 요청
  }, []); // 의존성 배열이 비어 있으므로, 컴포넌트가 처음 렌더링될 때만 호출됨

  return (
    <div>
      <h2>본인인증 페이지</h2>
      <p>본인인증 절차를 진행해주세요.</p>
      {loading && <p>본인 인증을 처리하는 중입니다...</p>}
      {message && <p>{message}</p>}
      {verificationId && (
        <p>본인인증이 완료되었습니다. 인증 ID: {verificationId}</p>
      )}
    </div>
  );
};

export default VerificationPage;
