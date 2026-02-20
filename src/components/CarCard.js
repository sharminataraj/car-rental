import React, { useState } from "react";
import { useCurrency } from "../contexts/CurrencyContext";
import { useBooking } from "../contexts/BookingContext";
import "./CarCard.css";

const CarCard = ({ car, onBook, viewMode = "grid" }) => {
  const { formatPrice, currency } = useCurrency();
  const { getCarAvailability } = useBooking();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const {
    id,
    brand,
    model,
    year,
    pricePerDay,
    weeklyPrice,
    available,
    image,
    description,
    category,
    fuelType,
    transmission,
    seatingCapacity,
    luggageCapacity,
    conditionRating
  } = car;

  // Get category icon
  const getCategoryIcon = (cat) => {
    const icons = {
      Sedan: "🚙",
      SUV: "🚐",
      Sports: "🏎️",
      Luxury: "✨",
      Electric: "⚡",
      Economy: "💰"
    };
    return icons[cat] || "🚗";
  };

  // Get fuel type icon
  const getFuelIcon = (fuel) => {
    const icons = {
      Gasoline: "⛽",
      Electric: "⚡",
      Hybrid: "🔋",
      Diesel: "🛢️"
    };
    return icons[fuel] || "⛽";
  };

  // Render star rating
  const renderRating = (rating) => {
    const stars = [];
    for (let i = 0; i < 5; i++) {
      stars.push(
        <span key={i} className={`star ${i < rating ? "filled" : ""}`}>
          ★
        </span>
      );
    }
    return stars;
  };

  // Handle image load
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  // Handle image error
  const handleImageError = () => {
    setImageError(true);
    setImageLoaded(true);
  };

  // Check real-time availability
  const isAvailable = available && getCarAvailability(id);

  if (viewMode === "list") {
    return (
      <div className={`car-card list-view ${!isAvailable ? "unavailable" : ""}`}>
        <div className="car-image-container">
          {!imageLoaded && !imageError && (
            <div className="image-skeleton"></div>
          )}
          {imageError ? (
            <div className="image-placeholder">
              <span className="placeholder-icon">🚗</span>
              <span className="placeholder-text">{brand} {model}</span>
            </div>
          ) : (
            <img
              src={image}
              alt={`${brand} ${model}`}
              className={`car-image ${imageLoaded ? "loaded" : ""}`}
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          )}
          <div className="image-overlay">
            <span className="category-badge">
              {getCategoryIcon(category)} {category}
            </span>
          </div>
        </div>

        <div className="car-details">
          <div className="car-header">
            <div className="car-title">
              <h3>{brand} {model}</h3>
              <span className="car-year">{year}</span>
            </div>
            <div className="car-rating">
              {renderRating(conditionRating || 4)}
            </div>
          </div>

          <p className="car-description">{description}</p>

          <div className="car-specs">
            <div className="spec-item">
              <span className="spec-icon">👥</span>
              <span className="spec-value">{seatingCapacity || 5} Seats</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">{getFuelIcon(fuelType)}</span>
              <span className="spec-value">{fuelType}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">⚙️</span>
              <span className="spec-value">{transmission}</span>
            </div>
            <div className="spec-item">
              <span className="spec-icon">🧳</span>
              <span className="spec-value">{luggageCapacity || "2 bags"}</span>
            </div>
          </div>
        </div>

        <div className="car-pricing">
          <div className="price-info">
            <div className="daily-price">
              <span className="price-amount">{formatPrice(pricePerDay)}</span>
              <span className="price-period">/day</span>
            </div>
            {weeklyPrice && (
              <div className="weekly-price">
                <span className="weekly-label">Weekly</span>
                <span className="weekly-amount">{formatPrice(weeklyPrice)}</span>
              </div>
            )}
          </div>

          <div className={`availability-status ${isAvailable ? "available" : "unavailable"}`}>
            <span className="status-dot"></span>
            <span className="status-text">{isAvailable ? "Available" : "Rented"}</span>
          </div>

          <button
            className={`book-button ${!isAvailable ? "disabled" : ""}`}
            onClick={() => onBook(car)}
            disabled={!isAvailable}
          >
            {isAvailable ? "Book Now" : "Unavailable"}
            {isAvailable && <span className="button-arrow">→</span>}
          </button>
        </div>
      </div>
    );
  }

  // Grid view (default)
  return (
    <div className={`car-card grid-view ${!isAvailable ? "unavailable" : ""}`}>
      <div className="car-image-container">
        {!imageLoaded && !imageError && (
          <div className="image-skeleton"></div>
        )}
        {imageError ? (
          <div className="image-placeholder">
            <span className="placeholder-icon">🚗</span>
            <span className="placeholder-text">{brand} {model}</span>
          </div>
        ) : (
          <img
            src={image}
            alt={`${brand} ${model}`}
            className={`car-image ${imageLoaded ? "loaded" : ""}`}
            onLoad={handleImageLoad}
            onError={handleImageError}
          />
        )}
        
        <div className="image-overlay">
          <span className="category-badge">
            {getCategoryIcon(category)} {category}
          </span>
          {!isAvailable && (
            <div className="rented-overlay">
              <span>Currently Rented</span>
            </div>
          )}
        </div>

        <button className="favorite-button" title="Add to favorites">
          <span>♡</span>
        </button>
      </div>

      <div className="card-content">
        <div className="card-header">
          <div className="car-title">
            <h3>{brand}</h3>
            <span className="model-name">{model}</span>
          </div>
          <span className="car-year">{year}</span>
        </div>

        <div className="car-rating">
          {renderRating(conditionRating || 4)}
          <span className="rating-count">({conditionRating || 4}.0)</span>
        </div>

        <div className="car-specs">
          <div className="spec-item">
            <span className="spec-icon">👥</span>
            <span className="spec-value">{seatingCapacity || 5}</span>
          </div>
          <div className="spec-item">
            <span className="spec-icon">{getFuelIcon(fuelType)}</span>
            <span className="spec-value">{fuelType}</span>
          </div>
          <div className="spec-item">
            <span className="spec-icon">⚙️</span>
            <span className="spec-value">{transmission}</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="price-section">
            <div className="daily-price">
              <span className="price-amount">{formatPrice(pricePerDay)}</span>
              <span className="price-period">/day</span>
            </div>
            {weeklyPrice && (
              <div className="weekly-price">
                {formatPrice(weeklyPrice)}/week
              </div>
            )}
          </div>

          <button
            className={`book-button ${!isAvailable ? "disabled" : ""}`}
            onClick={() => onBook(car)}
            disabled={!isAvailable}
          >
            {isAvailable ? (
              <>
                <span>Book Now</span>
                <span className="button-arrow">→</span>
              </>
            ) : (
              "Unavailable"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default CarCard;
