import React, { useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "./RentalForm.css";
import { useCurrency } from "../../contexts/CurrencyContext";

const RentalForm = ({ onClose, car, availableCars, onSubmit }) => {
  const { formatPrice } = useCurrency();
  const [selectedCar, setSelectedCar] = useState(car);
  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    startDate: "",
    endDate: "",
    notes: ""
  });

  const handleCarSelect = (car) => {
    setSelectedCar(car);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!selectedCar) {
      toast.error("Please select a car");
      return;
    }

    const rentalData = {
      carId: selectedCar.id,
      carDetails: selectedCar,
      customerName: formData.customerName,
      customerEmail: formData.customerEmail,
      customerPhone: formData.customerPhone,
      startDate: formData.startDate,
      endDate: formData.endDate,
      notes: formData.notes,
      status: "pending",
      createdAt: new Date().toISOString()
    };

    onSubmit(rentalData);
  };

  return (
    <div className="rental-form-overlay">
      <div className="rental-form">
        <ToastContainer />
        
        <div className="form-header">
          <h2>Create New Rental</h2>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-section">
            <h3>Select Vehicle</h3>
            <div className="car-selection">
              {availableCars.map(car => (
                <div 
                  key={car.id} 
                  className={`car-option ${selectedCar?.id === car.id ? 'selected' : ''}`}
                  onClick={() => handleCarSelect(car)}
                >
                  <div className="car-info">
                    <div className="car-name">{car.brand} {car.model}</div>
                    <div className="car-details">
                      <span>{car.year} • {car.category}</span>
                    </div>
                  </div>
                  <div className="car-price">
                    <span>{formatPrice(car.pricePerDay)}/day</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {selectedCar && (
            <>
              <div className="form-section">
                <h3>Customer Information</h3>
                
                <div className="form-group">
                  <label htmlFor="customerName">Full Name</label>
                  <input
                    type="text"
                    id="customerName"
                    name="customerName"
                    value={formData.customerName}
                    onChange={handleInputChange}
                    placeholder="Enter customer's full name"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerEmail">Email</label>
                  <input
                    type="email"
                    id="customerEmail"
                    name="customerEmail"
                    value={formData.customerEmail}
                    onChange={handleInputChange}
                    placeholder="Enter customer's email"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="customerPhone">Phone</label>
                  <input
                    type="tel"
                    id="customerPhone"
                    name="customerPhone"
                    value={formData.customerPhone}
                    onChange={handleInputChange}
                    placeholder="Enter customer's phone number"
                    required
                  />
                </div>
              </div>

              <div className="form-section">
                <h3>Rental Details</h3>
                
                <div className="form-group">
                  <label htmlFor="startDate">Start Date</label>
                  <input
                    type="date"
                    id="startDate"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
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
                    onChange={handleInputChange}
                    min={formData.startDate || new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="notes">Notes</label>
                  <textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    placeholder="Additional notes or special requests"
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="button" className="btn-secondary" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  Create Rental
                </button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
};

export default RentalForm;
