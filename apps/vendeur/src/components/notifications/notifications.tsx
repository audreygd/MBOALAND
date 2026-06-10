import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  Stack,
  Chip,
  IconButton,
} from "@mui/material";

import NotificationsIcon from "@mui/icons-material/Notifications";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { TransactionIcon } from "../../assets/icons";

type NotificationType = "SUCCESS" | "ERROR" | "INFO";

type Notification = {
  id: string;
  title: string;
  message: string;
  date: string;
  type: NotificationType;
  read: boolean;
};

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Transaction validée",
    message: "Votre transaction TR-2024-0015 a été validée.",
    date: "12 Mai 2024",
    type: "SUCCESS",
    read: false,
  },
  {
    id: "2",
    title: "Offre reçue",
    message: "Vous avez reçu une nouvelle offre sur votre terrain.",
    date: "10 Mai 2024",
    type: "INFO",
    read: true,
  },
  {
    id: "3",
    title: "Erreur de paiement",
    message: "Un problème est survenu lors du paiement.",
    date: "08 Mai 2024",
    type: "ERROR",
    read: false,
  },
];

function getIcon(type: NotificationType) {
  switch (type) {
    case "SUCCESS":
      return <TransactionIcon />;
    case "ERROR":
      return <NotificationsIcon sx={{ color: "#dc2626" }} />;
    case "INFO":
    default:
      return <InfoOutlinedIcon sx={{ color: "#2563eb" }} />;
  }
}

export default function NotificationsPage() {
  const [search, setSearch] = useState("");

  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim();

    return mockNotifications.filter(
      (n) =>
        n.title.toLowerCase().includes(q) ||
        n.message.toLowerCase().includes(q),
    );
  }, [search]);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}

      <Typography
        sx={{
          color: "text.secondary",
          mb: 3,
          maxWidth: 700,
          lineHeight: 1.6,
          fontSize: 18,
        }}
      >
        Retrouvez toutes vos notifications importantes liées aux transactions,
        offres et activités de votre compte.
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        size="small"
        placeholder="Rechercher une notification..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        sx={{
          mb: 2.5,
          maxWidth: 420,
          bgcolor: "#fff",
          ml: 10,
          borderRadius: 0.7,
        }}
      />

      {/* List */}
      <Stack spacing={1.5} sx={{ width: "70%", justifySelf: "center" }}>
        {filtered.map((n) => (
          <Paper
            key={n.id}
            elevation={0}
            sx={{
              p: 2,
              px: 2.5,
              display: "flex",
              gap: 2,
              alignItems: "flex-start",
              border: "1px solid rgba(0,0,0,0.06)",
              bgcolor: n.read ? "#fff" : "#f8fafc",
              mx: 3,
            }}
          >
            {/* Icon */}
            <Box sx={{ mt: 0.3 }}>{getIcon(n.type)}</Box>

            {/* Content */}
            <Box sx={{ flex: 1 }}>
              <Typography
                sx={{
                  fontSize: 16,
                  fontWeight: 600,
                }}
              >
                {n.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: 14,
                  color: "text.secondary",
                  mt: 0.3,
                  lineHeight: 1.6,
                }}
              >
                {n.message}
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "text.disabled",
                  mt: 0.8,
                }}
              >
                {n.date}
              </Typography>
            </Box>

            {/* Badge */}
            {!n.read && (
              <Chip
                label="Nouveau"
                size="small"
                sx={{
                  bgcolor: "#0B6B3A",
                  color: "#fff",
                  fontSize: 12,
                }}
              />
            )}

            <IconButton size="small">
              <NotificationsIcon fontSize="small" />
            </IconButton>
          </Paper>
        ))}
      </Stack>

      {filtered.length === 0 && (
        <Typography
          sx={{
            mt: 3,
            color: "text.secondary",
          }}
        >
          Aucune notification trouvée.
        </Typography>
      )}
    </Box>
  );
}

// import { useState } from "react";
// import {
//   Box,
//   Paper,
//   Typography,
//   Button,
//   Chip,
//   Divider,
//   IconButton,
// } from "@mui/material";
// import NotificationsIcon from "@mui/icons-material/Notifications";
// import { TransactionIcon, UserIcon } from "../../assets/icons";
// // import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
// // import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

// type NotificationType = "OFFRE" | "MESSAGE" | "TRANSACTION" | "DOCUMENT";

// type Notification = {
//   id: number;
//   title: string;
//   description: string;
//   date: string;
//   read: boolean;
//   type: NotificationType;
// };

// const initialNotifications: Notification[] = [
//   {
//     id: 1,
//     title: "Nouvelle offre reçue",
//     description:
//       "Martin Kamga a soumis une offre pour votre terrain situé à Odza.",
//     date: "Il y a 5 min",
//     read: false,
//     type: "OFFRE",
//   },
//   {
//     id: 2,
//     title: "Nouveau message",
//     description:
//       "Alice Nguimatsia vous a envoyé un message concernant un terrain.",
//     date: "Il y a 1 heure",
//     read: false,
//     type: "MESSAGE",
//   },
//   {
//     id: 3,
//     title: "Transaction mise à jour",
//     description:
//       "La transaction TR-2024-0015 est passée à l'étape Vérification notaire.",
//     date: "Hier",
//     read: true,
//     type: "TRANSACTION",
//   },
//   {
//     id: 4,
//     title: "Document validé",
//     description: "Votre titre foncier a été validé avec succès.",
//     date: "02 Juin 2026",
//     read: true,
//     type: "DOCUMENT",
//   },
// ];

