import { Paper, Box, Typography, Chip, Button } from "@mui/material";
import { STATUS_CHIP_COLOR, STATUS_LABELS } from "../lib/missionUtils";
import type { Mission } from "../types";

interface Props {
  mission: Mission;
  onOpen?: () => void;
}

export default function MissionCard({ mission, onOpen }: Props) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 2,
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        transition: "0.2s",
        "&:hover": { transform: "translateY(-2px)" },
      }}
    >
      <Box>
        <Typography sx={{ fontWeight: 700 }}>{mission.title}</Typography>
        <Typography variant="body2" color="text.secondary">
          Zone : {mission.zone}
        </Typography>
        {mission.admin.date && (
          <Typography variant="caption" color="text.secondary">
            {mission.admin.date}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        <Chip
          label={STATUS_LABELS[mission.status]}
          color={STATUS_CHIP_COLOR[mission.status]}
          size="small"
          sx={
            mission.status === "en_attente_validation"
              ? { bgcolor: "#ede9fe", color: "#7c3aed", fontWeight: 600 }
              : { fontWeight: 600 }
          }
        />
        <Button size="small" variant="outlined" onClick={onOpen}>
          Ouvrir
        </Button>
      </Box>
    </Paper>
  );
}
