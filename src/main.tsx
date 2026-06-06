import ReactDOM from "react-dom/client";
import { ThemeProvider } from "@mui/material/styles";
import { CssBaseline } from "@mui/material";

import VendeurApp from "./App";
import { theme } from "../apps/vendeur/src/theme";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ThemeProvider theme={theme}>
    <CssBaseline />
    <VendeurApp />
  </ThemeProvider>,
);
