import { useState } from "react";
import {
  Box, Typography, TextField, InputAdornment, Chip,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Tooltip, Button,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import RestartAltIcon from "@mui/icons-material/RestartAlt";

import { useGeometreNavigation } from "../hooks/useGeometreNavigation";
import { useMissions } from "../context/MissionsContext";
import { STATUS_CHIP_COLOR, STATUS_LABELS } from "../lib/missionUtils";
import type { MissionStatus } from "../types";

export default function Missions() {
  // ✅ remplace useNavigate (react-router) par useGeometreNavigation
  const { goTo } = useGeometreNavigation();

  const { missions, resetDemo } = useMissions();
  const [filtre, setFiltre] = useState<MissionStatus | "toutes">("toutes");
  const [recherche, setRecherche] = useState("");

  const missionsFiltrees = missions.filter((m) => {
    const matchStatut = filtre === "toutes" || m.status === filtre;
    const owner = m.admin?.proprietaire ?? m.vendeur ?? "";

    const matchRecherche =
      m.title.toLowerCase().includes(recherche.toLowerCase()) ||
      m.zone.toLowerCase().includes(recherche.toLowerCase()) ||
      owner.toLowerCase().includes(recherche.toLowerCase());

    return matchStatut && matchRecherche;
  });

  const STATUS_FILTERS: { label: string; value: MissionStatus | "toutes" }[] = [
    { label: "Toutes", value: "toutes" },
    { label: "Assignée", value: "assignée" },
    { label: "En cours", value: "en_cours" },
    { label: "En validation", value: "en_attente_validation" },
    { label: "Terminée", value: "terminée" },
  ];

  const counts: Record<MissionStatus | "toutes", number> = {
    toutes: missions.length,
    assignée: missions.filter((m) => m.status === "assignée").length,
    en_cours: missions.filter((m) => m.status === "en_cours").length,
    en_attente_validation: missions.filter((m) => m.status === "en_attente_validation").length,
    terminée: missions.filter((m) => m.status === "terminée").length,
  };

  const handleReset = () => {
    if (window.confirm("Réinitialiser les missions ?")) {
      resetDemo();
    }
  };

  // ✅ chemin relatif "missions/3" — goTo ajoute le préfixe /surveyor si besoin
  const handleOpenMission = (id: number) => {
    goTo(`missions/${id}`);
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Mes missions
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {missions.length} missions
          </Typography>
        </Box>

        <Button
          startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{ textTransform: "none" }}
          variant="outlined"
        >
          Reset
        </Button>
      </Box>

      {/* FILTRES */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {STATUS_FILTERS.map((f) => (
          <Chip
            key={f.value}
            label={`${f.label} (${counts[f.value]})`}
            onClick={() => setFiltre(f.value)}
            sx={{
              bgcolor: filtre === f.value ? "#10b981" : "transparent",
              color: filtre === f.value ? "#fff" : "inherit",
              border: "1px solid #10b981",
              fontWeight: 600,
            }}
          />
        ))}

        <TextField
          size="small"
          placeholder="Rechercher..."
          value={recherche}
          onChange={(e) => setRecherche(e.target.value)}
          sx={{ ml: "auto", minWidth: 250 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* TABLE */}
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Mission</TableCell>
              <TableCell>Zone</TableCell>
              <TableCell>Superficie</TableCell>
              <TableCell>Date</TableCell>
              <TableCell>Notaire</TableCell>
              <TableCell>Statut</TableCell>
              <TableCell align="center">Action</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {missionsFiltrees.map((m) => (
              <TableRow
                key={m.id}
                hover
                sx={{ cursor: "pointer" }}
                onClick={() => handleOpenMission(m.id)}
              >
                <TableCell>{m.title}</TableCell>
                <TableCell>{m.zone}</TableCell>
                <TableCell>{m.admin?.superficie ?? "—"}</TableCell>
                <TableCell>{m.admin?.date ?? "—"}</TableCell>
                <TableCell>{m.admin?.notaire ?? "—"}</TableCell>

                <TableCell>
                  <Chip
                    label={STATUS_LABELS[m.status]}
                    color={STATUS_CHIP_COLOR[m.status]}
                    size="small"
                  />
                </TableCell>

                <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                  <Tooltip title="Voir">
                    <IconButton
                      onClick={() => handleOpenMission(m.id)}
                      sx={{ color: "#10b981" }}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}