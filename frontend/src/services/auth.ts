export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

export interface RegisterPayload {
  username: string;
  password: string;
  email: string;
  phoneNumber?: string;
  avatar?: string;
  role?: string;
  isActive?: boolean;
}

const API_URL = import.meta.env.VITE_API_URL as string;
const TOKEN_KEY = "auth_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

/**
 * Generic helper for performing authenticated API requests.
 * Provides basic network error handling and JSON parsing.
 */
async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  try {
    const res = await fetch(`${API_URL}${path}`, { ...options, headers });
    const data = (await res.json().catch(() => ({}))) as T & { message?: string };
    if (!res.ok) {
      throw new Error(data.message || "Request failed");
    }
    return data;
  } catch (err) {
    throw err instanceof Error ? err : new Error("Network error");
  }
}

async function login(p: LoginPayload): Promise<LoginResult> {
  const data = await apiRequest<LoginResult>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(p),
  });
  return { token: data.token };
}

async function loginWithGoogle(credential: string): Promise<LoginResult> {
  const data = await apiRequest<LoginResult>("/api/auth/login/google", {
    method: "POST",
    body: JSON.stringify({ idToken: credential }),
  });
  return { token: data.token };
}

async function register(p: RegisterPayload): Promise<number> {
  const data = await apiRequest<{ id: number }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(p),
  });
  return data.id;
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
  register,
  saveToken,
  logout: clearToken,
  getToken,
};
