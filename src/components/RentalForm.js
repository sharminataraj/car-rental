import React, { useState } from "react";
import carApi from "../services/api";
import "./RentalForm.css";

const RentalForm = ({ car, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const calculateTotal = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days > 0 ? days * car.pricePerDay : 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const rentalData = {
        carId: car.id,
        customerName: formData.customerName,
        customerEmail: formData.customerEmail,
        customerPhone: formData.customerPhone,
        startDate: formData.startDate,
        endDate: formData.endDate,
        totalPrice: calculateTotal(),
      };

      await carApi.createRental(rentalData);
      onSuccess();
      onClose();
    } catch (err) {
      setError("Failed to create rental. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rental-form-overlay">
      <div className="rental-form">
        <div className="form-header">
          <h2>Rent {car.brand} {car.model}</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>
        
        <div className="car-summary">
          <p><strong>Price:</strong> ${car.pricePerDay}/day</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="customerName">Full Name</label>
            <input
              type="text"
              id="customerName"
              name="customerName"
              value={formData.customerName}
              onChange={handleChange}
              required
              placeholder="Enter your full name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerEmail">Email</label>
            <input
              type="email"
              id="customerEmail"
              name="customerEmail"
              value={formData.customerEmail}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="customerPhone">Phone</label>
            <input
              type="tel"
              id="customerPhone"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleChange}
              required
              placeholder="Enter your phone number"
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="startDate">Start Date</label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="endDate">End Date</label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                required
                min={formData.startDate}
              />
            </div>
          </div>

          {calculateTotal() > 0 && (
            <div className="total-price">
              <strong>Total: ${calculateTotal()}</strong>
            </div>
          )}

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? "Processing..." : "Confirm Rental"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RentalForm;
