export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = "auth_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function request(path: string, options: RequestInit = {}) {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data;
}

async function login(p: LoginPayload): Promise<LoginResult> {
  const data = await request("/login", {
    method: "POST",
    body: JSON.stringify(p),
  });
  return { token: data.token };
}

async function loginWithGoogle(credential: string): Promise<LoginResult> {
  const data = await request("/login/google", {
    method: "POST",
    body: JSON.stringify({ idToken: credential }),
  });
  return { token: data.token };
}

function saveToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}

function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export const auth = {
  login,
  loginWithGoogle,
  saveToken,
  logout: clearToken,
  getToken,
};