// const typeColor = {
//   OFFRE: "#15803d",
//   MESSAGE: "#2563eb",
//   TRANSACTION: "#d97706",
//   DOCUMENT: "#7c3aed",
// };

// export default function NotificationsPage() {
//   const [notifications, setNotifications] = useState(initialNotifications);

//   const unreadCount = notifications.filter((n) => !n.read).length;

//   const markAsRead = (id: number) => {
//     setNotifications((prev) =>
//       prev.map((n) => (n.id === id ? { ...n, read: true } : n)),
//     );
//   };

//   const markAllAsRead = () => {
//     setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
//   };

//   const deleteNotification = (id: number) => {
//     setNotifications((prev) => prev.filter((n) => n.id !== id));
//   };

//   return (
//     <Box sx={{ p: 3 }}>
//       {/* Header */}
//       <Box
//         sx={{
//           mb: 3,
//           display: "flex",
//           justifyContent: "space-between",
//           alignItems: "center",
//         }}
//       >
//         <Box>
//           <Typography
//             sx={{
//               fontSize: 30,
//               fontWeight: 700,
//             }}
//           >
//             Notifications
//           </Typography>

//           <Typography
//             sx={{
//               color: "text.secondary",
//               mt: 0.5,
//             }}
//           >
//             Consultez les événements importants liés à vos terrains.
//           </Typography>
//         </Box>

//         <Button
//           variant="contained"
//           onClick={markAllAsRead}
//           sx={{
//             bgcolor: "#15803d",
//             textTransform: "none",
//             borderRadius: 1,
//             "&:hover": {
//               bgcolor: "#166534",
//             },
//           }}
//         >
//           Tout marquer comme lu
//         </Button>
//       </Box>

//       {/* Statistiques */}
//       <Paper
//         elevation={0}
//         sx={{
//           p: 3,
//           mb: 3,
//           border: "1px solid",
//           borderColor: "divider",
//           borderRadius: 1,
//         }}
//       >
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             gap: 2,
//           }}
//         >
//           <NotificationsIcon
//             sx={{
//               fontSize: 40,
//               color: "#15803d",
//             }}
//           />

//           <Box>
//             <Typography
//               sx={{
//                 fontSize: 28,
//                 fontWeight: 700,
//               }}
//             >
//               {unreadCount}
//             </Typography>

//             <Typography
//               sx={{
//                 color: "text.secondary",
//               }}
//             >
//               Notifications non lues
//             </Typography>
//           </Box>
//         </Box>
//       </Paper>

//       {/* Liste */}
//       <Paper
//         elevation={0}
//         sx={{
//           border: "1px solid",
//           borderColor: "divider",
//           borderRadius: 1,
//           overflow: "hidden",
//         }}
//       >
//         {notifications.map((notification, index) => (
//           <Box key={notification.id}>
//             <Box
//               sx={{
//                 p: 2.5,
//                 display: "flex",
//                 gap: 2,
//                 alignItems: "flex-start",
//                 backgroundColor: notification.read
//                   ? "#fff"
//                   : "rgba(21,128,61,0.03)",
//               }}
//             >
//               <Box
//                 sx={{
//                   width: 12,
//                   height: 12,
//                   borderRadius: "50%",
//                   mt: 0.8,
//                   bgcolor: notification.read ? "transparent" : "#15803d",
//                 }}
//               />

//               <Box sx={{ flex: 1 }}>
//                 <Box
//                   sx={{
//                     display: "flex",
//                     alignItems: "center",
//                     gap: 1,
//                     mb: 1,
//                   }}
//                 >
//                   <Typography
//                     sx={{
//                       fontWeight: 600,
//                       fontSize: 16,
//                     }}
//                   >
//                     {notification.title}
//                   </Typography>

//                   <Chip
//                     size="small"
//                     label={notification.type}
//                     sx={{
//                       bgcolor: `${typeColor[notification.type]}15`,
//                       color: typeColor[notification.type],
//                       fontWeight: 600,
//                     }}
//                   />
//                 </Box>

//                 <Typography
//                   sx={{
//                     color: "text.secondary",
//                     mb: 1,
//                   }}
//                 >
//                   {notification.description}
//                 </Typography>

//                 <Typography
//                   sx={{
//                     fontSize: 13,
//                     color: "text.secondary",
//                   }}
//                 >
//                   {notification.date}
//                 </Typography>
//               </Box>

//               <Box
//                 sx={{
//                   display: "flex",
//                   gap: 1,
//                 }}
//               >
//                 {!notification.read && (
//                   <IconButton onClick={() => markAsRead(notification.id)}>
//                     <TransactionIcon />
//                   </IconButton>
//                 )}

//                 <IconButton onClick={() => deleteNotification(notification.id)}>
//                   <UserIcon />
//                 </IconButton>
//               </Box>
//             </Box>

//             {index < notifications.length - 1 && <Divider />}
//           </Box>
//         ))}

//         {notifications.length === 0 && (
//           <Box
//             sx={{
//               py: 8,
//               textAlign: "center",
//             }}
//           >
//             <Typography
//               sx={{
//                 fontSize: 18,
//                 fontWeight: 600,
//               }}
//             >
//               Aucune notification
//             </Typography>

//             <Typography
//               sx={{
//                 color: "text.secondary",
//                 mt: 1,
//               }}
//             >
//               Vous êtes à jour.
//             </Typography>
//           </Box>
//         )}
//       </Paper>
//     </Box>
//   );
// }
