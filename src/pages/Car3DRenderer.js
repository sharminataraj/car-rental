import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import CarRenderer from "../components/3D/CarRenderer";
import carApi from "../services/api";
import "./Car3DRenderer.css";

const Car3DRenderer = () => {
  const { carId } = useParams();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCarData = async () => {
      try {
        setLoading(true);
        // For demo purposes, we'll use static data if carId is 1
        if (carId === "1") {
          // Mock data for Tesla Model 3
          setCar({
            id: 1,
            brand: "Tesla",
            model: "Model 3",
            year: 2024,
            pricePerDay: 80,
            available: false,
            image: "https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=400&h=300&fit=crop",
            description: "Electric sedan with cutting-edge technology",
            category: "Electric",
            fuelType: "Electric",
            transmission: "Automatic",
            seatingCapacity: 5,
            luggageCapacity: "3 suitcases",
            weeklyPrice: 500,
            conditionRating: 5,
            color: "#e63946" // Red color
          });
        } else {
          const cars = await carApi.getCars();
          const selectedCar = cars.find(c => c.id === parseInt(carId));
          setCar(selectedCar);
        }
      } catch (error) {
        console.error("Error fetching car data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarData();
  }, [carId]);

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading 3D model...</p>
      </div>
    );
  }

  if (!car) {
    return (
      <div className="error-container">
        <h1>Car not found</h1>
        <p>The requested car could not be found in the database.</p>
      </div>
    );
  }

  return (
    <div className="car-3d-renderer-page">
      <div className="page-header">
        <h1>3D Car Rendering</h1>
        <p>High-quality 3D visualization with realistic materials and lighting</p>
      </div>
      
      <div className="renderer-content">
        <CarRenderer carData={car} />
      </div>
    </div>
  );
};

export default Car3DRenderer;