import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VendeurApp from "../apps/vendeur/src/App";
import RoleSelectionPage from "./auth/SelectRole";
import GeometreApp from "../apps/geometre/src/App";

function BuyerPage() {
  return <h1>Espace Acheteur</h1>;
}

function AdminPage() {
  return <h1>Espace Admin</h1>;
}

function NotaryPage() {
  return <h1>Espace Notaire</h1>;
}

// function SurveyorPage() {
//   return <h1>Espace Géomètre</h1>;
// }

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection vers la sélection des rôles */}
        <Route path="/" element={<Navigate to="/select-role" replace />} />

        <Route path="/select-role" element={<RoleSelectionPage />} />

        <Route path="/seller" element={<VendeurApp />} />
        <Route path="/buyer" element={<BuyerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/notary" element={<NotaryPage />} />
        <Route path="/surveyor" element={<GeometreApp />} />
      </Routes>
    </BrowserRouter>
  );
}
