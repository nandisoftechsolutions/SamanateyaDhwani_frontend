import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginAdmin } from "../../services/api";

import "./Login.css";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] =
    useState(false);

  // ====================================================
  // HANDLE INPUT CHANGE
  // ====================================================

  const handleChange = (event) => {
    const {
      name,
      value,
    } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
  };

  // ====================================================
  // HANDLE LOGIN
  // ====================================================

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    // Validate email
    if (!formData.email.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ಇಮೇಲ್ ನಮೂದಿಸಿ."
      );
      return;
    }

    // Validate password
    if (!formData.password.trim()) {
      setError(
        "ದಯವಿಟ್ಟು ಪಾಸ್‌ವರ್ಡ್ ನಮೂದಿಸಿ."
      );
      return;
    }

    try {
      setLoading(true);

      // Call backend
      const response =
        await loginAdmin(
          formData.email,
          formData.password
        );

      console.log(
        "Admin login successful:",
        response.admin
      );

      // Navigate only after successful login
      navigate("/admin");
    } catch (error) {
      console.error(
        "Login error:",
        error
      );

      setError(
        error.message ||
          "Login failed. Please check your email and password."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="admin-login-page">

      <div className="admin-login-card">

        {/* ==================================================
            LOGO
        ================================================== */}

        <div className="admin-login-header">

          <div className="admin-login-logo">
            ಸ
          </div>

          <h1>
            ಸಮಾನತೆ ಧ್ವನಿ
          </h1>

          <p>
            Admin Panel
          </p>

        </div>

        {/* ==================================================
            ERROR
        ================================================== */}

        {error && (
          <div
            className="admin-login-error"
            role="alert"
          >
            {error}
          </div>
        )}

        {/* ==================================================
            LOGIN FORM
        ================================================== */}

        <form
          onSubmit={handleSubmit}
        >

          {/* Email */}

          <div className="admin-login-field">

            <label htmlFor="email">
              ಇಮೇಲ್
            </label>

            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={
                handleChange
              }
              placeholder="admin@example.com"
              autoComplete="email"
              disabled={loading}
            />

          </div>

          {/* Password */}

          <div className="admin-login-field">

            <label htmlFor="password">
              ಪಾಸ್‌ವರ್ಡ್
            </label>

            <div className="password-input-wrapper">

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                id="password"
                name="password"
                value={
                  formData.password
                }
                onChange={
                  handleChange
                }
                placeholder="ನಿಮ್ಮ ಪಾಸ್‌ವರ್ಡ್"
                autoComplete="current-password"
                disabled={loading}
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() =>
                  setShowPassword(
                    !showPassword
                  )
                }
                disabled={loading}
              >
                {showPassword
                  ? "ಮರೆಮಾಡಿ"
                  : "ತೋರಿಸಿ"}
              </button>

            </div>

          </div>

          {/* ==================================================
              LOGIN BUTTON
          ================================================== */}

          <button
            type="submit"
            className="admin-login-button"
            disabled={loading}
          >
            {loading
              ? "ಲಾಗಿನ್ ಆಗುತ್ತಿದೆ..."
              : "Login"}
          </button>

        </form>

        {/* ==================================================
            BACK TO WEBSITE
        ================================================== */}

        <Link
          to="/"
          className="back-to-website"
        >
          ← ವೆಬ್‌ಸೈಟ್‌ಗೆ ಹಿಂತಿರುಗಿ
        </Link>

      </div>

    </main>
  );
}

export default Login;