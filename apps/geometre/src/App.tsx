import { useState } from "react";
import { Box } from "@mui/material";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import MissionsDetails from "./pages/Missionsdetails";
import CarteTerrain from "./pages/CarteTerrain";
import Notifications from "./pages/Notifications";
import Messagerie from "./pages/Messagerie";
import Profil from "./pages/Profil";

import "leaflet/dist/leaflet.css";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

type Page =
  | "dashboard"
  | "missions"
  | "mission-detail"
  | "carte"
  | "notifications"
  | "messagerie"
  | "profil";

export default function App() {
  const [page, setPage]                           = useState<Page>("dashboard");
  const [selectedMissionId, setSelectedMissionId] = useState<number | null>(null);
  const [selectedIndex, setSelectedIndex]         = useState(0);

  // Navigation depuis la sidebar
  const handleNavigate = (index: number) => {
    setSelectedIndex(index);
    const pages: Page[] = ["dashboard", "missions", "carte", "notifications", "messagerie", "profil"];
    setPage(pages[index] ?? "dashboard");
  };

  // Navigation depuis le header (icônes + menu avatar)
  const handleHeaderNavigate = (p: string) => {
    switch (p) {
      case "notifications": setPage("notifications"); setSelectedIndex(3); break;
      case "messagerie":    setPage("messagerie");    setSelectedIndex(4); break;
      case "profil":        setPage("profil");        setSelectedIndex(5); break;
    }
  };

  const handleViewDetail = (id: number) => {
    setSelectedMissionId(id);
    setPage("mission-detail");
  };

  const handleBack = () => {
    setPage("missions");
    setSelectedIndex(1);
  };

  const menuItems = [
    { title: "Dashboard",      icon: <DashboardIcon />,     onClick: () => handleNavigate(0) },
    { title: "Missions",       icon: <AssignmentIcon />,    onClick: () => handleNavigate(1) },
    { title: "Carte terrain",  icon: <MapIcon />,            onClick: () => handleNavigate(2) },
    { title: "Notifications",  icon: <NotificationsIcon />,  onClick: () => handleNavigate(3) },
    { title: "Messagerie",     icon: <ChatIcon />,            onClick: () => handleNavigate(4) },
    { title: "Profil",         icon: <PersonIcon />,          onClick: () => handleNavigate(5) },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        appName="MBOALAND"
        slogan="Session Géomètre"
        userName="Jean-Paul Mbarga"
        userInitials="JM"
        menuItems={menuItems}
        selectedIndex={selectedIndex}
        onLogout={() => console.log("logout")}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header onNavigate={handleHeaderNavigate} />

        <Box sx={{ flex: 1 }}>
          {page === "dashboard"      && <Dashboard />}
          {page === "missions"       && <Missions onViewDetail={handleViewDetail} />}
          {page === "mission-detail" && selectedMissionId !== null && (
            <MissionsDetails missionId={selectedMissionId} onBack={handleBack} />
          )}
          {page === "carte"          && <CarteTerrain />}
          {page === "notifications"  && <Notifications />}
          {page === "messagerie"     && <Messagerie />}
          {page === "profil"         && <Profil />}
        </Box>
      </Box>
    </Box>
  );
}