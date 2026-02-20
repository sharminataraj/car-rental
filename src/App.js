import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LogoProvider } from "./contexts/LogoContext";
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
import Car3DRenderer from "./pages/Car3DRenderer";
import AvailableCars from "./pages/AvailableCars";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import Login from "./components/Auth/Login";
import "./App.css";

function App() {
  const handleLogin = (user) => {
    console.log("User logged in:", user);
    // Reload to apply authentication
    window.location.href = "/dashboard";
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("user");
    window.location.href = "/";
  };

  return (
    <Router>
      <LogoProvider>
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
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <UltraSimpleDashboard />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <DashboardHome />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/ultra" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <UltraSimpleDashboard />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/vehicles" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <VehicleManagement />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/rentals" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <RentalManagement />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/rentals/active" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <ActiveRentals />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/rentals/history" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <RentalHistory />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/analytics" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <Analytics />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/maintenance" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <Maintenance />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/settings" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <Settings />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/car-3d/:carId" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <Car3DRenderer />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/available-cars" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <AvailableCars />
                </SimpleLayout>
              </ProtectedRoute>
            } />
            <Route path="/my-bookings" element={
              <ProtectedRoute>
                <SimpleLayout onLogout={handleLogout}>
                  <MyBookings />
                </SimpleLayout>
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </LogoProvider>
    </Router>
  );
}

export default App;
