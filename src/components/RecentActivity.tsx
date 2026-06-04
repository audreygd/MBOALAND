import { Paper, Typography, List, ListItem, ListItemText } from "@mui/material";

export default function RecentActivity() {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 1,
        my: 3,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Activité récente
      </Typography>

      <List>
        <ListItem>
          <ListItemText
            primary="Nouvelle offre reçue"
            secondary="Terrain à Odza"
          />
        </ListItem>

        <ListItem>
          <ListItemText primary="Document validé" secondary="Titre foncier" />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Visite programmée"
            secondary="Terrain à Kribi"
          />
        </ListItem>

        <ListItem>
          <ListItemText
            primary="Message du notaire"
            secondary="Dossier #TRX-0025"
          />
        </ListItem>
      </List>
    </Paper>
  );
}
