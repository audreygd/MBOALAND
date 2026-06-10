import { Outlet } from "react-router-dom";
import { MissionsProvider } from "./context/MissionsContext";

export default function GeometreApp() {
  return (
    <MissionsProvider>
      <Outlet />
    </MissionsProvider>
  );
}
