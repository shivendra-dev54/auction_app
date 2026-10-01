import axios, { Method } from "axios";

const AUTH_ENDPOINTS = [
  "/api/auth/signin",
  "/api/auth/signup",
  "/api/auth/refresh",
];

export const axiosRequestHandler = async (
  url: string,
  type: Method,
  body: unknown,
  logout: () => void
) => {
  const base =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:64000";

  const request = () =>
    axios({
      url: base + url,
      method: type,
      data: body,
      withCredentials: true,
    });

  try {
    return await request();
  } catch (error) {
    if (
      !axios.isAxiosError(error) ||
      error.response?.status !== 401 ||
      AUTH_ENDPOINTS.includes(url)
    ) {
      throw error;
    }

    try {
      await axios({
        url: base + "/api/auth/refresh",
        method: "POST",
        withCredentials: true,
      });

      return await request();
    } catch (refreshError) {
      if (
        axios.isAxiosError(refreshError) &&
        refreshError.response?.status === 401
      ) {
        logout();
      }

      throw refreshError;
    }
  }
};