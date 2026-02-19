import React, { useState, useEffect } from "react";
import { ToastContainer, toast } from "react-toastify";
import carApi from "../../services/api";
import RentalForm from "./RentalForm";
import "./RentalManagement.css";

const RentalManagement = () => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [carsData, rentalsData] = await Promise.all([
        carApi.getCars(),
        carApi.getRentals()
      ]);
      setCars(carsData);
      setRentals(rentalsData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateRental = async (rentalData) => {
    try {
      await carApi.createRental(rentalData);
      toast.success("Rental created successfully");
      setShowForm(false);
      setSelectedCar(null);
      loadData();
    } catch (error) {
      console.error("Error creating rental:", error);
      toast.error("Failed to create rental");
    }
  };

  const handleCarSelect = (car) => {
    setSelectedCar(car);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedCar(null);
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading rental data...</p>
      </div>
    );
  }

  return (
    <div className="rental-management">
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

      <div className="page-header">
        <div className="header-content">
          <h1>Rental Management</h1>
          <p className="subtitle">Create and manage vehicle rentals for your customers</p>
        </div>
        <div className="header-actions">
          <button 
            className="btn-primary"
            onClick={() => setShowForm(true)}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            Create New Rental
          </button>
        </div>
      </div>

      {/* Available Cars for Rental */}
      <div className="section">
        <h2>Available Cars for Rental</h2>
        <div className="cars-grid">
          {cars.filter(car => car.available).length > 0 ? (
            cars.filter(car => car.available).map(car => (
              <div key={car.id} className="car-card">
                <div className="car-image">
                  <div className="car-placeholder">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M18.7 19.2c.2 0 .4-.1.5-.2.2-.2.3-.5.2-.7-.3-.6-.7-1.1-1.2-1.6L15 14.2V16c0 .3-.1.5-.3.7-.2.2-.5.3-.7.3H7c-.3 0-.5-.1-.7-.3-.2-.2-.3-.5-.3-.7V8c0-.3.1-.5.3-.7.2-.2.5-.3.7-.3h7c.3 0 .5.1.7.3.2.2.3.5.3.7v1.8l3-2.8c.5-.5.9-1.1 1.2-1.6.1-.2.1-.4.2-.7-.1-.3-.4-.5-.7-.5H4.7c-.3 0-.5.2-.7.5-.2.3-.2.6 0 .8L10 11.2V8.3L3.8 14c-.6.5-.9 1.3-.9 2 0 1.1.9 2 2 2h8c.3 0 .5-.1.7-.3.2-.2.3-.5.3-.7V14.2l2.7 2.4c.2.2.4.3.7.3z"/>
                    </svg>
                  </div>
                </div>
                <div className="car-details">
                  <h3>{car.brand} {car.model}</h3>
                  <div className="car-info">
                    <span className="info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <polyline points="12 6 12 12 16 14"/>
                      </svg>
                      {car.year}
                    </span>
                    <span className="info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                        <polyline points="9 22 9 12 15 12 15 22"/>
                      </svg>
                      {car.category}
                    </span>
                    <span className="info-item">
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      {car.fuelType}
                    </span>
                  </div>
                  <div className="car-pricing">
                    <div className="price">
                      <span className="amount">${car.pricePerDay}</span>
                      <span className="period">/day</span>
                    </div>
                    {car.weeklyPrice && (
                      <div className="weekly-price">
                        ${car.weeklyPrice} <span>/week</span>
                      </div>
                    )}
                  </div>
                  <button 
                    className="rent-button"
                    onClick={() => handleCarSelect(car)}
                  >
                    Rent Now
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="no-cars">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="9" x2="15" y2="9"/>
                <line x1="9" y1="15" x2="15" y2="15"/>
              </svg>
              <h3>No available cars</h3>
              <p>All vehicles are currently rented or in maintenance</p>
            </div>
          )}
        </div>
      </div>

      {/* Recent Rentals */}
      <div className="section">
        <div className="section-header">
          <h2>Recent Rentals</h2>
          <button className="btn-view-all">View All</button>
        </div>
        <div className="rentals-list">
          {rentals.length > 0 ? (
            rentals.slice(0, 5).map(rental => {
              const car = cars.find(c => c.id === rental.carId);
              return (
                <div key={rental.id} className="rental-item">
                  <div className="rental-info">
                    <div className="customer-info">
                      <h3>{rental.customerName}</h3>
                      <p>{rental.customerEmail}</p>
                    </div>
                    <div className="car-info">
                      {car && (
                        <span>{car.brand} {car.model}</span>
                      )}
                    </div>
                    <div className="rental-dates">
                      <span className="date">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                          <line x1="16" y1="2" x2="16" y2="6"/>
                          <line x1="8" y1="2" x2="8" y2="6"/>
                          <line x1="3" y1="10" x2="21" y2="10"/>
                        </svg>
                        {new Date(rental.startDate).toLocaleDateString()}
                      </span>
                      <span className="to">-</span>
                      <span className="date">
                        {new Date(rental.endDate).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="rental-status">
                      <span className={`status-badge ${rental.status}`}>
                        {rental.status.charAt(0).toUpperCase() + rental.status.slice(1)}
                      </span>
                    </div>
                  </div>
                  <div className="rental-actions">
                    <button className="action-btn">View</button>
                    {rental.status === "pending" && (
                      <button className="action-btn primary">Confirm</button>
                    )}
                    {rental.status === "active" && (
                      <button className="action-btn success">Complete</button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="no-rentals">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
              </svg>
              <h3>No rentals yet</h3>
              <p>Create your first rental reservation</p>
            </div>
          )}
        </div>
      </div>

      {/* Rental Form */}
      {showForm && (
        <RentalForm
          car={selectedCar}
          availableCars={selectedCar ? [selectedCar] : cars.filter(car => car.available)}
          onSubmit={handleCreateRental}
          onClose={handleCloseForm}
        />
      )}
    </div>
  );
};

export default RentalManagement;
