import React from "react";
import { useNavigate } from "react-router-dom";
import { useCurrency } from "../../contexts/CurrencyContext";
import "./BookingConfirmation.css";

const BookingConfirmation = ({ booking, onClose }) => {
  const navigate = useNavigate();
  const { formatPrice } = useCurrency();

  if (!booking) return null;

  const handleViewBookings = () => {
    onClose();
    navigate("/my-bookings");
  };

  return (
    <div className="confirmation-overlay">
      <div className="confirmation-modal">
        {/* Success Animation */}
        <div className="success-animation">
          <div className="success-checkmark">
            <div className="check-icon">
              <span className="icon-line line-tip"></span>
              <span className="icon-line line-long"></span>
              <div className="icon-circle"></div>
              <div className="icon-fix"></div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="confirmation-content">
          <h2>Booking Confirmed!</h2>
          <p className="confirmation-message">
            Your rental has been successfully booked. We've sent a confirmation email to{" "}
            <strong>{booking.customerInfo.email}</strong>
          </p>

          {/* Booking Reference */}
          <div className="booking-reference">
            <span className="label">Booking Reference</span>
            <span className="reference-number">{booking.id}</span>
            <button 
              className="copy-button"
              onClick={() => {
                navigator.clipboard.writeText(booking.id);
              }}
              title="Copy to clipboard"
            >
              📋 Copy
            </button>
          </div>

          {/* Booking Summary Card */}
          <div className="booking-summary-card">
            <div className="summary-header">
              <img 
                src={booking.carDetails.image} 
                alt={`${booking.carDetails.brand} ${booking.carDetails.model}`}
                className="car-image"
              />
              <div className="car-details">
                <h3>{booking.carDetails.brand} {booking.carDetails.model}</h3>
                <span className="car-category">{booking.carDetails.category}</span>
              </div>
            </div>

            <div className="summary-details">
              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div className="detail-content">
                    <span className="detail-label">Pickup</span>
                    <span className="detail-value">
                      {new Date(booking.pickupDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏁</span>
                  <div className="detail-content">
                    <span className="detail-label">Return</span>
                    <span className="detail-value">
                      {new Date(booking.returnDate).toLocaleDateString('en-US', {
                        weekday: 'short',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>
              </div>

              <div className="detail-row">
                <div className="detail-item">
                  <span className="detail-icon">📍</span>
                  <div className="detail-content">
                    <span className="detail-label">Pickup Location</span>
                    <span className="detail-value">{booking.pickupLocation?.name}</span>
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">⏱️</span>
                  <div className="detail-content">
                    <span className="detail-label">Duration</span>
                    <span className="detail-value">{booking.pricing?.days} days</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Price Breakdown */}
            <div className="price-breakdown">
              <div className="price-row">
                <span>Base Price ({booking.pricing?.days} days)</span>
                <span>{formatPrice(booking.pricing?.basePrice)}</span>
              </div>
              {booking.pricing?.extrasTotal > 0 && (
                <div className="price-row">
                  <span>Extras</span>
                  <span>{formatPrice(booking.pricing?.extrasTotal)}</span>
                </div>
              )}
              <div className="price-row">
                <span>Tax (10%)</span>
                <span>{formatPrice(booking.pricing?.tax)}</span>
              </div>
              <div className="price-row total">
                <span>Total Paid</span>
                <span>{formatPrice(booking.pricing?.total)}</span>
              </div>
            </div>
          </div>

          {/* Extras Tags */}
          {booking.extras && booking.extras.length > 0 && (
            <div className="extras-section">
              <span className="extras-label">Included Extras:</span>
              <div className="extras-tags">
                {booking.extras.includes('insurance') && (
                  <span className="extra-tag">🛡️ Full Insurance</span>
                )}
                {booking.extras.includes('gps') && (
                  <span className="extra-tag">📍 GPS Navigation</span>
                )}
                {booking.extras.includes('childSeat') && (
                  <span className="extra-tag">👶 Child Seat</span>
                )}
              </div>
            </div>
          )}

          {/* Important Info */}
          <div className="important-info">
            <h4>📋 Important Information</h4>
            <ul>
              <li>Please arrive 15 minutes before your pickup time</li>
              <li>Bring a valid driver's license and credit card</li>
              <li>A security deposit will be held on your card</li>
              <li>Free cancellation up to 24 hours before pickup</li>
            </ul>
          </div>

          {/* Actions */}
          <div className="confirmation-actions">
            <button className="btn-primary" onClick={handleViewBookings}>
              View My Bookings
            </button>
            <button className="btn-secondary" onClick={onClose}>
              Continue Browsing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation;
