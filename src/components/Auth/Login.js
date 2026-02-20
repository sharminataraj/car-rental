import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import { Logo } from "../Logo/Logo";
import "./Auth.css";

const Login = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Simple validation (in real app, this would be API call)
      if (email && password) {
        const user = {
          id: 1,
          email,
          name: "Admin User",
          role: "admin"
        };
        
        // Save user to localStorage
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");
        
        toast.success("Login successful!");
        setTimeout(() => onLogin(user), 1000);
      } else {
        toast.error("Please enter both email and password");
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />

      <div className="auth-card">
        <div className="auth-header">
          <div className="logo">
            <Logo size="large" showName={true} />
          </div>
          <p className="subtitle">Sign in to manage your car rental business</p>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="email">Email Address</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@injeerental.com"
              required
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="form-input"
            />
          </div>

          <div className="form-options">
            <div className="remember-me">
              <input type="checkbox" id="remember" />
              <label htmlFor="remember">Remember me</label>
            </div>
            <a href="#" className="forgot-password">Forgot password?</a>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="auth-button"
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <div className="auth-footer">
          <p>
            Demo credentials:
            <br />
            <span className="demo-credential">Email: admin@injeerental.com</span>
            <br />
            <span className="demo-credential">Password: admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
