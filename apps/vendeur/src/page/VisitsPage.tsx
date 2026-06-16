/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Chip,
  Stack,
  TextField,
  MenuItem,
  Select,
  Avatar,
  Drawer,
  IconButton,
} from "@mui/material";

import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

type VisitStatus = "PLANIFIEE" | "CONFIRMEE" | "TERMINEE" | "ANNULEE";

type Visit = {
  id: string;
  terrain: string;
  location: string;
  buyer: string;
  phone: string;
  date: string;
  hour: string;
  agent: string;
  status: VisitStatus;
};

const statusMeta = {
  PLANIFIEE: {
    label: "Planifiée",
    color: "#D97706",
    bg: "#FFF7ED",
  },
  CONFIRMEE: {
    label: "Confirmée",
    color: "#2563EB",
    bg: "#EFF6FF",
  },
  TERMINEE: {
    label: "Terminée",
    color: "#15803D",
    bg: "#ECFDF5",
  },
  ANNULEE: {
    label: "Annulée",
    color: "#DC2626",
    bg: "#FEF2F2",
  },
};

function StatusChip({ status }: { status: VisitStatus }) {
  const meta = statusMeta[status];

  return (
    <Chip
      label={meta.label}
      sx={{
        bgcolor: meta.bg,
        color: meta.color,
        fontWeight: 600,
      }}
    />
  );
}

