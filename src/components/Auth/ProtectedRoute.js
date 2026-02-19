import React from "react";
import Login from "./Login";

const ProtectedRoute = ({ children }) => {
  try {
    const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
    const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;

    console.log("ProtectedRoute - Authentication status:", { isAuthenticated, user });

    if (!isAuthenticated || !user) {
      return <Login onLogin={(user) => {
        console.log("Login successful, user:", user);
        window.location.href = "/dashboard";
      }} />;
    }

    return children;
  } catch (error) {
    console.error("Error in ProtectedRoute:", error);
    return <Login onLogin={(user) => window.location.href = "/dashboard"} />;
  }
};

export default ProtectedRoute;
