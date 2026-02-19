import React from "react";
import "./CarCard.css";

const CarCard = ({ car, onRent }) => {
  const { id, brand, model, year, pricePerDay, available, image } = car;

  return (
    <div className="car-card">
      <div className="car-image">
        {image ? (
          <img src={image} alt={`${brand} ${model}`} />
        ) : (
          <div className="car-placeholder">🚗</div>
        )}
      </div>
      <div className="car-info">
        <h3>{brand} {model}</h3>
        <p className="car-year">{year}</p>
        <p className="car-price">${pricePerDay}/day</p>
        <div className={`car-availability ${available ? "available" : "unavailable"}`}>
          {available ? "Available" : "Not Available"}
        </div>
        <button 
          className="rent-button" 
          onClick={() => onRent(car)}
          disabled={!available}
        >
          Rent Now
        </button>
      </div>
    </div>
  );
};

export default CarCard;
