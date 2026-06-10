import { Route } from "react-router-dom";

import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Missions from "./pages/Missions";
import Missionsdetails from "./pages/Missionsdetails";
import CarteTerrain from "./pages/CarteTerrain";
import Notifications from "./pages/Notifications";
import Messagerie from "./pages/Messagerie";
import Profil from "./pages/Profil";

export const geometreLayoutRoutes = (
  <Route element={<Layout />}>
    <Route index element={<Dashboard />} />
    <Route path="missions" element={<Missions />} />
    <Route path="missions/:id" element={<Missionsdetails />} />
    <Route path="carte" element={<CarteTerrain />} />
    <Route path="notifications" element={<Notifications />} />
    <Route path="messagerie" element={<Messagerie />} />
    <Route path="profil" element={<Profil />} />
  </Route>
);
