import { getToken } from "./auth.js";

const BASE_URL = import.meta.env.VITE_API_BASE || "http://localhost:3000";

async function getJSON(url, options) {
  try {
    const res = await fetch(url, options);
    const data = await res.json().catch(() => ({}));
    return data;
  } catch {
    return { ok: false, error: "network error" };
  }
}

function withAuth(init = {}) {
  const token = getToken();
  return {
    ...init,
    headers: {
      ...(init.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
  };
}

export const api = {
  getMessages(order = "newest") {
    return getJSON(`${BASE_URL}/messages?order=${encodeURIComponent(order)}`);
  },

  createMessage({ username, text }) {
    // attach token if we have one (backend will check match)
    return getJSON(
      `${BASE_URL}/messages`,
      withAuth({
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, text }),
      })
    );
  },

  updateMessage(id, { text }) {
    return getJSON(
      `${BASE_URL}/messages/${encodeURIComponent(id)}`,
      withAuth({
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      })
    );
  },

  deleteMessage(id) {
    return getJSON(
      `${BASE_URL}/messages/${encodeURIComponent(id)}`,
      withAuth({
        method: "DELETE",
      })
    );
  },

  getMessagesByUser(username, order = "newest") {
    return getJSON(
      `${BASE_URL}/users/${encodeURIComponent(
        username
      )}/messages?order=${encodeURIComponent(order)}`
    );
  },

  register({ username, password }) {
    return getJSON(`${BASE_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  },

  login({ username, password }) {
    return getJSON(`${BASE_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
  },
};
