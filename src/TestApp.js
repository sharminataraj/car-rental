import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import SimpleLayout from "./components/Dashboard/SimpleLayout";
import UltraSimpleDashboard from "./pages/UltraSimpleDashboard";
import DashboardHome from "./pages/DashboardHome";
import VehicleManagement from "./components/Vehicles/VehicleManagement";
import RentalManagement from "./components/Rentals/RentalManagement";
import ActiveRentals from "./components/Rentals/ActiveRentals";
import RentalHistory from "./components/Rentals/RentalHistory";
import Analytics from "./components/Analytics/Analytics";
import Maintenance from "./components/Maintenance/Maintenance";
import Settings from "./components/Settings/Settings";
import Login from "./components/Auth/Login";
import "./App.css";

function TestApp() {
  // For testing, automatically authenticate
  React.useEffect(() => {
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify({
      id: 1,
      email: "admin@injeerental.com",
      name: "Admin User",
      role: "admin"
    }));
  }, []);

  const handleLogin = (user) => {
    console.log("User logged in:", user);
    window.location.href = "/dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <Router>
      <div className="app">
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
        
        <Routes>
          <Route path="/login" element={<Login onLogin={handleLogin} />} />
          <Route path="/" element={
            <SimpleLayout onLogout={handleLogout}>
              <UltraSimpleDashboard />
            </SimpleLayout>
          } />
          <Route path="/dashboard" element={
            <SimpleLayout onLogout={handleLogout}>
              <DashboardHome />
            </SimpleLayout>
          } />
          <Route path="/ultra" element={
            <SimpleLayout onLogout={handleLogout}>
              <UltraSimpleDashboard />
            </SimpleLayout>
          } />
          <Route path="/vehicles" element={
            <SimpleLayout onLogout={handleLogout}>
              <VehicleManagement />
            </SimpleLayout>
          } />
          <Route path="/rentals" element={
            <SimpleLayout onLogout={handleLogout}>
              <RentalManagement />
            </SimpleLayout>
          } />
          <Route path="/rentals/active" element={
            <SimpleLayout onLogout={handleLogout}>
              <ActiveRentals />
            </SimpleLayout>
          } />
          <Route path="/rentals/history" element={
            <SimpleLayout onLogout={handleLogout}>
              <RentalHistory />
            </SimpleLayout>
          } />
          <Route path="/analytics" element={
            <SimpleLayout onLogout={handleLogout}>
              <Analytics />
            </SimpleLayout>
          } />
          <Route path="/maintenance" element={
            <SimpleLayout onLogout={handleLogout}>
              <Maintenance />
            </SimpleLayout>
          } />
          <Route path="/settings" element={
            <SimpleLayout onLogout={handleLogout}>
              <Settings />
            </SimpleLayout>
          } />
        </Routes>
      </div>
    </Router>
  );
}

export default TestApp;
