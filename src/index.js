import React from "react";
import ReactDOM from "react-dom/client";
import TestApp from "./TestApp";

console.log("Starting to render React app...");

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <TestApp />
  </React.StrictMode>
);
