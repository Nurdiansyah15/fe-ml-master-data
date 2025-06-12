import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080",
  // baseURL: "https://api.hertod-anal.cloud",
    baseURL: "/api",
});

export default axiosInstance;
