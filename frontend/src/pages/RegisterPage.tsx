import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, RegisterPayload } from "../services/auth";
import styles from "../styles/pages/auth/registerPage.module.scss";

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
    <div className={styles.registerPage}>
      <div className={styles.registerPage__container}>
        <h1 className={styles.registerPage__title}>Create Account</h1>
        <form onSubmit={handleSubmit} className={styles.registerPage__form}>
          <div className={styles.registerPage__field}>
            <label htmlFor="username" className={styles.registerPage__label}>
              Username
            </label>
            <input
              id="username"
              name="username"
              type="text"
              className={styles.registerPage__input}
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.registerPage__field}>
            <label htmlFor="email" className={styles.registerPage__label}>
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className={styles.registerPage__input}
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.registerPage__field}>
            <label htmlFor="password" className={styles.registerPage__label}>
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              className={styles.registerPage__input}
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>
          <div className={styles.registerPage__field}>
            <label htmlFor="phoneNumber" className={styles.registerPage__label}>
              Phone Number
            </label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="tel"
              className={styles.registerPage__input}
              value={form.phoneNumber || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.registerPage__field}>
            <label htmlFor="avatar" className={styles.registerPage__label}>
              Avatar URL
            </label>
            <input
              id="avatar"
              name="avatar"
              type="text"
              className={styles.registerPage__input}
              value={form.avatar || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.registerPage__field}>
            <label htmlFor="role" className={styles.registerPage__label}>
              Role
            </label>
            <input
              id="role"
              name="role"
              type="text"
              className={styles.registerPage__input}
              value={form.role || ""}
              onChange={handleChange}
            />
          </div>
          <div className={styles.registerPage__fieldCheckbox}>
            <label className={styles.registerPage__checkboxLabel}>
              <input
                type="checkbox"
                name="isActive"
                checked={form.isActive ?? false}
                onChange={handleChange}
              />
              Active
            </label>
          </div>
          {error && <div className={styles.registerPage__error}>{error}</div>}
          <button type="submit" className={styles.registerPage__submitButton} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <div className={styles.registerPage__footer}>
          <a href="/login" className={styles.registerPage__link}>
            Already have an account? Sign in
          </a>
        </div>
      </div>
    </div>
  );
}
