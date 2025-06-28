import api from "./api";

export const loginUser = async (credentials) => {
  const response = await axios.post("/api/auth/login", credentials);
  return response.data.data;
};

export const signupUser = async (userData) => {
  const response = await axios.post("/api/auth/signup", userData);
  return response.data.data;
};

export const verifyOtp = async (payload) => {
  const response = await axios.post("/api/auth/verify", payload);
  return response.data.data;
};