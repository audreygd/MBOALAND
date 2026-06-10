import "./index.css";
import App from "./App";
import ReactDOM from "react-dom/client";
import { MissionsProvider } from "./context/MissionsContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MissionsProvider>
    <App />
  </MissionsProvider>
);