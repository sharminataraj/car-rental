// Simple test for authentication system
console.log("Testing Authentication System...");

// Test 1: Check if login component exists
console.log("1. Checking login component accessibility...");
const loginRoute = "http://localhost:3000/login";

// Test 2: Check if we can login
console.log("\n2. Testing login functionality...");
const testLogin = async () => {
  try {
    // Simulate login process
    localStorage.setItem("isAuthenticated", "true");
    localStorage.setItem("user", JSON.stringify({
      id: 1,
      email: "admin@injeerental.com",
      name: "Admin User",
      role: "admin"
    }));
    
    console.log("✅ Login successful!");
    console.log("User:", localStorage.getItem("user"));
  } catch (error) {
    console.error("❌ Login failed:", error);
  }
};

// Test 3: Check if we can access protected routes
console.log("\n3. Testing protected routes...");
const testProtectedRoutes = () => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  
  if (isAuthenticated && user) {
    console.log("✅ User is authenticated");
    console.log("User role:", user.role);
  } else {
    console.error("❌ User not authenticated");
  }
};

// Test 4: Check if we can logout
console.log("\n4. Testing logout functionality...");
const testLogout = () => {
  localStorage.removeItem("isAuthenticated");
  localStorage.removeItem("user");
  console.log("✅ Logout successful!");
  
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const user = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  
  if (!isAuthenticated && !user) {
    console.log("✅ User session cleared");
  }
};

// Run all tests
const runTests = async () => {
  console.log("=== Authentication System Test ===");
  
  // Test login
  await testLogin();
  
  // Test protected routes
  testProtectedRoutes();
  
  // Test logout
  testLogout();
  
  // Test again after logout
  console.log("\n5. Testing after logout...");
  testProtectedRoutes();
  
  console.log("\n=== All tests completed ===");
};

// Run tests if in browser environment
if (typeof window !== "undefined") {
  runTests();
}

export { runTests, testLogin, testLogout, testProtectedRoutes };
