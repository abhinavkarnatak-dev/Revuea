const TOKEN_KEY = "revuea_token";
const USER_KEY = "revuea_user";

export const setAuth = (token, user) => {
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getToken = () => localStorage.getItem(TOKEN_KEY);
export const getUser = () => JSON.parse(localStorage.getItem(USER_KEY));

export const clearAuth = () => {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
};