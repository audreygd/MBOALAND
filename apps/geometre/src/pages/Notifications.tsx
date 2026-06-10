import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Chip,
  IconButton,
  Button,
  Divider,
  Tabs,
  Tab,
} from "@mui/material";

import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import NotificationsIcon from "@mui/icons-material/Notifications";

export type NotifType = "mission" | "validation" | "message" | "update" | "alerte";

export interface Notif {
  id: number;
  texte: string;
  detail?: string;
  temps: string;
  lu: boolean;
  type: NotifType;
}

const TYPE_CONFIG: Record<NotifType, { label: string; color: string; bg: string }> = {
  mission:    { label: "Mission",    color: "#10b981", bg: "#f0fdf4" },
  validation: { label: "Validation", color: "#3b82f6", bg: "#eff6ff" },
  message:    { label: "Message",    color: "#8b5cf6", bg: "#f5f3ff" },
  update:     { label: "Mise à jour",color: "#f59e0b", bg: "#fffbeb" },
  alerte:     { label: "Alerte",     color: "#ef4444", bg: "#fef2f2" },
};

const MOCK_NOTIFS: Notif[] = [
  { id: 1,  type: "mission",    lu: false, temps: "Il y a 5 min",  texte: "Nouvelle mission assignée : Bornage Bafoussam",        detail: "Mission #5 — Bafoussam Ouest · Départ le 12/06/2026" },
  { id: 2,  type: "validation", lu: false, temps: "Il y a 30 min", texte: "Rapport de Kribi validé par Me. Paul Essomba",          detail: "Le notaire a approuvé votre rapport technique." },
  { id: 3,  type: "message",    lu: false, temps: "Il y a 1h",     texte: "Me. Élise Nkolo vous a envoyé un message",              detail: "Pouvez-vous confirmer la date de descente pour Odza ?" },
  { id: 4,  type: "update",     lu: false, temps: "Il y a 2h",     texte: "Mission Odza — date modifiée au 08/06/2026",            detail: "Le vendeur a demandé un report de 2 jours." },
  { id: 5,  type: "alerte",     lu: true,  temps: "Hier, 16:30",   texte: "Délai de transmission approche : Plan Bali",            detail: "Le plan cadastral doit être transmis avant le 05/06." },
  { id: 6,  type: "mission",    lu: true,  temps: "Hier, 10:00",   texte: "Mission Ngaoundéré marquée comme terminée",             detail: "Vous avez complété la mission #4." },
  { id: 7,  type: "validation", lu: true,  temps: "03/06/2026",    texte: "Certificat de bornage Bonanjo approuvé",                detail: "Document disponible dans la section Documents." },
  { id: 8,  type: "message",    lu: true,  temps: "02/06/2026",    texte: "Armand Tabi a confirmé la réception du plan",           detail: "Merci pour le plan cadastral, tout est conforme." },
];

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notif[]>(MOCK_NOTIFS);
  const [onglet, setOnglet] = useState(0); // 0=Toutes, 1=Non lues, 2=Lues

  const filtrees = notifs.filter((n) => {
    if (onglet === 1) return !n.lu;
    if (onglet === 2) return n.lu;
    return true;
  });

  const nonLues = notifs.filter((n) => !n.lu).length;

  const marquerLu = (id: number) =>
    setNotifs((prev) => prev.map((n) => (n.id === id ? { ...n, lu: true } : n)));

  const supprimer = (id: number) =>
    setNotifs((prev) => prev.filter((n) => n.id !== id));

  const toutMarquerLu = () =>
    setNotifs((prev) => prev.map((n) => ({ ...n, lu: true })));

  const toutSupprimer = () =>
    setNotifs((prev) => prev.filter((n) => n.lu));

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 4 }}>

      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 3 }}>
        <Box>
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Notifications
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            {nonLues > 0 ? `${nonLues} notification${nonLues > 1 ? "s" : ""} non lue${nonLues > 1 ? "s" : ""}` : "Tout est à jour"}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 1 }}>
          {nonLues > 0 && (
            <Button
              variant="outlined"
              size="small"
              startIcon={<CheckCircleOutlinedIcon />}
              onClick={toutMarquerLu}
              sx={{ textTransform: "none", borderColor: "#10b981", color: "#10b981" }}
            >
              Tout marquer lu
            </Button>
          )}
          <Button
            variant="outlined"
            size="small"
            startIcon={<DeleteOutlinedIcon />}
            onClick={toutSupprimer}
            sx={{ textTransform: "none", borderColor: "#ef4444", color: "#ef4444" }}
          >
            Supprimer lues
          </Button>
        </Box>
      </Box>

      <Paper elevation={1} sx={{ borderRadius: 2, overflow: "hidden" }}>
        {/* ONGLETS */}
        <Tabs
          value={onglet}
          onChange={(_, v) => setOnglet(v)}
          sx={{
            borderBottom: "1px solid #e5e7eb",
            "& .MuiTab-root": { textTransform: "none", fontWeight: 600, fontSize: 13 },
            "& .Mui-selected": { color: "#10b981" },
            "& .MuiTabs-indicator": { bgcolor: "#10b981" },
          }}
        >
          <Tab label={`Toutes (${notifs.length})`} />
          <Tab label={`Non lues (${nonLues})`} />
          <Tab label={`Lues (${notifs.length - nonLues})`} />
        </Tabs>

        {/* LISTE */}
        {filtrees.length === 0 ? (
          <Box sx={{ py: 8, textAlign: "center", color: "#9ca3af" }}>
            <NotificationsIcon sx={{ fontSize: 48, mb: 2, opacity: 0.4 }} />
            <Typography variant="body2">Aucune notification</Typography>
          </Box>
        ) : (
          filtrees.map((n, i) => {
            const cfg = TYPE_CONFIG[n.type];
            return (
              <Box key={n.id}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 2,
                    px: 3,
                    py: 2,
                    bgcolor: n.lu ? "transparent" : cfg.bg,
                    transition: "background 0.2s",
                    "&:hover": { bgcolor: "#f9fafb" },
                  }}
                >
                  {/* Point non lu */}
                  <Box
                    sx={{
                      width: 8, height: 8, borderRadius: "50%",
                      bgcolor: n.lu ? "transparent" : cfg.color,
                      flexShrink: 0, mt: 1.5,
                    }}
                  />

                  {/* Contenu */}
                  <Box sx={{ flex: 1 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Chip
                        label={cfg.label}
                        size="small"
                        sx={{
                          fontSize: 10, fontWeight: 700, height: 20,
                          bgcolor: cfg.bg, color: cfg.color,
                          border: `1px solid ${cfg.color}`,
                        }}
                      />
                      <Typography variant="caption" color="text.secondary">
                        {n.temps}
                      </Typography>
                    </Box>
                    <Typography sx={{ fontSize: 13, fontWeight: n.lu ? 400 : 600 }}>
                      {n.texte}
                    </Typography>
                    {n.detail && (
                      <Typography variant="caption" color="text.secondary" sx={{ mt: 0.3, display: "block" }}>
                        {n.detail}
                      </Typography>
                    )}
                  </Box>

                  {/* Actions */}
                  <Box sx={{ display: "flex", gap: 0.5, flexShrink: 0 }}>
                    {!n.lu && (
                      <IconButton size="small" onClick={() => marquerLu(n.id)} title="Marquer comme lu">
                        <CheckCircleOutlinedIcon sx={{ fontSize: 18, color: "#10b981" }} />
                      </IconButton>
                    )}
                    <IconButton size="small" onClick={() => supprimer(n.id)} title="Supprimer">
                      <DeleteOutlinedIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    </IconButton>
                  </Box>
                </Box>
                {i < filtrees.length - 1 && <Divider />}
              </Box>
            );
          })
        )}
      </Paper>
    </Box>
  );
}