import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import "./VehicleForm.css";

const VehicleForm = ({ vehicle, onSubmit, onCancel }) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [selectedFeatures, setSelectedFeatures] = useState([]);
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  const { register, handleSubmit, setValue } = useForm({
    defaultValues: vehicle || {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      color: "",
      vin: "",
      licensePlate: "",
      odometer: 0,
      fuelType: "Petrol",
      transmission: "Automatic",
      category: "Economy",
      seatingCapacity: 5,
      luggageCapacity: "3 suitcases",
      pricePerDay: 0,
      weeklyPrice: 0,
      insuranceRate: 0,
      depositAmount: 0,
      conditionRating: 5,
      features: [],
      amenities: [],
      available: true,
      status: "active",
      notes: ""
    }
  });

  useEffect(() => {
    if (vehicle) {
      setSelectedFeatures(vehicle.features || []);
      setSelectedAmenities(vehicle.amenities || []);
    }
  }, [vehicle]);

  const availableFeatures = [
    "Air Conditioning",
    "Bluetooth",
    "Navigation",
    "Backup Camera",
    "Parking Sensors",
    "Sunroof",
    "Leather Seats",
    "Heated Seats",
    "Blind Spot Monitoring",
    "Lane Departure Warning",
    "Adaptive Cruise Control",
    "Apple CarPlay",
    "Android Auto"
  ];

  const availableAmenities = [
    "USB Charger",
    "Charging Cable",
    "Child Seat",
    "Roadside Assistance",
    "GPS Navigation",
    "Additional Insurance",
    "Toll Pass"
  ];

  const fuelTypes = ["Petrol", "Diesel", "Electric", "Hybrid"];
  const transmissions = ["Automatic", "Manual"];
  const categories = ["Economy", "Compact", "Mid-size", "SUV", "Premium", "Luxury"];
  const statuses = ["active", "maintenance", "archived"];

  const validateForm = (data) => {
    const newErrors = {};

    if (!data.brand.trim()) {
      newErrors.brand = "Brand is required";
    }

    if (!data.model.trim()) {
      newErrors.model = "Model is required";
    }

    if (!data.year || data.year < 2010 || data.year > 2025) {
      newErrors.year = "Year must be between 2010 and 2025";
    }

    if (!data.color.trim()) {
      newErrors.color = "Color is required";
    }

    if (!data.vin.trim() || data.vin.length < 17) {
      newErrors.vin = "VIN must be at least 17 characters";
    }

    if (!data.licensePlate.trim()) {
      newErrors.licensePlate = "License plate is required";
    }

    if (data.odometer < 0) {
      newErrors.odometer = "Odometer cannot be negative";
    }

    if (data.pricePerDay <= 0) {
      newErrors.pricePerDay = "Daily price must be greater than 0";
    }

    if (data.weeklyPrice <= 0) {
      newErrors.weeklyPrice = "Weekly price must be greater than 0";
    }

    if (data.insuranceRate < 0) {
      newErrors.insuranceRate = "Insurance rate cannot be negative";
    }

    if (data.depositAmount < 0) {
      newErrors.depositAmount = "Deposit cannot be negative";
    }

    if (data.conditionRating < 1 || data.conditionRating > 5) {
      newErrors.conditionRating = "Condition rating must be between 1 and 5";
    }

    return newErrors;
  };

  const handleFormSubmit = async (data) => {
    setErrors({});
    const validationErrors = validateForm(data);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    
    try {
      const formData = {
        ...data,
        features: selectedFeatures,
        amenities: selectedAmenities,
        weeklyPrice: data.weeklyPrice || data.pricePerDay * 6,
        insuranceRate: data.insuranceRate || data.pricePerDay * 0.05,
        depositAmount: data.depositAmount || data.pricePerDay * 2
      };

      await onSubmit(formData);
    } catch (error) {
      console.error("Error saving vehicle:", error);
      setErrors({ submit: "Failed to save vehicle. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = (feature) => {
    setSelectedFeatures(prev => 
      prev.includes(feature) 
        ? prev.filter(f => f !== feature)
        : [...prev, feature]
    );
  };

  const toggleAmenity = (amenity) => {
    setSelectedAmenities(prev => 
      prev.includes(amenity) 
        ? prev.filter(a => a !== amenity)
        : [...prev, amenity]
    );
  };

  return (
    <div className="vehicle-form-overlay">
      <div className="vehicle-form">
        <div className="form-header">
          <h2>{vehicle ? "Edit Vehicle" : "Add New Vehicle"}</h2>
          <button className="close-button" onClick={onCancel}>×</button>
        </div>

        <form onSubmit={handleSubmit(handleFormSubmit)}>
          {/* Basic Information */}
          <div className="form-section">
            <h3>Basic Information</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="brand">Brand</label>
                <input
                  type="text"
                  id="brand"
                  {...register("brand")}
                  className={errors.brand ? "error" : ""}
                  placeholder="e.g., Toyota"
                />
                {errors.brand && <div className="error-message">{errors.brand}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="model">Model</label>
                <input
                  type="text"
                  id="model"
                  {...register("model")}
                  className={errors.model ? "error" : ""}
                  placeholder="e.g., Camry"
                />
                {errors.model && <div className="error-message">{errors.model}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="year">Year</label>
                <input
                  type="number"
                  id="year"
                  {...register("year", { valueAsNumber: true })}
                  className={errors.year ? "error" : ""}
                  min="2010"
                  max="2025"
                />
                {errors.year && <div className="error-message">{errors.year}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="color">Color</label>
                <input
                  type="text"
                  id="color"
                  {...register("color")}
                  className={errors.color ? "error" : ""}
                  placeholder="e.g., Black"
                />
                {errors.color && <div className="error-message">{errors.color}</div>}
              </div>
            </div>
          </div>

          {/* Vehicle Details */}
          <div className="form-section">
            <h3>Vehicle Details</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="vin">VIN Number</label>
                <input
                  type="text"
                  id="vin"
                  {...register("vin")}
                  className={errors.vin ? "error" : ""}
                  placeholder="e.g., 1HGBH41JXMN109186"
                />
                {errors.vin && <div className="error-message">{errors.vin}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="licensePlate">License Plate</label>
                <input
                  type="text"
                  id="licensePlate"
                  {...register("licensePlate")}
                  className={errors.licensePlate ? "error" : ""}
                  placeholder="e.g., ABC123"
                />
                {errors.licensePlate && <div className="error-message">{errors.licensePlate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="odometer">Odometer Reading</label>
                <input
                  type="number"
                  id="odometer"
                  {...register("odometer", { valueAsNumber: true })}
                  className={errors.odometer ? "error" : ""}
                  placeholder="e.g., 50000"
                  min="0"
                />
                {errors.odometer && <div className="error-message">{errors.odometer}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="fuelType">Fuel Type</label>
                <select
                  id="fuelType"
                  {...register("fuelType")}
                >
                  {fuelTypes.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="transmission">Transmission</label>
                <select
                  id="transmission"
                  {...register("transmission")}
                >
                  {transmissions.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="category">Category</label>
                <select
                  id="category"
                  {...register("category")}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="seatingCapacity">Seating Capacity</label>
                <input
                  type="number"
                  id="seatingCapacity"
                  {...register("seatingCapacity", { valueAsNumber: true })}
                  min="2"
                  max="12"
                />
              </div>

              <div className="form-group">
                <label htmlFor="luggageCapacity">Luggage Capacity</label>
                <input
                  type="text"
                  id="luggageCapacity"
                  {...register("luggageCapacity")}
                  placeholder="e.g., 3 suitcases"
                />
              </div>
            </div>
          </div>

          {/* Pricing & Insurance */}
          <div className="form-section">
            <h3>Pricing & Insurance</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="pricePerDay">Daily Price</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    id="pricePerDay"
                    {...register("pricePerDay", { valueAsNumber: true })}
                    className={errors.pricePerDay ? "error" : ""}
                    placeholder="e.g., 50"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.pricePerDay && <div className="error-message">{errors.pricePerDay}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="weeklyPrice">Weekly Price</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    id="weeklyPrice"
                    {...register("weeklyPrice", { valueAsNumber: true })}
                    className={errors.weeklyPrice ? "error" : ""}
                    placeholder="e.g., 300"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.weeklyPrice && <div className="error-message">{errors.weeklyPrice}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="insuranceRate">Insurance Rate</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    id="insuranceRate"
                    {...register("insuranceRate", { valueAsNumber: true })}
                    className={errors.insuranceRate ? "error" : ""}
                    placeholder="e.g., 2.50"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.insuranceRate && <div className="error-message">{errors.insuranceRate}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="depositAmount">Deposit Amount</label>
                <div className="price-input">
                  <span className="currency">$</span>
                  <input
                    type="number"
                    id="depositAmount"
                    {...register("depositAmount", { valueAsNumber: true })}
                    className={errors.depositAmount ? "error" : ""}
                    placeholder="e.g., 100"
                    min="0"
                    step="0.01"
                  />
                </div>
                {errors.depositAmount && <div className="error-message">{errors.depositAmount}</div>}
              </div>
            </div>
          </div>

          {/* Condition & Status */}
          <div className="form-section">
            <h3>Condition & Status</h3>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="conditionRating">Condition Rating</label>
                <div className="rating-input">
                  {[1, 2, 3, 4, 5].map(rating => (
                    <button
                      key={rating}
                      type="button"
                      className={`rating-star ${rating <= (vehicle?.conditionRating || 5) ? "filled" : ""}`}
                      onClick={() => setValue("conditionRating", rating)}
                    >
                      ★
                    </button>
                  ))}
                </div>
                {errors.conditionRating && <div className="error-message">{errors.conditionRating}</div>}
              </div>

              <div className="form-group">
                <label htmlFor="status">Status</label>
                <select
                  id="status"
                  {...register("status")}
                >
                  {statuses.map(status => (
                    <option key={status} value={status}>
                      {status.charAt(0).toUpperCase() + status.slice(1)}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="available">Availability</label>
                <div className="checkbox-wrapper">
                  <input
                    type="checkbox"
                    id="available"
                    {...register("available")}
                    checked={register("available").value || true}
                  />
                  <label for="available">Available for rent</label>
                </div>
              </div>
            </div>
          </div>

          {/* Features & Amenities */}
          <div className="form-section">
            <h3>Features & Amenities</h3>
            <div className="form-grid">
              <div className="form-group">
                <label>Features</label>
                <div className="checkbox-grid">
                  {availableFeatures.map(feature => (
                    <div key={feature} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`feature-${feature}`}
                        checked={selectedFeatures.includes(feature)}
                        onChange={() => toggleFeature(feature)}
                      />
                      <label for={`feature-${feature}`}>{feature}</label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="form-group">
                <label>Amenities</label>
                <div className="checkbox-grid">
                  {availableAmenities.map(amenity => (
                    <div key={amenity} className="checkbox-item">
                      <input
                        type="checkbox"
                        id={`amenity-${amenity}`}
                        checked={selectedAmenities.includes(amenity)}
                        onChange={() => toggleAmenity(amenity)}
                      />
                      <label for={`amenity-${amenity}`}>{amenity}</label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Additional Notes */}
          <div className="form-section">
            <h3>Additional Notes</h3>
            <div className="form-group">
              <label htmlFor="notes">Notes</label>
              <textarea
                id="notes"
                {...register("notes")}
                rows="4"
                placeholder="Any additional information about this vehicle..."
              />
            </div>
          </div>

          {/* Form Errors */}
          {errors.submit && (
            <div className="submit-error">{errors.submit}</div>
          )}

          {/* Form Actions */}
          <div className="form-actions">
            <button type="button" className="btn-secondary" onClick={onCancel} disabled={loading}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={loading}>
              {loading ? "Saving..." : (vehicle ? "Update Vehicle" : "Add Vehicle")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default VehicleForm;
