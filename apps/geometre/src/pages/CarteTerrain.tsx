import { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import { useGeometreNavigation } from "../hooks/useGeometreNavigation";
import {
  Box,
  Typography,
  Paper,
  Chip,
  List,
  ListItemButton,
  ListItemText,
  Divider,
} from "@mui/material";
import { MISSIONS, type Mission, type MissionStatus } from "../types";

// ✅ en_attente_validation ajouté dans les deux records
const STATUS_COLOR: Record<MissionStatus, string> = {
  assignée:              "#3b82f6",
  en_cours:              "#f59e0b",
  en_attente_validation: "#8b5cf6",
  terminée:              "#10b981",
};

const STATUS_MUI: Record<MissionStatus, "info" | "warning" | "default" | "success"> = {
  assignée:              "info",
  en_cours:              "warning",
  en_attente_validation: "default",
  terminée:              "success",
};

const ZONES = [
  { label: "Tous",        value: "tous"        },
  { label: "Douala",      value: "Douala"      },
  { label: "Yaoundé",     value: "Yaoundé"     },
  { label: "Bafoussam",   value: "Bafoussam"   },
  { label: "Ngaoundéré",  value: "Ngaoundéré"  },
  { label: "Kribi",       value: "Kribi"       },
];

export default function CarteTerrain() {
  const { goTo } = useGeometreNavigation();
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<unknown>(null);
  const markersRef     = useRef<unknown[]>([]);
  const [selectedMission, setSelectedMission] = useState<Mission | null>(null);
  const [zoneFiltre,   setZoneFiltre]   = useState("tous");
  const [statutFiltre, setStatutFiltre] = useState<MissionStatus | "tous">("tous");

  const missionsFiltrees = MISSIONS.filter((m) => {
    const matchZone   = zoneFiltre === "tous" || m.zone.includes(zoneFiltre);
    const matchStatut = statutFiltre === "tous" || m.status === statutFiltre;
    return matchZone && matchStatut;
  });

  // Init Leaflet
  useEffect(() => {
    import("leaflet").then((L) => {
      if (!mapRef.current || mapInstanceRef.current) return;

      // @ts-expect-error - fix Leaflet icon path avec Vite
      delete L.Icon.Default.prototype._getIconUrl;
      L.Icon.Default.mergeOptions({
        iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
        iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
        shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
      });

      const map = L.map(mapRef.current).setView([4.5, 12.0], 6);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© <a href="https://www.openstreetmap.org/">OpenStreetMap</a>',
        maxZoom: 18,
      }).addTo(map);

      mapInstanceRef.current = map;
    });

    return () => {
      if (mapInstanceRef.current) {
        // @ts-expect-error - Leaflet map instance
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (!mapInstanceRef.current) return;
      // @ts-expect-error - Leaflet map instance
      mapInstanceRef.current.invalidateSize?.();
    }, 150);
    return () => window.clearTimeout(timer);
  }, []);

  // Mise à jour des marqueurs
  useEffect(() => {
    import("leaflet").then((L) => {
      const map = mapInstanceRef.current;
      if (!map) return;

      markersRef.current.forEach((m) => { (m as { remove: () => void }).remove(); });
      markersRef.current = [];

      missionsFiltrees.forEach((mission) => {
        const coords = mission.coordonnees ?? mission.admin?.coordonnees;
        if (!coords) return;

        const match = coords.match(/([\d.]+)°\s*N,\s*([\d.]+)°\s*E/);
        if (!match) return;

        const lat   = parseFloat(match[1]);
        const lng   = parseFloat(match[2]);
        const color = STATUS_COLOR[mission.status];

        const svgIcon = L.divIcon({
          html: `<div style="width:32px;height:32px;background:${color};border:3px solid white;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 2px 8px rgba(0,0,0,0.3);"></div>`,
          iconSize:   [32, 32],
          iconAnchor: [16, 32],
          className:  "",
        });

        const superficie = mission.superficie ?? mission.admin?.superficie ?? "";
        const date       = mission.date       ?? mission.admin?.date       ?? "";

        const marker = L.marker([lat, lng], { icon: svgIcon })
          .addTo(map as never)
          .bindPopup(`
            <div style="font-family:sans-serif;min-width:180px;">
              <strong style="font-size:14px;">${mission.title}</strong><br/>
              <span style="color:#666;font-size:12px;">${mission.zone}</span><br/>
              <span style="display:inline-block;margin-top:6px;background:${color}22;color:${color};border:1px solid ${color};border-radius:12px;padding:2px 10px;font-size:11px;font-weight:600;">${mission.status}</span><br/>
              <span style="color:#888;font-size:11px;margin-top:4px;display:block;">${superficie} · ${date}</span>
            </div>
          `);

        marker.on("click", () => setSelectedMission(mission));
        markersRef.current.push(marker);
      });
    });
  }, [missionsFiltrees]);

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh", p: 3 }}>
      <Box sx={{ mb: 2 }}>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>Carte terrain</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Visualisation géographique des missions
        </Typography>
      </Box>

      {/* FILTRES */}
      <Box sx={{ display: "flex", gap: 1, mb: 2, flexWrap: "wrap", alignItems: "center" }}>
        <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Zone :</Typography>
        {ZONES.map((z) => (
          <Chip key={z.value} label={z.label} size="small"
            onClick={() => setZoneFiltre(z.value)}
            sx={{
              cursor: "pointer", fontWeight: 600,
              bgcolor: zoneFiltre === z.value ? "#10b981" : "transparent",
              color:   zoneFiltre === z.value ? "#fff" : "inherit",
              border: "1px solid", borderColor: "#10b981",
              "&:hover": { bgcolor: zoneFiltre === z.value ? "#059669" : "#f0fdf4" },
            }}
          />
        ))}

        <Divider orientation="vertical" flexItem sx={{ mx: 1 }} />

        <Typography variant="body2" sx={{ fontWeight: 600, mr: 1 }}>Statut :</Typography>
        {(["tous", "assignée", "en_cours", "en_attente_validation", "terminée"] as const).map((s) => (
          <Chip key={s}
            label={s === "tous" ? "Tous" : s === "en_attente_validation" ? "En validation" : s}
            size="small"
            onClick={() => setStatutFiltre(s)}
            color={s !== "tous" && statutFiltre === s ? STATUS_MUI[s as MissionStatus] : "default"}
            variant={statutFiltre === s ? "filled" : "outlined"}
            sx={{ cursor: "pointer", fontWeight: 600 }}
          />
        ))}
      </Box>

      {/* LAYOUT */}
      <Box sx={{ display: "flex", gap: 2, height: "calc(100vh - 240px)" }}>

        {/* CARTE */}
        <Paper elevation={2} sx={{ flex: 1, borderRadius: 2, overflow: "hidden", position: "relative" }}>
          {/* Légende */}
          <Box sx={{ position: "absolute", top: 12, right: 12, zIndex: 1000, bgcolor: "white", borderRadius: 2, p: 1.5, boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
            <Typography variant="caption" sx={{ fontWeight: 700, display: "block", mb: 1 }}>Légende</Typography>
            {[
              { label: "Assignée",     color: "#3b82f6" },
              { label: "En cours",     color: "#f59e0b" },
              { label: "En validation",color: "#8b5cf6" },
              { label: "Terminée",     color: "#10b981" },
            ].map((l) => (
              <Box key={l.label} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                <Box sx={{ width: 12, height: 12, borderRadius: "50%", bgcolor: l.color }} />
                <Typography variant="caption">{l.label}</Typography>
              </Box>
            ))}
          </Box>

          {/* Compteur */}
          <Box sx={{ position: "absolute", bottom: 12, left: 12, zIndex: 1000, bgcolor: "#10b981", color: "white", borderRadius: 2, px: 2, py: 0.8, boxShadow: "0 2px 8px rgba(0,0,0,0.2)" }}>
            <Typography variant="caption" sx={{ fontWeight: 700 }}>
              {missionsFiltrees.length} mission{missionsFiltrees.length > 1 ? "s" : ""} affichée{missionsFiltrees.length > 1 ? "s" : ""}
            </Typography>
          </Box>

          <div ref={mapRef} style={{ width: "100%", height: "100%" }} />
        </Paper>

        {/* PANNEAU */}
        <Paper elevation={2} sx={{ width: 280, borderRadius: 2, display: "flex", flexDirection: "column", overflow: "hidden" }}>
          <Box sx={{ p: 2, borderBottom: "1px solid #e5e7eb" }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
              Missions ({missionsFiltrees.length})
            </Typography>
          </Box>

          <List sx={{ flex: 1, overflow: "auto", p: 0 }}>
            {missionsFiltrees.length === 0 ? (
              <Box sx={{ p: 3, textAlign: "center", color: "#9ca3af" }}>
                <Typography variant="body2">Aucune mission trouvée</Typography>
              </Box>
            ) : (
              missionsFiltrees.map((m) => (
                <ListItemButton key={m.id}
                  selected={selectedMission?.id === m.id}
                  onClick={() => setSelectedMission(m)}
                  sx={{ borderBottom: "1px solid #f3f4f6", "&.Mui-selected": { bgcolor: "#f0fdf4" } }}
                >
                  <Box sx={{ width: 10, height: 10, borderRadius: "50%", bgcolor: STATUS_COLOR[m.status], flexShrink: 0, mr: 1.5 }} />
                  <ListItemText
                    primary={<Typography sx={{ fontWeight: 600, fontSize: 13 }}>{m.title}</Typography>}
                    secondary={<Typography variant="caption" color="text.secondary">{m.zone} · {m.date ?? m.admin?.date ?? "—"}</Typography>}
                  />
                </ListItemButton>
              ))
            )}
          </List>

          {selectedMission && (
            <Box sx={{ p: 2, borderTop: "1px solid #e5e7eb", bgcolor: "#f8fafc" }}>
              <Typography sx={{ fontWeight: 700, fontSize: 13, mb: 1 }}>{selectedMission.title}</Typography>
              {[
                { label: "Zone",       value: selectedMission.zone },
                { label: "Superficie", value: selectedMission.superficie ?? selectedMission.admin?.superficie ?? "—" },
                { label: "Date",       value: selectedMission.date ?? selectedMission.admin?.date ?? "—" },
                { label: "Notaire",    value: selectedMission.notaire ?? selectedMission.admin?.notaire ?? "—" },
              ].map((row) => (
                <Box key={row.label} sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                  <Typography variant="caption" color="text.secondary">{row.label}</Typography>
                  <Typography variant="caption" sx={{ fontWeight: 600 }}>{row.value}</Typography>
                </Box>
              ))}
              <Chip label={selectedMission.status} color={STATUS_MUI[selectedMission.status]} size="small" sx={{ mt: 1, fontWeight: 600 }} />
              <Box
                component="button"
                onClick={() => goTo(`missions/${selectedMission.id}`)}
                sx={{
                  mt: 1.5,
                  width: "100%",
                  border: "none",
                  borderRadius: 1.5,
                  py: 1,
                  bgcolor: "#10b981",
                  color: "#fff",
                  fontWeight: 600,
                  fontSize: 12,
                  cursor: "pointer",
                  "&:hover": { bgcolor: "#059669" },
                }}
              >
                Voir la mission
              </Box>
            </Box>
          )}
        </Paper>
      </Box>
    </Box>
  );
}