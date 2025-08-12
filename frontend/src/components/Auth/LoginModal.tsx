import { useState } from "react";
import { auth } from "../../services/auth";
import styles from "../../styles/pages/auth/LoginPage.module.scss";

interface Props {
  onClose: () => void;
}

export default function LoginModal({ onClose }: Props) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setResult("");
    setError("");
    setLoading(true);
    try {
      const { message } = await auth.login({ username, password });
      setResult(message);
    } catch (ex: unknown) {
      setError(ex instanceof Error ? ex.message : "Invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  const overlay: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "rgba(0,0,0,0.5)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 1000,
  };

  const box: React.CSSProperties = {
    background: "#fff",
    padding: "20px",
    maxWidth: "400px",
    width: "100%",
  };

  return (
    <div style={overlay}>
      <div style={box}>
        <button onClick={onClose} style={{ float: "right" }}>
          ×
        </button>
        <form onSubmit={onSubmit} className={styles.login__form}>
          <div className={styles.login__field}>
            <label htmlFor="username" className={styles.login__label}>
              Username
            </label>
            <input
              id="username"
              className={styles.login__input}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div className={styles.login__field}>
            <label htmlFor="password" className={styles.login__label}>
              Password
            </label>
            <input
              id="password"
              type="password"
              className={styles.login__input}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          {result && <p className={styles.login__success}>{result}</p>}
          {error && <p className={styles.login__error}>{error}</p>}
          <button
            className={styles.login__btn}
            type="submit"
            disabled={loading}
          >
            {loading ? "Loading..." : "Login"}
          </button>
        </form>
      </div>
    </div>
  );
}