import axios from "axios";

const baseURL = "http://localhost:3000";

//erased content type as Axios can automatically assing what content type is passed through
// we can switch between formdata vs json
export const Http = axios.create({ baseURL });

const attachTokenInterceptor = (instance) => {
  instance.interceptors.request.use((config) => {
    const token = localStorage.getItem("token");
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  });
};

attachTokenInterceptor(Http);
