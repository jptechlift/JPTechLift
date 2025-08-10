import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authMock } from "../../services/authMock";
import styles from "../../styles/pages/auth/LoginPage.module.scss";

export default function LoginPage() {
  const nav = useNavigate();
  const [email, setEmail] = useState(""); // state email
  const [password, setPassword] = useState(""); // state mật khẩu
  const [remember, setRemember] = useState(true); // ghi nhớ
  const [showPwd, setShowPwd] = useState(false); // ẩn/hiện mật khẩu
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr("");
    setLoading(true);
    try {
      const { token } = await authMock.login({ email, password, remember });
      authMock.saveToken(token); // lưu token tạm
      nav("/"); // điều hướng về trang chủ
    } catch (ex: unknown) {
      const msg = ex instanceof Error ? ex.message : "Đăng nhập thất bại";
      setErr(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className={styles.login}>
      <h1 className={styles.login__title}>Đăng nhập</h1>

      <form className={styles.login__form} onSubmit={onSubmit}>
        {/* Email */}
        <div className={styles.login__field}>
          <label className={styles.login__label} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            className={styles.login__input}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />
        </div>

        {/* Mật khẩu + ẩn/hiện */}
        <div className={styles.login__field}>
          <label className={styles.login__label} htmlFor="password">
            Mật khẩu
          </label>
          <div className={styles.login__password}>
            <input
              id="password"
              required
              type={showPwd ? "text" : "password"}
              className={styles.login__input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
            />
            <button
              type="button"
              className={styles["login__btn--ghost"]}
              onClick={() => setShowPwd((s) => !s)}
              aria-label="Hiện/ẩn mật khẩu"
            >
              {showPwd ? "Ẩn" : "Hiện"}
            </button>
          </div>
        </div>

        {/* Remember me */}
        <label className={styles.login__remember}>
          <input
            type="checkbox"
            checked={remember}
            onChange={(e) => setRemember(e.target.checked)}
          />
          <span>Ghi nhớ đăng nhập</span>
        </label>

        {/* Thông báo lỗi */}
        {err && <p className={styles.login__error}>{err}</p>}

        {/* Submit */}
        <button
          className={styles.login__btn}
          type="submit"
          disabled={loading}
        >
          {loading ? "Đang xử lý..." : "Đăng nhập"}
        </button>
      </form>
    </section>
  );
}

