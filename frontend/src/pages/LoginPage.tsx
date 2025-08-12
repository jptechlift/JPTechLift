import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import styles from "../styles/pages/auth/loginPage.module.scss";

// Mock auth service - replace with your actual auth service
const auth = {
  login: async ({ username, password }: { username: string; password: string }) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    if (username === "admin" && password === "1") {
      return { token: "mock-jwt-token-12345" };
    }
    throw new Error("Invalid credentials");
  },
  saveToken: (token: string) => {
    localStorage.setItem('authToken', token);
  }
};

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const { token } = await auth.login({ username, password });
      auth.saveToken(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginPage}>
      <div className={styles.loginPage__background}>
        <div className={styles.loginPage__backgroundShape}></div>
        <div className={styles.loginPage__backgroundShape}></div>
      </div>
      
      <div className={styles.loginPage__container}>
        <div className={styles.loginPage__card}>
          <div className={styles.loginPage__header}>
            <div className={styles.loginPage__logo}>
              <div className={styles.loginPage__logoIcon}>
                <Lock size={32} />
              </div>
            </div>
            <h1 className={styles.loginPage__title}>Welcome Back</h1>
            <p className={styles.loginPage__subtitle}>
              Please sign in to your account to continue
            </p>
          </div>

          <form onSubmit={handleSubmit} className={styles.loginPage__form}>
            <div className={styles.loginPage__field}>
              <label htmlFor="username" className={styles.loginPage__label}>
                Username
              </label>
              <div className={styles.loginPage__inputWrapper}>
                <User className={styles.loginPage__inputIcon} size={20} />
                <input
                  id="username"
                  type="text"
                  className={styles.loginPage__input}
                  placeholder="Enter your username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className={styles.loginPage__field}>
              <label htmlFor="password" className={styles.loginPage__label}>
                Password
              </label>
              <div className={styles.loginPage__inputWrapper}>
                <Lock className={styles.loginPage__inputIcon} size={20} />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  className={styles.loginPage__input}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button
                  type="button"
                  className={styles.loginPage__togglePassword}
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            {error && (
              <div className={styles.loginPage__error}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className={styles.loginPage__submitButton}
              disabled={loading}
            >
              {loading ? (
                <>
                  <div className={styles.loginPage__spinner}></div>
                  Signing in...
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <div className={styles.loginPage__footer}>
              <a href="#" className={styles.loginPage__link}>
                Forgot your password?
              </a>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}