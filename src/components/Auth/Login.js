import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
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
            <svg className="logo-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18.7 19.2c.2 0 .4-.1.5-.2.2-.2.3-.5.2-.7-.3-.6-.7-1.1-1.2-1.6L15 14.2V16c0 .3-.1.5-.3.7-.2.2-.5.3-.7.3H7c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7V8c0-.3.1-.5.3-.7.2-.2.5-.3.7-.3h7c.3 0 .5.1.7.3.2.2.3.5.3.7v1.8l3-2.8c.5-.5.9-1.1 1.2-1.6.1-.2.1-.4.2-.7-.1-.3-.4-.5-.7-.5H4.7c-.3 0-.5.2-.7.5-.2.3-.2.6 0 .8L10 11.2V8.3L3.8 14c-.6.5-.9 1.3-.9 2 0 1.1.9 2 2 2h8c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7V14.2l2.7 2.4c.2.2.4.3.7.3z"/>
            </svg>
            <h1>InJee Rental</h1>
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
