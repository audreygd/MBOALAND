import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SellerDashboard from "./page/SellerDashboard";
import TransactionPage from "./page/Transactions";
import { Box } from "@mui/material";
import LandPage from "./page/LandPage";
import Row from "./components/Row";
import OffersPage from "./components/offers/OffersPage";
import DocumentsPage from "./components/documents/DocumentsPage";
import MessagingPage from "./components/messages/MessagesPage";
import NotificationsPage from "./components/notifications/notifications";
import SettingsPage from "./components/settings/Settings";

function VendeurApp() {
  const [selectedMenu, setSelectedMenu] = useState("Tableau de bord");

  useEffect(() => {
    const mapHashToMenu = (hash: string) => {
      const path = hash.replace("#", "").split("?")[0];
      switch (path) {
        case "terrains":
          return "Mes terrains";
        case "offres":
          return "Offres reçues";
        case "transactions":
          return "Transactions";
        case "documents":
          return "Documents";
        case "messagerie":
          return "Messagerie";
        case "notifications":
          return "Notifications";
        case "parametres":
          return "Paramètres";
        default:
          return "Tableau de bord";
      }
    };

    const applyHash = () =>
      setSelectedMenu(mapHashToMenu(window.location.hash));

    // Initialize from current hash
    applyHash();

    // Listen for future hash changes
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  const renderContent = () => {
    switch (selectedMenu) {
      case "Tableau de bord":
        return <SellerDashboard />;
      case "Mes terrains":
        return <LandPage />;
      case "Offres reçues":
        return <OffersPage />;
      case "Transactions":
        return <TransactionPage />;
      case "Documents":
        return <DocumentsPage />;
      case "Messagerie":
        return <MessagingPage />;
      case "Notifications":
        return <NotificationsPage />;
      case "Paramètres":
        return <SettingsPage />;
      default:
        return <SellerDashboard />;
    }
  };

  // keep the url hash in sync when user clicks the sidebar
  const handleMenuSelect = (menu: string) => {
    setSelectedMenu(menu);
    const mapMenuToHash: Record<string, string> = {
      "Mes terrains": "#terrains",
      "Offres reçues": "#offres",
      Transactions: "#transactions",
      Documents: "#documents",
      Messagerie: "#messagerie",
      Notifications: "#notifications",
      Paramètres: "#parametres",
      "Tableau de bord": "#",
    };
    const newHash = mapMenuToHash[menu] ?? "#";
    if (window.location.hash !== newHash) window.location.hash = newHash;
  };

  return (
    <Row sx={{ display: "flex", height: "100vh", position: "sticky", gap: 0 }}>
      <Box sx={{ width: 280 }}>
        <Sidebar
          selectedItem={selectedMenu}
          onMenuItemClick={handleMenuSelect}
        />
      </Box>

      <Box sx={{ flex: 1 }}>
        <Header title={selectedMenu} />
        {renderContent()}
      </Box>
    </Row>
  );
}

export default VendeurApp;
