import React, { createContext, useContext, useReducer, useEffect } from 'react';

// Initial state
const initialState = {
  bookings: [],
  cars: [],
  loading: false,
  error: null
};

// Action types
const ActionTypes = {
  SET_CARS: 'SET_CARS',
  ADD_BOOKING: 'ADD_BOOKING',
  CANCEL_BOOKING: 'CANCEL_BOOKING',
  UPDATE_BOOKING: 'UPDATE_BOOKING',
  SET_BOOKINGS: 'SET_BOOKINGS',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR'
};

// Reducer function
const bookingReducer = (state, action) => {
  switch (action.type) {
    case ActionTypes.SET_CARS:
      return {
        ...state,
        cars: action.payload
      };
    
    case ActionTypes.SET_BOOKINGS:
      return {
        ...state,
        bookings: action.payload
      };
    
    case ActionTypes.ADD_BOOKING:
      const newBookings = [...state.bookings, action.payload];
      localStorage.setItem('bookings', JSON.stringify(newBookings));
      return {
        ...state,
        bookings: newBookings
      };
    
    case ActionTypes.CANCEL_BOOKING:
      const filteredBookings = state.bookings.filter(b => b.id !== action.payload);
      localStorage.setItem('bookings', JSON.stringify(filteredBookings));
      return {
        ...state,
        bookings: filteredBookings
      };
    
    case ActionTypes.UPDATE_BOOKING:
      const updatedBookings = state.bookings.map(b => 
        b.id === action.payload.id ? action.payload : b
      );
      localStorage.setItem('bookings', JSON.stringify(updatedBookings));
      return {
        ...state,
        bookings: updatedBookings
      };
    
    case ActionTypes.SET_LOADING:
      return {
        ...state,
        loading: action.payload
      };
    
    case ActionTypes.SET_ERROR:
      return {
        ...state,
        error: action.payload
      };
    
    default:
      return state;
  }
};

// Create context
const BookingContext = createContext();

// Provider component
export const BookingProvider = ({ children }) => {
  const [state, dispatch] = useReducer(bookingReducer, initialState);

  // Load bookings from localStorage on mount
  useEffect(() => {
    const savedBookings = localStorage.getItem('bookings');
    if (savedBookings) {
      dispatch({ type: ActionTypes.SET_BOOKINGS, payload: JSON.parse(savedBookings) });
    }
  }, []);

  // Set cars data
  const setCars = (cars) => {
    dispatch({ type: ActionTypes.SET_CARS, payload: cars });
  };

  // Check if a car is available for given dates
  const isCarAvailable = (carId, pickupDate, returnDate) => {
    const carBookings = state.bookings.filter(b => b.carId === carId && b.status !== 'cancelled');
    
    for (const booking of carBookings) {
      const existingPickup = new Date(booking.pickupDate);
      const existingReturn = new Date(booking.returnDate);
      const newPickup = new Date(pickupDate);
      const newReturn = new Date(returnDate);

      // Check for overlapping dates
      if (
        (newPickup >= existingPickup && newPickup <= existingReturn) ||
        (newReturn >= existingPickup && newReturn <= existingReturn) ||
        (newPickup <= existingPickup && newReturn >= existingReturn)
      ) {
        return false;
      }
    }
    return true;
  };

  // Get car availability status
  const getCarAvailability = (carId) => {
    const now = new Date();
    const carBookings = state.bookings.filter(b => 
      b.carId === carId && 
      b.status !== 'cancelled' &&
      new Date(b.returnDate) >= now
    );
    return carBookings.length === 0;
  };

  // Create a new booking
  const createBooking = (bookingData) => {
    const booking = {
      id: `BK${Date.now()}${Math.random().toString(36).substr(2, 9)}`.toUpperCase(),
      ...bookingData,
      status: 'confirmed',
      createdAt: new Date().toISOString()
    };
    
    dispatch({ type: ActionTypes.ADD_BOOKING, payload: booking });
    return booking;
  };

  // Cancel a booking
  const cancelBooking = (bookingId) => {
    const booking = state.bookings.find(b => b.id === bookingId);
    if (booking) {
      const updatedBooking = { ...booking, status: 'cancelled', cancelledAt: new Date().toISOString() };
      dispatch({ type: ActionTypes.UPDATE_BOOKING, payload: updatedBooking });
    }
  };

  // Get user's bookings
  const getUserBookings = (userId = null) => {
    return state.bookings.filter(b => b.status !== 'cancelled');
  };

  // Get active bookings
  const getActiveBookings = () => {
    const now = new Date();
    return state.bookings.filter(b => 
      b.status === 'confirmed' && 
      new Date(b.returnDate) >= now
    );
  };

  // Get past bookings
  const getPastBookings = () => {
    const now = new Date();
    return state.bookings.filter(b => 
      b.status === 'confirmed' && 
      new Date(b.returnDate) < now
    );
  };

  // Get booking by ID
  const getBookingById = (bookingId) => {
    return state.bookings.find(b => b.id === bookingId);
  };

  // Calculate total price
  const calculateTotalPrice = (pricePerDay, pickupDate, returnDate, extras = []) => {
    const pickup = new Date(pickupDate);
    const returnD = new Date(returnDate);
    const days = Math.ceil((returnD - pickup) / (1000 * 60 * 60 * 24));
    
    let basePrice = pricePerDay * days;
    
    // Add extras
    const extrasTotal = extras.reduce((sum, extra) => {
      switch (extra) {
        case 'insurance':
          return sum + (15 * days);
        case 'gps':
          return sum + (8 * days);
        case 'childSeat':
          return sum + (10 * days);
        default:
          return sum;
      }
    }, 0);
    
    const subtotal = basePrice + extrasTotal;
    const tax = subtotal * 0.1; // 10% tax
    const total = subtotal + tax;
    
    return {
      days,
      basePrice,
      extrasTotal,
      subtotal,
      tax,
      total
    };
  };

  // Get booked dates for a car
  const getBookedDates = (carId) => {
    const carBookings = state.bookings.filter(b => 
      b.carId === carId && 
      b.status !== 'cancelled'
    );
    
    return carBookings.flatMap(booking => {
      const dates = [];
      const start = new Date(booking.pickupDate);
      const end = new Date(booking.returnDate);
      
      for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
        dates.push(new Date(d).toISOString().split('T')[0]);
      }
      return dates;
    });
  };

  const value = {
    ...state,
    setCars,
    isCarAvailable,
    getCarAvailability,
    createBooking,
    cancelBooking,
    getUserBookings,
    getActiveBookings,
    getPastBookings,
    getBookingById,
    calculateTotalPrice,
    getBookedDates
  };

  return (
    <BookingContext.Provider value={value}>
      {children}
    </BookingContext.Provider>
  );
};

// Custom hook to use booking context
export const useBooking = () => {
  const context = useContext(BookingContext);
  if (!context) {
    throw new Error('useBooking must be used within a BookingProvider');
  }
  return context;
};

export default BookingContext;
