export interface LoginPayload { email: string; password: string; remember?: boolean; }
export interface LoginResult { token: string; user: { email: string }; }

export const authMock = {
  // Giả lập gọi API có độ trễ
  login: (p: LoginPayload) =>
    new Promise<LoginResult>((resolve, reject) => {
      setTimeout(() => {
        const ok = /\S+@\S+\.\S+/.test(p.email) && (p.password?.length ?? 0) >= 6;
        if (ok) {
          resolve({ token: "mock-token", user: { email: p.email } });
        } else {
          reject(new Error("Email hoặc mật khẩu không đúng."));
        }
      }, 800);
    }),
  saveToken: (t: string) => localStorage.setItem("auth_token", t),
  clearToken: () => localStorage.removeItem("auth_token"),
  getToken: () => localStorage.getItem("auth_token"),
};
