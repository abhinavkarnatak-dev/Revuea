import api from "./api";

export const loginUser = async (credentials) => {
  const response = await api.post("/auth/login", credentials);
  return response.data.data;
};

export const signupUser = async (userData) => {
  const response = await api.post("/auth/signup", userData);
  return response.data.data;
};

export const verifyOtp = async (payload) => {
  const response = await api.post("/auth/verify", payload);
  return response.data.data;
};