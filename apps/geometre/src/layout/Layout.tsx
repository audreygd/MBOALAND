import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import { getActiveGeometreSegment } from "../lib/routes";
import { useGeometreNavigation } from "../hooks/useGeometreNavigation";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

const NAV_ITEMS = [
  { title: "Dashboard", segment: "" },
  { title: "Missions", segment: "missions" },
  { title: "Carte terrain", segment: "carte" },
  { title: "Notifications", segment: "notifications" },
  { title: "Messagerie", segment: "messagerie" },
  { title: "Profil", segment: "profil" },
] as const;

const NAV_ICONS = [
  <DashboardIcon key="dashboard" />,
  <AssignmentIcon key="missions" />,
  <MapIcon key="carte" />,
  <NotificationsIcon key="notifications" />,
  <ChatIcon key="messagerie" />,
  <PersonIcon key="profil" />,
];

export default function Layout() {
  const { goTo } = useGeometreNavigation();
  const navigate = useNavigate();
  const location = useLocation();

  const activeSegment = getActiveGeometreSegment(location.pathname);
  const selectedIndex = Math.max(
    0,
    NAV_ITEMS.findIndex((item) => item.segment === activeSegment),
  );

  const menuItems = NAV_ITEMS.map((item, index) => ({
    title: item.title,
    icon: NAV_ICONS[index],
    onClick: () => goTo(item.segment),
  }));

  const handleLogout = () => {
    localStorage.removeItem("mboaland_role");
    navigate(location.pathname.startsWith("/surveyor") ? "/select-role" : "/");
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        appName="MBOALAND"
        slogan="Session Géomètre"
        userName="Jean-Paul Mbarga"
        userInitials="JM"
        menuItems={menuItems}
        selectedIndex={selectedIndex}
        onLogout={handleLogout}
      />

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        <Header onNavigate={(page) => goTo(page)} />

        <Box sx={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
