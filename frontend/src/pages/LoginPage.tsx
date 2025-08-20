import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Eye, EyeOff, Lock, User, ArrowRight } from "lucide-react";
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
        {/* Background Elements */}
        <div className={styles.loginPage__background}>
          <div className={styles.loginPage__backgroundShape}></div>
          <div className={styles.loginPage__backgroundShape}></div>
        </div>

        {/* Main Container */}
        <div className={styles.loginPage__container}>
          <div className={styles.loginPage__card}>
            {/* Header */}
            <div className={styles.loginPage__header}>
              <div className={styles.loginPage__logo}>
                <div className={styles.loginPage__logoIcon}>
                  <Lock size={24} />
                </div>
              </div>
              <h1 className={styles.loginPage__title}>Welcome Back</h1>
              <p className={styles.loginPage__subtitle}>Sign in to continue to your account</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className={styles.loginPage__form}>
              {/* Email Input */}
              <div className={styles.loginPage__field}>
                <label htmlFor="email" className={styles.loginPage__label}>
                  Email
                </label>
                <div className={styles.loginPage__inputWrapper}>
                  <User className={styles.loginPage__inputIcon} size={18} />
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

              {/* Password Input */}
              <div className={styles.loginPage__field}>
                <label htmlFor="password" className={styles.loginPage__label}>
                  Password
                </label>
                <div className={styles.loginPage__inputWrapper}>
                  <Lock className={styles.loginPage__inputIcon} size={18} />
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
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className={styles.loginPage__options}>
                <label className={styles.loginPage__rememberMe}>
                  <input type="checkbox" checked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)} />
                  <span>Remember me</span>
                </label>
                <a href="#" className={styles.loginPage__link}>
                  Forgot password?
                </a>
              </div>

              {/* Error Message */}
              {error && <div className={styles.loginPage__error}>{error}</div>}

              {/* Submit Button */}
              <button type="submit" className={styles.loginPage__submitButton} disabled={loading}>
                {loading ? (
                  <>
                    <div className={styles.loginPage__spinner}></div>
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {/* Divider */}
              <div className={styles.loginPage__divider}>
                <span>or continue with</span>
              </div>

              {/* Google OAuth */}
              <div className={styles.loginPage__oauth}>
                <GoogleLogin
                  onSuccess={(cred) => handleGoogleSuccess(cred.credential)}
                  onError={() => setError("Google login failed")}
                />
              </div>
            </form>

            {/* Footer */}
            <div className={styles.loginPage__footer}>
              <p>
                Don't have an account?{" "}
                <Link to="/register" className={styles.loginPage__link}>
                  Create account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </GoogleOAuthProvider>
  );
}
