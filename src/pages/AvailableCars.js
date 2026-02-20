import React, { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import CarCard from "../components/CarCard";
import BookingModal from "../components/Booking/BookingModal";
import BookingConfirmation from "../components/Booking/BookingConfirmation";
import { useCurrency } from "../contexts/CurrencyContext";
import { useBooking } from "../contexts/BookingContext";
import carData from "../data/cars.json";
import "./AvailableCars.css";

const AvailableCars = () => {
  const navigate = useNavigate();
  const { formatPrice, currency, setCurrency } = useCurrency();
  const { getCarAvailability } = useBooking();
  
  // State management
  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("grid");
  
  // Booking modal state
  const [selectedCar, setSelectedCar] = useState(null);
  const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
  const [completedBooking, setCompletedBooking] = useState(null);
  const [showConfirmation, setShowConfirmation] = useState(false);
  
  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [selectedTransmission, setSelectedTransmission] = useState("all");
  const [selectedFuelType, setSelectedFuelType] = useState("all");
  const [showAvailableOnly, setShowAvailableOnly] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  
  // Price range slider state
  const [priceRange, setPriceRange] = useState([0, 300]);
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(300);

  // Categories with icons
  const categories = [
    { id: "all", label: "All Categories", icon: "🚗" },
    { id: "Sedan", label: "Sedan", icon: "🚙" },
    { id: "SUV", label: "SUV", icon: "🚐" },
    { id: "Sports", label: "Sports", icon: "🏎️" },
    { id: "Luxury", label: "Luxury", icon: "✨" },
    { id: "Electric", label: "Electric", icon: "⚡" },
    { id: "Economy", label: "Economy", icon: "💰" }
  ];

  // Price ranges
  const priceRanges = [
    { id: "all", label: "All Prices", min: 0, max: Infinity },
    { id: "budget", label: "Budget (Under ₹2,500)", min: 0, max: 2500 },
    { id: "mid", label: "Mid-Range (₹2,500-₹5,000)", min: 2500, max: 5000 },
    { id: "premium", label: "Premium (₹5,000+)", min: 5000, max: Infinity }
  ];

  // Sort options
  const sortOptions = [
    { id: "name", label: "Name (A-Z)" },
    { id: "price-low", label: "Price: Low to High" },
    { id: "price-high", label: "Price: High to Low" },
    { id: "year", label: "Year (Newest)" },
    { id: "rating", label: "Rating" }
  ];

  // Load cars data
  useEffect(() => {
    loadCars();
  }, []);

  const loadCars = async () => {
    try {
      setLoading(true);
      // Use local data directly
      const data = carData;
      setCars(data);
      
      // Set price range based on actual data
      if (data.length > 0) {
        const prices = data.map(car => car.pricePerDay);
        const min = Math.min(...prices);
        const max = Math.max(...prices);
        setMinPrice(Math.floor(min * 83)); // Convert to INR (approx 83 INR per USD)
        setMaxPrice(Math.ceil(max * 83));
        setPriceRange([Math.floor(min * 83), Math.ceil(max * 83)]);
      }
      
      setError(null);
    } catch (err) {
      setError("Failed to load cars. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Get USD price from INR
  const getUSDPrice = (inrPrice) => {
    return Math.round(inrPrice / 83);
  };

  // Filtered and sorted cars
  const filteredCars = useMemo(() => {
    let result = [...cars];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(car =>
        car.brand.toLowerCase().includes(query) ||
        car.model.toLowerCase().includes(query) ||
        car.description?.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (selectedCategory !== "all") {
      result = result.filter(car => car.category === selectedCategory);
    }

    // Price range filter (using slider) - convert INR to USD for comparison
    const minUSD = getUSDPrice(priceRange[0]);
    const maxUSD = getUSDPrice(priceRange[1]);
    result = result.filter(car => 
      car.pricePerDay >= minUSD && car.pricePerDay <= maxUSD
    );

    // Transmission filter
    if (selectedTransmission !== "all") {
      result = result.filter(car => car.transmission === selectedTransmission);
    }

    // Fuel type filter
    if (selectedFuelType !== "all") {
      result = result.filter(car => car.fuelType === selectedFuelType);
    }

    // Available only filter
    if (showAvailableOnly) {
      result = result.filter(car => car.available && getCarAvailability(car.id));
    }

    // Sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "name":
          return `${a.brand} ${a.model}`.localeCompare(`${b.brand} ${b.model}`);
        case "price-low":
          return a.pricePerDay - b.pricePerDay;
        case "price-high":
          return b.pricePerDay - a.pricePerDay;
        case "year":
          return b.year - a.year;
        case "rating":
          return (b.conditionRating || 0) - (a.conditionRating || 0);
        default:
          return 0;
      }
    });

    return result;
  }, [cars, searchQuery, selectedCategory, priceRange, selectedTransmission, selectedFuelType, showAvailableOnly, sortBy, getCarAvailability]);

  // Clear all filters
  const clearFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedPriceRange("all");
    setSelectedTransmission("all");
    setSelectedFuelType("all");
    setShowAvailableOnly(false);
    setSortBy("name");
    setPriceRange([minPrice, maxPrice]);
  };

  // Handle book action
  const handleBook = (car) => {
    if (!car.available) {
      toast.error("This car is currently not available for rental.");
      return;
    }
    
    if (!getCarAvailability(car.id)) {
      toast.warning("This car has existing bookings. Please check availability for your dates.");
    }
    
    setSelectedCar(car);
    setIsBookingModalOpen(true);
  };

  // Handle booking complete
  const handleBookingComplete = (booking) => {
    setCompletedBooking(booking);
    setIsBookingModalOpen(false);
    setShowConfirmation(true);
    toast.success("Booking confirmed successfully!");
  };

  // Handle close modal
  const handleCloseBookingModal = () => {
    setIsBookingModalOpen(false);
    setSelectedCar(null);
  };

  // Handle close confirmation
  const handleCloseConfirmation = () => {
    setShowConfirmation(false);
    setCompletedBooking(null);
  };

  // Count active filters
  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (searchQuery) count++;
    if (selectedCategory !== "all") count++;
    if (priceRange[0] !== minPrice || priceRange[1] !== maxPrice) count++;
    if (selectedTransmission !== "all") count++;
    if (selectedFuelType !== "all") count++;
    if (showAvailableOnly) count++;
    return count;
  }, [searchQuery, selectedCategory, priceRange, selectedTransmission, selectedFuelType, showAvailableOnly, minPrice, maxPrice]);

  // Get unique values for filters
  const transmissions = useMemo(() => {
    const trans = new Set(cars.map(car => car.transmission).filter(Boolean));
    return ["all", ...Array.from(trans)];
  }, [cars]);

  const fuelTypes = useMemo(() => {
    const fuels = new Set(cars.map(car => car.fuelType).filter(Boolean));
    return ["all", ...Array.from(fuels)];
  }, [cars]);

  // Handle price range change
  const handlePriceRangeChange = (index, value) => {
    const newRange = [...priceRange];
    newRange[index] = parseInt(value);
    
    // Ensure min doesn't exceed max
    if (index === 0 && newRange[0] > newRange[1]) {
      newRange[1] = newRange[0];
    } else if (index === 1 && newRange[1] < newRange[0]) {
      newRange[0] = newRange[1];
    }
    
    setPriceRange(newRange);
  };

  // Handle currency toggle
  const toggleCurrency = () => {
    if (currency === 'USD') {
      setCurrency('INR');
    } else {
      setCurrency('USD');
    }
  };

  if (loading) {
    return (
      <div className="available-cars-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Loading available cars...</p>
        </div>
      </div>
    );
  }

  if (error && cars.length === 0) {
    return (
      <div className="available-cars-page">
        <div className="error-container">
          <div className="error-icon">⚠️</div>
          <h3>Unable to Load Cars</h3>
          <p>{error}</p>
          <button className="retry-button" onClick={loadCars}>
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="available-cars-page">
      {/* Hero Header */}
      <div className="page-hero">
        <div className="hero-content">
          <h1>Available Cars for Rental</h1>
          <p>Discover our premium fleet of vehicles for every occasion</p>
          <div className="hero-stats">
            <div className="stat">
              <span className="stat-number">{cars.length}</span>
              <span className="stat-label">Total Vehicles</span>
            </div>
            <div className="stat">
              <span className="stat-number">{cars.filter(c => c.available && getCarAvailability(c.id)).length}</span>
              <span className="stat-label">Available Now</span>
            </div>
            <div className="stat">
              <span className="stat-number">{new Set(cars.map(c => c.category)).size}</span>
              <span className="stat-label">Categories</span>
            </div>
          </div>
        </div>
      </div>

      <div className="page-content">
        {/* Mobile Filter Toggle */}
        <button 
          className="mobile-filter-toggle"
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        >
          <span className="filter-icon">🔍</span>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="filter-badge">{activeFilterCount}</span>
          )}
        </button>

        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${isSidebarOpen ? "open" : ""}`}>
          <div className="sidebar-header">
            <h2>Filters</h2>
            {activeFilterCount > 0 && (
              <button className="clear-filters" onClick={clearFilters}>
                Clear All
              </button>
            )}
          </div>

          {/* Search */}
          <div className="filter-section">
            <label className="filter-label">Search</label>
            <div className="search-input-wrapper">
              <input
                type="text"
                placeholder="Search by brand, model..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="search-input"
              />
              <span className="search-icon">🔍</span>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="filter-section quick-actions">
            <label className="filter-label">Quick Actions</label>
            <div className="quick-action-buttons">
              <button 
                className={`quick-action-btn ${showAvailableOnly ? 'active' : ''}`}
                onClick={() => setShowAvailableOnly(!showAvailableOnly)}
              >
                <span className="action-icon">✓</span>
                Available Only
              </button>
              <button 
                className="quick-action-btn"
                onClick={clearFilters}
              >
                <span className="action-icon">↺</span>
                Reset All
              </button>
              <button 
                className="quick-action-btn currency-toggle"
                onClick={toggleCurrency}
              >
                <span className="action-icon">💱</span>
                {currency === 'USD' ? 'Switch to INR' : 'Switch to USD'}
              </button>
            </div>
          </div>

          {/* Category Filter */}
          <div className="filter-section">
            <label className="filter-label">Category</label>
            <div className="category-buttons">
              {categories.map(cat => (
                <button
                  key={cat.id}
                  className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                  onClick={() => setSelectedCategory(cat.id)}
                >
                  <span className="category-icon">{cat.icon}</span>
                  <span className="category-label">{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range Slider */}
          <div className="filter-section">
            <label className="filter-label">Price Range (per day)</label>
            <div className="price-slider-container">
              <div className="price-display">
                <span>₹{priceRange[0].toLocaleString()}</span>
                <span> - </span>
                <span>₹{priceRange[1].toLocaleString()}</span>
              </div>
              <div className="range-inputs">
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceRangeChange(0, e.target.value)}
                  className="range-slider"
                />
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceRangeChange(1, e.target.value)}
                  className="range-slider"
                />
              </div>
              <div className="price-presets">
                {priceRanges.map(range => (
                  <button
                    key={range.id}
                    className={`preset-btn ${priceRange[0] === range.min && priceRange[1] === range.max ? 'active' : ''}`}
                    onClick={() => setPriceRange([range.min === 0 ? minPrice : range.min, range.max === Infinity ? maxPrice : range.max])}
                  >
                    {range.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Transmission Filter */}
          <div className="filter-section">
            <label className="filter-label">Transmission</label>
            <select
              value={selectedTransmission}
              onChange={(e) => setSelectedTransmission(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Transmissions</option>
              {transmissions.filter(t => t !== "all").map(trans => (
                <option key={trans} value={trans}>{trans}</option>
              ))}
            </select>
          </div>

          {/* Fuel Type Filter */}
          <div className="filter-section">
            <label className="filter-label">Fuel Type</label>
            <select
              value={selectedFuelType}
              onChange={(e) => setSelectedFuelType(e.target.value)}
              className="filter-select"
            >
              <option value="all">All Fuel Types</option>
              {fuelTypes.filter(f => f !== "all").map(fuel => (
                <option key={fuel} value={fuel}>{fuel}</option>
              ))}
            </select>
          </div>

          {/* Close sidebar button for mobile */}
          <button 
            className="close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
          >
            Apply Filters
          </button>
        </aside>

        {/* Main Content */}
        <main className="cars-main">
          {/* Results Header */}
          <div className="results-header">
            <div className="results-info">
              <h2>{filteredCars.length} Cars Found</h2>
              {activeFilterCount > 0 && (
                <span className="active-filters">
                  {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} applied
                </span>
              )}
            </div>
            
            <div className="results-controls">
              {/* Sort Dropdown */}
              <div className="sort-wrapper">
                <label>Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="sort-select"
                >
                  {sortOptions.map(option => (
                    <option key={option.id} value={option.id}>{option.label}</option>
                  ))}
                </select>
              </div>

              {/* View Mode Toggle */}
              <div className="view-toggle">
                <button
                  className={`view-btn ${viewMode === "grid" ? "active" : ""}`}
                  onClick={() => setViewMode("grid")}
                  title="Grid View"
                >
                  ▦
                </button>
                <button
                  className={`view-btn ${viewMode === "list" ? "active" : ""}`}
                  onClick={() => setViewMode("list")}
                  title="List View"
                >
                  ≡
                </button>
              </div>
            </div>
          </div>

          {/* Cars Grid/List */}
          {filteredCars.length > 0 ? (
            <div className={`cars-container ${viewMode}`}>
              {filteredCars.map(car => (
                <CarCard
                  key={car.id}
                  car={car}
                  onBook={handleBook}
                  viewMode={viewMode}
                />
              ))}
            </div>
          ) : (
            <div className="no-results">
              <div className="no-results-icon">🚗</div>
              <h3>No Cars Found</h3>
              <p>Try adjusting your filters to see more results</p>
              <button className="reset-button" onClick={clearFilters}>
                Reset Filters
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Booking Modal */}
      {selectedCar && (
        <BookingModal
          car={selectedCar}
          isOpen={isBookingModalOpen}
          onClose={handleCloseBookingModal}
          onBookingComplete={handleBookingComplete}
        />
      )}

      {/* Booking Confirmation */}
      {completedBooking && (
        <BookingConfirmation
          booking={completedBooking}
          isOpen={showConfirmation}
          onClose={handleCloseConfirmation}
        />
      )}

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div 
          className="sidebar-overlay"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}
    </div>
  );
};

export default AvailableCars;
