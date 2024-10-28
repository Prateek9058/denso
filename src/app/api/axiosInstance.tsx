import axios from "axios";
import { signOut } from "next-auth/react";
const axiosInstance = axios.create({
  baseURL: "http://103.127.30.171:8090",
  // baseURL: "http://10.5.50.82:8081",
  // baseURL: "http://localhost:8081",
});
const requestInterceptor = axiosInstance.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      request.headers["Authorization"] = "Bearer " + accessToken;
      request.headers["Content-Type"] = "application/json";
    }
    return request;
  },
  (error) => {
    throw error;
  }
);
const responseInterceptor = axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status == 401 && !originalRequest?.sent) {
      signOut({
        callbackUrl: "/login?error=Session expired. Please log in again.",
        redirect: true,
      });
      localStorage.removeItem("loginToken");
      localStorage.removeItem("loginToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userRole");
      localStorage.removeItem("loginId");
      localStorage.removeItem("selectedSite");
      originalRequest.sent = true;
    }
    throw error;
  }
);

export default axiosInstance;
