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
import {
  DashboardIcon,
  MapIcon,
  OfferIcon,
  TransactionIcon,
  DocumentIcon,
  // VisitIcon,
  MessageIcon,
  NotificationIcon,
  // UserIcon,
  SettingsIcon,
  LogoutIcon,
} from "../assets/icons";

const menuItems = [
  {
    title: "Tableau de bord",
    icon: <DashboardIcon />,
  },
  {
    title: "Mes terrains",
    icon: <MapIcon />,
  },
  {
    title: "Offres reçues",
    icon: <OfferIcon />,
  },
  {
    title: "Transactions",
    icon: <TransactionIcon />,
  },
  {
    title: "Documents",
    icon: <DocumentIcon />,
  },
  // {
  //   title: "Visites",
  //   icon: <VisitIcon />,
  // },
  {
    title: "Messagerie",
    icon: <MessageIcon />,
  },
  {
    title: "Notifications",
    icon: <NotificationIcon />,
  },
  // {
  //   title: "Profil",
  //   icon: <UserIcon />,
  // },
  {
    title: "Paramètres",
    icon: <SettingsIcon />,
  },
];

type SidebarProps = {
  selectedItem: string;
  onMenuItemClick: (menu: string) => void;
};

export default function Sidebar({
  selectedItem,
  onMenuItemClick,
}: SidebarProps) {
  return (
    <Drawer
      variant="permanent"
      sx={{
        width: 280,
        "& .MuiDrawer-paper": {
          width: 280,
          borderRight: "1px solid #e5e7eb",
        },
      }}
    >
      <Toolbar
        sx={{
          px: 1,
          py: 2.5,
          display: "flex",
          gap: 1,
          alignItems: "flex-start",
        }}
      >
        <Avatar
          sx={{
            width: 40,
            height: 40,
            bgcolor: "#15803d",
            flexShrink: 0,
            mt: 0.5,
          }}
        >
          MD
        </Avatar>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700, color: "#15803d" }}>
            MBOALAND
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Vendez en toute sécurité
          </Typography>
        </Box>
      </Toolbar>

      <List>
        {menuItems.map((menu) => (
          <ListItemButton
            key={menu.title}
            selected={menu.title === selectedItem}
            onClick={() => onMenuItemClick(menu.title)}
            sx={{
              gap: 2,
              fontSize: 24,
              fontWeight: 600,
              borderRadius: 0.5,
              mx: 2,
              my: 1,
            }}
          >
            <ListItemIcon sx={{ minWidth: 36, color: "#15803d" }}>
              {menu.icon}
            </ListItemIcon>
            <ListItemText primary={menu.title} />
          </ListItemButton>
        ))}
      </List>

      <Box sx={{ flex: 1 }} />

      <Divider />
      <Box sx={{ p: 4 }}>
        <Button
          component="a"
          href="/"
          fullWidth
          variant="outlined"
          sx={{
            borderColor: "#15803d",
            color: "#15803d",
            textTransform: "none",
            justifyContent: "center",
            gap: 1,
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Se déconnecter
          <LogoutIcon size={20} />
        </Button>
      </Box>
    </Drawer>
  );
}
