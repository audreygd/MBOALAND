import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { MissionsProvider } from "./context/MissionsContext";
import GeometreApp from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <MissionsProvider>
        <GeometreApp />
      </MissionsProvider>
    </BrowserRouter>
  </React.StrictMode>,
);