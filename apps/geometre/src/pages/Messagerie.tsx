import { useState } from "react";
import {
  Box,
  Typography,
  Avatar,
  TextField,
  InputAdornment,
  Divider,
  IconButton,
  Paper,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import SendIcon from "@mui/icons-material/Send";

// ── Types ────────────────────────────────────────────────────────
interface Message {
  id: number;
  auteur: string;
  texte: string;
  heure: string;
  soi: boolean;
}

interface Conversation {
  id: number;
  expediteur: string;
  initiales: string;
  role: string;
  couleur: string;
  heure: string;
  apercu: string;
  non_lu: number;
  messages: Message[];
}

// ── Données mock ─────────────────────────────────────────────────
const CONVERSATIONS: Conversation[] = [
  {
    id: 1,
    expediteur: "Me. Élise Nkolo",
    initiales: "EN",
    role: "Notaire",
    couleur: "#10b981",
    heure: "09:14",
    apercu: "Pouvez-vous confirmer la date de descente ?",
    non_lu: 2,
    messages: [
      { id: 1, auteur: "Me. Élise Nkolo", texte: "Bonjour Monsieur Mbarga, j'espère que vous allez bien.", heure: "09:10", soi: false },
      { id: 2, auteur: "Me. Élise Nkolo", texte: "Pouvez-vous confirmer la date de descente pour la parcelle d'Odza ? Le vendeur attend.", heure: "09:14", soi: false },
    ],
  },
  {
    id: 2,
    expediteur: "Me. Henri Feudjio",
    initiales: "HF",
    role: "Notaire",
    couleur: "#3b82f6",
    heure: "Hier",
    apercu: "Le rapport de bornage est attendu pour vendredi.",
    non_lu: 0,
    messages: [
      { id: 1, auteur: "Jean-Paul Mbarga", texte: "Bonjour Maître, j'ai bien reçu le dossier de Bafoussam.", heure: "14:00", soi: true },
      { id: 2, auteur: "Me. Henri Feudjio", texte: "Parfait. Le rapport de bornage est attendu pour vendredi au plus tard.", heure: "16:32", soi: false },
    ],
  },
  {
    id: 3,
    expediteur: "Armand Tabi",
    initiales: "AT",
    role: "Vendeur",
    couleur: "#8b5cf6",
    heure: "03/06",
    apercu: "Merci pour le plan cadastral, tout est conforme.",
    non_lu: 0,
    messages: [
      { id: 1, auteur: "Armand Tabi", texte: "Bonjour, j'ai bien reçu le plan cadastral.", heure: "10:05", soi: false },
      { id: 2, auteur: "Armand Tabi", texte: "Merci pour le plan cadastral, tout est conforme à ce que j'attendais.", heure: "10:06", soi: false },
      { id: 3, auteur: "Jean-Paul Mbarga", texte: "Avec plaisir ! N'hésitez pas si vous avez des questions.", heure: "10:20", soi: true },
    ],
  },
  {
    id: 4,
    expediteur: "Me. Yvonne Bell",
    initiales: "YB",
    role: "Notaire",
    couleur: "#f59e0b",
    heure: "02/06",
    apercu: "Le certificat de bornage a été transmis au cadastre.",
    non_lu: 0,
    messages: [
      { id: 1, auteur: "Me. Yvonne Bell", texte: "Le certificat de bornage de Bali a été transmis au cadastre.", heure: "11:00", soi: false },
      { id: 2, auteur: "Jean-Paul Mbarga", texte: "Merci pour la confirmation.", heure: "11:15", soi: true },
    ],
  },
];

export default function Messagerie() {
  const [convs, setConvs] = useState<Conversation[]>(CONVERSATIONS);
  const [convId, setConvId] = useState<number>(1);
  const [texte, setTexte] = useState("");
  const [recherche, setRecherche] = useState("");

  const conv = convs.find((c) => c.id === convId)!;

  const convsFiltrees = convs.filter(
    (c) =>
      c.expediteur.toLowerCase().includes(recherche.toLowerCase()) ||
      c.apercu.toLowerCase().includes(recherche.toLowerCase())
  );

  const selectionner = (id: number) => {
    setConvId(id);
    // Marquer comme lu
    setConvs((prev) =>
      prev.map((c) => (c.id === id ? { ...c, non_lu: 0 } : c))
    );
  };

  const envoyer = () => {
    if (!texte.trim()) return;
    const now = new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
    const newMsg: Message = {
      id: Date.now(),
      auteur: "Jean-Paul Mbarga",
      texte: texte.trim(),
      heure: now,
      soi: true,
    };
    setConvs((prev) =>
      prev.map((c) =>
        c.id === convId
          ? { ...c, messages: [...c.messages, newMsg], apercu: texte.trim(), heure: now }
          : c
      )
    );
    setTexte("");
  };

  return (
    <Box sx={{ bgcolor: "#f8fafc", p: 3, height: "calc(100vh - 64px)", display: "flex", flexDirection: "column" }}>

      {/* HEADER */}
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Messagerie</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Communications sécurisées avec notaires et vendeurs
        </Typography>
      </Box>

      {/* CHAT LAYOUT */}
      <Paper elevation={1} sx={{ flex: 1, borderRadius: 2, overflow: "hidden", display: "flex" }}>

        {/* COLONNE GAUCHE — liste conversations */}
        <Box
          sx={{
            width: 300,
            borderRight: "1px solid #e5e7eb",
            display: "flex",
            flexDirection: "column",
            flexShrink: 0,
          }}
        >
          {/* Recherche */}
          <Box sx={{ p: 1.5, borderBottom: "1px solid #f3f4f6" }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Rechercher..."
              value={recherche}
              onChange={(e) => setRecherche(e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ fontSize: 18, color: "#9ca3af" }} />
                    </InputAdornment>
                  ),
                },
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
          </Box>

          {/* Liste */}
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {convsFiltrees.map((c, i) => (
              <Box key={c.id}>
                <Box
                  onClick={() => selectionner(c.id)}
                  sx={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 1.5,
                    px: 2,
                    py: 1.5,
                    cursor: "pointer",
                    bgcolor: convId === c.id ? "#f0fdf4" : "transparent",
                    borderLeft: convId === c.id ? "3px solid #10b981" : "3px solid transparent",
                    "&:hover": { bgcolor: "#f8fafc" },
                  }}
                >
                  <Avatar sx={{ bgcolor: c.couleur, width: 38, height: 38, fontSize: 13, flexShrink: 0 }}>
                    {c.initiales}
                  </Avatar>
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
                      <Typography sx={{ fontSize: 13, fontWeight: 600 }} noWrap>
                        {c.expediteur}
                      </Typography>
                      <Typography variant="caption" color="text.secondary" sx={{ flexShrink: 0, ml: 1 }}>
                        {c.heure}
                      </Typography>
                    </Box>
                    <Typography variant="caption" sx={{ color: "#10b981", fontWeight: 500, display: "block" }}>
                      {c.role}
                    </Typography>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="caption" color="text.secondary" noWrap sx={{ maxWidth: 160 }}>
                        {c.apercu}
                      </Typography>
                      {c.non_lu > 0 && (
                        <Box sx={{
                          bgcolor: "#10b981", color: "#fff",
                          borderRadius: "10px", px: 0.8,
                          fontSize: 10, fontWeight: 700, flexShrink: 0,
                        }}>
                          {c.non_lu}
                        </Box>
                      )}
                    </Box>
                  </Box>
                </Box>
                {i < convsFiltrees.length - 1 && <Divider />}
              </Box>
            ))}
          </Box>
        </Box>

        {/* COLONNE DROITE — conversation */}
        <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>

          {/* Header conversation */}
          <Box sx={{ px: 3, py: 2, borderBottom: "1px solid #e5e7eb", display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar sx={{ bgcolor: conv.couleur, width: 36, height: 36, fontSize: 13 }}>
              {conv.initiales}
            </Avatar>
            <Box>
              <Typography sx={{ fontWeight: 700, fontSize: 14 }}>{conv.expediteur}</Typography>
              <Typography variant="caption" color="text.secondary">{conv.role}</Typography>
            </Box>
          </Box>

          {/* Messages */}
          <Box sx={{ flex: 1, overflow: "auto", p: 2.5, display: "flex", flexDirection: "column", gap: 2, bgcolor: "#fafbfc" }}>
            {conv.messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{ display: "flex", justifyContent: msg.soi ? "flex-end" : "flex-start", gap: 1 }}
              >
                {!msg.soi && (
                  <Avatar sx={{ bgcolor: conv.couleur, width: 28, height: 28, fontSize: 11 }}>
                    {conv.initiales}
                  </Avatar>
                )}
                <Box
                  sx={{
                    maxWidth: "65%",
                    px: 2, py: 1.2,
                    borderRadius: msg.soi ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
                    bgcolor: msg.soi ? "#10b981" : "#fff",
                    color: msg.soi ? "#fff" : "#111",
                    border: msg.soi ? "none" : "1px solid #e5e7eb",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.06)",
                  }}
                >
                  <Typography sx={{ fontSize: 13, lineHeight: 1.5 }}>{msg.texte}</Typography>
                  <Typography
                    sx={{
                      fontSize: 10,
                      mt: 0.5,
                      color: msg.soi ? "rgba(255,255,255,0.7)" : "#9ca3af",
                      textAlign: "right",
                    }}
                  >
                    {msg.heure}
                  </Typography>
                </Box>
              </Box>
            ))}
          </Box>

          {/* Input */}
          <Box sx={{ px: 2.5, py: 2, borderTop: "1px solid #e5e7eb", display: "flex", gap: 1 }}>
            <TextField
              size="small"
              fullWidth
              placeholder="Écrire un message..."
              value={texte}
              onChange={(e) => setTexte(e.target.value)}
              onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); envoyer(); } }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
            />
            <IconButton
              onClick={envoyer}
              disabled={!texte.trim()}
              sx={{
                bgcolor: "#10b981", color: "#fff",
                borderRadius: 2,
                "&:hover": { bgcolor: "#059669" },
                "&:disabled": { bgcolor: "#e5e7eb", color: "#9ca3af" },
              }}
            >
              <SendIcon fontSize="small" />
            </IconButton>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
}