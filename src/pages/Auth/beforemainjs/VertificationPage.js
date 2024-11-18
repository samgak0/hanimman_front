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
        // 포트원 본인인증 요청
        const response = await PortOne.requestIdentityVerification({
          storeId: "store-302994fc-3ebb-4893-9225-815b7ece31f7",
          identityVerificationId: `identity-verification-${crypto.randomUUID()}`,
          channelKey: "channel-key-d057bd45-bd94-4a77-9988-64084b164fd6",
        });

        // 인증 응답 코드 확인
        if (response.code !== undefined) {
          return alert(response.message);
        }

        // 인증 ID 상태 저장
        setVerificationId(response.identityVerificationId);

        // 본인 인증 결과 서버로 전송
        const verificationResult = await fetch("http://localhost:8080/identity-verifications", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            identityVerificationId: response.identityVerificationId,
          }),
        });

        // 서버 응답 처리
        if (!verificationResult.ok) {
          throw new Error("본인 인증 결과 조회 실패");
        }

        const resultData = await verificationResult.json();
        console.log(resultData); // 결과 출력

        // 본인 인증 결과를 바탕으로 회원가입/로그인 처리
        const verifyAndSignupOrLogin = await fetch("http://localhost:8080/users/verify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(resultData), // resultData를 서버로 전송
        });

        // 회원가입/로그인 처리 결과 확인
        if (verifyAndSignupOrLogin.ok) {
          setMessage("회원가입 또는 로그인 성공!");
        } else {
          setMessage("회원가입 또는 로그인 처리 실패.");
        }

      } catch (error) {
        console.error("본인 인증 실패", error);
        setMessage("본인 인증 실패: " + error.message);
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