export default function VisitsPage() {
  const [selected, setSelected] = useState<Visit | null>(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | VisitStatus>("ALL");

  const visits = useMemo<Visit[]>(
    () => [
      {
        id: "1",
        terrain: "Terrain à Odza",
        location: "Yaoundé",
        buyer: "Martin Kamga",
        phone: "+237 674 12 45 67",
        date: "15 Juin 2026",
        hour: "10:00",
        agent: "Jean Dupont",
        status: "PLANIFIEE",
      },
      {
        id: "2",
        terrain: "Terrain à Kribi",
        location: "Kribi",
        buyer: "Alice Ndzi",
        phone: "+237 655 78 32 10",
        date: "14 Juin 2026",
        hour: "14:30",
        agent: "Patrick Mbarga",
        status: "CONFIRMEE",
      },
      {
        id: "3",
        terrain: "Terrain à Douala",
        location: "Douala",
        buyer: "Bernard Tchamda",
        phone: "+237 677 45 12 54",
        date: "12 Juin 2026",
        hour: "09:00",
        agent: "Jean Dupont",
        status: "TERMINEE",
      },
      {
        id: "4",
        terrain: "Terrain à Bafoussam",
        location: "Bafoussam",
        buyer: "Patrick Mvogo",
        phone: "+237 694 78 25 11",
        date: "10 Juin 2026",
        hour: "16:00",
        agent: "Jean Dupont",
        status: "ANNULEE",
      },
    ],
    [],
  );

  const filteredVisits = useMemo(() => {
    return visits.filter((v) => {
      const q = search.toLowerCase();

      const matchesSearch =
        v.terrain.toLowerCase().includes(q) ||
        v.buyer.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : v.status === statusFilter;

      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter, visits]);

  const stats = {
    total: visits.length,
    planned: visits.filter((v) => v.status === "PLANIFIEE").length,
    confirmed: visits.filter((v) => v.status === "CONFIRMEE").length,
    completed: visits.filter((v) => v.status === "TERMINEE").length,
  };

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Visites
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mt: 1,
          }}
        >
          Gérez les visites planifiées et leur suivi.
        </Typography>
      </Box>

      {/* Statistiques */}
      <Stack direction="row" spacing={3} sx={{ mb: 3 }}>
        {[
          {
            label: "Total",
            value: stats.total,
          },
          {
            label: "Planifiées",
            value: stats.planned,
          },
          {
            label: "Confirmées",
            value: stats.confirmed,
          },
          {
            label: "Terminées",
            value: stats.completed,
          },
        ].map((card) => (
          <Paper
            key={card.label}
            elevation={0}
            sx={{
              flex: 1,
              p: 3,
              border: "1px solid rgba(0,0,0,.08)",
            }}
          >
            <Typography
              sx={{
                color: "text.secondary",
              }}
            >
              {card.label}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontWeight: 700,
                fontSize: 28,
              }}
            >
              {card.value}
            </Typography>
          </Paper>
        ))}
      </Stack>

      {/* Filtres */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          border: "1px solid rgba(0,0,0,.08)",
        }}
      >
        <Stack direction="row" spacing={2}>
          <TextField
            size="small"
            placeholder="Rechercher..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            sx={{ width: 350 }}
          />

          <Select
            size="small"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
          >
            <MenuItem value="ALL">Tous les statuts</MenuItem>
            <MenuItem value="PLANIFIEE">Planifiées</MenuItem>
            <MenuItem value="CONFIRMEE">Confirmées</MenuItem>
            <MenuItem value="TERMINEE">Terminées</MenuItem>
            <MenuItem value="ANNULEE">Annulées</MenuItem>
          </Select>

          <Button
            variant="contained"
            startIcon={<DownloadOutlinedIcon />}
            sx={{
              ml: "auto",
              bgcolor: "#15803D",
            }}
          >
            Exporter
          </Button>
        </Stack>
      </Paper>

      {/* Liste */}

      <Paper
        elevation={0}
        sx={{
          border: "1px solid rgba(0,0,0,.08)",
          overflow: "hidden",
        }}
      >
        {/* Entête */}
        <Box
          sx={{
            px: 3,
            py: 1.5,
            display: "grid",
            gridTemplateColumns: "1.5fr 1fr 1fr 1fr .8fr .5fr",
            bgcolor: "#F8FAFC",
            borderBottom: "1px solid rgba(0,0,0,.08)",
          }}
        >
          <Typography sx={{ fontWeight: 700 }}>Terrain</Typography>

          <Typography sx={{ fontWeight: 700 }}>Acheteur</Typography>

          <Typography sx={{ fontWeight: 700 }}>Date</Typography>

          <Typography sx={{ fontWeight: 700 }}>Heure</Typography>

          <Typography sx={{ fontWeight: 700 }}>Statut</Typography>

          <Typography sx={{ fontWeight: 700 }}>Action</Typography>
        </Box>

        {/* Corps */}
        {filteredVisits.map((visit) => (
          <Box
            key={visit.id}
            sx={{
              px: 3,
              py: 2,
              display: "grid",
              gridTemplateColumns: "1.5fr 1fr 1fr 1fr .8fr .5fr",
              borderBottom: "1px solid rgba(0,0,0,.06)",
              alignItems: "center",
              "&:hover": {
                bgcolor: "#F8FAFC",
              },
            }}
          >
            <Box>
              <Typography sx={{ fontWeight: 600 }}>{visit.terrain}</Typography>

              <Typography
                sx={{
                  color: "text.secondary",
                  fontSize: 14,
                }}
              >
                {visit.location}
              </Typography>
            </Box>

            <Typography>{visit.buyer}</Typography>

            <Typography>{visit.date}</Typography>

            <Typography>{visit.hour}</Typography>

            <StatusChip status={visit.status} />

            <IconButton onClick={() => setSelected(visit)}>
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
      >
        {selected && (
          <Box
            sx={{
              width: 500,
              p: 3,
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 22,
                  fontWeight: 700,
                }}
              >
                Détails de la visite
              </Typography>

              <IconButton onClick={() => setSelected(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Stack spacing={3}>
              <Avatar
                sx={{
                  width: 70,
                  height: 70,
                  bgcolor: "#15803D",
                }}
              >
                {selected.buyer[0]}
              </Avatar>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>Acheteur</Typography>

                <Typography>{selected.buyer}</Typography>

                <Typography color="text.secondary">{selected.phone}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>Terrain</Typography>

                <Typography>{selected.terrain}</Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>Date et heure</Typography>

                <Typography>
                  {selected.date} à {selected.hour}
                </Typography>
              </Box>

              <Box>
                <Typography sx={{ fontWeight: 700 }}>
                  Agent responsable
                </Typography>

                <Typography>{selected.agent}</Typography>
              </Box>

              <StatusChip status={selected.status} />

              <Stack direction="row" spacing={2}>
                <Button variant="outlined" color="error" fullWidth>
                  Annuler
                </Button>

                <Button
                  variant="contained"
                  fullWidth
                  sx={{
                    bgcolor: "#15803D",
                  }}
                >
                  Confirmer
                </Button>
              </Stack>
            </Stack>
          </Box>
        )}
      </Drawer>
    </Box>
  );
}
