import axios from "axios";
import { f7 } from "framework7-vue";

import { apiEndPoint } from "../config/config";

const config = {
  baseURL: apiEndPoint,
};

const service = axios.create(config);

service.interceptors.request.use((config) => {
  let token = localStorage.getItem("token");
  if (token) token = `Bearer ${token}`;
  config.headers["Authorization"] = token;
  return config;
});

// Add a response interceptor
service.interceptors.response.use(
  (response) => {
    console.log(response);
    return response;
  },
  (error) => {
    // f7.dialog.preloader("hello", "primary");
    f7.dialog.alert(
      error.response.data.error ?? "Something went wrong",
      "Some Error",
      () => {
        console.log("popup is close");
      }
    );

    return Promise.reject(error);
  }
);

export default service;
