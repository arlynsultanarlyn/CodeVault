import React, { useEffect, useState } from "react";
import { useIonRouter } from "@ionic/react";
import { registerUser } from "../services/api";

const Register: React.FC = () => {
  const router = useIonRouter();

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    password: "",
    confirm_password: "",
    role: "student",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("user")) router.push("/dashboard", "root");
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (form.password !== form.confirm_password) {
      setError("Passwords do not match.");
      return;
    }
    if (form.password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await registerUser({
        full_name: form.full_name,
        email: form.email,
        password: form.password,
        role: form.role,
      });
      if (res.status === "success") {
        setSuccess("Account created! Redirecting to login…");
        setTimeout(() => router.push("/login", "root"), 1500);
      } else {
        setError(res.message || "Registration failed. Please try again.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <link
        rel="stylesheet"
        href="/assets/vendors/mdi/css/materialdesignicons.min.css"
      />
      <link rel="stylesheet" href="/assets/css/style.css" />

      <style>{`
        html, body { height: 100%; margin: 0; background: #f0f4ff; }
        .auth-wrapper {
          min-height: 100vh; display: flex;
          align-items: center; justify-content: center; background: #f0f4ff;
        }
        .auth-card {
          background: #fff; border-radius: 16px;
          box-shadow: 0 8px 40px rgba(101,113,255,0.10);
          width: 100%; max-width: 420px; padding: 48px 40px 36px;
        }
        .auth-brand { display: flex; align-items: center; gap: 8px; margin-bottom: 32px; }
        .auth-brand span { font-size: 1.25rem; font-weight: 700; color: #504B8E; letter-spacing: .3px; }
        .auth-card h4 { font-size: 1.35rem; font-weight: 700; color: #1a1a2e; margin-bottom: 4px; }
        .auth-card .subtitle { color: #9da5c9; font-size: 0.875rem; margin-bottom: 28px; }
        .auth-form-label {
          font-size: 0.8rem; font-weight: 600; color: #6c757d;
          text-transform: uppercase; letter-spacing: .5px;
          margin-bottom: 6px; display: block;
        }
        .auth-input {
          width: 100%; border: 1.5px solid #e3e6f0; border-radius: 8px;
          padding: 10px 14px; font-size: 0.9rem; color: #333;
          background: #f8f9ff; transition: border-color .2s, box-shadow .2s;
          outline: none; box-sizing: border-box;
        }
        .auth-input:focus {
          border-color: #6571ff; box-shadow: 0 0 0 3px rgba(101,113,255,0.12); background: #fff;
        }
        .auth-input::placeholder { color: #c0c6e4; }
        .btn-register {
          width: 100%; padding: 12px;
          background: linear-gradient(135deg, #6571ff, #504B8E);
          border: none; border-radius: 8px; color: #fff;
          font-size: 0.95rem; font-weight: 600; letter-spacing: .3px;
          cursor: pointer; margin-top: 8px; transition: opacity .2s, transform .1s;
        }
        .btn-register:hover { opacity: 0.92; transform: translateY(-1px); }
        .btn-register:active { transform: translateY(0); }
        .btn-register:disabled { opacity: 0.7; cursor: not-allowed; transform: none; }
        .auth-alert-danger {
          background: #fff0f0; border: 1px solid #ffd0d0; color: #d9534f;
          border-radius: 8px; font-size: 0.85rem; padding: 10px 14px; margin-bottom: 16px;
        }
        .auth-alert-success {
          background: #f0fff4; border: 1px solid #b7ebc8; color: #2e7d4f;
          border-radius: 8px; font-size: 0.85rem; padding: 10px 14px; margin-bottom: 16px;
        }
        .role-selector { display: flex; gap: 12px; }
        .role-option {
          flex: 1; display: flex; align-items: center; justify-content: center;
          gap: 8px; padding: 10px 14px; border: 1.5px solid #e3e6f0;
          border-radius: 8px; background: #f8f9ff; cursor: pointer;
          font-size: 0.88rem; font-weight: 600; color: #6c757d;
          transition: border-color .2s, background .2s, color .2s, box-shadow .2s;
          user-select: none;
        }
        .role-option:hover { border-color: #6571ff; background: #f0f2ff; color: #504B8E; }
        .role-option.selected {
          border-color: #6571ff;
          background: linear-gradient(135deg, rgba(101,113,255,0.08), rgba(80,75,142,0.08));
          color: #504B8E; box-shadow: 0 0 0 3px rgba(101,113,255,0.12);
        }
        .login-link { text-align: center; margin-top: 20px; font-size: 0.85rem; color: #9da5c9; }
        .login-link button {
          color: #6571ff; font-weight: 600; background: none;
          border: none; cursor: pointer; padding: 0; font-size: 0.85rem;
        }
        .login-link button:hover { text-decoration: underline; }
      `}</style>

      <div className="auth-wrapper">
        <div className="auth-card">
          {/* Brand */}
          <div className="auth-brand">
            <svg
              width="32"
              height="32"
              viewBox="0 0 107 73"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle cx="53.5" cy="36.5" r="36.5" fill="#D8E3FF" />
              <path
                d="M3.43651 12.0425C5.63232 12.2316 7.87829 12.7788 9.92735 14.1728C10.4109 14.576 10.9525 14.8862 11.3964 15.3781C11.8405 15.8591 12.3298 16.332 12.7064 16.8622C13.0606 17.3289 13.4047 17.7933 13.7386 18.2771C19.212 18.6508 24.6736 19.3881 30.0833 20.6322C33.8508 21.4791 37.5741 22.6347 41.2594 24.0012C44.4983 25.2983 47.7186 26.8565 50.7235 29.0196C41.603 19.039 31.7885 15.4665 27.1317 13.8558C16.9991 10.3487 7.94427 10.7712 1.39374 12.0144C2.06847 11.9888 2.75431 12.0048 3.43651 12.0425Z"
                fill="#504B8E"
              />
              <path
                d="M29.6337 23.8305C25.952 22.9304 22.2231 22.3062 18.4881 21.7691C17.5835 21.6347 16.679 21.5003 15.7789 21.4008C16.8632 23.1541 17.881 25.0088 18.8113 26.9191C18.9996 27.3051 19.1861 27.7041 19.3743 28.101C24.2552 28.4621 29.1319 29.1347 33.9746 30.2077L36.7441 30.9255L38.1262 31.2952L39.4955 31.7388L42.2324 32.6369C43.1424 32.9849 44.0405 33.3501 44.945 33.7285C48.5316 35.2352 52.0678 37.1267 55.3103 39.7375C57.9671 41.8501 60.4786 44.453 62.4359 47.6648C61.3012 44.9632 59.9406 42.1865 58.3161 39.415C56.192 36.434 53.6627 34.0269 50.9281 32.1159C47.6803 29.8819 44.1793 28.2239 40.5843 26.9698C36.9891 25.7288 33.3354 24.6134 29.6337 23.8305Z"
                fill="#504B8E"
              />
              <path
                d="M54.3269 41.9417C51.1357 39.7237 47.7379 37.9604 44.2168 36.6725L41.5898 35.6714L38.9171 34.8352L37.5757 34.4224L36.2216 34.0836L33.5217 33.406C29.894 32.5894 26.2426 31.9097 22.5698 31.4562C21.9652 31.3629 21.3587 31.2783 20.7504 31.2068C21.1777 32.1843 21.6035 33.0266 22.1355 33.7899C23.4403 35.6508 25.1018 37.0657 26.9724 37.9627C27.9042 38.4265 28.8713 38.7448 29.8922 39.0354L33.0483 39.9197L45.6553 43.6285L51.9336 45.5534C54.1242 46.3634 56.1813 47.6595 58.0231 49.3143C61.5847 52.5155 64.3584 56.8168 66.612 61.4247C65.7823 57.5422 64.462 53.8882 62.6337 50.7675C60.4634 47.0169 57.4857 44.2049 54.3269 41.9417Z"
                fill="#504B8E"
              />
            </svg>
            <span>CodeVault</span>
          </div>

          <h4>Create your account</h4>
          <p className="subtitle">Register to get started.</p>

          {error && (
            <div className="auth-alert-danger">
              <i className="mdi mdi-alert-circle me-1"></i>
              {error}
            </div>
          )}
          {success && (
            <div className="auth-alert-success">
              <i className="mdi mdi-check-circle me-1"></i>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="auth-form-label">Full Name</label>
              <input
                type="text"
                name="full_name"
                className="auth-input"
                placeholder="Enter your full name"
                value={form.full_name}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            <div className="mb-3">
              <label className="auth-form-label">Email</label>
              <input
                type="email"
                name="email"
                className="auth-input"
                placeholder="Enter your email"
                value={form.email}
                onChange={handleChange}
                required
                autoComplete="off"
              />
            </div>

            <div className="mb-3">
              <label className="auth-form-label">Password</label>
              <input
                type="password"
                name="password"
                className="auth-input"
                placeholder="Minimum 6 characters"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-form-label">Confirm Password</label>
              <input
                type="password"
                name="confirm_password"
                className="auth-input"
                placeholder="Re-enter your password"
                value={form.confirm_password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="auth-form-label">Role</label>
              <div className="role-selector">
                {(["student", "teacher"] as const).map((r) => (
                  <label
                    key={r}
                    className={`role-option${form.role === r ? " selected" : ""}`}
                    onClick={() => setForm((p) => ({ ...p, role: r }))}
                  >
                    {/* <span className="role-icon">
                      {r === "student" ? "🎓" : "📚"}
                    </span> */}
                    <span>{r.charAt(0).toUpperCase() + r.slice(1)}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="btn-register"
              disabled={submitting}
            >
              {submitting ? "CREATING ACCOUNT…" : "CREATE ACCOUNT"}
            </button>
          </form>

          <div className="login-link">
            Already have an account?{" "}
            <button onClick={() => router.push("/login", "root")}>
              Sign in here
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
