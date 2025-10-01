// Tiny auth helper using localStorage.

const KEY = "shui_token";
const NAME = "shui_username";

export function setAuth(token, username) {
  localStorage.setItem(KEY, token);
  localStorage.setItem(NAME, username);
}

export function clearAuth() {
  localStorage.removeItem(KEY);
  localStorage.removeItem(NAME);
}

export function getToken() {
  return localStorage.getItem(KEY) || "";
}

export function getUsername() {
  return localStorage.getItem(NAME) || "";
}

export function isLoggedIn() {
  return !!getToken();
}
