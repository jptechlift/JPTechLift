export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  message: string;
}

const API_URL = "http://localhost:5000/api/login";

export const auth = {
  async login(p: LoginPayload): Promise<LoginResult> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });

    const text = await res.text();
    if (res.ok) {
      return { message: text };
    }
    throw new Error(text || "Invalid credentials");
  },
  saveToken: (t: string) => localStorage.setItem("auth_token", t),
  clearToken: () => localStorage.removeItem("auth_token"),
  getToken: () => localStorage.getItem("auth_token"),
};