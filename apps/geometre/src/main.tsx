import "./index.css";
import ReactDOM from "react-dom/client";
import { MissionsProvider } from "./context/MissionsContext";
import GeometreApp from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MissionsProvider>
    <GeometreApp />
  </MissionsProvider>,
);
