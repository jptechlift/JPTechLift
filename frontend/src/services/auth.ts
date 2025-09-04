export interface LoginPayload {
  email: string;
  password: string;
  captchaToken?: string | null;
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
let csrfRequestToken: string | null = null;
let csrfRequestHeaderName: string | null = null;


function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

async function fetchCsrfToken(): Promise<void> {
  const res = await fetch(`${API_URL}/api/antiforgery/token`, {
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Failed to fetch antiforgery token");
  }
  const data = (await res.json()) as { headerName: string; requestToken: string };
  csrfRequestHeaderName = data.headerName;
  csrfRequestToken = data.requestToken;
  if (import.meta.env.MODE === "development") {
    console.debug("Antiforgery token received");
  }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const jwtToken = getToken();

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;
  if (csrfRequestToken && csrfRequestHeaderName)
    headers[csrfRequestHeaderName] = csrfRequestToken;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });

  if (!res.ok) {
    const text = await res.text();
    try {
      const json = text ? JSON.parse(text) : {};
      throw new Error(json.message || `Request to ${path} failed with status ${res.status}`);
    } catch {
      throw new Error(`Request to ${path} failed with status ${res.status}`);
    }
  }

  const body = await res.text();
  return body ? JSON.parse(body) : ({} as T);
}

// Login
async function login(p: LoginPayload): Promise<LoginResult> {
  await fetchCsrfToken();
  if (!csrfRequestToken) {
    throw new Error("Missing CSRF token");
  }
  const data = await apiRequest<LoginResult>("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(p),
  });

  return { token: data.token };
}

// Login with Google
async function loginWithGoogle(credential: string): Promise<LoginResult> {
  //await fetchCsrfToken();
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

async function verifyEmail(token: string): Promise<void> {

  //apirequest will handle error.
  await apiRequest(`/api/auth/verify-email?token=${token}`, {
    method: 'POST',
  })
}

async function resendVerification(email: string): Promise<void> {
  await fetchCsrfToken();
  await apiRequest("/api/auth/resend-verification", {
    method: "POST",
    body: JSON.stringify({ email }),
  });
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
  verifyEmail,
  resendVerification,
};
