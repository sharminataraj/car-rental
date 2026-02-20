import React, { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useBooking } from "../contexts/BookingContext";
import { useCurrency } from "../contexts/CurrencyContext";
import "./MyBookings.css";

const MyBookings = () => {
  const navigate = useNavigate();
  const { bookings, cancelBooking, getActiveBookings, getPastBookings } = useBooking();
  const { formatPrice } = useCurrency();
  
  const [activeTab, setActiveTab] = useState("active");
  const [cancellingId, setCancellingId] = useState(null);
  const [showCancelConfirm, setShowCancelConfirm] = useState(null);

  // Get active and past bookings
  const activeBookings = useMemo(() => getActiveBookings(), [bookings]);
  const pastBookings = useMemo(() => getPastBookings(), [bookings]);

  // Handle cancel booking
  const handleCancelBooking = (bookingId) => {
    setShowCancelConfirm(bookingId);
  };

  // Confirm cancellation
  const confirmCancel = (bookingId) => {
    setCancellingId(bookingId);
    setTimeout(() => {
      cancelBooking(bookingId);
      setCancellingId(null);
      setShowCancelConfirm(null);
    }, 500);
  };

  // Get status badge
  const getStatusBadge = (booking) => {
    const now = new Date();
    const pickup = new Date(booking.pickupDate);
    const returnD = new Date(booking.returnDate);

    if (booking.status === 'cancelled') {
      return <span className="status-badge cancelled">Cancelled</span>;
    }
    
    if (now < pickup) {
      return <span className="status-badge upcoming">Upcoming</span>;
    }
    
    if (now >= pickup && now <= returnD) {
      return <span className="status-badge active">In Progress</span>;
    }
    
    return <span className="status-badge completed">Completed</span>;
  };

  // Render booking card
  const renderBookingCard = (booking) => {
    const isCancelling = cancellingId === booking.id;
    const canCancel = new Date(booking.pickupDate) > new Date() && booking.status !== 'cancelled';
    
    return (
      <div key={booking.id} className={`booking-card ${isCancelling ? 'cancelling' : ''}`}>
        {/* Cancel Confirmation Overlay */}
        {showCancelConfirm === booking.id && (
          <div className="cancel-overlay">
            <div className="cancel-confirm">
              <h4>Cancel Booking?</h4>
              <p>Are you sure you want to cancel this booking? This action cannot be undone.</p>
              <div className="cancel-actions">
                <button 
                  className="btn-cancel-confirm"
                  onClick={() => confirmCancel(booking.id)}
                >
                  Yes, Cancel
                </button>
                <button 
                  className="btn-cancel-dismiss"
                  onClick={() => setShowCancelConfirm(null)}
                >
                  Keep Booking
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="booking-card-header">
          <div className="booking-id">
            <span className="label">Booking ID</span>
            <span className="value">{booking.id}</span>
          </div>
          {getStatusBadge(booking)}
        </div>

        <div className="booking-card-content">
          <div className="car-section">
            <img 
              src={booking.carDetails.image} 
              alt={`${booking.carDetails.brand} ${booking.carDetails.model}`}
              className="car-image"
            />
            <div className="car-info">
              <h3>{booking.carDetails.brand} {booking.carDetails.model}</h3>
              <span className="car-year">{booking.carDetails.year}</span>
              <span className="car-category">{booking.carDetails.category}</span>
            </div>
          </div>

          <div className="details-section">
            <div className="detail-group">
              <div className="detail">
                <span className="detail-icon">📅</span>
                <div className="detail-content">
                  <span className="detail-label">Pickup Date</span>
                  <span className="detail-value">
                    {new Date(booking.pickupDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>

              <div className="detail">
                <span className="detail-icon">🏁</span>
                <div className="detail-content">
                  <span className="detail-label">Return Date</span>
                  <span className="detail-value">
                    {new Date(booking.returnDate).toLocaleDateString('en-US', {
                      weekday: 'short',
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="detail-group">
              <div className="detail">
                <span className="detail-icon">📍</span>
                <div className="detail-content">
                  <span className="detail-label">Pickup Location</span>
                  <span className="detail-value">{booking.pickupLocation?.name}</span>
                </div>
              </div>

              <div className="detail">
                <span className="detail-icon">⏱️</span>
                <div className="detail-content">
                  <span className="detail-label">Duration</span>
                  <span className="detail-value">{booking.pricing?.days} days</span>
                </div>
              </div>
            </div>
          </div>

          <div className="price-section">
            <div className="price-row">
              <span>Total Amount</span>
              <span className="total-price">{formatPrice(booking.pricing?.total)}</span>
            </div>
            {booking.extras && booking.extras.length > 0 && (
              <div className="extras-list">
                {booking.extras.includes('insurance') && <span className="extra-tag">🛡️ Insurance</span>}
                {booking.extras.includes('gps') && <span className="extra-tag">📍 GPS</span>}
                {booking.extras.includes('childSeat') && <span className="extra-tag">👶 Child Seat</span>}
              </div>
            )}
          </div>
        </div>

        <div className="booking-card-footer">
          <div className="booking-date">
            Booked on {new Date(booking.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            })}
          </div>
          <div className="booking-actions">
            {canCancel && (
              <button 
                className="btn-cancel"
                onClick={() => handleCancelBooking(booking.id)}
                disabled={isCancelling}
              >
                Cancel Booking
              </button>
            )}
            <button 
              className="btn-details"
              onClick={() => navigate(`/booking-details/${booking.id}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="my-bookings-page">
      {/* Header */}
      <div className="page-header">
        <div className="header-content">
          <h1>My Bookings</h1>
          <p>Manage your car rental bookings</p>
        </div>
        <button className="btn-browse" onClick={() => navigate('/available-cars')}>
          <span>🔍</span> Browse Cars
        </button>
      </div>

      {/* Stats */}
      <div className="booking-stats">
        <div className="stat-card">
          <div className="stat-icon active">🚗</div>
          <div className="stat-info">
            <span className="stat-value">{activeBookings.length}</span>
            <span className="stat-label">Active Bookings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon past">📋</div>
          <div className="stat-info">
            <span className="stat-value">{pastBookings.length}</span>
            <span className="stat-label">Past Bookings</span>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-icon total">📊</div>
          <div className="stat-info">
            <span className="stat-value">{bookings.length}</span>
            <span className="stat-label">Total Bookings</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs-container">
        <button 
          className={`tab ${activeTab === 'active' ? 'active' : ''}`}
          onClick={() => setActiveTab('active')}
        >
          Active ({activeBookings.length})
        </button>
        <button 
          className={`tab ${activeTab === 'past' ? 'active' : ''}`}
          onClick={() => setActiveTab('past')}
        >
          Past ({pastBookings.length})
        </button>
        <button 
          className={`tab ${activeTab === 'all' ? 'active' : ''}`}
          onClick={() => setActiveTab('all')}
        >
          All ({bookings.length})
        </button>
      </div>

      {/* Bookings List */}
      <div className="bookings-list">
        {activeTab === 'active' && (
          activeBookings.length > 0 ? (
            activeBookings.map(renderBookingCard)
          ) : (
            <div className="empty-state">
              <div className="empty-icon">🚗</div>
              <h3>No Active Bookings</h3>
              <p>You don't have any active bookings at the moment.</p>
              <button className="btn-primary" onClick={() => navigate('/available-cars')}>
                Browse Available Cars
              </button>
            </div>
          )
        )}

        {activeTab === 'past' && (
          pastBookings.length > 0 ? (
            pastBookings.map(renderBookingCard)
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📋</div>
              <h3>No Past Bookings</h3>
              <p>You haven't completed any rentals yet.</p>
            </div>
          )
        )}

        {activeTab === 'all' && (
          bookings.length > 0 ? (
            bookings.map(renderBookingCard)
          ) : (
            <div className="empty-state">
              <div className="empty-icon">📭</div>
              <h3>No Bookings Yet</h3>
              <p>Start by browsing our available cars and make your first booking.</p>
              <button className="btn-primary" onClick={() => navigate('/available-cars')}>
                Browse Available Cars
              </button>
            </div>
          )
        )}
      </div>

      {/* Quick Actions */}
      <div className="quick-actions-section">
        <h2 className="quick-actions-title">Quick Actions</h2>
        <div className="quick-actions-grid">
          <button 
            type="button"
            className="quick-action-btn"
            onClick={() => navigate('/vehicles')}
          >
            <span className="quick-action-icon">🚗</span>
            <span className="quick-action-label">Add New Vehicle</span>
          </button>
          <button 
            type="button"
            className="quick-action-btn"
            onClick={() => navigate('/rentals')}
          >
            <span className="quick-action-icon">📝</span>
            <span className="quick-action-label">Create Rental</span>
          </button>
          <button 
            type="button"
            className="quick-action-btn"
            onClick={() => navigate('/rentals')}
          >
            <span className="quick-action-icon">👤</span>
            <span className="quick-action-label">View Customer</span>
          </button>
          <button 
            type="button"
            className="quick-action-btn"
            onClick={() => navigate('/maintenance')}
          >
            <span className="quick-action-icon">🔧</span>
            <span className="quick-action-label">Maintenance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
