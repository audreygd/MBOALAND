import { useState, useEffect } from "react";
import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SellerDashboard from "./page/SellerDashboard";
import TransactionPage from "./page/Transactions";
import { Box, Typography } from "@mui/material";
import LandPage from "./page/LandPage";

const PagePlaceholder = ({
  title,
  description,
}: {
  title: string;
  description: string;
}) => (
  <Box sx={{ p: 4 }}>
    <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
      {title}
    </Typography>
    <Typography color="text.secondary" sx={{ maxWidth: 640, lineHeight: 1.8 }}>
      {description}
    </Typography>
  </Box>
);

function App() {
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
        return (
          <PagePlaceholder
            title="Offres reçues"
            description="Consultez toutes les offres que vous avez reçues pour vos terrains. Vous pouvez accepter, refuser ou répondre directement depuis cette section."
          />
        );
      case "Transactions":
        return <TransactionPage />;
      case "Documents":
        return (
          <PagePlaceholder
            title="Documents"
            description="Organisez et consultez vos documents liés aux terrains et aux ventes depuis cette section sécurisée."
          />
        );
      case "Messagerie":
        return (
          <PagePlaceholder
            title="Messagerie"
            description="Echangez avec les acheteurs et suivez les conversations en cours pour vos terrains."
          />
        );
      case "Notifications":
        return (
          <PagePlaceholder
            title="Notifications"
            description="Retrouvez ici les alertes importantes liées aux offres, aux messages et aux transactions en cours."
          />
        );
      case "Paramètres":
        return (
          <PagePlaceholder
            title="Paramètres"
            description="Personnalisez votre compte, mettez à jour vos informations et gérez les préférences de notification."
          />
        );
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
    <Box sx={{ display: "flex", minHeight: "100vh", position: "sticky" }}>
      <Sidebar selectedItem={selectedMenu} onMenuItemClick={handleMenuSelect} />
      <Box sx={{ flex: 1 }}>
        <Header title={selectedMenu} />
        {renderContent()}
      </Box>
    </Box>
  );
}

export default App;
