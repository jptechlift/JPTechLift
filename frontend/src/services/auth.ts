
export interface LoginPayload {
  username: string;
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

function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

function getCookie(name: string): string | null {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for(let i=0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0)==' ') c = c.substring(1,c.length);
    if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
  }
  return null;
}

async function fetchCsrfToken(): Promise<void> {
    const res = await fetch(`${API_URL}/api/auth/csrf-token`, {
        credentials: "include",
    });
     if (!res.ok) {
        console.error("Failed to fetch CSRF token, status:", res.status);
        return; // Dừng lại nếu thất bại
    }

    // ĐỌC TOKEN TỪ HEADER, KHÔNG PHẢI TỪ COOKIE
    const csrfToken = res.headers.get("X-CSRF-TOKEN-FROM-SERVER");

    console.log("[DEBUG] CSRF Token received from server header:", csrfToken);

    if (csrfToken) {
        // Chúng ta vẫn có thể dùng hàm getCookie/setCookie để lưu nó tạm thời
        // hoặc dùng một biến toàn cục. Ở đây ta sẽ dùng một hàm set đơn giản.
        // NOTE: Đây là hàm setCookie đơn giản, không phải getCookie
        document.cookie = `XSRF-TOKEN=${csrfToken};path=/;samesite=lax`;
    }
}

async function apiRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const jwtToken = getToken();
  const csrfToken = getCookie("XSRF-TOKEN");
  console.log("[DEBUG] Value of XSRF-TOKEN cookie read for request:", csrfToken);

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  
  if (jwtToken) headers["Authorization"] = `Bearer ${jwtToken}`;
  if (csrfToken) headers["X-CSRF-TOKEN"] = csrfToken;
  
  const res = await fetch(`${API_URL}${path}`, { ...options, headers, credentials: "include" });
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error(`[DEBUG] Error response body from ${path}:`, errorText);
    throw new Error(`Request to ${path} failed with status ${res.status}`);
  }
  
  // Tránh lỗi nếu body trống
  const text = await res.text();
  return text ? JSON.parse(text) : ({} as T);
}

// Login
async function login(p: LoginPayload): Promise<LoginResult> {
  // Bước 1: Lấy CSRF token TRƯỚC TIÊN.
  // Hàm này đã lưu token vào localStorage.
  //await fetchCsrfToken();

  // Bước 2: THỰC HIỆN YÊU CẦU LOGIN.
  // Hàm apiRequest sẽ tự động đọc token từ localStorage và thêm vào header.
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
};