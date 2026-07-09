import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Alert,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LockIcon from "@mui/icons-material/Lock";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import StraightenIcon from "@mui/icons-material/Straighten";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

import { useGeometreNavigation } from "../hooks/useGeometreNavigation";
import { useMissions } from "../context/MissionsContext";
import {
  STATUS_CHIP_COLOR,
  STATUS_LABELS,
  canEditTechnical,
  getMissionSteps,
} from "../lib/missionUtils";

import type { MissionTechnicalData } from "../types";

/* ───────── UI helpers ───────── */

function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5, py: 1 }}>
      <Box sx={{ color: "#10b981", mt: 0.2 }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
          {label}
        </Typography>
        <Typography variant="body2" sx={{ fontWeight: 500 }}>
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

function ReadOnlyBanner() {
  return (
    <Alert
      severity="info"
      icon={<LockIcon fontSize="inherit" />}
      sx={{
        mb: 2,
        bgcolor: "#f0fdf4",
        color: "#166534",
        "& .MuiAlert-icon": { color: "#10b981" },
      }}
    >
      Informations enregistrées par le propriétaire et validées par le notaire — lecture seule.
    </Alert>
  );
}

/* ───────── Component ───────── */

export default function MissionsDetails() {
  //  remplace useNavigate par useGeometreNavigation
  const { goTo } = useGeometreNavigation();
  const { id } = useParams();

  const missionId = Number(id);

  const { getMission, updateTechnical, startMission, submitReport } =
    useMissions();

  const mission = getMission(missionId);

  const [form, setForm] = useState<MissionTechnicalData | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  /* sync mission -> form */
  useEffect(() => {
    if (mission) {
      setForm({ ...mission.technical });
      setSubmitErrors([]);
      setSubmitSuccess(false);
      setSavedMsg(false);
    }
  }, [mission]);

  const etapes = mission ? getMissionSteps(mission) : [];

  if (!mission || !form) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Mission introuvable</Alert>
        {/*  "missions" relatif au lieu de "/missions" */}
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={() => goTo("missions")}>
          Retour
        </Button>
      </Box>
    );
  }

  const editable = canEditTechnical(mission.status);

  /* ───────── handlers ───────── */

  const handleField = (field: keyof MissionTechnicalData, value: string | number) => {
    setForm((prev) => {
      if (!prev) return prev;
      return { ...prev, [field]: value };
    });
    setSavedMsg(false);
  };

  const handleSave = () => {
    if (!form) return;
    updateTechnical(mission.id, form);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 2500);
  };

  const handleSubmitReport = () => {
    if (!form) return;

    const errors = submitReport(mission.id, form);

    if (errors.length) {
      setSubmitErrors(errors);
      setSubmitSuccess(false);
    } else {
      setSubmitErrors([]);
      setSubmitSuccess(true);
    }
  };

  /* ───────── UI ───────── */

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 2 }}>

        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => goTo("missions")}
            variant="outlined"
            size="small"
          >
            Retour
          </Button>

          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {mission.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mission.zone} · Mission #{mission.id}
            </Typography>
          </Box>
        </Box>

        <Chip
          label={STATUS_LABELS[mission.status]}
          color={STATUS_CHIP_COLOR[mission.status]}
        />
      </Box>

      {/* ÉTAPES */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Avancement de la mission
        </Typography>
        <Stack
  direction="row"
  spacing={1}
  sx={{
    flexWrap: "wrap",
    gap: 1,
  }}
>
          {etapes.map((etape) => (
            <Chip
              key={etape.label}
              label={etape.label}
              size="small"
              sx={{
                fontWeight: 600,
                bgcolor: etape.done ? "#f0fdf4" : "#f3f4f6",
                color: etape.done ? "#15803d" : "#6b7280",
                border: etape.done ? "1px solid #bbf7d0" : "1px solid #e5e7eb",
              }}
            />
          ))}
        </Stack>
      </Paper>

      {/* ALERTS */}
      {submitSuccess && <Alert severity="success" sx={{ mb: 2 }}>Rapport envoyé avec succès</Alert>}

      {submitErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <List dense>
            {submitErrors.map((e, i) => (
              <ListItem key={i}>
                <ListItemText primary={`• ${e}`} />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      {/* ADMIN */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Informations administratives
        </Typography>

        <ReadOnlyBanner />

        <InfoRow icon={<StraightenIcon />} label="Superficie" value={mission.admin?.superficie ?? ""} />
        <InfoRow icon={<CalendarTodayIcon />} label="Date" value={mission.admin?.date ?? ""} />
        <InfoRow icon={<LocationOnIcon />} label="GPS" value={mission.admin?.coordonnees ?? ""} />
        <InfoRow icon={<GavelIcon />} label="Notaire" value={mission.admin?.notaire ?? ""} />
        <InfoRow icon={<PersonIcon />} label="Propriétaire" value={mission.admin?.proprietaire ?? ""} />
      </Paper>

      {/* TECH */}
      <Paper sx={{ p: 3 }}>
        <Typography sx={{ fontWeight: 700, mb: 2 }}>
          Données techniques
        </Typography>

        <Stack spacing={2}>
          <TextField
            label="Bornes"
            type="number"
            size="small"
            disabled={!editable}
            value={form.nb_bornes ?? ""}
            onChange={(e) => handleField("nb_bornes", Number(e.target.value))}
          />

          <TextField
            label="Surface calculée"
            size="small"
            disabled={!editable}
            value={form.surface_calculee ?? ""}
            onChange={(e) => handleField("surface_calculee", e.target.value)}
          />

          <TextField
            label="Écart titre foncier"
            size="small"
            disabled={!editable}
            value={form.ecart_titre ?? ""}
            onChange={(e) => handleField("ecart_titre", e.target.value)}
          />

          <TextField
            label="Notes"
            size="small"
            multiline
            rows={2}
            disabled={!editable}
            value={form.notes_techniques ?? ""}
            onChange={(e) => handleField("notes_techniques", e.target.value)}
          />
        </Stack>

        {editable && (
          <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
            {mission.status === "assignée" && (
              <Button
                variant="contained"
                startIcon={<PlayArrowIcon />}
                onClick={() => startMission(mission.id)}
              >
                Commencer
              </Button>
            )}

            <Button variant="outlined" startIcon={<SaveIcon />} onClick={handleSave}>
              Sauvegarder
            </Button>

            <Button variant="contained" startIcon={<SendIcon />} onClick={handleSubmitReport}>
              Envoyer
            </Button>
          </Box>
        )}

        {savedMsg && <Alert sx={{ mt: 2 }}>Sauvegardé</Alert>}
      </Paper>
    </Box>
  );
}
