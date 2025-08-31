
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

const API_URL = import.meta.env.VITE_API_URL ?? "https://localhost:5001";
const TOKEN_KEY = "auth_token";
const CSRF_TOKEN_KEY = "csrf_token";

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getCsrfToken() {
  return localStorage.getItem(CSRF_TOKEN_KEY);
}

async function fetchCsrfToken(): Promise<string> {
  const res = await fetch(`${API_URL}/api/auth/csrf-token`, {
    credentials: "include",
  });
  const data = await res.json();
  const token = data.token ?? "";
  if (token) localStorage.setItem(CSRF_TOKEN_KEY, token);
  return token;
}

/**
 * Generic helper for performing authenticated API requests.
 * Provides basic network error handling and JSON parsing.
 */
async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = getToken();
  const csrf = getCsrfToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  if (csrf) headers["X-CSRF-TOKEN"] = csrf;
  try {
   // Attempt to parse the response body as JSON.
   // If the body is empty or not valid JSON, .catch() prevents a crash and returns an empty object.
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

// Login
async function login(p: LoginPayload): Promise<LoginResult> {
  await fetchCsrfToken();
  const data = await apiRequest<LoginResult>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(p),
  });
  return { token: data.token };
}

// Login with Google
async function loginWithGoogle(credential: string): Promise<LoginResult> {
  await fetchCsrfToken();
  const data = await apiRequest<LoginResult>("/api/auth/login/google", {
    method: "POST",
    body: JSON.stringify({ idToken: credential }),
  });
  return { token: data.token };
}

// Register a new account
async function register(p: RegisterPayload): Promise<number> {
  await fetchCsrfToken();
  const data = await apiRequest<{ id: number }>("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(p),
  });
  return data.id;
}
// Save token in localStorage when login
function saveToken(t: string) {
  localStorage.setItem(TOKEN_KEY, t);
}
// Delete token from localStorage when logout.
function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

// Group all authentication functions into a single 'auth' service object 
// for easy importing and use throughout the application.
export const auth = {
  login,
  loginWithGoogle,
  register,
  saveToken,
  logout: clearToken,
  getToken,
  fetchCsrfToken,
  getCsrfToken,
};