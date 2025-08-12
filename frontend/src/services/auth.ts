export interface LoginPayload {
  username: string;
  password: string;
}

export interface LoginResult {
  token: string;
}

const API_URL = "http://localhost:5000/api/login";

export const auth = {
  async login(p: LoginPayload): Promise<LoginResult> {
    const res = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(p),
    });

    const data = await res.json().catch(() => ({}));
    if (res.ok && data.token) {
      return { token: data.token };
    }
    throw new Error(data.message || "Invalid credentials");
  },
  saveToken: (t: string) => localStorage.setItem("auth_token", t),
  clearToken: () => localStorage.removeItem("auth_token"),
  getToken: () => localStorage.getItem("auth_token"),
};
