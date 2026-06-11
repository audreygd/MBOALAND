import { Routes, Route, Navigate } from "react-router-dom";
import VendeurApp from "../apps/vendeur/src/App";
import GeometreApp from "../apps/geometre/src/App";
import RoleSelectionPage from "./auth/SelectRole";
import { MissionsProvider } from "../apps/geometre/src/context/MissionsContext";
function BuyerPage() { return <h1>Espace Acheteur</h1>; }
function AdminPage()  { return <h1>Espace Admin</h1>; }
function NotaryPage() { return <h1>Espace Notaire</h1>; }

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/select-role" replace />} />
      <Route path="/select-role" element={<RoleSelectionPage />} />
      <Route path="/seller/*" element={<VendeurApp />} />
      <Route path="/buyer" element={<BuyerPage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/notary" element={<NotaryPage />} />

      {/* ✅ Plus de geometreLayoutRoutes — GeometreApp gère ses propres routes */}
     <Route
  path="/surveyor/*"
  element={
    <MissionsProvider>
      <GeometreApp />
    </MissionsProvider>
  }
/>
    </Routes>
  );
}