"use server";

import { API_SECRET, API_URL } from "@/config/server";
import axios from "axios";
import { validateUser } from "@/app/actions/auth/validate.action";
import { UnauthorizedError } from "@/constants/class";
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "x-api-secret": API_SECRET,
  },
});

api.interceptors.request.use(
  async (config) => {
    try {
      const user = await validateUser();
      if (user) {
        const { accessToken, refreshToken } = user;
        config.headers.Authorization = `Bearer ${accessToken}`;
        config.headers["x-refresh-token"] = `${refreshToken}`;
      }
      return config;
    } catch (err) {
      throw new Error("AUTH_INVALID");
    }
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      return Promise.reject(new UnauthorizedError());
    }
    return Promise.reject(error);
  },
);

export { api };
