// Test file to verify data loading
import carApi from "./services/api";
import initialCarData from "./data/cars.json";

console.log("=== Data Loading Test ===");

console.log("\n1. Initial car data from JSON file:");
console.log(initialCarData.length, "cars");

console.log("\n2. Checking localStorage:");
const cars = localStorage.getItem("injee_cars");
console.log("Cars in localStorage:", cars ? `${JSON.parse(cars).length} items` : "none");

console.log("\n3. Calling carApi.getCars():");
carApi.getCars().then(carsData => {
  console.log("Successfully fetched", carsData.length, "cars");
  if (carsData.length > 0) {
    console.log("First car:", carsData[0]);
  }
}).catch(error => {
  console.error("Error fetching cars:", error);
});

console.log("\n4. Calling carApi.getRentals():");
carApi.getRentals().then(rentalsData => {
  console.log("Successfully fetched", rentalsData.length, "rentals");
  if (rentalsData.length > 0) {
    console.log("First rental:", rentalsData[0]);
  }
}).catch(error => {
  console.error("Error fetching rentals:", error);
});

console.log("\n=== Test completed ===");
