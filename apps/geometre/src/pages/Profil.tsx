import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Avatar,
  Button,
  TextField,
  Divider,
  Chip,
  Switch,
  FormControlLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CloseIcon from "@mui/icons-material/Close";
import LockIcon from "@mui/icons-material/Lock";
import ShieldIcon from "@mui/icons-material/Shield";
import StarIcon from "@mui/icons-material/Star";

const PROFIL_INITIAL = {
  nom: "Jean-Paul Mbarga",
  titre: "Géomètre Expert agréé",
  email: "jp.mbarga@geometres-cm.com",
  telephone: "+237 699 123 456",
  numero_agrement: "GEO-CM-2019-0047",
  etude: "Cabinet Mbarga & Associés",
  adresse: "Rue Joss, Akwa, Douala",
  note: 4.8,
  avis: 34,
};

interface InfoRowProps {
  label: string;
  value: string;
  field: string;
  editMode: boolean;
  onChange: (field: string, value: string) => void;
}

function InfoRow({ label, value, field, editMode, onChange }: InfoRowProps) {
  return (
    <Box sx={{ mb: 2 }}>
      <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600, display: "block", mb: 0.5 }}>
        {label}
      </Typography>
      {editMode ? (
        <TextField
          size="small"
          fullWidth
          value={value}
          onChange={(e) => onChange(field, e.target.value)}
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: 1.5 } }}
        />
      ) : (
        <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{value}</Typography>
      )}
    </Box>
  );
}

