import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, Lock, User } from "lucide-react";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import styles from "../styles/pages/auth/loginPage.module.scss";
import { auth } from "../services/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { token } = await auth.login({ username: email, password });
      auth.saveToken(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (credential: string | undefined) => {
    if (!credential) return;
    try {
      const { token } = await auth.loginWithGoogle(credential);
      auth.saveToken(token);
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    }
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
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
              <p className={styles.loginPage__subtitle}>Please sign in to your account to continue</p>
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
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
              <label className={styles.loginPage__rememberMe}>
                <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                <span>Remember Me</span>
              </label>
              {error && <div className={styles.loginPage__error}>{error}</div>}

              <button type="submit" className={styles.loginPage__submitButton} disabled={loading}>
                {loading ? (
                  <>
                    <div className={styles.loginPage__spinner}></div>
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </button>

              <div className={styles.loginPage__divider}>
                <span>or</span>
              </div>

              <div className={styles.loginPage__oauth}>
                <GoogleLogin
                  onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
                  onError={() => setError("Google login failed")}
                />
              </div>
              
              <div className={styles.loginPage__footer}>
                <a href="#" className={styles.loginPage__link}>
                  Forgot your password?
                </a>
              </div>
            </form>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
