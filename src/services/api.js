// API service using Injee REST API with comprehensive vehicle management
import initialCarData from "../data/cars.json";

// Fallback to localStorage for development purposes
const CARS_KEY = "injee_cars";
const RENTALS_KEY = "injee_rentals";
const ARCHIVED_CARS_KEY = "injee_archived_cars";

const initializeLocalStorageData = () => {
  console.log("Initializing localStorage data...");
  console.log("Current cars in localStorage:", localStorage.getItem(CARS_KEY) ? JSON.parse(localStorage.getItem(CARS_KEY)).length : 0);
  
  if (!localStorage.getItem(CARS_KEY)) {
    console.log("No cars found in localStorage, initializing with sample data...");
    const enrichedCars = initialCarData.map(car => ({
      ...car,
      status: "active",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      lastMaintenance: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      features: ["Air Conditioning", "Bluetooth", "Navigation", "Backup Camera", "Parking Sensors"],
      amenities: ["USB Charger", "Charging Cable", "Child Seat", "Roadside Assistance"],
      insuranceRate: car.pricePerDay * 0.05,
      depositAmount: car.pricePerDay * 2,
      // Preserve existing fields from cars.json or add defaults
      weeklyPrice: car.weeklyPrice || car.pricePerDay * 6,
      luggageCapacity: car.luggageCapacity || "3 suitcases",
      fuelType: car.fuelType || ["Petrol", "Diesel", "Electric", "Hybrid"][Math.floor(Math.random() * 4)],
      transmission: car.transmission || ["Automatic", "Manual"][Math.floor(Math.random() * 2)],
      category: car.category || ["Economy", "Compact", "Mid-size", "SUV", "Premium", "Luxury"][Math.floor(Math.random() * 6)],
      conditionRating: car.conditionRating || Math.floor(Math.random() * 5) + 3
    }));
    localStorage.setItem(CARS_KEY, JSON.stringify(enrichedCars));
    console.log("Successfully initialized localStorage with", enrichedCars.length, "cars");
  }
  
  // Initialize rentals if not present
  if (!localStorage.getItem(RENTALS_KEY)) {
    console.log("No rentals found in localStorage, initializing with empty array...");
    localStorage.setItem(RENTALS_KEY, JSON.stringify([]));
  }
};

// Get cars from local storage
const getStoredCars = () => {
  const cars = localStorage.getItem(CARS_KEY);
  return cars ? JSON.parse(cars) : [];
};

// Save cars to local storage
const saveCars = (cars) => {
  localStorage.setItem(CARS_KEY, JSON.stringify(cars));
};

// Get archived cars from local storage
const getArchivedCars = () => {
  const archived = localStorage.getItem(ARCHIVED_CARS_KEY);
  return archived ? JSON.parse(archived) : [];
};

// Save archived cars to local storage
const saveArchivedCars = (archived) => {
  localStorage.setItem(ARCHIVED_CARS_KEY, JSON.stringify(archived));
};

// Get rentals from local storage
const getStoredRentals = () => {
  const rentals = localStorage.getItem(RENTALS_KEY);
  return rentals ? JSON.parse(rentals) : [];
};

// Save rentals to local storage
const saveRentals = (rentals) => {
  localStorage.setItem(RENTALS_KEY, JSON.stringify(rentals));
};

// Initialize data when API service is loaded
console.log("Initializing API service...");
initializeLocalStorageData(); // Always initialize localStorage as fallback
console.log("LocalStorage initialized, cars count:", getStoredCars().length);

// API configuration
const API_BASE_URL = "http://localhost:4125/api";

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const defaultOptions = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const response = await fetch(url, { ...defaultOptions, ...options });
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    // For DELETE requests, return true instead of parsing JSON
    if (options.method === "DELETE") {
      return true;
    }

    return await response.json();
  } catch (error) {
    console.error(`Error ${options.method || "GET"} ${endpoint}:`, error);
    throw error;
  }
};

