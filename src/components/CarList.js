import React, { useState, useEffect } from "react";
import CarCard from "./CarCard";
import carApi from "../services/api";
import "./CarList.css";

const CarList = ({ onRentCar }) => {
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      const data = await carApi.getCars();
      setCars(data);
      setError(null);
    } catch (err) {
      setError("Failed to load cars. Please try again.");
      // Mock data for demonstration
      setCars([
        { id: 1, brand: "Toyota", model: "Camry", year: 2024, pricePerDay: 50, available: true },
        { id: 2, brand: "Honda", model: "Civic", year: 2023, pricePerDay: 45, available: true },
        { id: 3, brand: "Tesla", model: "Model 3", year: 2024, pricePerDay: 80, available: false },
        { id: 4, brand: "BMW", model: "3 Series", year: 2023, pricePerDay: 75, available: true },
        { id: 5, brand: "Mercedes", model: "C-Class", year: 2024, pricePerDay: 85, available: true },
        { id: 6, brand: "Ford", model: "Mustang", year: 2023, pricePerDay: 70, available: true },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const filteredCars = filter === "all" 
    ? cars 
    : filter === "available" 
      ? cars.filter(car => car.available)
      : cars.filter(car => !car.available);

  if (loading) {
    return <div className="loading">Loading cars...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="car-list-container">
      <div className="car-list-header">
        <h2>Available Cars</h2>
        <div className="filter-buttons">
          <button 
            className={filter === "all" ? "active" : ""} 
            onClick={() => setFilter("all")}
          >
            All
          </button>
          <button 
            className={filter === "available" ? "active" : ""} 
            onClick={() => setFilter("available")}
          >
            Available
          </button>
          <button 
            className={filter === "unavailable" ? "active" : ""} 
            onClick={() => setFilter("unavailable")}
          >
            Rented
          </button>
        </div>
      </div>
      <div className="car-grid">
        {filteredCars.map((car) => (
          <CarCard key={car.id} car={car} onRent={onRentCar} />
        ))}
      </div>
    </div>
  );
};

export default CarList;
