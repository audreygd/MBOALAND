import { Box } from "@mui/material";
import type { ReactNode } from "react";
import Header from "./Header";
import Sidebar from "./Sidebar";

import DashboardIcon from "@mui/icons-material/Dashboard";
import AssignmentIcon from "@mui/icons-material/Assignment";
import MapIcon from "@mui/icons-material/Map";
import DescriptionIcon from "@mui/icons-material/Description";
import ChatIcon from "@mui/icons-material/Chat";
import PersonIcon from "@mui/icons-material/Person";

interface LayoutProps {
  children: ReactNode;
  selectedIndex?: number;
  onNavigate?: (index: number) => void;
}

const menuItems = (onNavigate?: (i: number) => void) => [
  { title: "Dashboard",     icon: <DashboardIcon />,  onClick: () => onNavigate?.(0) },
  { title: "Missions",      icon: <AssignmentIcon />,  onClick: () => onNavigate?.(1) },
  { title: "Carte terrain", icon: <MapIcon />,          onClick: () => onNavigate?.(2) },
  { title: "Documents",     icon: <DescriptionIcon />,  onClick: () => onNavigate?.(3) },
  { title: "Messagerie",    icon: <ChatIcon />,          onClick: () => onNavigate?.(4) },
  { title: "Profil",        icon: <PersonIcon />,        onClick: () => onNavigate?.(5) },
];

export default function Layout({ children, selectedIndex = 0, onNavigate }: LayoutProps) {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        appName="MBOALAND"
        slogan="Session Géomètre"
        userName="Jean-Paul Mbarga"
        userInitials="JM"
        menuItems={menuItems(onNavigate)}
        selectedIndex={selectedIndex}
        onLogout={() => console.log("logout")}
      />
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Header />
        <Box sx={{ flex: 1 }}>
          {children}
        </Box>
      </Box>
    </Box>
  );
}