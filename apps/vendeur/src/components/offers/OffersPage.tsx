import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  Chip,
  Drawer,
  IconButton,
  Stack,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";

type OfferStatus = "EN_ATTENTE" | "ACCEPTEE" | "REFUSEE" | "CONTRE_OFFRE";

interface Offer {
  id: string;
  reference: string;
  terrain: string;
  buyer: string;
  amount: number;
  status: OfferStatus;
  date: string;
}

const offers: Offer[] = [
  {
    id: "1",
    reference: "OFF-2024-001",
    terrain: "Terrain à Odza",
    buyer: "Martin Kamga",
    amount: 12500000,
    status: "EN_ATTENTE",
    date: "12 Mai 2024",
  },
];

const statusColors = {
  EN_ATTENTE: {
    bg: "#FFF4E5",
    color: "#B45309",
    label: "En attente",
  },
  ACCEPTEE: {
    bg: "#E8F5E9",
    color: "#15803D",
    label: "Acceptée",
  },
  REFUSEE: {
    bg: "#FEECEC",
    color: "#DC2626",
    label: "Refusée",
  },
  CONTRE_OFFRE: {
    bg: "#EEF2FF",
    color: "#2563EB",
    label: "Contre-offre",
  },
};

export default function OffersPage() {
  const [selected, setSelected] = useState<Offer | null>(null);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {/* <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Offres reçues
        </Typography> */}

        <Typography color="text.secondary" sx={{ fontSize: 18 }}>
          Consultez et gérez les offres reçues pour vos terrains.
        </Typography>
      </Box>

      {/* Statistiques */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 2,
          mb: 3,
        }}
      >
        {[
          { title: "Offres reçues", value: 24 },
          { title: "En attente", value: 12 },
          { title: "Acceptées", value: 5 },
          { title: "Refusées", value: 7 },
        ].map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              p: 2,
              border: "1px solid #E5E7EB",
              borderRadius: 1,
            }}
          >
            <Typography color="text.secondary">{item.title}</Typography>

            <Typography
              sx={{
                fontSize: 28,
                fontWeight: 700,
                mt: 1,
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Filtres */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          border: "1px solid #E5E7EB",
          borderRadius: 1,
          mb: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <TextField
            size="small"
            placeholder="Rechercher une offre..."
            sx={{ minWidth: 300 }}
          />

          <Select size="small" defaultValue="ALL" sx={{ minWidth: 180 }}>
            <MenuItem value="ALL">Tous les statuts</MenuItem>
            <MenuItem value="EN_ATTENTE">En attente</MenuItem>
            <MenuItem value="ACCEPTEE">Acceptée</MenuItem>
            <MenuItem value="REFUSEE">Refusée</MenuItem>
          </Select>

          <Button
            variant="contained"
            sx={{
              ml: "auto",
              bgcolor: "#15803D",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#166534",
              },
            }}
          >
            Exporter
          </Button>
        </Box>
      </Paper>

      {/* Tableau */}
      <Paper
        elevation={0}
        sx={{
          border: "1px solid #E5E7EB",
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 80px",
            px: 2,
            py: 2,
            bgcolor: "#F9FAFB",
            borderBottom: "1px solid #E5E7EB",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Référence</Typography>

          <Typography sx={{ fontWeight: 600 }}>Terrain</Typography>

          <Typography sx={{ fontWeight: 600 }}>Acheteur</Typography>

          <Typography sx={{ fontWeight: 600 }}>Montant</Typography>

          <Typography sx={{ fontWeight: 600 }}>Statut</Typography>

          <Typography sx={{ fontWeight: 600 }}>Action</Typography>
        </Box>

        {/* Lignes */}
        {offers.map((offer) => (
          <Box
            key={offer.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr 1fr 1fr 80px",
              px: 2,
              py: 2,
              borderBottom: "1px solid #F3F4F6",
              alignItems: "center",
            }}
          >
            <Typography>{offer.reference}</Typography>

            <Typography>{offer.terrain}</Typography>

            <Typography>{offer.buyer}</Typography>

            <Typography sx={{ fontWeight: 600 }}>
              {offer.amount.toLocaleString("fr-FR")} FCFA
            </Typography>

            <Chip
              label={statusColors[offer.status].label}
              sx={{
                bgcolor: statusColors[offer.status].bg,
                color: statusColors[offer.status].color,
                fontWeight: 600,
                width: "fit-content",
              }}
            />

            <IconButton onClick={() => setSelected(offer)}>
              <VisibilityOutlinedIcon />
            </IconButton>
          </Box>
        ))}
      </Paper>

      {/* Drawer détails */}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 550,
            p: 3,
          },
        }}
      >
        {selected && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Détails de l'offre
              </Typography>

              <IconButton onClick={() => setSelected(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack spacing={2}>
              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Terrain</Typography>

                <Typography>{selected.terrain}</Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Acheteur</Typography>

                <Typography>{selected.buyer}</Typography>
              </Paper>

              <Paper variant="outlined" sx={{ p: 2 }}>
                <Typography sx={{ fontWeight: 700 }}>Offre proposée</Typography>

                <Typography
                  sx={{
                    fontSize: 24,
                    fontWeight: 700,
                    color: "#15803D",
                  }}
                >
                  {selected.amount.toLocaleString("fr-FR")} FCFA
                </Typography>
              </Paper>
            </Stack>

            <Box
              sx={{
                display: "flex",
                gap: 2,
                mt: 4,
              }}
            >
              <Button variant="outlined" color="error" fullWidth>
                Refuser
              </Button>

              <Button variant="outlined" fullWidth>
                Contre-offre
              </Button>

              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#15803D",
                }}
              >
                Accepter
              </Button>
            </Box>
          </>
        )}
      </Drawer>
    </Box>
  );
}
