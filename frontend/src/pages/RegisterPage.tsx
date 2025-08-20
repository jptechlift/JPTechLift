import { useState } from "react";
import styles from "../styles/pages/auth/registerPage.module.scss";
import { useNavigate } from "react-router-dom";
import { auth, RegisterPayload } from "../services/auth";

export default function RegisterPage() {
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    avatar: "",
    role: "",
    isActive: true,
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
 const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const id = await auth.register(form);
      alert(`Registered with ID ${id}`);
      navigate("/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.register}>
      <div className={styles.register__container}>
        <div className={styles.register__accent}></div>
        
        <div className={styles.register__header}>
          <h1 className={styles.register__title}>Create Account</h1>
          <div className={styles.register__underline}></div>
        </div>

        <form onSubmit={handleSubmit} className={styles.register__form}>
          {/* Essential Fields */}
          <div className={styles.register__section}>
            <div className={styles.register__field}>
              <label 
                htmlFor="username" 
                className={styles.register__label}
              >
                Username
              </label>
              <input
                id="username"
                name="username"
                type="text"
                className={styles.register__input}
                value={form.username}
                onChange={handleChange}
                placeholder="Enter your username"
                required
              />
            </div>

            <div className={styles.register__field}>
              <label 
                htmlFor="email" 
                className={styles.register__label}
              >
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={styles.register__input}
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
              />
            </div>

            <div className={styles.register__field}>
              <label 
                htmlFor="password" 
                className={styles.register__label}
              >
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                className={styles.register__input}
                value={form.password}
                onChange={handleChange}
                placeholder="Create a strong password"
                required
              />
            </div>
          </div>

          {/* Optional Fields Divider */}
          <div className={styles.register__divider}>
            <div className={styles.register__divider_line}></div>
            <div className={styles.register__divider_text}>
              <span>Optional Information</span>
            </div>
          </div>

          {/* Optional Fields */}
          <div className={styles.register__optional}>
            <div className={styles.register__row}>
              <div className={styles.register__field_compact}>
                <label 
                  htmlFor="phoneNumber" 
                  className={styles.register__label_compact}
                >
                  Phone
                </label>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  className={styles.register__input_compact}
                  value={form.phoneNumber || ""}
                  onChange={handleChange}
                  placeholder="Phone number"
                />
              </div>

              <div className={styles.register__field_compact}>
                <label 
                  htmlFor="role" 
                  className={styles.register__label_compact}
                >
                  Role
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  className={styles.register__input_compact}
                  value={form.role || ""}
                  onChange={handleChange}
                  placeholder="Your role"
                />
              </div>
            </div>

            <div className={styles.register__field_compact}>
              <label 
                htmlFor="avatar" 
                className={styles.register__label_compact}
              >
                Avatar URL
              </label>
              <input
                id="avatar"
                name="avatar"
                type="url"
                className={styles.register__input_compact}
                value={form.avatar || ""}
                onChange={handleChange}
                placeholder="https://example.com/avatar.jpg"
              />
            </div>
          </div>

          {/* Account Status */}
          <div className={styles.register__checkbox_container}>
            <label className={styles.register__checkbox}>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive ?? false}
                onChange={handleChange}
                className={styles.register__checkbox_input}
              />
              <span className={styles.register__checkbox_text}>
                Activate account immediately
              </span>
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className={styles.register__error}>
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button 
            type="submit" 
            className={`${styles.register__button} ${loading ? styles.register__button_loading : ''}`}
            disabled={loading}
          >
            <span className={styles.register__button_text}>
              Create Account
            </span>
            
            {loading && (
              <div className={styles.register__button_spinner}>
                <div className={styles.register__spinner}></div>
              </div>
            )}

            <div className={styles.register__button_shine}></div>
          </button>
        </form>

        {/* Footer */}
        <div className={styles.register__footer}>
          <a 
            href="/login" 
            className={styles.register__link}
          >
            Already have an account? Sign in
            <span className={styles.register__link_underline}></span>
          </a>
        </div>
      </div>
    </div>
  );
}