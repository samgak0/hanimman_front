import axios from "axios";


const axiosInstance = axios.create({
  baseURL: 'localhost:8080',
});



export default axiosInstance;