export default function Profil() {
  const [profil, setProfil] = useState(PROFIL_INITIAL);
  const [editMode, setEditMode] = useState(false);
  const [draft, setDraft] = useState(PROFIL_INITIAL);
  const [notifEmail, setNotifEmail] = useState(true);
  const [notifSMS, setNotifSMS] = useState(true);
  const [twoFA, setTwoFA] = useState(true);

  const handleChange = (field: string, value: string) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
  };

  const sauvegarder = () => {
    setProfil(draft);
    setEditMode(false);
  };

  const annuler = () => {
    setDraft(profil);
    setEditMode(false);
  };

  const current = editMode ? draft : profil;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>Mon profil</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Informations professionnelles et paramètres de compte
          </Typography>
        </Box>
        {!editMode ? (
          <Button
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => setEditMode(true)}
            sx={{ textTransform: "none", borderColor: "#10b981", color: "#10b981" }}
          >
            Modifier
          </Button>
        ) : (
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button
              variant="contained"
              startIcon={<SaveIcon />}
              onClick={sauvegarder}
              sx={{ textTransform: "none", bgcolor: "#10b981", "&:hover": { bgcolor: "#059669" } }}
            >
              Enregistrer
            </Button>
            <Button
              variant="outlined"
              startIcon={<CloseIcon />}
              onClick={annuler}
              sx={{ textTransform: "none" }}
            >
              Annuler
            </Button>
          </Box>
        )}
      </Box>

      <Box sx={{ display: "flex", gap: 3, flexWrap: "wrap" }}>

        {/* COLONNE GAUCHE */}
        <Box sx={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Carte identité */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            {/* Avatar + nom */}
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
              <Avatar
                sx={{
                  bgcolor: "#0f766e", width: 64, height: 64,
                  fontSize: 22, fontWeight: 700,
                }}
              >
                JM
              </Avatar>
              <Box>
                <Typography sx={{ fontWeight: 700, fontSize: 18 }}>{profil.nom}</Typography>
                <Typography variant="body2" color="text.secondary">{profil.titre}</Typography>
                {/* Étoiles */}
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mt: 0.5 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon
                      key={i}
                      sx={{
                        fontSize: 16,
                        color: i <= Math.floor(profil.note) ? "#f59e0b" : "#e5e7eb",
                      }}
                    />
                  ))}
                  <Typography variant="caption" sx={{ ml: 0.5, color: "#555" }}>
                    {profil.note} ({profil.avis} avis)
                  </Typography>
                </Box>
              </Box>
            </Box>

            {/* Badge agrément */}
            <Chip
              icon={<ShieldIcon sx={{ fontSize: 16 }} />}
              label={`Agrément : ${profil.numero_agrement}`}
              sx={{
                bgcolor: "#f0fdf4", color: "#15803d",
                border: "1px solid #bbf7d0",
                fontWeight: 600, fontSize: 12, mb: 3,
              }}
            />

            <Divider sx={{ mb: 2 }} />

            {/* Champs */}
            <InfoRow label="Nom complet"    field="nom"              value={current.nom}              editMode={editMode} onChange={handleChange} />
            <InfoRow label="Titre"          field="titre"            value={current.titre}            editMode={editMode} onChange={handleChange} />
            <InfoRow label="Email"          field="email"            value={current.email}            editMode={editMode} onChange={handleChange} />
            <InfoRow label="Téléphone"      field="telephone"        value={current.telephone}        editMode={editMode} onChange={handleChange} />
            <InfoRow label="Cabinet"        field="etude"            value={current.etude}            editMode={editMode} onChange={handleChange} />
            <InfoRow label="Adresse"        field="adresse"          value={current.adresse}          editMode={editMode} onChange={handleChange} />
            <InfoRow label="N° agrément"    field="numero_agrement"  value={current.numero_agrement}  editMode={editMode} onChange={handleChange} />
          </Paper>
        </Box>

        {/* COLONNE DROITE */}
        <Box sx={{ flex: "1 1 340px", display: "flex", flexDirection: "column", gap: 3 }}>

          {/* Statistiques */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Statistiques
            </Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
              {[
                { label: "Missions réalisées", value: "27",    color: "#10b981" },
                { label: "Terrains certifiés", value: "63",    color: "#3b82f6" },
                { label: "Note moyenne",        value: "4.8/5", color: "#f59e0b" },
                { label: "Années d'expérience", value: "7",    color: "#8b5cf6" },
              ].map((s) => (
                <Box
                  key={s.label}
                  sx={{
                    p: 2, borderRadius: 2,
                    border: "1px solid #e5e7eb",
                    bgcolor: "#fafafa",
                  }}
                >
                  <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                    {s.label}
                  </Typography>
                  <Typography sx={{ fontWeight: 800, fontSize: 22, color: s.color, mt: 0.5 }}>
                    {s.value}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Paper>

          {/* Sécurité */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Sécurité
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {/* 2FA */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, bgcolor: "#f8fafc", borderRadius: 1.5, border: "1px solid #e5e7eb" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <ShieldIcon sx={{ color: "#10b981", fontSize: 20 }} />
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Double authentification</Typography>
                    <Typography variant="caption" color="text.secondary">Sécurité renforcée du compte</Typography>
                  </Box>
                </Box>
                <Switch
                  checked={twoFA}
                  onChange={(e) => setTwoFA(e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#10b981" } }}
                />
              </Box>

              {/* Mot de passe */}
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", p: 1.5, bgcolor: "#f8fafc", borderRadius: 1.5, border: "1px solid #e5e7eb" }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <LockIcon sx={{ color: "#3b82f6", fontSize: 20 }} />
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 600 }}>Mot de passe</Typography>
                    <Typography variant="caption" color="text.secondary">Modifié il y a 30 jours</Typography>
                  </Box>
                </Box>
                <Button size="small" variant="outlined" sx={{ textTransform: "none", fontSize: 12, borderColor: "#3b82f6", color: "#3b82f6" }}>
                  Changer
                </Button>
              </Box>
            </Box>
          </Paper>

          {/* Notifications préférences */}
          <Paper elevation={1} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2 }}>
              Préférences de notifications
            </Typography>
            <FormControlLabel
              control={
                <Switch
                  checked={notifEmail}
                  onChange={(e) => setNotifEmail(e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#10b981" } }}
                />
              }
              label={<Typography sx={{ fontSize: 13 }}>Notifications par email</Typography>}
            />
            <FormControlLabel
              control={
                <Switch
                  checked={notifSMS}
                  onChange={(e) => setNotifSMS(e.target.checked)}
                  sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "#10b981" }, "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": { bgcolor: "#10b981" } }}
                />
              }
              label={<Typography sx={{ fontSize: 13 }}>Notifications par SMS</Typography>}
            />
          </Paper>

        </Box>
      </Box>
    </Box>
  );
}