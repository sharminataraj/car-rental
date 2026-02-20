import React, { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  AreaChart,
  Area
} from "recharts";
import carApi from "../services/api";
import "./DashboardHome.css";
import { useCurrency } from "../contexts/CurrencyContext";

const DashboardHome = () => {
  const { formatPrice, currency } = useCurrency();
  
  const [metrics, setMetrics] = useState({
    totalFleet: 0,
    availableVehicles: 0,
    rentedVehicles: 0,
    maintenanceVehicles: 0,
    dailyRevenue: 0,
    weeklyRevenue: 0,
    monthlyRevenue: 0,
    averageRentalDuration: 0,
    mostPopularCategory: "-",
    occupancyRate: 0
  });

  const [revenueData, setRevenueData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [availabilityData, setAvailabilityData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch cars and rentals
      const [cars, rentals] = await Promise.all([
        carApi.getCars(),
        carApi.getRentals()
      ]);

      // Calculate metrics
      const available = cars.filter(car => car.available && car.status === "active").length;
      const rented = rentals.filter(rental => rental.status === "active").length;
      const maintenance = cars.filter(car => car.status === "maintenance").length;
      const totalFleet = cars.length;

      // Calculate daily, weekly, monthly revenue
      const dailyRevenue = calculateDailyRevenue(rentals);
      const weeklyRevenue = calculateWeeklyRevenue(rentals);
      const monthlyRevenue = calculateMonthlyRevenue(rentals);

      // Calculate average rental duration
      const averageDuration = calculateAverageRentalDuration(rentals);

      // Find most popular category
      const categoryCounts = {};
      rentals.forEach(rental => {
        const car = cars.find(c => c.id === rental.carId);
        if (car && car.category) {
          categoryCounts[car.category] = (categoryCounts[car.category] || 0) + 1;
        }
      });
      
      const mostPopularCategory = Object.keys(categoryCounts).length > 0 
        ? Object.keys(categoryCounts).reduce((a, b) => categoryCounts[a] > categoryCounts[b] ? a : b)
        : "-";

      // Calculate occupancy rate
      const occupancyRate = totalFleet > 0 
        ? Math.round((rented / totalFleet) * 100)
        : 0;

      setMetrics({
        totalFleet,
        availableVehicles: available,
        rentedVehicles: rented,
        maintenanceVehicles: maintenance,
        dailyRevenue,
        weeklyRevenue,
        monthlyRevenue,
        averageRentalDuration: averageDuration,
        mostPopularCategory,
        occupancyRate
      });

      // Generate chart data
      generateChartData(cars, rentals);
      
    } catch (error) {
      console.error("Error loading dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDailyRevenue = (rentals) => {
    const today = new Date().toDateString();
    const todayRentals = rentals.filter(rental => 
      new Date(rental.startDate).toDateString() === today
    );
    return todayRentals.reduce((sum, rental) => sum + (rental.totalPrice || 0), 0);
  };

  const calculateWeeklyRevenue = (rentals) => {
    const now = new Date();
    const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    
    return rentals
      .filter(rental => new Date(rental.startDate) >= weekAgo && new Date(rental.startDate) <= now)
      .reduce((sum, rental) => sum + (rental.totalPrice || 0), 0);
  };

  const calculateMonthlyRevenue = (rentals) => {
    const now = new Date();
    const monthAgo = new Date(now.getFullYear(), now.getMonth(), 1);
    
    return rentals
      .filter(rental => new Date(rental.startDate) >= monthAgo && new Date(rental.startDate) <= now)
      .reduce((sum, rental) => sum + (rental.totalPrice || 0), 0);
  };

  const calculateAverageRentalDuration = (rentals) => {
    const activeRentals = rentals.filter(rental => rental.status === "active");
    if (activeRentals.length === 0) return 0;

    const totalDuration = activeRentals.reduce((total, rental) => {
      const start = new Date(rental.startDate);
      const end = new Date(rental.endDate);
      const duration = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
      return total + duration;
    }, 0);

    return Math.round(totalDuration / activeRentals.length);
  };

  const generateChartData = (cars, rentals) => {
    // Revenue trend over time (last 7 days)
    const revenueTrend = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      
      const dayRentals = rentals.filter(rental => 
        new Date(rental.startDate).toDateString() === date.toDateString()
      );
      
      revenueTrend.push({
        date: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        revenue: dayRentals.reduce((sum, rental) => sum + (rental.totalPrice || 0), 0)
      });
    }

    // Category distribution
    const categoryMap = {};
    cars.forEach(car => {
      categoryMap[car.category] = (categoryMap[car.category] || 0) + 1;
    });

    const categoryDistribution = Object.keys(categoryMap).map(category => ({
      category,
      count: categoryMap[category]
    }));

    // Availability status
    const availableCount = cars.filter(car => car.available && car.status === "active").length;
    const rentedCount = rentals.filter(rental => rental.status === "active").length;
    const maintenanceCount = cars.filter(car => car.status === "maintenance").length;

    const availabilityStats = [
      { name: "Available", value: availableCount, color: "#10b981" },
      { name: "Rented", value: rentedCount, color: "#3b82f6" },
      { name: "Maintenance", value: maintenanceCount, color: "#f59e0b" }
    ].filter(item => item.value > 0);

    setRevenueData(revenueTrend);
    setCategoryData(categoryDistribution);
    setAvailabilityData(availabilityStats);
  };

  const COLORS = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-home">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p>Welcome back! Here's what's happening with your car rental business today.</p>
      </div>

      {/* Metrics Grid */}
      <div className="metrics-grid">
        <div className="metric-card">
          <div className="metric-icon available">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="9" cy="9" r="1"/>
              <circle cx="15" cy="9" r="1"/>
              <path d="M9 15h6"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Total Fleet</h3>
            <div className="metric-value">{metrics.totalFleet}</div>
            <div className="metric-change positive">
              <span>↑ 12%</span>
              <span className="metric-change-label">from last month</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon rented">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Available Vehicles</h3>
            <div className="metric-value">{metrics.availableVehicles}</div>
            <div className="metric-change positive">
              <span>↑ 8%</span>
              <span className="metric-change-label">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon active">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Currently Rented</h3>
            <div className="metric-value">{metrics.rentedVehicles}</div>
            <div className="metric-change negative">
              <span>↓ 2%</span>
              <span className="metric-change-label">from yesterday</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon maintenance">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Maintenance</h3>
            <div className="metric-value">{metrics.maintenanceVehicles}</div>
            <div className="metric-change neutral">
              <span>—</span>
              <span className="metric-change-label">no change</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="12" y1="20" x2="12" y2="10"/>
              <line x1="18" y1="20" x2="18" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="16"/>
            </svg>
          </div>
            <div className="metric-content">
              <h3>Daily Revenue</h3>
              <div className="metric-value">{formatPrice(metrics.dailyRevenue)}</div>
              <div className="metric-change positive">
                <span>↑ 15%</span>
                <span className="metric-change-label">from yesterday</span>
              </div>
            </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon revenue">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 3v18h18"/>
              <path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3"/>
            </svg>
          </div>
            <div className="metric-content">
              <h3>Weekly Revenue</h3>
              <div className="metric-value">{formatPrice(metrics.weeklyRevenue)}</div>
              <div className="metric-change positive">
                <span>↑ 22%</span>
                <span className="metric-change-label">from last week</span>
              </div>
            </div>
          </div>

          <div className="metric-card">
            <div className="metric-icon revenue">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 20V10M8 20V4M3 10h18"/>
              </svg>
            </div>
            <div className="metric-content">
              <h3>Monthly Revenue</h3>
              <div className="metric-value">{formatPrice(metrics.monthlyRevenue)}</div>
              <div className="metric-change positive">
                <span>↑ 35%</span>
                <span className="metric-change-label">from last month</span>
              </div>
            </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon duration">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Average Duration</h3>
            <div className="metric-value">{metrics.averageRentalDuration} days</div>
            <div className="metric-change neutral">
              <span>—</span>
              <span className="metric-change-label">stable</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon category">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Most Popular</h3>
            <div className="metric-value">{metrics.mostPopularCategory}</div>
            <div className="metric-change positive">
              <span>↑ 5%</span>
              <span className="metric-change-label">in popularity</span>
            </div>
          </div>
        </div>

        <div className="metric-card">
          <div className="metric-icon occupancy">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
          </div>
          <div className="metric-content">
            <h3>Occupancy Rate</h3>
            <div className="metric-value">{metrics.occupancyRate}%</div>
            <div className="metric-change positive">
              <span>↑ 3%</span>
              <span className="metric-change-label">from last week</span>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="charts-grid">
        {/* Revenue Trend Chart */}
        <div className="chart-card">
          <h3>Revenue Trend (Last 7 Days)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={revenueData}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }}/>
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} tickFormatter={(value) => `$${value}`}/>
              <Tooltip 
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#1f2937", fontWeight: "600" }}
                formatter={(value) => [formatPrice(value), "Revenue"]}
              />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                stroke="#3b82f6" 
                strokeWidth={2}
                fillOpacity={1} 
                fill="url(#colorRevenue)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Vehicle Category Distribution */}
        <div className="chart-card">
          <h3>Vehicle Category Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={categoryData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="category" stroke="#6b7280" style={{ fontSize: "12px" }}/>
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }}/>
              <Tooltip 
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#1f2937", fontWeight: "600" }}
              />
              <Bar dataKey="count" fill="#10b981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Availability Status */}
        <div className="chart-card">
          <h3>Vehicle Availability Status</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={availabilityData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {availabilityData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                formatter={(value) => [value, "Vehicles"]}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Comparison */}
        <div className="chart-card">
          <h3>Revenue Breakdown</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6"/>
              <XAxis dataKey="date" stroke="#6b7280" style={{ fontSize: "12px" }}/>
              <YAxis stroke="#6b7280" style={{ fontSize: "12px" }} tickFormatter={(value) => formatPrice(value).replace('/day', '')}/>
              <Tooltip 
                contentStyle={{ backgroundColor: "white", border: "1px solid #e5e7eb", borderRadius: "8px" }}
                labelStyle={{ color: "#1f2937", fontWeight: "600" }}
                formatter={(value) => [formatPrice(value), "Revenue"]}
              />
              <Legend wrapperStyle={{ paddingTop: "20px" }} />
              <Line 
                type="monotone" 
                dataKey="revenue" 
                stroke="#8b5cf6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="quick-actions">
        <h3>Quick Actions</h3>
        <div className="action-buttons">
          <button className="action-button primary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 5v14M5 12h14"/>
            </svg>
            <span>Add New Vehicle</span>
          </button>
          <button className="action-button secondary">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <span>Create Rental</span>
          </button>
          <button className="action-button success">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span>View Customers</span>
          </button>
          <button className="action-button warning">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 0 0 2.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 0 0 1.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 0 0-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 0 0-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 0 0-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 0 0-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 0 0 1.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
            <span>Maintenance</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DashboardHome;
