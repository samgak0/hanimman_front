import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from 'react-router-dom';
import "../beforemaincss/VerificationPage.css";
import PortOne from "@portone/browser-sdk/v2";
import { v4 as uuidv4 } from "uuid";
import { toast } from "react-toastify"; // 토스트 import 추가

const VerificationPage = () => {
  const location = useLocation(); // URL 정보 가져오기
  const navigate = useNavigate(); // navigate 함수 가져오기
  const queryParams = new URLSearchParams(location.search); // 쿼리 파라미터 처리
  const legalCode = queryParams.get('address'); // 법정 코드 가져오기

  const [verificationId, setVerificationId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const requestVerification = async () => {
      setLoading(true); // 로딩 시작
      const uniqueId = uuidv4();

      try {
        // 포트원 본인인증 요청 부분
        const response = await PortOne.requestIdentityVerification({
          storeId: "store-302994fc-3ebb-4893-9225-815b7ece31f7",
          identityVerificationId: `identity-verification-${uniqueId}`,
          channelKey: "channel-key-d057bd45-bd94-4a77-9988-64084b164fd6",
          windowType: {
            pc: "POPUP",
            mobile: "REDIRECTION",
          },
          redirectUrl: "https://www.samgak.store/verification/mobile"
        });

        if (response.code !== undefined) {
          toast.error(response.message); // 실패 시 toast.error
          return;
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

        // 본인 인증 결과를 바탕으로 회원가입/로그인 처리
        const verifyAndSignupOrLogin = await fetch(
          "http://localhost:8080/users/verify",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              ...resultData,
            }),
            credentials: "include",
          }
        );

        if (verifyAndSignupOrLogin.ok) {
          const responseToken = verifyAndSignupOrLogin.headers.get("Authorization");

          if (responseToken) {
            const tokenWithoutBearer = responseToken.replace("Bearer ", "");
            localStorage.setItem("authToken", tokenWithoutBearer);
            toast.success("회원가입 또는 로그인 성공!"); // 성공 시 toast.success
            navigate("/location");
          } else {
            setMessage("Authorization 토큰을 찾을 수 없습니다.");
            toast.error("Authorization 토큰을 찾을 수 없습니다."); // 실패 시 toast.error
          }
        } else {
          const errorData = await verifyAndSignupOrLogin.json();
          setMessage(`회원가입 또는 로그인 처리 실패: ${errorData.message}`);
          toast.error(`회원가입 또는 로그인 처리 실패: ${errorData.message}`); // 실패 시 toast.error
        }
      } catch (error) {
        console.error("Error:", error);
        setMessage("본인 인증 중 오류가 발생했습니다.");
        toast.error("본인 인증 중 오류가 발생했습니다."); // 실패 시 toast.error
      } finally {
        setLoading(false); // 로딩 끝
      }
    };

    requestVerification();
  }, [legalCode, navigate]); // legalCode와 navigate가 변경될 때마다 effect 실행

  return (
    <div className='mobile-container'>
      <div>
        <h2>본인인증 페이지</h2>
        <p>본인인증 절차를 진행해주세요.</p>
        {loading && <p>본인 인증을 처리하는 중입니다...</p>}
        {message && <p>{message}</p>}
        {verificationId && (
          <p>본인인증이 완료되었습니다. 인증 ID: {verificationId}</p>
        )}
      </div>
    </div>
  );
};

export default VerificationPage;