import React, { useState, useEffect } from "react";
import carApi from "../services/api";

const TestComponent = () => {
  const [cars, setCars] = useState([]);
  const [rentals, setRentals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.log("Fetching cars...");
        const carsData = await carApi.getCars();
        console.log("Cars data:", carsData);
        setCars(carsData);

        console.log("Fetching rentals...");
        const rentalsData = await carApi.getRentals();
        console.log("Rentals data:", rentalsData);
        setRentals(rentalsData);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <div>Loading data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ padding: "20px" }}>
      <h1>Test Component - Data Verification</h1>
      
      <div style={{ marginBottom: "20px" }}>
        <h2>Cars ({cars.length} items)</h2>
        {cars.length === 0 ? (
          <p>No cars found in localStorage</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {cars.map(car => (
              <li key={car.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
                {car.brand} {car.model} - {car.pricePerDay}/day
              </li>
            ))}
          </ul>
        )}
      </div>

      <div>
        <h2>Rentals ({rentals.length} items)</h2>
        {rentals.length === 0 ? (
          <p>No rentals found in localStorage</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0 }}>
            {rentals.map(rental => (
              <li key={rental.id} style={{ marginBottom: "10px", padding: "10px", border: "1px solid #ccc", borderRadius: "4px" }}>
                Rental ID: {rental.id} - Status: {rental.status}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div style={{ marginTop: "20px", fontSize: "0.8rem", color: "#666" }}>
        <h3>Debug Info:</h3>
        <p>LocalStorage keys: {Object.keys(localStorage).join(", ")}</p>
      </div>
    </div>
  );
};

export default TestComponent;
