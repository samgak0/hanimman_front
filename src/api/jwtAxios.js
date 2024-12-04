import axios from "axios";

const jwtAxios = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 서버의 기본 URL
  headers: {
    "Content-Type": "application/json",
  },
});

// 요청 인터셉터를 추가하여 인증 토큰을 헤더에 포함시킵니다.
jwtAxios.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("authToken"); // 로컬 스토리지에서 토큰을 가져옵니다.
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default jwtAxios;
