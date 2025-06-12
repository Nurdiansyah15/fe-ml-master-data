import axios from "axios";

const axiosInstance = axios.create({
  // baseURL: "http://localhost:8080",
  // baseURL: "https://api.hertod-anal.cloud",
    baseURL: "http://apihertodanalcom-4af8450eb240.nevacloud.io",
});

export default axiosInstance;
