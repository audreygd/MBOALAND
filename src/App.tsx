import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import VendeurApp from "../apps/vendeur/src/App";
import RoleSelectionPage from "./auth/SelectRole";
import AcheteurApp from "../apps/acheteur/src/App";

// function SellerPage() {
//   return <h1>Espace Vendeur</h1>;
// }

function BuyerPage() {
   return <AcheteurApp />
}

function AdminPage() {
  return <h1>Espace Admin</h1>;
}

function NotaryPage() {
  return <h1>Espace Notaire</h1>;
}

function SurveyorPage() {
  return <h1>Espace Géomètre</h1>;
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirection vers la sélection des rôles */}
        <Route path="/" element={<Navigate to="/select-role" replace />} />

        <Route path="/select-role" element={<RoleSelectionPage />} />

        <Route path="/seller" element={<VendeurApp />} />
        <Route path="/buyer" element={<BuyerPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/notary" element={<NotaryPage />} />
        <Route path="/surveyor" element={<SurveyorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

// interface Role {
//   title: string;
//   description: string;
//   icon: React.ReactNode;
//   color: string;
//   route: string;
// }

// const roles: Role[] = [
//   {
//     title: "Vendeur",
//     description: "Publier et gérer vos terrains",
//     icon: <StorefrontIcon />,
//     color: "#2E7D32",
//     route: "/seller",
//   },
//   {
//     title: "Acheteur",
//     description: "Explorer et acquérir des terrains",
//     icon: <ShoppingCartIcon />,
//     color: "#1976D2",
//     route: "/buyer",
//   },
//   {
//     title: "Administrateur",
//     description: "Superviser la plateforme",
//     icon: <AdminPanelSettingsIcon />,
//     color: "#7B1FA2",
//     route: "/admin",
//   },
//   {
//     title: "Notaire",
//     description: "Valider les actes et transactions",
//     icon: <GavelIcon />,
//     color: "#EF6C00",
//     route: "/notary",
//   },
//   {
//     title: "Géomètre",
//     description: "Vérifier et délimiter les parcelles",
//     icon: <LandscapeIcon />,
//     color: "#00897B",
//     route: "/surveyor",
//   },
// ];

// export default function App() {
//   const navigate = useNavigate();

//   const handleSelectRole = (role: Role) => {
//     localStorage.setItem("mboaland_role", role.title);
//     navigate(role.route);
//   };

//   return (
//     <Box
//       sx={{
//         display: "flex",
//         minHeight: "100vh",
//         bgcolor: "#F8FAFC",
//       }}
//     >
//       <Box
//         sx={{
//           flex: 1,
//           display: { xs: "none", md: "flex" },
//           alignItems: "center",
//           justifyContent: "center",
//           flexDirection: "column",
//           background:
//             "linear-gradient(135deg, #0B7A3E 0%, #13A35A 50%, #25C06D 100%)",
//           color: "#FFFFFF",
//           p: 6,
//         }}
//       >
//         <Typography
//           variant="h2"
//           sx={{
//             fontWeight: 800,
//             letterSpacing: 1,
//           }}
//         >
//           MBOALAND
//         </Typography>

//         <Typography
//           sx={{
//             mt: 3,
//             maxWidth: 500,
//             textAlign: "center",
//             fontSize: "1.1rem",
//             opacity: 0.9,
//             lineHeight: 1.8,
//           }}
//         >
//           Plateforme intelligente de gestion, de sécurisation et de
//           commercialisation du foncier au Cameroun.
//         </Typography>
//       </Box>

//       {/* SECTION DROITE */}
//       <Box
//         sx={{
//           flex: 1,
//           display: "flex",
//           justifyContent: "center",
//           alignItems: "center",
//           p: { xs: 3, md: 6 },
//         }}
//       >
//         <Box
//           sx={{
//             width: "100%",
//             maxWidth: 520,
//           }}
//         >
//           <Typography
//             variant="h4"
//             sx={{
//               fontWeight: 700,
//               mb: 1,
//               color: "#1E293B",
//             }}
//           >
//             Choisissez votre espace
//           </Typography>

//           <Typography
//             sx={{
//               color: "#64748B",
//               mb: 4,
//             }}
//           >
//             Sélectionnez le rôle avec lequel vous souhaitez accéder à
//             l'application.
//           </Typography>

//           <Stack spacing={2}>
//             {roles.map((role) => (
//               <Card
//                 key={role.title}
//                 elevation={0}
//                 sx={{
//                   borderRadius: 4,
//                   border: "1px solid #E2E8F0",
//                   transition: "all .25s ease",
//                   overflow: "hidden",

//                   "&:hover": {
//                     transform: "translateY(-4px)",
//                     boxShadow: "0 12px 30px rgba(0,0,0,0.08)",
//                     borderColor: role.color,
//                   },
//                 }}
//               >
//                 <CardActionArea
//                   onClick={() => handleSelectRole(role)}
//                   sx={{
//                     p: 2,
//                   }}
//                 >
//                   <CardContent
//                     sx={{
//                       display: "flex",
//                       alignItems: "center",
//                       p: "0 !important",
//                     }}
//                   >
//                     <Box
//                       sx={{
//                         width: 60,
//                         height: 60,
//                         borderRadius: 3,
//                         bgcolor: role.color,
//                         color: "#FFFFFF",
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         mr: 2.5,

//                         "& svg": {
//                           fontSize: 30,
//                         },
//                       }}
//                     >
//                       {role.icon}
//                     </Box>

//                     <Box>
//                       <Typography
//                         variant="h6"
//                         sx={{
//                           fontWeight: 600,
//                           color: "#1E293B",
//                         }}
//                       >
//                         {role.title}
//                       </Typography>

//                       <Typography
//                         variant="body2"
//                         sx={{
//                           color: "#64748B",
//                           mt: 0.5,
//                         }}
//                       >
//                         {role.description}
//                       </Typography>
//                     </Box>
//                   </CardContent>
//                 </CardActionArea>
//               </Card>
//             ))}
//           </Stack>
//         </Box>
//       </Box>
//     </Box>
//   );
// }
// import "./App.css";
// import { apps } from "./appData";

// export default function App() {
//   return (
//     <div className="selector-shell">
//       <header className="selector-hero">
//         <img src="favicon.png" alt="logo" height={"100px"} />
//         <h1>Choisissez votre application</h1>
//         <p className="lead">
//           Ouvrez une application et commencez à travailler.
//         </p>
//       </header>

//       <div className="app-grid">
//         {apps.map((app) => (
//           <a className="app-card" key={app.id} href={app.href}>
//             <div>
//               <h2>{app.name}</h2>
//             </div>
//           </a>
//         ))}
//       </div>
//     </div>
//   );
// }
