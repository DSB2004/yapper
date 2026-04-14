"use server";

import { API_SECRET, API_URL } from "@/config/server";
import axios from "axios";

const authAPI = axios.create({
  baseURL: API_URL + "/auth",
  headers: {
    "x-api-secret": API_SECRET,
  },
});

export { authAPI };
