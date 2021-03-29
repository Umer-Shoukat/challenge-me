import axios from "axios";
import { apiEndPoint } from "../config/config";

export default {
  install: (app) => {
    let config = {
      baseURL: apiEndPoint,
    };

    const service = axios.create(config);
    const store = app.config.globalProperties.$store;

    service.interceptors.request.use(
      (config) => {
        let token = localStorage.getItem("token");
        if (token) token = `Bearer ${token}`;
        config.headers["Authorization"] = token;
        return config;
      },
      (error) => {
        store.commit(
          "SET_APP_ERROR",
          error?.response?.data?.error ?? "Something went Wrong"
        );
        return Promise.reject(error);
      }
    );

    // Add a response interceptor
    service.interceptors.response.use(
      (response) => {
        return response;
      },
      (error) => {
        store.commit(
          "SET_APP_ERROR",
          error?.response?.data?.error ?? "Something went Wrong"
        );
        return Promise.reject(error);
      }
    );

    app.config.globalProperties.$axios = service;
  },
};
