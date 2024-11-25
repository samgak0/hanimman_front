import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:8080", // 백엔드 서버의 기본 URL
  headers: {
    "Content-Type": "application/json",
  },
});

export default axiosInstance;
