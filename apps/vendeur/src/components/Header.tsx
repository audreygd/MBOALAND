// import {
//   AppBar,
//   Toolbar,
//   Typography,
//   Box,
//   IconButton,
//   Badge,
//   Avatar,
// } from "@mui/material";

// type HeaderProps = {
//   title?: string;
// };

// function BellIcon({ size = 30 }: { size?: number }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       width={size}
//       height={size}
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
//       <path d="M13.73 21a2 2 0 0 1-3.46 0" />
//     </svg>
//   );
// }

// function MessageIcon({ size = 30 }: { size?: number }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       width={size}
//       height={size}
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="1.8"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M4 4h16v14H5.17L4 19V4z" />
//       <path d="M22 4l-10 7L2 4" />
//     </svg>
//   );
// }

// function CaretDownIcon({ size = 30 }: { size?: number }) {
//   return (
//     <svg
//       viewBox="0 0 24 24"
//       width={size}
//       height={size}
//       fill="none"
//       stroke="currentColor"
//       strokeWidth="2"
//       strokeLinecap="round"
//       strokeLinejoin="round"
//     >
//       <path d="M6 9l6 6 6-6" />
//     </svg>
//   );
// }

import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import MessageIcon from "@mui/icons-material/Message";

type HeaderProps = {
  title?: string;
  user?: {
    name: string;
    role: string;
    photoUrl?: string;
  };
};

export default function Header({
  title = "Tableau de bord",
  user = {
    name: "Marie Dupont",
    role: "Propriétaire",
    photoUrl: "",
  },
}: HeaderProps) {
  const goTo = (path: string) => {
    window.location.hash = path;
  };

  return (
    <AppBar
      position="sticky"
      color="inherit"
      elevation={0}
      sx={{
        borderBottom: "1px solid #e5e7eb",
        height: 90,
        justifyContent: "center",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between", px: 4 }}>
        {/* TITLE */}
        <Typography sx={{ fontWeight: 700, fontSize: 24 }}>{title}</Typography>

        {/* ACTIONS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {/* Notifications */}
          <IconButton onClick={() => goTo("#notifications")} size="small">
            <Badge badgeContent={3} color="primary">
              <NotificationsIcon />
            </Badge>
          </IconButton>

          {/* Messages */}
          <IconButton onClick={() => goTo("#messagerie")} size="small">
            <Badge badgeContent={1} color="primary">
              <MessageIcon />
            </Badge>
          </IconButton>

          {/* USER */}
          <Box
            onClick={() => goTo("#parametres")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              cursor: "pointer",
              px: 1.5,
              py: 0.5,
              borderRadius: 2,
              "&:hover": { bgcolor: "#f3f4f6" },
            }}
          >
            <Avatar
              src={user.photoUrl || undefined}
              alt={user.name}
              sx={{
                width: 38,
                height: 38,
                bgcolor: user.photoUrl ? "transparent" : "#15803d",
              }}
            >
              {!user.photoUrl && user.name?.charAt(0)}
            </Avatar>

            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                {user.name}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {user.role}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Toolbar>
    </AppBar>
  );
}

// export default function Header({ title = "Tableau de bord" }: HeaderProps) {
//   return (
//     <AppBar
//       position="sticky"
//       color="inherit"
//       elevation={0}
//       sx={{ borderBottom: "1px solid #e5e7eb", height: "100px" }}
//     >
//       <Toolbar sx={{ justifyContent: "space-between", px: 4, py: 2 }}>
//         <Box>
//           <Typography variant="h6" sx={{ fontWeight: 700 }}>
//             {title}
//           </Typography>
//         </Box>

//         <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
//           <Box sx={{ display: "flex", gap: 3, alignItems: "center", ml: 2 }}>
//             <IconButton size="small" aria-label="Notifications">
//               <Badge badgeContent={3} color="primary">
//                 <BellIcon />
//               </Badge>
//             </IconButton>
//             <IconButton size="small" aria-label="Messages">
//               <Badge badgeContent={1} color="primary">
//                 <MessageIcon />
//               </Badge>
//             </IconButton>

//             <Box
//               sx={{
//                 display: "flex",
//                 alignItems: "center",
//                 gap: 1,
//                 px: 2,
//                 py: 0.5,
//               }}
//             >
//               <Avatar sx={{ width: 45, height: 45, bgcolor: "#15803d" }}>
//                 MD
//               </Avatar>
//               <Box sx={{ minWidth: 88 }}>
//                 <Typography variant="body2" sx={{ fontWeight: 700 }}>
//                   Marie Dupont
//                 </Typography>
//                 <Typography
//                   variant="caption"
//                   color="text.secondary"
//                   sx={{ mr: 2 }}
//                 >
//                   Proprietaire
//                 </Typography>
//               </Box>
//               <IconButton size="small" aria-label="Menu">
//                 <CaretDownIcon size={18} />
//               </IconButton>
//             </Box>
//           </Box>
//         </Box>
//       </Toolbar>
//     </AppBar>
//   );
// }
