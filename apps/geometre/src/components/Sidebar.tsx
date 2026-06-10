import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";

import LogoutIcon from "@mui/icons-material/Logout";

interface MenuItem {
  title: string;
  icon: React.ReactNode;
  onClick?: () => void;
}

interface SidebarProps {
  appName?: string;
  slogan?: string;
  userName: string;
  userInitials: string;
  menuItems: MenuItem[];
  selectedIndex?: number;
  onLogout?: () => void;
}

export default function Sidebar({
  appName = "GEO-SYSTEM",
  slogan = "Gestion des missions terrain",
  userName,
  userInitials,
  menuItems,
  selectedIndex = 0,
  onLogout,
}: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 260,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 260,
          boxSizing: "border-box",
          borderRight: "1px solid #e5e7eb",
          background: "#f4f6fa",
          color: "#fff",
        },
      }}
    >
      {/* HEADER */}
      <Toolbar
        sx={{
          px: 2,
          py: 3,
          display: "flex",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Avatar
          sx={{
            bgcolor: "#10b981",
            width: 45,
            height: 45,
            fontWeight: "bold",
          }}
        >
          {userInitials}
        </Avatar>

        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700, color: "#10b981" }}>
            {appName}
          </Typography>

          <Typography variant="body2" color="#cbd5e1">
            {slogan}
          </Typography>
        </Box>
      </Toolbar>

      {/* MENU */}
      <List sx={{ px: 1 }}>
        {menuItems.map((item, index) => (
          <ListItemButton
            key={item.title}
            selected={selectedIndex === index}
            onClick={item.onClick}
            sx={{
              borderRadius: 2,
              mb: 0.5,
              color: "#010c1a",
              "&.Mui-selected": {
                backgroundColor: "rgba(16,185,129,0.15)",
                color: "#10b981",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              {item.icon}
            </ListItemIcon>

            <ListItemText primary={item.title} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "#334155" }} />

      {/* USER SECTION */}
      <Box sx={{ p: 3 }}>
        <Typography
          variant="body2"
          sx={{
            textAlign: "center",
            fontWeight: 600,
            mb: 2,
            color: "#010811",
          }}
        >
          {userName}
        </Typography>

        <Button
          fullWidth
          variant="outlined"
          onClick={onLogout}
          startIcon={<LogoutIcon />}
          sx={{
            borderColor: "#10b981",
            color: "#10b981",
            textTransform: "none",
            fontWeight: 600,
          }}
        >
          Se déconnecter
        </Button>
      </Box>
    </Drawer>
  );
}