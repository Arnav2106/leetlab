import axios from "axios";

// Dev: use local backend
// Production: use VITE_API_URL set in Vercel/Netlify dashboard
const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:8081/api/v1"
    : import.meta.env.VITE_API_URL;

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
