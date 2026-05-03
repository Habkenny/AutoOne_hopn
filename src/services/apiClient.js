const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:4000";
const TOKEN_KEY = "autoone.accessToken";

export function getAccessToken() {
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setAccessToken(token) {
  if (token) {
    window.localStorage.setItem(TOKEN_KEY, token);
  } else {
    window.localStorage.removeItem(TOKEN_KEY);
  }
}

export async function apiRequest(path, options = {}) {
  const response = await sendRequest(path, options);

  if (response.status === 401 && path !== "/auth/refresh") {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      return parseResponse(await sendRequest(path, options));
    }
  }

  return parseResponse(response);
}

async function sendRequest(path, options = {}) {
  const token = getAccessToken();
  const headers = new Headers(options.headers);
  const isFormData = options.body instanceof FormData;

  if (!isFormData && options.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
    credentials: "include",
  });
}

async function parseResponse(response) {
  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({}));
    throw new Error(errorBody.message ?? "AutoOne API request failed.");
  }

  if (response.status === 204) return null;
  return response.json();
}

async function refreshAccessToken() {
  try {
    const response = await sendRequest("/auth/refresh", { method: "POST" });
    if (!response.ok) {
      setAccessToken(null);
      return false;
    }
    const result = await response.json();
    setAccessToken(result.accessToken);
    return true;
  } catch {
    setAccessToken(null);
    return false;
  }
}

export function toQueryString(params) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "" && value !== false) {
      query.set(key, String(value));
    }
  });
  const value = query.toString();
  return value ? `?${value}` : "";
}
