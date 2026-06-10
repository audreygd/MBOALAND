import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  Button,
  Divider,
  Grid,
  Alert,
  TextField,
  Stack,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import LockIcon from "@mui/icons-material/Lock";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import SendIcon from "@mui/icons-material/Send";
import SaveIcon from "@mui/icons-material/Save";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PersonIcon from "@mui/icons-material/Person";
import GavelIcon from "@mui/icons-material/Gavel";
import StraightenIcon from "@mui/icons-material/Straighten";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import { useMissions } from "../context/MissionsContext";
import {
  STATUS_CHIP_COLOR,
  STATUS_LABELS,
  canEditTechnical,
  getMissionSteps,
} from "../lib/missionUtils";
import type { MissionTechnicalData } from "../types";

interface Props {
  missionId: number;
  onBack?: () => void;
}

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
        <Typography variant="body2" sx={{ fontWeight: 500, mt: 0.2 }}>
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
      sx={{ mb: 2, bgcolor: "#f0fdf4", color: "#166534", "& .MuiAlert-icon": { color: "#10b981" } }}
    >
      Informations enregistrées par le propriétaire et validées par le notaire — lecture seule.
    </Alert>
  );
}

export default function MissionsDetails({ missionId, onBack }: Props) {
  const { getMission, updateTechnical, startMission, submitReport } = useMissions();
  const mission = getMission(missionId);

  const [form, setForm] = useState<MissionTechnicalData | null>(null);
  const [savedMsg, setSavedMsg] = useState(false);
  const [submitErrors, setSubmitErrors] = useState<string[]>([]);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  useEffect(() => {
    if (mission) {
      setForm({ ...mission.technical });
      setSubmitErrors([]);
      setSubmitSuccess(false);
      setSavedMsg(false);
    }
  }, [mission]);

  if (!mission || !form) {
    return (
      <Box sx={{ p: 4 }}>
        <Alert severity="error">Mission introuvable.</Alert>
        <Button sx={{ mt: 2 }} startIcon={<ArrowBackIcon />} onClick={onBack}>
          Retour
        </Button>
      </Box>
    );
  }

  const editable = canEditTechnical(mission.status);
  const etapes = getMissionSteps(mission);

  const handleField = (field: keyof MissionTechnicalData, value: string | number) => {
    setForm((prev) => (prev ? { ...prev, [field]: value } : prev));
    setSavedMsg(false);
  };

  const handleFile = (field: "fichier_gps" | "rapport", file: File | null) => {
    if (file) handleField(field, file.name);
  };

  const handleSave = () => {
    updateTechnical(mission.id, form);
    setSavedMsg(true);
    setTimeout(() => setSavedMsg(false), 3000);
  };

  const handleSubmitReport = () => {
    const errors = submitReport(mission.id, form);
    if (errors.length > 0) {
      setSubmitErrors(errors);
      setSubmitSuccess(false);
    } else {
      setSubmitErrors([]);
      setSubmitSuccess(true);
    }
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 3,
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={onBack}
            variant="outlined"
            size="small"
            sx={{ textTransform: "none", color: "#555", borderColor: "#ddd" }}
          >
            Retour
          </Button>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {mission.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {mission.zone} · Mission #{mission.id}
              {mission.admin.referenceTerrain && ` · ${mission.admin.referenceTerrain}`}
            </Typography>
          </Box>
        </Box>
        <Chip
          label={STATUS_LABELS[mission.status]}
          color={STATUS_CHIP_COLOR[mission.status]}
          sx={
            mission.status === "en_attente_validation"
              ? { fontWeight: 700, fontSize: 13, px: 1, bgcolor: "#ede9fe", color: "#7c3aed" }
              : { fontWeight: 700, fontSize: 13, px: 1 }
          }
        />
      </Box>

      {mission.status === "en_attente_validation" && (
        <Alert severity="warning" sx={{ mb: 3 }}>
          Rapport déposé le {mission.dateDepot}. En attente de validation par le notaire /
          administrateur.
        </Alert>
      )}

      {mission.status === "terminée" && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Mission validée par le notaire
          {mission.dateValidation ? ` le ${mission.dateValidation}` : ""}.
        </Alert>
      )}

      {submitSuccess && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Rapport déposé avec succès. La mission est en attente de validation.
        </Alert>
      )}

      {submitErrors.length > 0 && (
        <Alert severity="error" sx={{ mb: 3 }}>
          <Typography variant="body2" sx={{ fontWeight: 600, mb: 1 }}>
            Complétez les champs suivants avant de déposer le rapport :
          </Typography>
          <List dense disablePadding>
            {submitErrors.map((err) => (
              <ListItem key={err} disablePadding sx={{ py: 0.2 }}>
                <ListItemText
                  primary={`• ${err}`}
                  slotProps={{ primary: { sx: { fontSize: 13 } } }}
                />
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      <Paper elevation={1} sx={{ p: 3, borderRadius: 2, mb: 3 }}>
        <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
          Avancement de la mission
        </Typography>
        <Box sx={{ display: "flex", alignItems: "flex-start", overflowX: "auto" }}>
          {etapes.map((etape, i) => (
            <Box
              key={etape.label}
              sx={{
                flex: 1,
                minWidth: 90,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                position: "relative",
              }}
            >
              {i < etapes.length - 1 && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 12,
                    left: "50%",
                    width: "100%",
                    height: 2,
                    bgcolor: etape.done ? "#10b981" : "#e5e7eb",
                    zIndex: 0,
                  }}
                />
              )}
              <Box sx={{ zIndex: 1, bgcolor: "#fff", px: 0.5 }}>
                {etape.done ? (
                  <CheckCircleIcon sx={{ color: "#10b981", fontSize: 26 }} />
                ) : (
                  <RadioButtonUncheckedIcon sx={{ color: "#d1d5db", fontSize: 26 }} />
                )}
              </Box>
              <Typography
                variant="caption"
                sx={{
                  mt: 0.5,
                  textAlign: "center",
                  fontWeight: etape.done ? 600 : 400,
                  color: etape.done ? "#10b981" : "#9ca3af",
                  px: 0.5,
                }}
              >
                {etape.label}
              </Typography>
            </Box>
          ))}
        </Box>
      </Paper>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2, height: "100%" }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
              <LockIcon sx={{ color: "#64748b", fontSize: 18 }} />
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                Informations administratives
              </Typography>
            </Box>
            <ReadOnlyBanner />

            <InfoRow
              icon={<StraightenIcon fontSize="small" />}
              label="Superficie déclarée"
              value={mission.admin.superficie}
            />
            <InfoRow
              icon={<CalendarTodayIcon fontSize="small" />}
              label="Date planifiée"
              value={mission.admin.date}
            />
            <InfoRow
              icon={<LocationOnIcon fontSize="small" />}
              label="Coordonnées GPS (approx.)"
              value={mission.admin.coordonnees}
            />
            <InfoRow
              icon={<GavelIcon fontSize="small" />}
              label="Notaire mandaté"
              value={mission.admin.notaire}
            />
            <InfoRow
              icon={<PersonIcon fontSize="small" />}
              label="Propriétaire"
              value={mission.admin.proprietaire}
            />

            <Box sx={{ mt: 2, p: 2, bgcolor: "#f1f5f9", borderRadius: 1 }}>
              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                Description
              </Typography>
              <Typography variant="body2" sx={{ mt: 0.5, lineHeight: 1.7 }}>
                {mission.admin.description}
              </Typography>
            </Box>
          </Paper>
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 1 }}>
              Données techniques
              {editable ? " (à compléter)" : " (consultation)"}
            </Typography>
            <Divider sx={{ mb: 2 }} />

            {!editable && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Les données techniques ne sont plus modifiables pour cette mission.
              </Alert>
            )}

            <Stack spacing={2.5}>
              <TextField
                label="Nombre de bornes posées"
                type="number"
                size="small"
                fullWidth
                disabled={!editable}
                value={form.nb_bornes || ""}
                onChange={(e) => handleField("nb_bornes", Math.max(0, Number(e.target.value)))}
                slotProps={{ htmlInput: { min: 0 } }}
              />

              <TextField
                label="Surface calculée"
                size="small"
                fullWidth
                disabled={!editable}
                placeholder="ex. 2 487 m²"
                value={form.surface_calculee}
                onChange={(e) => handleField("surface_calculee", e.target.value)}
              />

              <TextField
                label="Écart avec le titre foncier"
                size="small"
                fullWidth
                disabled={!editable}
                placeholder="ex. -0.5% ou +0.4%"
                value={form.ecart_titre}
                onChange={(e) => handleField("ecart_titre", e.target.value)}
              />

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Fichier GPS (.gpx, .csv…)
                </Typography>
                {editable ? (
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<UploadFileIcon />}
                    sx={{ mt: 0.5, display: "flex", textTransform: "none", borderColor: "#10b981", color: "#10b981" }}
                  >
                    {form.fichier_gps || "Choisir un fichier"}
                    <input
                      type="file"
                      hidden
                      accept=".gpx,.csv,.kml,.txt"
                      onChange={(e) => handleFile("fichier_gps", e.target.files?.[0] ?? null)}
                    />
                  </Button>
                ) : (
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {form.fichier_gps || "—"}
                  </Typography>
                )}
              </Box>

              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                  Rapport / certificat de bornage (PDF)
                </Typography>
                {editable ? (
                  <Button
                    component="label"
                    variant="outlined"
                    size="small"
                    startIcon={<DescriptionIcon />}
                    sx={{ mt: 0.5, display: "flex", textTransform: "none", borderColor: "#10b981", color: "#10b981" }}
                  >
                    {form.rapport || "Choisir un PDF"}
                    <input
                      type="file"
                      hidden
                      accept=".pdf"
                      onChange={(e) => handleFile("rapport", e.target.files?.[0] ?? null)}
                    />
                  </Button>
                ) : (
                  <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 500 }}>
                    {form.rapport || "—"}
                  </Typography>
                )}
              </Box>

              <TextField
                label="Notes techniques (optionnel)"
                size="small"
                fullWidth
                multiline
                rows={2}
                disabled={!editable}
                value={form.notes_techniques ?? ""}
                onChange={(e) => handleField("notes_techniques", e.target.value)}
              />
            </Stack>

            {editable && (
              <Box sx={{ mt: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                {mission.status === "assignée" && (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => startMission(mission.id)}
                    sx={{
                      bgcolor: "#3b82f6",
                      textTransform: "none",
                      fontWeight: 600,
                      "&:hover": { bgcolor: "#2563eb" },
                    }}
                  >
                    Commencer le relevé
                  </Button>
                )}

                <Button
                  variant="outlined"
                  startIcon={<SaveIcon />}
                  onClick={handleSave}
                  sx={{ textTransform: "none", fontWeight: 600, borderColor: "#10b981", color: "#10b981" }}
                >
                  Enregistrer le brouillon
                </Button>

                <Button
                  variant="contained"
                  startIcon={<SendIcon />}
                  onClick={handleSubmitReport}
                  sx={{
                    bgcolor: "#10b981",
                    textTransform: "none",
                    fontWeight: 600,
                    "&:hover": { bgcolor: "#059669" },
                  }}
                >
                  Déposer le rapport
                </Button>
              </Box>
            )}

            {savedMsg && (
              <Alert severity="success" sx={{ mt: 2 }}>
                Brouillon enregistré dans le navigateur.
              </Alert>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
