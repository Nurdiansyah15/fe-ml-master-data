import { logout } from "../redux/features/authSlice";
import axiosInstance from "./axiosInstance";

const excludedEndpoints = ["/login"];
let url;
export const setupInterceptors = (store) => {
  axiosInstance.interceptors.request.use(
    (config) => {
      url = config.url;
      if (!excludedEndpoints.includes(config.url)) {
        const token = store.getState().auth.token;
        if (token) {
          // Tambahkan token ke header authorization untuk endpoint yang tidak dikecualikan
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
      if (!excludedEndpoints.includes(url)) {
        if (error?.response?.status === 401) {
          store.dispatch(logout());
          window.location.href = "/login";
        }
      }
      return Promise.reject(error);
    }
  );
};
