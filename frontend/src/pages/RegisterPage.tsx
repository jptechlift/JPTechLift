import { useState } from "react"; //A core React Hook that allows functional components to hold and manage state. When the state is updated, React automatically re-renders the component's UI.
import styles from "../styles/pages/auth/registerPage.module.scss";
// 'auth': An object containing functions to interact with the authentication API.
// 'RegisterPayload': A TypeScript type that defines the data structure for the registration request.
import { auth, RegisterPayload } from "../services/auth";
import { ROLES } from "../constants/roles";

export default function RegisterPage() {
  // 'form': State object to store user input from the registration form.
  // 'setForm': Function to update the 'form' state.
  // '<RegisterPayload>': Provides a specific type for the state, ensuring type safety.
  const [form, setForm] = useState<RegisterPayload>({
    username: "",
    password: "",
    email: "",
    phoneNumber: "",
    avatar: "",
    role: ROLES.USER,
    isActive: true,
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");

  // 'e': The event object, which contains details about the change event.
  // Updates the form state based on the input's 'name' attribute.
  // Using an updater function `(f) => ({...})` ensures we always have the latest state, preventing race conditions.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setForm((f) => ({ ...f, [name]: type === "checkbox" ? checked : value }));
  };

  // Declared as an async function to handle the API call for registration.
  const handleSubmit = async (e: React.FormEvent) => {
    // Prevents the default browser behavior of reloading the page on form submission.
    e.preventDefault();
    setError("");
    if (!Object.values(ROLES).includes(form.role!)) {
      setError("Invalid role");
      return;
    }
    setLoading(true);
    try {
      await auth.register(form);
      setNotice(
        "Registration successful. Check your email for a verification link."
      );
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
          <p className={styles.register__info}>
            A verification email will be sent. You must verify before logging
            in.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.register__form}>
          {/* Essential Fields */}
          <div className={styles.register__section}>
            <div className={styles.register__field}>
              <label htmlFor="username" className={styles.register__label}>
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
              <label htmlFor="email" className={styles.register__label}>
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
              <label htmlFor="password" className={styles.register__label}>
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
              <small className={styles.register__hint}>
                At least 8 characters including upper, lower, digit, and
                special.
              </small>
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
  <select
                  id="role"
                  name="role"
                  className={styles.register__input_compact}
                  value={form.role || ROLES.USER}
                  onChange={handleChange}
                >
                  <option value={ROLES.USER}>User</option>
                  <option value={ROLES.AUTHOR}>Author</option>
                </select>
              </div>
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
          {error && <div className={styles.register__error}>{error}</div>}

          {/* Submit Button */}
          <button
            type="submit"
            className={`${styles.register__button} ${
              loading ? styles.register__button_loading : ""
            }`}
            disabled={loading}
          >
            <span className={styles.register__button_text}>Create Account</span>

            {loading && (
              <div className={styles.register__button_spinner}>
                <div className={styles.register__spinner}></div>
              </div>
            )}

            <div className={styles.register__button_shine}></div>
          </button>
        </form>
        {notice && (
          <div className={styles.register__notice}>
            {notice}
            <button
              type="button"
              onClick={() => auth.resendVerification(form.email)}
              className={styles.register__resend}
            >
              Resend
            </button>
          </div>
        )}
        {/* Footer */}
        <div className={styles.register__footer}>
          <a href="/login" className={styles.register__link}>
            Already have an account? Sign in
            <span className={styles.register__link_underline}></span>
          </a>
        </div>
      </div>
    </div>
  );
}
