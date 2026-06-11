import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Badge,
  Avatar,
  Chip,
  Popover,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Divider,
  Button,
  Menu,
  MenuItem,
  TextField,
  InputAdornment,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";

// ── Données mock ─────────────────────────────────────────────────
const NOTIFICATIONS = [
  { id: 1, texte: "Nouvelle mission assignée : Bornage Bafoussam", temps: "Il y a 5 min",  lu: false, type: "mission"    },
  { id: 2, texte: "Rapport de Kribi validé par le notaire",        temps: "Il y a 30 min", lu: false, type: "validation" },
  { id: 3, texte: "Me. Élise Nkolo vous a envoyé un message",      temps: "Il y a 1h",     lu: false, type: "message"    },
  { id: 4, texte: "Mission Odza — date modifiée au 08/06",         temps: "Hier",           lu: true,  type: "update"     },
];

const MESSAGES = [
  { id: 1, expediteur: "Me. Élise Nkolo", initiales: "EN", role: "Notaire", texte: "Pouvez-vous confirmer la date de descente pour Odza ?", heure: "09:14", non_lu: 2, couleur: "#10b981" },
  { id: 2, expediteur: "Me. Henri Feudjio", initiales: "HF", role: "Notaire", texte: "Le rapport de bornage de Bafoussam est attendu vendredi.", heure: "Hier", non_lu: 0, couleur: "#3b82f6" },
  { id: 3, expediteur: "Armand Tabi", initiales: "AT", role: "Vendeur", texte: "Merci pour le plan cadastral, tout est conforme.", heure: "03/06", non_lu: 0, couleur: "#8b5cf6" },
];

const NOTIF_COLOR: Record<string, string> = {
  mission:    "#10b981",
  validation: "#3b82f6",
  message:    "#8b5cf6",
  update:     "#f59e0b",
};

// ── Icônes SVG inline ────────────────────────────────────────────
function BellIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
  );
}

function MsgIcon() {
  return (
    <svg viewBox="0 0 24 24" width={22} height={22} fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 4h16v14H5.17L4 19V4z" />
      <path d="M22 4l-10 7L2 4" />
    </svg>
  );
}

// ── Props ────────────────────────────────────────────────────────
interface HeaderProps {
  onNavigate?: (page: string) => void;
}

