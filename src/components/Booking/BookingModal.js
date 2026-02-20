import React, { useState, useEffect, useMemo } from "react";
import { useBooking } from "../../contexts/BookingContext";
import { useCurrency } from "../../contexts/CurrencyContext";
import "./BookingModal.css";

const BookingModal = ({ car, isOpen, onClose, onBookingComplete }) => {
  const { isCarAvailable, createBooking, calculateTotalPrice, getBookedDates } = useBooking();
  const { formatPrice } = useCurrency();
  
  // Form state
  const [pickupDate, setPickupDate] = useState("");
  const [returnDate, setReturnDate] = useState("");
  const [pickupLocation, setPickupLocation] = useState("");
  const [returnLocation, setReturnLocation] = useState("");
  const [extras, setExtras] = useState({
    insurance: false,
    gps: false,
    childSeat: false
  });
  const [customerInfo, setCustomerInfo] = useState({
    name: "",
    email: "",
    phone: ""
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Locations
  const locations = [
    { id: "airport", name: "Airport Terminal", address: "Main Airport, Terminal 1" },
    { id: "downtown", name: "Downtown Office", address: "123 Main Street, City Center" },
    { id: "mall", name: "Shopping Mall", address: "Central Mall, Parking Level B2" },
    { id: "station", name: "Train Station", address: "Central Railway Station" }
  ];

  // Extras options
  const extrasOptions = [
    { id: "insurance", name: "Full Insurance", price: 15, description: "Complete coverage with zero deductible" },
    { id: "gps", name: "GPS Navigation", price: 8, description: "Turn-by-turn navigation system" },
    { id: "childSeat", name: "Child Seat", price: 10, description: "Safety-approved child seat" }
  ];

  // Get booked dates for this car
  const bookedDates = useMemo(() => getBookedDates(car.id), [car.id, getBookedDates]);

  // Calculate pricing
  const pricing = useMemo(() => {
    if (!pickupDate || !returnDate) return null;
    
    const selectedExtras = Object.entries(extras)
      .filter(([_, selected]) => selected)
      .map(([id]) => id);
    
    return calculateTotalPrice(car.pricePerDay, pickupDate, returnDate, selectedExtras);
  }, [pickupDate, returnDate, extras, car.pricePerDay, calculateTotalPrice]);

  // Validate dates
  useEffect(() => {
    if (pickupDate && returnDate) {
      const pickup = new Date(pickupDate);
      const returnD = new Date(returnDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const newErrors = {};
      
      if (pickup < today) {
        newErrors.pickupDate = "Pickup date cannot be in the past";
      }
      
      if (returnD <= pickup) {
        newErrors.returnDate = "Return date must be after pickup date";
      }
      
      // Check availability
      if (!isCarAvailable(car.id, pickupDate, returnDate)) {
        newErrors.availability = "This car is not available for the selected dates";
      }
      
      setErrors(newErrors);
    }
  }, [pickupDate, returnDate, car.id, isCarAvailable]);

  // Handle date change
  const handlePickupDateChange = (e) => {
    setPickupDate(e.target.value);
    if (!returnDate || new Date(e.target.value) >= new Date(returnDate)) {
      const nextDay = new Date(e.target.value);
      nextDay.setDate(nextDay.getDate() + 1);
      setReturnDate(nextDay.toISOString().split('T')[0]);
    }
  };

  // Handle extra toggle
  const handleExtraToggle = (extraId) => {
    setExtras(prev => ({
      ...prev,
      [extraId]: !prev[extraId]
    }));
  };

  // Handle customer info change
  const handleCustomerInfoChange = (field, value) => {
    setCustomerInfo(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Validate step
  const validateStep = (step) => {
    const newErrors = {};
    
    if (step === 1) {
      if (!pickupDate) newErrors.pickupDate = "Please select a pickup date";
      if (!returnDate) newErrors.returnDate = "Please select a return date";
      if (!pickupLocation) newErrors.pickupLocation = "Please select a pickup location";
    }
    
    if (step === 2) {
      if (!customerInfo.name.trim()) newErrors.name = "Name is required";
      if (!customerInfo.email.trim()) newErrors.email = "Email is required";
      else if (!/\S+@\S+\.\S+/.test(customerInfo.email)) newErrors.email = "Invalid email format";
      if (!customerInfo.phone.trim()) newErrors.phone = "Phone number is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  // Previous step
  const handlePrevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  // Submit booking
  const handleSubmit = async () => {
    if (!validateStep(2)) return;
    
    setIsSubmitting(true);
    
    try {
      const selectedExtras = Object.entries(extras)
        .filter(([_, selected]) => selected)
        .map(([id]) => id);
      
      const bookingData = {
        carId: car.id,
        carDetails: {
          brand: car.brand,
          model: car.model,
          year: car.year,
          image: car.image,
          category: car.category
        },
        pickupDate,
        returnDate,
        pickupLocation: locations.find(l => l.id === pickupLocation),
        returnLocation: returnLocation ? locations.find(l => l.id === returnLocation) : locations.find(l => l.id === pickupLocation),
        extras: selectedExtras,
        customerInfo,
        pricing
      };
      
      const booking = createBooking(bookingData);
      
      if (onBookingComplete) {
        onBookingComplete(booking);
      }
      
      onClose();
    } catch (error) {
      setErrors({ submit: "Failed to create booking. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Get minimum date (today)
  const getMinDate = () => {
    return new Date().toISOString().split('T')[0];
  };

  // Check if date is booked
  const isDateBooked = (dateStr) => {
    return bookedDates.includes(dateStr);
  };

  if (!isOpen) return null;

  return (
    <div className="booking-modal-overlay" onClick={onClose}>
      <div className="booking-modal" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="modal-header">
          <div className="header-content">
            <h2>Book Your Ride</h2>
            <p>{car.brand} {car.model} {car.year}</p>
          </div>
          <button className="close-button" onClick={onClose}>×</button>
        </div>

        {/* Progress Steps */}
        <div className="progress-steps">
          <div className={`step ${currentStep >= 1 ? 'active' : ''} ${currentStep > 1 ? 'completed' : ''}`}>
            <div className="step-number">1</div>
            <span>Details</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 2 ? 'active' : ''} ${currentStep > 2 ? 'completed' : ''}`}>
            <div className="step-number">2</div>
            <span>Information</span>
          </div>
          <div className="step-line"></div>
          <div className={`step ${currentStep >= 3 ? 'active' : ''}`}>
            <div className="step-number">3</div>
            <span>Confirm</span>
          </div>
        </div>

        {/* Car Summary */}
        <div className="car-summary">
          <img src={car.image} alt={`${car.brand} ${car.model}`} className="car-thumbnail" />
          <div className="car-info">
            <h3>{car.brand} {car.model}</h3>
            <div className="car-specs">
              <span>👥 {car.seatingCapacity} seats</span>
              <span>⚙️ {car.transmission}</span>
              <span>⛽ {car.fuelType}</span>
            </div>
            <div className="car-price">
              <span className="price">{formatPrice(car.pricePerDay)}</span>
              <span className="period">/day</span>
            </div>
          </div>
        </div>

        {/* Step Content */}
        <div className="step-content">
          {/* Step 1: Dates & Location */}
          {currentStep === 1 && (
            <div className="step-panel">
              <h3>Select Dates & Location</h3>
              
              <div className="form-row">
                <div className="form-group">
                  <label>Pickup Date *</label>
                  <input
                    type="date"
                    value={pickupDate}
                    onChange={handlePickupDateChange}
                    min={getMinDate()}
                    className={errors.pickupDate ? 'error' : ''}
                  />
                  {errors.pickupDate && <span className="error-text">{errors.pickupDate}</span>}
                </div>
                
                <div className="form-group">
                  <label>Return Date *</label>
                  <input
                    type="date"
                    value={returnDate}
                    onChange={e => setReturnDate(e.target.value)}
                    min={pickupDate || getMinDate()}
                    className={errors.returnDate ? 'error' : ''}
                  />
                  {errors.returnDate && <span className="error-text">{errors.returnDate}</span>}
                </div>
              </div>

              {errors.availability && (
                <div className="availability-error">
                  <span className="error-icon">⚠️</span>
                  {errors.availability}
                </div>
              )}

              <div className="form-group">
                <label>Pickup Location *</label>
                <select
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  className={errors.pickupLocation ? 'error' : ''}
                >
                  <option value="">Select pickup location</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} - {loc.address}
                    </option>
                  ))}
                </select>
                {errors.pickupLocation && <span className="error-text">{errors.pickupLocation}</span>}
              </div>

              <div className="form-group">
                <label>Return Location (Optional)</label>
                <select
                  value={returnLocation}
                  onChange={e => setReturnLocation(e.target.value)}
                >
                  <option value="">Same as pickup</option>
                  {locations.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} - {loc.address}
                    </option>
                  ))}
                </select>
              </div>

              {/* Extras */}
              <div className="extras-section">
                <h4>Optional Extras</h4>
                <div className="extras-grid">
                  {extrasOptions.map(extra => (
                    <div
                      key={extra.id}
                      className={`extra-card ${extras[extra.id] ? 'selected' : ''}`}
                      onClick={() => handleExtraToggle(extra.id)}
                    >
                      <div className="extra-checkbox">
                        {extras[extra.id] && <span>✓</span>}
                      </div>
                      <div className="extra-info">
                        <span className="extra-name">{extra.name}</span>
                        <span className="extra-description">{extra.description}</span>
                      </div>
                      <div className="extra-price">
                        +{formatPrice(extra.price)}/day
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Customer Information */}
          {currentStep === 2 && (
            <div className="step-panel">
              <h3>Your Information</h3>
              
              <div className="form-group">
                <label>Full Name *</label>
                <input
                  type="text"
                  value={customerInfo.name}
                  onChange={e => handleCustomerInfoChange('name', e.target.value)}
                  placeholder="Enter your full name"
                  className={errors.name ? 'error' : ''}
                />
                {errors.name && <span className="error-text">{errors.name}</span>}
              </div>

              <div className="form-group">
                <label>Email Address *</label>
                <input
                  type="email"
                  value={customerInfo.email}
                  onChange={e => handleCustomerInfoChange('email', e.target.value)}
                  placeholder="Enter your email"
                  className={errors.email ? 'error' : ''}
                />
                {errors.email && <span className="error-text">{errors.email}</span>}
              </div>

              <div className="form-group">
                <label>Phone Number *</label>
                <input
                  type="tel"
                  value={customerInfo.phone}
                  onChange={e => handleCustomerInfoChange('phone', e.target.value)}
                  placeholder="Enter your phone number"
                  className={errors.phone ? 'error' : ''}
                />
                {errors.phone && <span className="error-text">{errors.phone}</span>}
              </div>

              {/* Price Summary */}
              {pricing && (
                <div className="price-summary">
                  <h4>Price Summary</h4>
                  <div className="price-row">
                    <span>Base Price ({pricing.days} days)</span>
                    <span>{formatPrice(pricing.basePrice)}</span>
                  </div>
                  {pricing.extrasTotal > 0 && (
                    <div className="price-row">
                      <span>Extras</span>
                      <span>{formatPrice(pricing.extrasTotal)}</span>
                    </div>
                  )}
                  <div className="price-row">
                    <span>Subtotal</span>
                    <span>{formatPrice(pricing.subtotal)}</span>
                  </div>
                  <div className="price-row">
                    <span>Tax (10%)</span>
                    <span>{formatPrice(pricing.tax)}</span>
                  </div>
                  <div className="price-row total">
                    <span>Total</span>
                    <span>{formatPrice(pricing.total)}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Step 3: Confirmation */}
          {currentStep === 3 && (
            <div className="step-panel confirmation-panel">
              <h3>Review Your Booking</h3>
              
              <div className="review-section">
                <div className="review-card">
                  <h4>📅 Rental Period</h4>
                  <div className="review-details">
                    <div className="review-row">
                      <span>Pickup:</span>
                      <span>{new Date(pickupDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="review-row">
                      <span>Return:</span>
                      <span>{new Date(returnDate).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
                    </div>
                    <div className="review-row">
                      <span>Duration:</span>
                      <span>{pricing?.days} days</span>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h4>📍 Locations</h4>
                  <div className="review-details">
                    <div className="review-row">
                      <span>Pickup:</span>
                      <span>{locations.find(l => l.id === pickupLocation)?.name}</span>
                    </div>
                    <div className="review-row">
                      <span>Return:</span>
                      <span>{(returnLocation ? locations.find(l => l.id === returnLocation) : locations.find(l => l.id === pickupLocation))?.name}</span>
                    </div>
                  </div>
                </div>

                <div className="review-card">
                  <h4>👤 Customer Details</h4>
                  <div className="review-details">
                    <div className="review-row">
                      <span>Name:</span>
                      <span>{customerInfo.name}</span>
                    </div>
                    <div className="review-row">
                      <span>Email:</span>
                      <span>{customerInfo.email}</span>
                    </div>
                    <div className="review-row">
                      <span>Phone:</span>
                      <span>{customerInfo.phone}</span>
                    </div>
                  </div>
                </div>

                {Object.values(extras).some(v => v) && (
                  <div className="review-card">
                    <h4>✨ Extras</h4>
                    <div className="review-details">
                      {extras.insurance && <span className="extra-tag">Full Insurance</span>}
                      {extras.gps && <span className="extra-tag">GPS Navigation</span>}
                      {extras.childSeat && <span className="extra-tag">Child Seat</span>}
                    </div>
                  </div>
                )}
              </div>

              <div className="final-total">
                <span>Total Amount</span>
                <span className="total-amount">{formatPrice(pricing?.total)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="modal-footer">
          {currentStep > 1 && (
            <button className="btn-secondary" onClick={handlePrevStep}>
              ← Back
            </button>
          )}
          
          {currentStep < 3 ? (
            <button className="btn-primary" onClick={handleNextStep}>
              Continue →
            </button>
          ) : (
            <button 
              className="btn-primary btn-confirm" 
              onClick={handleSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Processing...' : 'Confirm Booking ✓'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;
