import { Box, Typography, Button, Link } from "@mui/material";

import StatCard from "../components/StatCard";
import LandTable from "../components/LandTable";
import Row from "../components/Row";
import GraphCard from "../components/GraphCard";
import {
  DocumentIcon,
  MapIcon,
  OfferIcon,
  TransactionIcon,
} from "../assets/icons";

export default function SellerDashboard() {
  return (
    <Box sx={{ bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          position: "sticky",
          top: 104,
          bgcolor: "#f8fafc",
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 2,
          }}
        >
          <Button
            variant="outlined"
            component="a"
            href="#terrains"
            sx={{
              borderColor: "#15803d",
              borderRadius: 0.5,
              px: 3,
              textTransform: "none",
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "#15803d" }}>
              Ajouter un terrain
            </Typography>
          </Button>
        </Box>
        {/* cards */}
        <Row
          sx={{
            gap: 4,
            p: 2,
            flex: 1,
            width: "100%",
          }}
          direction={"row"}
        >
          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Terrains en vente"
              value="5"
              color="#15803d"
              sx={{ width: "100%" }}
              description={
                <Link href="/terrains" underline="hover" color="#15803d">
                  <Typography variant="body2">Voir les terrains</Typography>
                </Link>
              }
              icon={<MapIcon />}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Offres reçues"
              value="8"
              color="#2563eb"
              sx={{ width: "100%" }}
              description={
                <Link href="/offres" underline="hover" color="#2563eb">
                  <Typography variant="body2">Voir les offres</Typography>
                </Link>
              }
              icon={<TransactionIcon />}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Transactions"
              value="3"
              color="#d97706"
              sx={{ width: "100%" }}
              description={
                <Link href="/transactions" underline="hover" color="#d97706">
                  <Typography variant="body2">Voir les transactions</Typography>
                </Link>
              }
              icon={<DocumentIcon />}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Ventes réalisées"
              value="12"
              color="#7c3aed"
              sx={{ width: "100%" }}
              description={
                <Link href="/ventes" underline="hover" color="#7c3aed">
                  <Typography variant="body2">Voir les ventes</Typography>
                </Link>
              }
              icon={<OfferIcon />}
            />
          </Box>
        </Row>
      </Box>

      <Box sx={{ m: 2, overflow: "auto" }}>
        <GraphCard
          title="Performance hebdomadaire"
          subtitle=" Offres et ventes sur 7 jours"
          data={[14, 18, 22, 21, 24, 28, 32]}
          color="#15803d"
          sx={{ width: "100%" }}
        />
      </Box>

      <Box sx={{ m: 2, overflow: "auto" }}>
        <Box>
          <LandTable showAll />
        </Box>
      </Box>
    </Box>
  );
}
