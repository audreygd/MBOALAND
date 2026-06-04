import { Box, Typography, Button, Stack, Link } from "@mui/material";

import StatCard from "../components/StatCard";
import LandTable from "../components/LandTable";
import Row from "../components/Row";
import GraphCard from "../components/GraphCard";

export default function SellerDashboard() {
  return (
    <Box sx={{ bgcolor: "#f8fafc" }}>
      <Stack sx={{ flex: 1, p: 4, pt: 0 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            py: 2,
          }}
        >
          <Button
            variant="outlined"
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
            display: "flex",
            flex: 1,
            width: "100%",
            bgcolor: "green",
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
                <Link href="/seller/lands" underline="hover" color="#15803d">
                  <Typography variant="body2">Voir les terrains</Typography>
                </Link>
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Offres reçues"
              value="8"
              color="#2563eb"
              sx={{ width: "100%" }}
              description={
                <Link href="/seller/offers" underline="hover" color="#2563eb">
                  <Typography variant="body2">Voir les offres</Typography>
                </Link>
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Transactions"
              value="3"
              color="#d97706"
              sx={{ width: "100%" }}
              description={
                <Link
                  href="/seller/transactions"
                  underline="hover"
                  color="#d97706"
                >
                  <Typography variant="body2">Voir les transactions</Typography>
                </Link>
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="Ventes réalisées"
              value="12"
              color="#7c3aed"
              sx={{ width: "100%" }}
              description={
                <Link href="/seller/sales" underline="hover" color="#7c3aed">
                  <Typography variant="body2">Voir les ventes</Typography>
                </Link>
              }
            />
          </Box>
        </Row>

        <Box sx={{ mt: 4 }}>
          <GraphCard
            title="Performance hebdomadaire"
            subtitle="Visites, offres et ventes sur 7 jours"
            data={[14, 18, 22, 21, 24, 28, 32]}
            color="#15803d"
            sx={{ width: "100%" }}
          />
        </Box>

        <Box sx={{ mt: 4 }}>
          <Box>
            <LandTable />
          </Box>
        </Box>
      </Stack>
    </Box>
  );
}
