import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";

import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { useGeometreNavigation } from "../hooks/useGeometreNavigation";
import { getActiveGeometreSegment } from "../lib/routes";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

// Chemins RELATIFS (sans "/" initial) — compatibles avec un montage
// sous "/surveyor/*" comme en standalone "/"
const items = [
  { title: "Dashboard",     path: "" },
  { title: "Missions",      path: "missions" },
  { title: "Carte terrain", path: "carte" },
  { title: "Notifications", path: "notifications" },
  { title: "Messagerie",    path: "messagerie" },
  { title: "Profil",        path: "profil" },
];

const icons = [
  <DashboardIcon />,
  <AssignmentIcon />,
  <MapIcon />,
  <NotificationsIcon />,
  <ChatIcon />,
  <PersonIcon />,
];

export default function Layout() {
  const { goTo } = useGeometreNavigation();
  const location = useLocation();

  // getActiveGeometreSegment gère aussi "/surveyor/missions/3" -> "missions"
  const activeSegment = getActiveGeometreSegment(location.pathname);
  const selectedIndex = items.findIndex((i) => i.path === activeSegment);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        appName="MBOALAND"
        slogan="Session Géomètre"
        userName="Jean-Paul Mbarga"
        userInitials="JM"
        selectedIndex={selectedIndex < 0 ? 0 : selectedIndex}
        menuItems={items.map((item, i) => ({
          title: item.title,
          icon: icons[i],
          onClick: () => goTo(item.path),
        }))}
        onLogout={() => console.log("logout")}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header.onNavigate reçoit un segment relatif, goTo gère le préfixe /surveyor */}
        <Header onNavigate={(p) => goTo(p)} />

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}