import { useState } from "react";
import {
  Box, Typography, TextField, InputAdornment, Chip,
  Table, TableHead, TableRow, TableCell, TableBody,
  Paper, IconButton, Tooltip, Button,
} from "@mui/material";
import SearchIcon      from "@mui/icons-material/Search";
import VisibilityIcon  from "@mui/icons-material/Visibility";
import RestartAltIcon  from "@mui/icons-material/RestartAlt";
import { useMissions } from "../context/MissionsContext";
import { STATUS_CHIP_COLOR, STATUS_LABELS } from "../lib/missionUtils";
import type { MissionStatus } from "../types";

interface Props {
  onViewDetail?: (id: number) => void;
}

const STATUS_FILTERS: { label: string; value: MissionStatus | "toutes" }[] = [
  { label: "Toutes",        value: "toutes"               },
  { label: "Assignée",      value: "assignée"             },
  { label: "En cours",      value: "en_cours"             },
  { label: "En validation", value: "en_attente_validation" },
  { label: "Terminée",      value: "terminée"             },
];

export default function Missions({ onViewDetail }: Props) {
  const { missions, resetDemo } = useMissions();
  const [filtre,    setFiltre]    = useState<MissionStatus | "toutes">("toutes");
  const [recherche, setRecherche] = useState("");

  const missionsFiltrees = missions.filter((m) => {
    const matchStatut   = filtre === "toutes" || m.status === filtre;
    // ✅ Accès sécurisé à admin avec ?.
    const proprietaire  = m.admin?.proprietaire ?? m.vendeur ?? "";
    const matchRecherche =
      m.title.toLowerCase().includes(recherche.toLowerCase()) ||
      m.zone.toLowerCase().includes(recherche.toLowerCase()) ||
      proprietaire.toLowerCase().includes(recherche.toLowerCase());
    return matchStatut && matchRecherche;
  });

  const counts: Record<MissionStatus | "toutes", number> = {
    toutes:               missions.length,
    assignée:             missions.filter((m) => m.status === "assignée").length,
    en_cours:             missions.filter((m) => m.status === "en_cours").length,
    en_attente_validation:missions.filter((m) => m.status === "en_attente_validation").length,
    terminée:             missions.filter((m) => m.status === "terminée").length,
  };

  const handleReset = () => {
    if (window.confirm("Réinitialiser toutes les missions aux données de démo ?")) {
      resetDemo();
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Mes missions</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {missions.length} missions reçues
          </Typography>
        </Box>
        <Button variant="outlined" size="small" startIcon={<RestartAltIcon />}
          onClick={handleReset}
          sx={{ textTransform: "none", color: "#64748b", borderColor: "#cbd5e1" }}
        >
          Réinitialiser la démo
        </Button>
      </Box>

      {/* FILTRES */}
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        {STATUS_FILTERS.map((f) => (
          <Chip key={f.value}
            label={`${f.label} (${counts[f.value]})`}
            onClick={() => setFiltre(f.value)}
            variant={filtre === f.value ? "filled" : "outlined"}
            sx={{
              fontWeight: 600, cursor: "pointer",
              bgcolor: filtre === f.value ? "#10b981" : "transparent",
              color:   filtre === f.value ? "#fff" : "inherit",
              borderColor: "#10b981",
              "&:hover": { bgcolor: filtre === f.value ? "#059669" : "#f0fdf4" },
            }}
          />
        ))}
        <TextField size="small" placeholder="Rechercher une mission..."
          value={recherche} onChange={(e) => setRecherche(e.target.value)}
          sx={{ ml: "auto", minWidth: 260 }}
          slotProps={{
            input: {
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#9ca3af", fontSize: 18 }} />
                </InputAdornment>
              ),
            },
          }}
        />
      </Box>

      {/* TABLE */}
      <Paper elevation={2} sx={{ borderRadius: 2, overflow: "hidden" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f1f5f9" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Mission</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Zone</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Superficie</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Date prévue</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Notaire</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Statut</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Action</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {missionsFiltrees.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} align="center" sx={{ py: 5, color: "#9ca3af" }}>
                  Aucune mission trouvée
                </TableCell>
              </TableRow>
            ) : (
              missionsFiltrees.map((m) => (
                <TableRow key={m.id}
                  sx={{ "&:hover": { bgcolor: "#f8fafc" }, cursor: "pointer" }}
                  onClick={() => onViewDetail?.(m.id)}
                >
                  <TableCell>
                    <Typography sx={{ fontWeight: 600, fontSize: 14 }}>{m.title}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>{m.zone}</Typography>
                  </TableCell>
                  <TableCell>
                    {/* ✅ Accès sécurisé : admin?.superficie ?? superficie top-level */}
                    <Typography sx={{ fontSize: 13 }}>
                      {m.admin?.superficie ?? m.superficie ?? "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13 }}>
                      {m.admin?.date ?? m.date ?? "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography sx={{ fontSize: 13 }}>
                      {m.admin?.notaire ?? m.notaire ?? "—"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={STATUS_LABELS[m.status]}
                      color={STATUS_CHIP_COLOR[m.status]}
                      size="small"
                      sx={
                        m.status === "en_attente_validation"
                          ? { bgcolor: "#ede9fe", color: "#7c3aed", fontWeight: 600 }
                          : { fontWeight: 600 }
                      }
                    />
                  </TableCell>
                  <TableCell align="center" onClick={(e) => e.stopPropagation()}>
                    <Tooltip title="Voir le détail">
                      <IconButton size="small" onClick={() => onViewDetail?.(m.id)} sx={{ color: "#10b981" }}>
                        <VisibilityIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  );
}