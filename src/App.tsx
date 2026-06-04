import "./App.css";
import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import SellerDashboard from "./page/SellerDashboard";
import { Box } from "@mui/material";

function App() {
  return (
    <Box sx={{ display: "flex", minHeight: "100vh", position: "sticky" }}>
      <Sidebar />
      <Box sx={{ flex: 1 }}>
        <Header />
        <SellerDashboard />
      </Box>
    </Box>
  );
}

export default App;
