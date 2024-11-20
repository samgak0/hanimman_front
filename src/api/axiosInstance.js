import axios from "axios";


const axiosInstance = axios.create({
  baseURL: 'http://192.168.101.253:8080',
});



export default axiosInstance;