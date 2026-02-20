import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { CurrencyProvider } from "./contexts/CurrencyContext";
import { BookingProvider } from "./contexts/BookingContext";

console.log("Starting to render React app...");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <CurrencyProvider>
      <BookingProvider>
        <App />
      </BookingProvider>
    </CurrencyProvider>
  </React.StrictMode>
);