// ── Composant ────────────────────────────────────────────────────
export default function Header({ onNavigate }: HeaderProps) {
  const [notifAnchor, setNotifAnchor]     = useState<HTMLElement | null>(null);
  const [msgAnchor, setMsgAnchor]         = useState<HTMLElement | null>(null);
  const [profilAnchor, setProfilAnchor]   = useState<HTMLElement | null>(null);
  const [notifs, setNotifs]               = useState(NOTIFICATIONS);
  const [msgSelectionne, setMsgSel]       = useState<number | null>(null);
  const [reponse, setReponse]             = useState("");

  const nbNotifs  = notifs.filter((n) => !n.lu).length;
  const nbMsgs    = MESSAGES.reduce((s, m) => s + m.non_lu, 0);
  const msgActif  = MESSAGES.find((m) => m.id === msgSelectionne);

  const marquerLu     = (id: number) => setNotifs((p) => p.map((n) => n.id === id ? { ...n, lu: true } : n));
  const toutMarquerLu = () => setNotifs((p) => p.map((n) => ({ ...n, lu: true })));

  // sx partagé pour les popover —  slotProps à la place de PaperProps
  const popoverSx = { borderRadius: 2, boxShadow: "0 8px 30px rgba(0,0,0,0.12)" };

  return (
    <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: "1px solid #e5e7eb" }}>
      <Toolbar sx={{ justifyContent: "space-between", px: 4, py: 1.5 }}>

        {/* GAUCHE */}
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>Géomètre Dashboard</Typography>
          <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
            <Chip label="En mission" size="small" color="success" sx={{ fontSize: 11 }} />
            <Chip label="GPS actif"  size="small" color="primary" sx={{ fontSize: 11 }} />
          </Box>
        </Box>

        {/* DROITE */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>

          {/* ── CLOCHE ── */}
          <IconButton size="small" onClick={(e) => setNotifAnchor(e.currentTarget)}>
            <Badge badgeContent={nbNotifs} color="error"><BellIcon /></Badge>
          </IconButton>

          <Popover
            open={Boolean(notifAnchor)}
            anchorEl={notifAnchor}
            onClose={() => setNotifAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            // slotProps au lieu de PaperProps
            slotProps={{ paper: { sx: { width: 360, ...popoverSx } } }}
          >
            <Box sx={{ px: 2, py: 1.5, display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f3f4f6" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                Notifications
                {nbNotifs > 0 && (
                  <Box component="span" sx={{ ml: 1, bgcolor: "#ef4444", color: "#fff", borderRadius: "10px", px: 0.8, py: 0.1, fontSize: 11 }}>
                    {nbNotifs}
                  </Box>
                )}
              </Typography>
              {nbNotifs > 0 && (
                <Button size="small" onClick={toutMarquerLu} sx={{ fontSize: 11, color: "#10b981", textTransform: "none" }}>
                  Tout lire
                </Button>
              )}
            </Box>

            <List sx={{ p: 0, maxHeight: 320, overflow: "auto" }}>
              {notifs.map((n, i) => (
                <Box key={n.id}>
                  <ListItem
                    onClick={() => marquerLu(n.id)}
                    sx={{ cursor: "pointer", bgcolor: n.lu ? "transparent" : "#f0fdf4", "&:hover": { bgcolor: "#f8fafc" }, alignItems: "flex-start", gap: 1 }}
                  >
                    <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: n.lu ? "transparent" : NOTIF_COLOR[n.type], flexShrink: 0, mt: 1.2 }} />
                    <ListItemText
                      primary={<Typography sx={{ fontSize: 13, fontWeight: n.lu ? 400 : 600 }}>{n.texte}</Typography>}
                      secondary={<Typography variant="caption" color="text.secondary">{n.temps}</Typography>}
                    />
                  </ListItem>
                  {i < notifs.length - 1 && <Divider />}
                </Box>
              ))}
            </List>

            <Box sx={{ p: 1.5, borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
              <Button
                size="small"
                onClick={() => { setNotifAnchor(null); onNavigate?.("notifications"); }}
                sx={{ fontSize: 12, color: "#10b981", textTransform: "none" }}
              >
                Voir toutes les notifications →
              </Button>
            </Box>
          </Popover>

          {/* ── MESSAGES ── */}
          <IconButton size="small" onClick={(e) => setMsgAnchor(e.currentTarget)}>
            <Badge badgeContent={nbMsgs} color="primary"><MsgIcon /></Badge>
          </IconButton>

          <Popover
            open={Boolean(msgAnchor)}
            anchorEl={msgAnchor}
            onClose={() => { setMsgAnchor(null); setMsgSel(null); setReponse(""); }}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            // slotProps au lieu de PaperProps
            slotProps={{ paper: { sx: { width: 360, ...popoverSx } } }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f3f4f6", display: "flex", alignItems: "center", gap: 1 }}>
              {msgSelectionne && (
                <Button size="small" onClick={() => { setMsgSel(null); setReponse(""); }} sx={{ minWidth: 0, p: 0.5, color: "#555" }}>←</Button>
              )}
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
                {msgActif ? msgActif.expediteur : "Messages"}
              </Typography>
            </Box>

            {!msgSelectionne ? (
              <>
                <List sx={{ p: 0, maxHeight: 300, overflow: "auto" }}>
                  {MESSAGES.map((m, i) => (
                    <Box key={m.id}>
                      <ListItem onClick={() => setMsgSel(m.id)} sx={{ cursor: "pointer", "&:hover": { bgcolor: "#f8fafc" } }}>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: m.couleur, width: 34, height: 34, fontSize: 12 }}>{m.initiales}</Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                              <Typography sx={{ fontSize: 13, fontWeight: 600 }}>{m.expediteur}</Typography>
                              <Typography variant="caption" color="text.secondary">{m.heure}</Typography>
                            </Box>
                          }
                          secondary={
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                              <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 200 }}>{m.texte}</Typography>
                              {m.non_lu > 0 && (
                                <Box sx={{ bgcolor: "#10b981", color: "#fff", borderRadius: "10px", px: 0.8, fontSize: 10, fontWeight: 700 }}>{m.non_lu}</Box>
                              )}
                            </Box>
                          }
                        />
                      </ListItem>
                      {i < MESSAGES.length - 1 && <Divider />}
                    </Box>
                  ))}
                </List>
                <Box sx={{ p: 1.5, borderTop: "1px solid #f3f4f6", textAlign: "center" }}>
                  <Button
                    size="small"
                    onClick={() => { setMsgAnchor(null); onNavigate?.("messagerie"); }}
                    sx={{ fontSize: 12, color: "#10b981", textTransform: "none" }}
                  >
                    Ouvrir la messagerie →
                  </Button>
                </Box>
              </>
            ) : (
              <Box>
                <Box sx={{ p: 2, maxHeight: 200, overflow: "auto", bgcolor: "#f8fafc", display: "flex", flexDirection: "column", gap: 1.5 }}>
                  <Box sx={{ display: "flex", gap: 1 }}>
                    <Avatar sx={{ bgcolor: msgActif?.couleur, width: 26, height: 26, fontSize: 10 }}>{msgActif?.initiales}</Avatar>
                    <Box sx={{ bgcolor: "#fff", border: "1px solid #e5e7eb", borderRadius: "0 12px 12px 12px", p: 1.5, maxWidth: "80%" }}>
                      <Typography sx={{ fontSize: 12 }}>{msgActif?.texte}</Typography>
                      <Typography variant="caption" color="text.secondary">{msgActif?.heure}</Typography>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ p: 1.5, borderTop: "1px solid #f3f4f6", display: "flex", gap: 1 }}>
                  <TextField
                    size="small" fullWidth placeholder="Répondre..."
                    value={reponse}
                    onChange={(e) => setReponse(e.target.value)}
                    onKeyDown={(e) => { if (e.key === "Enter" && reponse.trim()) setReponse(""); }}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3, fontSize: 13 } }}
                    slotProps={{
                      input: {
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small" disabled={!reponse.trim()} onClick={() => setReponse("")} sx={{ color: "#10b981" }}>
                              <SendIcon fontSize="small" />
                            </IconButton>
                          </InputAdornment>
                        ),
                      },
                    }}
                  />
                </Box>
              </Box>
            )}
          </Popover>

          {/* ── AVATAR PROFIL ── */}
          <Box
            onClick={(e) => setProfilAnchor(e.currentTarget)}
            sx={{ display: "flex", alignItems: "center", gap: 1, cursor: "pointer", borderRadius: 2, px: 1, py: 0.5, "&:hover": { bgcolor: "#f3f4f6" } }}
          >
            <Avatar sx={{ width: 36, height: 36, bgcolor: "#0f766e", fontSize: 13 }}>JM</Avatar>
            <Box sx={{ display: { xs: "none", md: "block" } }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>Jean-Paul Mbarga</Typography>
              <Typography variant="caption" color="text.secondary">Géomètre Expert</Typography>
            </Box>
          </Box>

          <Menu
            anchorEl={profilAnchor}
            open={Boolean(profilAnchor)}
            onClose={() => setProfilAnchor(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
            //  slotProps au lieu de PaperProps
            slotProps={{ paper: { sx: { width: 220, mt: 1, ...popoverSx } } }}
          >
            <Box sx={{ px: 2, py: 1.5, borderBottom: "1px solid #f3f4f6" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Avatar sx={{ bgcolor: "#0f766e", width: 34, height: 34, fontSize: 12 }}>JM</Avatar>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontSize: 13 }}>Jean-Paul Mbarga</Typography>
                  <Typography variant="caption" color="text.secondary">Géomètre Expert agréé</Typography>
                </Box>
              </Box>
            </Box>
            <MenuItem onClick={() => { setProfilAnchor(null); onNavigate?.("profil"); }} sx={{ fontSize: 13, gap: 1.5, py: 1.2 }}>
              👤 Mon profil
            </MenuItem>
            <MenuItem onClick={() => { setProfilAnchor(null); onNavigate?.("notifications"); }} sx={{ fontSize: 13, gap: 1.5, py: 1.2 }}>
              🔔 Notifications
            </MenuItem>
            <MenuItem onClick={() => { setProfilAnchor(null); onNavigate?.("messagerie"); }} sx={{ fontSize: 13, gap: 1.5, py: 1.2 }}>
              ✉️ Messagerie
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => setProfilAnchor(null)} sx={{ fontSize: 13, color: "#ef4444", gap: 1.5, py: 1.2 }}>
              🚪 Se déconnecter
            </MenuItem>
          </Menu>

        </Box>
      </Toolbar>
    </AppBar>
  );
}