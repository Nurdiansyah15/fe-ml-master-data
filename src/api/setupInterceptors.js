import { logout } from "../redux/features/authSlice";
import axiosInstance from "./axiosInstance";

const excludedEndpoints = ["/login"];

const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      const { url } = config; // Deklarasikan url dengan benar
      if (!excludedEndpoints.includes(url)) {
        const token = store.getState().auth.token; // Ambil token dari Redux store
        if (token) {
          // Tambahkan token ke header Authorization untuk endpoint yang tidak dikecualikan
          config.headers["Authorization"] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  axiosInstance.interceptors.response.use(
    (response) => response,
    (error) => {
      const { url } = error.config; // Pastikan url diambil dari error.config
      if (!excludedEndpoints.includes(url)) {
        if (error?.response?.status === 401) {
          store.dispatch(logout()); // Dispatch logout action
          window.location.href = "/login"; // Redirect ke halaman login setelah logout
        }
      }
      return Promise.reject(error);
    }
  );
};

export default setupInterceptors;