// Car management API endpoints
export const carApi = {
  // Get all active cars
  getCars: async () => {
    try {
      const cars = await apiRequest("/cars");
      return cars.filter(car => car.status !== "archived");
    } catch (error) {
      console.error("Error fetching cars:", error);
      // Fallback to localStorage if API fails
      return getStoredCars().filter(car => car.status !== "archived");
    }
  },

  // Get all cars including archived
  getAllCars: async () => {
    try {
      return await apiRequest("/cars");
    } catch (error) {
      console.error("Error fetching all cars:", error);
      // Fallback to localStorage if API fails
      const active = getStoredCars();
      const archived = getArchivedCars();
      return [...active, ...archived];
    }
  },

  // Get archived cars
  getArchivedCars: async () => {
    try {
      const cars = await apiRequest("/cars");
      return cars.filter(car => car.status === "archived");
    } catch (error) {
      console.error("Error fetching archived cars:", error);
      // Fallback to localStorage if API fails
      return getArchivedCars();
    }
  },

  // Get car by ID
  getCarById: async (id) => {
    try {
      return await apiRequest(`/cars/${id}`);
    } catch (error) {
      console.error("Error fetching car:", error);
      // Fallback to localStorage if API fails
      const allCars = await carApi.getAllCars();
      return allCars.find((car) => car.id === parseInt(id)) || null;
    }
  },

  // Create new car
  createCar: async (carData) => {
    try {
      const newCar = {
        id: Date.now(),
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...carData,
        lastMaintenance: new Date().toISOString(),
        insuranceRate: carData.pricePerDay * 0.05,
        depositAmount: carData.pricePerDay * 2,
        weeklyPrice: carData.pricePerDay * 6
      };
      return await apiRequest("/cars", {
        method: "POST",
        body: JSON.stringify(newCar),
      });
    } catch (error) {
      console.error("Error creating car:", error);
      // Fallback to localStorage if API fails
      const cars = getStoredCars();
      const newCar = {
        id: Date.now(),
        status: "active",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        ...carData,
        lastMaintenance: new Date().toISOString(),
        insuranceRate: carData.pricePerDay * 0.05,
        depositAmount: carData.pricePerDay * 2,
        weeklyPrice: carData.pricePerDay * 6
      };
      cars.push(newCar);
      saveCars(cars);
      return newCar;
    }
  },

  // Update car
  updateCar: async (id, carData) => {
    try {
      return await apiRequest(`/cars/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...carData,
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error updating car:", error);
      // Fallback to localStorage if API fails
      const cars = getStoredCars();
      const carIndex = cars.findIndex((car) => car.id === parseInt(id));
      
      if (carIndex === -1) {
        throw new Error("Car not found");
      }

      cars[carIndex] = {
        ...cars[carIndex],
        ...carData,
        updatedAt: new Date().toISOString()
      };

      saveCars(cars);
      return cars[carIndex];
    }
  },

  // Archive car (soft delete)
  archiveCar: async (id) => {
    try {
      return await apiRequest(`/cars/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "archived",
          archivedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error archiving car:", error);
      // Fallback to localStorage if API fails
      const cars = getStoredCars();
      const archived = getArchivedCars();
      const carIndex = cars.findIndex((car) => car.id === parseInt(id));

      if (carIndex === -1) {
        throw new Error("Car not found");
      }

      const [archivedCar] = cars.splice(carIndex, 1);
      archivedCar.status = "archived";
      archivedCar.archivedAt = new Date().toISOString();
      archived.push(archivedCar);

      saveCars(cars);
      saveArchivedCars(archived);
      return archivedCar;
    }
  },

  // Restore archived car
  restoreCar: async (id) => {
    try {
      return await apiRequest(`/cars/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status: "active",
          archivedAt: null,
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error restoring car:", error);
      // Fallback to localStorage if API fails
      const cars = getStoredCars();
      const archived = getArchivedCars();
      const carIndex = archived.findIndex((car) => car.id === parseInt(id));

      if (carIndex === -1) {
        throw new Error("Car not found in archive");
      }

      const [restoredCar] = archived.splice(carIndex, 1);
      restoredCar.status = "active";
      restoredCar.archivedAt = null;
      restoredCar.updatedAt = new Date().toISOString();
      cars.push(restoredCar);

      saveCars(cars);
      saveArchivedCars(archived);
      return restoredCar;
    }
  },

  // Create rental booking
  createRental: async (rentalData) => {
    try {
      const newRental = {
        id: Date.now(),
        ...rentalData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      const createdRental = await apiRequest("/rentals", {
        method: "POST",
        body: JSON.stringify(newRental),
      });
      
      // Update car availability
      if (rentalData.carId) {
        await apiRequest(`/cars/${rentalData.carId}`, {
          method: "PUT",
          body: JSON.stringify({
            available: false,
            updatedAt: new Date().toISOString(),
          }),
        });
      }

      return createdRental;
    } catch (error) {
      console.error("Error creating rental:", error);
      // Fallback to localStorage if API fails
      const rentals = getStoredRentals();
      const newRental = {
        id: Date.now(),
        ...rentalData,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      rentals.push(newRental);
      saveRentals(rentals);
      
      // Update car availability
      if (rentalData.carId) {
        const cars = getStoredCars();
        const carIndex = cars.findIndex(car => car.id === parseInt(rentalData.carId));
        if (carIndex !== -1) {
          cars[carIndex].available = false;
          saveCars(cars);
        }
      }

      return newRental;
    }
  },

  // Get all rentals
  getRentals: async () => {
    try {
      return await apiRequest("/rentals");
    } catch (error) {
      console.error("Error fetching rentals:", error);
      // Fallback to localStorage if API fails
      return getStoredRentals();
    }
  },

  // Get rental by ID
  getRentalById: async (id) => {
    try {
      return await apiRequest(`/rentals/${id}`);
    } catch (error) {
      console.error("Error fetching rental:", error);
      // Fallback to localStorage if API fails
      const rentals = getStoredRentals();
      return rentals.find(rental => rental.id === parseInt(id)) || null;
    }
  },

  // Update rental
  updateRental: async (id, rentalData) => {
    try {
      return await apiRequest(`/rentals/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          ...rentalData,
          updatedAt: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error("Error updating rental:", error);
      // Fallback to localStorage if API fails
      const rentals = getStoredRentals();
      const rentalIndex = rentals.findIndex((r) => r.id === parseInt(id));
      
      if (rentalIndex === -1) {
        throw new Error("Rental not found");
      }

      rentals[rentalIndex] = {
        ...rentals[rentalIndex],
        ...rentalData,
        updatedAt: new Date().toISOString()
      };

      saveRentals(rentals);
      return rentals[rentalIndex];
    }
  },

  // Update rental status
  updateRentalStatus: async (id, status) => {
    try {
      const updatedRental = await apiRequest(`/rentals/${id}`, {
        method: "PUT",
        body: JSON.stringify({
          status,
          updatedAt: new Date().toISOString(),
        }),
      });
      
      // If status is completed or cancelled, mark car as available
      if (status === "completed" || status === "cancelled") {
        const carId = updatedRental.carId;
        await apiRequest(`/cars/${carId}`, {
          method: "PUT",
          body: JSON.stringify({
            available: true,
            updatedAt: new Date().toISOString(),
          }),
        });
      }

      return updatedRental;
    } catch (error) {
      console.error("Error updating rental status:", error);
      // Fallback to localStorage if API fails
      const rentals = getStoredRentals();
      const rentalIndex = rentals.findIndex((r) => r.id === parseInt(id));
      
      if (rentalIndex === -1) {
        throw new Error("Rental not found");
      }

      rentals[rentalIndex].status = status;
      
      // If status is completed or cancelled, mark car as available
      if (status === "completed" || status === "cancelled") {
        const carId = rentals[rentalIndex].carId;
        const cars = getStoredCars();
        const carIndex = cars.findIndex(car => car.id === parseInt(carId));
        if (carIndex !== -1) {
          cars[carIndex].available = true;
          saveCars(cars);
        }
      }

      saveRentals(rentals);
      return rentals[rentalIndex];
    }
  },
};

export default carApi;
