import React from "react";
import ReactDOM from "react-dom/client";
import { HelmetProvider } from 'react-helmet-async'; // <--- Import this
import App from "./App";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HelmetProvider> {/* <--- Wrap App with this */}
          <App />
    </HelmetProvider>
  </React.StrictMode>
);
