import "./index.css";
import React from "react";
import ReactDOM from "react-dom/client";
import { MissionsProvider } from "./context/MissionsContext";
import GeometreApp from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MissionsProvider>
      <GeometreApp />
    </MissionsProvider>
  </React.StrictMode>,
);