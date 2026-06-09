import { useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";

export default function SettingsPage() {
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true,
  });

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#f8fafc",
        p: 2,
      }}
    >
      <Paper
        elevation={6}
        sx={{
          width: "100%",
          maxWidth: 650,
          p: 4,
          borderRadius: 2,
          boxShadow: "0 10px 30px rgba(0,0,0,0.08)",
        }}
      >
        {/* Header */}
        <Typography sx={{ fontSize: 26, fontWeight: 700, mb: 1 }}>
          Paramètres
        </Typography>

        <Typography
          sx={{
            color: "text.secondary",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          Gérez vos informations personnelles et vos préférences.
        </Typography>

        <Divider sx={{ mb: 3 }} />

        {/* Infos utilisateur (read-only) */}
        <Stack spacing={1.5} sx={{ mb: 3 }}>
          <Typography sx={{ fontWeight: 600 }}>Nom : John Doe</Typography>

          <Typography sx={{ fontWeight: 600 }}>
            Email : john@email.com
          </Typography>

          <Typography sx={{ fontWeight: 600 }}>
            Téléphone : +237 6XX XXX XXX
          </Typography>
        </Stack>

        {/* bouton modifier */}
        <Button
          variant="contained"
          sx={{
            mb: 3,
            bgcolor: "#0B6B3A",
            textTransform: "none",
            "&:hover": { bgcolor: "#095a2e" },
          }}
        >
          Modifier les infos
        </Button>

        <Divider sx={{ mb: 3 }} />

        {/* Notifications */}
        <Typography sx={{ fontWeight: 700, mb: 2 }}>Notifications</Typography>

        <Stack spacing={1}>
          <FormControlLabel
            control={
              <Switch
                checked={notifications.email}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    email: e.target.checked,
                  }))
                }
              />
            }
            label="Email"
          />

          <FormControlLabel
            control={
              <Switch
                checked={notifications.app}
                onChange={(e) =>
                  setNotifications((prev) => ({
                    ...prev,
                    app: e.target.checked,
                  }))
                }
              />
            }
            label="Application"
          />
        </Stack>

        {/* sécurité */}
        <Divider sx={{ my: 3 }} />

        <Typography sx={{ fontWeight: 700, mb: 1 }}>Sécurité</Typography>

        <Button
          variant="outlined"
          sx={{
            textTransform: "none",
            borderColor: "#0B6B3A",
            color: "#0B6B3A",
          }}
        >
          Changer le mot de passe
        </Button>
      </Paper>
    </Box>
  );
}
