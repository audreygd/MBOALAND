import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import GeometreApp from "./App";
import { geometreLayoutRoutes } from "./geometreRoutes";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<GeometreApp />}>
          {geometreLayoutRoutes}
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
);
