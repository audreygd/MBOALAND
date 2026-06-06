import {
  Box,
  Button,
  Chip,
  Divider,
  Drawer,
  IconButton,
  Stack,
  Typography,
} from "@mui/material";
import { UserIcon } from "../../assets/icons";

interface Props {
  open: boolean;
  onClose: () => void;
}

const styles = {
  drawer: {
    width: 700,
    bgcolor: "background.default",
    display: "flex",
    flexDirection: "column",
  },

  header: {
    p: 3,
    bgcolor: "background.paper",
    borderBottom: 1,
    borderColor: "divider",
  },

  headerContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  imageContainer: {
    p: 3,
  },

  image: {
    width: "100%",
    height: 260,
    objectFit: "cover",
    borderRadius: 3,
  },

  section: {
    px: 3,
  },

  sectionTitle: {
    fontWeight: 700,
    mb: 2,
  },

  divider: {
    my: 3,
  },

  footer: {
    p: 3,
    bgcolor: "background.paper",
    borderTop: 1,
    borderColor: "divider",
  },

  actions: {
    flexDirection: "row",
    gap: 2,
  },

  primaryButton: {
    flex: 1,
    borderRadius: 2,
    textTransform: "none",
    height: 44,
  },

  secondaryButton: {
    borderRadius: 2,
    textTransform: "none",
    height: 44,
  },

  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  document: {
    p: 2,
    border: 1,
    borderColor: "divider",
    borderRadius: 2,
    bgcolor: "background.paper",
  },
};

export default function LandDetailsDrawer({ open, onClose }: Props) {
  return (
    <Drawer
      anchor="right"
      title="Details du terrain"
      open={open}
      onClose={onClose}
      ModalProps={{
        sx: styles.drawer,
      }}
    >
      {/* Header */}

      <Box sx={{ ...styles.header, position: "sticky" }}>
        <Stack sx={styles.headerContent}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              Terrain à Odza
            </Typography>

            <Typography color="text.secondary">REF-2025-001</Typography>
          </Box>

          <IconButton onClick={onClose}>
            <UserIcon />
          </IconButton>
        </Stack>
      </Box>

      {/* Photo */}

      <Box sx={styles.imageContainer}>
        <Box
          component="img"
          src="https://images.unsplash.com/photo-1500382017468-9049fed747ef"
          sx={styles.image}
        />
      </Box>

      {/* Prix */}

      <Box sx={styles.section}>
        <Typography color="text.secondary">Prix demandé</Typography>

        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          15 000 000 FCFA
        </Typography>
      </Box>

      <Divider sx={styles.divider} />

      {/* Informations */}

      <Box sx={styles.section}>
        <Typography variant="h6" sx={styles.sectionTitle}>
          Informations
        </Typography>

        <Stack spacing={2}>
          <Stack sx={styles.infoRow}>
            <Typography color="text.secondary">Superficie</Typography>

            <Typography>1000 m²</Typography>
          </Stack>

          <Stack sx={styles.infoRow}>
            <Typography color="text.secondary">Type</Typography>

            <Typography>Résidentiel</Typography>
          </Stack>

          <Stack sx={styles.infoRow}>
            <Typography color="text.secondary">Accès routier</Typography>

            <Typography>Oui</Typography>
          </Stack>

          <Stack sx={styles.infoRow}>
            <Typography color="text.secondary">Statut</Typography>

            <Chip label="Publié" color="success" size="small" />
          </Stack>
        </Stack>
      </Box>

      <Divider sx={styles.divider} />

      {/* Localisation */}

      <Box sx={styles.section}>
        <Typography variant="h6" sx={styles.sectionTitle}>
          Localisation
        </Typography>

        <Stack spacing={1}>
          <Typography>Yaoundé - Odza</Typography>

          <Typography color="text.secondary">Latitude : 3.8485</Typography>

          <Typography color="text.secondary">Longitude : 11.5021</Typography>
        </Stack>
      </Box>

      <Divider sx={styles.divider} />

      {/* Documents */}

      <Box sx={styles.section}>
        <Typography variant="h6" sx={styles.sectionTitle}>
          Documents
        </Typography>

        <Stack spacing={2}>
          <Box sx={styles.document}>
            <Typography>Titre foncier.pdf</Typography>
          </Box>

          <Box sx={styles.document}>
            <Typography>Plan cadastral.pdf</Typography>
          </Box>

          <Box sx={styles.document}>
            <Typography>Pièce identité.pdf</Typography>
          </Box>
        </Stack>
      </Box>

      <Box sx={{ flexGrow: 1 }} />

      {/* Footer */}

      <Box sx={styles.footer}>
        <Stack sx={styles.actions}>
          <Button
            variant="contained"
            startIcon={<UserIcon />}
            sx={styles.primaryButton}
          >
            Modifier
          </Button>

          <Button
            variant="outlined"
            startIcon={<UserIcon />}
            sx={styles.secondaryButton}
          >
            Suspendre
          </Button>

          <Button
            color="error"
            startIcon={<UserIcon />}
            sx={styles.secondaryButton}
          >
            Supprimer
          </Button>
        </Stack>
      </Box>
    </Drawer>
  );
}
