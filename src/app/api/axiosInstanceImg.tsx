import axios from "axios";

const axiosInstanceImg = axios.create({
  baseURL: "http://103.127.30.171:8081",
  // baseURL: "http://localhost:8081",
});

const requestInterceptorImg = axiosInstanceImg.interceptors.request.use(
  (request) => {
    const accessToken = localStorage.getItem("token");
    if (accessToken) {
      request.headers["Authorization"] = "Bearer " + accessToken;
      request.headers["Content-Type"] = "multipart/form-data";
    }
    return request;
  },
  (error) => {
    throw error;
  }
);
const responseInterceptor = axiosInstanceImg.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error?.config;
    if (error?.response?.status == 401 && !originalRequest?.sent) {
      localStorage.removeItem("loginToken");
      localStorage.removeItem("loginToken");
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      localStorage.removeItem("loginId");
      originalRequest.sent = true;
    }
    throw error;
  }
);

export default axiosInstanceImg;
