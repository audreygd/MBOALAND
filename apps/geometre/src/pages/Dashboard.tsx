import { Box, Typography, Link } from "@mui/material";
import StatCard from "../components/Statcard";
import MissionCard from "../components/MissionCard";
import GraphCard from "../components/GraphCard";
import { useMissions } from "../context/MissionsContext";

interface Props {
  onViewDetail?: (id: number) => void;
}

export default function Dashboard({ onViewDetail }: Props) {
  const { missions } = useMissions();
  const recentMissions = missions.slice(0, 3);

  const assigned = missions.filter((m) => m.status === "assignée").length;
  const inProgress = missions.filter((m) => m.status === "en_cours").length;
  const pending = missions.filter((m) => m.status === "en_attente_validation").length;
  const done = missions.filter((m) => m.status === "terminée").length;
  const gpsCount = missions.filter((m) => m.technical.fichier_gps).length;

  return (
    <Box sx={{ bgcolor: "#f8fafc", minHeight: "100vh" }}>
      <Box sx={{ p: 4, pt: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="body2" color="text.secondary">
            Missions reçues après validation propriétaire / notaire.
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 3, width: "100%", flexWrap: "wrap" }}>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <StatCard
              title="Missions assignées"
              value={assigned}
              color="#10b981"
              description={
                <Link href="#" underline="hover" sx={{ color: "#10b981", fontSize: 13 }}>
                  À démarrer
                </Link>
              }
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <StatCard
              title="En cours"
              value={inProgress}
              color="#f59e0b"
              description={
                <Link href="#" underline="hover" sx={{ color: "#f59e0b", fontSize: 13 }}>
                  Relevés en cours
                </Link>
              }
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <StatCard
              title="En validation"
              value={pending}
              color="#8b5cf6"
              description={
                <Link href="#" underline="hover" sx={{ color: "#8b5cf6", fontSize: 13 }}>
                  Rapports déposés
                </Link>
              }
            />
          </Box>
          <Box sx={{ flex: 1, minWidth: 200 }}>
            <StatCard
              title="Terminées"
              value={done}
              color="#3b82f6"
              description={
                <Link href="#" underline="hover" sx={{ color: "#3b82f6", fontSize: 13 }}>
                  Validées notaire
                </Link>
              }
            />
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          <GraphCard
            title="Activité terrain"
            subtitle="Missions traitées sur 7 jours"
            data={[2, 4, 3, 5, 6, 4, 7]}
            color="#10b981"
            sx={{ width: "100%" }}
          />
        </Box>

        <Box sx={{ mt: 2, display: "flex", justifyContent: "flex-end" }}>
          <Typography variant="caption" color="text.secondary">
            Relevés GPS complétés : {gpsCount}
          </Typography>
        </Box>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Missions récentes
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {recentMissions.map((mission) => (
              <MissionCard
                key={mission.id}
                mission={mission}
                onOpen={() => onViewDetail?.(mission.id)}
              />
            ))}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
