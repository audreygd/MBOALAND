import { useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

type DocumentType = "TITRE_FONCIER" | "CONTRAT" | "CERTIFICAT";

interface Document {
  id: string;
  name: string;
  type: DocumentType;
  terrain: string;
  date: string;
  size: string;
}

const documents: Document[] = [
  {
    id: "1",
    name: "Titre_Foncier_Odza.pdf",
    type: "TITRE_FONCIER",
    terrain: "Terrain à Odza",
    date: "12 Mai 2024",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Contrat_Vente.pdf",
    type: "CONTRAT",
    terrain: "Terrain à Kribi",
    date: "08 Mai 2024",
    size: "1.2 MB",
  },
  {
    id: "1",
    name: "Titre_Foncier_Odza.pdf",
    type: "TITRE_FONCIER",
    terrain: "Terrain à Odza",
    date: "12 Mai 2024",
    size: "2.4 MB",
  },
  {
    id: "2",
    name: "Contrat_Vente.pdf",
    type: "CONTRAT",
    terrain: "Terrain à Kribi",
    date: "08 Mai 2024",
    size: "1.2 MB",
  },
];

export default function DocumentsPage() {
  const [selected, setSelected] = useState<Document | null>(null);

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 3 }}>
        {/* <Typography
          sx={{
            fontSize: 30,
            fontWeight: 700,
          }}
        >
          Documents
        </Typography> */}

        <Typography
          sx={{
            mt: 0.5,
            color: "#6B7280",
            fontSize: 18,
          }}
        >
          Gérez tous les documents liés à vos terrains et transactions.
        </Typography>
      </Box>

      {/* Stats */}
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(4,minmax(0,1fr))",
          gap: 2,
          mb: 3,
        }}
      >
        {[
          {
            title: "Documents",
            value: 24,
            color: "#111827",
          },
          {
            title: "Titres fonciers",
            value: 10,
            color: "#15803D",
          },
          {
            title: "Contrats",
            value: 8,
            color: "#2563EB",
          },
          {
            title: "Certificats",
            value: 6,
            color: "#9333EA",
          },
        ].map((item) => (
          <Paper
            key={item.title}
            elevation={0}
            sx={{
              p: 2,
              borderRadius: 1,
              border: "1px solid #E5E7EB",
            }}
          >
            <Typography
              sx={{
                fontSize: 14,
                color: "#6B7280",
              }}
            >
              {item.title}
            </Typography>

            <Typography
              sx={{
                mt: 1,
                fontSize: 28,
                fontWeight: 700,
                color: item.color,
              }}
            >
              {item.value}
            </Typography>
          </Paper>
        ))}
      </Box>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 2,
          borderRadius: 1,
          border: "1px solid #E5E7EB",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <TextField
            size="small"
            placeholder="Rechercher un document..."
            sx={{ flex: 1 }}
          />

          <Select
            defaultValue="ALL"
            size="small"
            sx={{
              minWidth: 180,
            }}
          >
            <MenuItem value="ALL">Tous les types</MenuItem>

            <MenuItem value="TITRE_FONCIER">Titres fonciers</MenuItem>

            <MenuItem value="CONTRAT">Contrats</MenuItem>

            <MenuItem value="CERTIFICAT">Certificats</MenuItem>
          </Select>

          <Button
            variant="contained"
            sx={{
              bgcolor: "#15803D",
              textTransform: "none",
              px: 3,
              "&:hover": {
                bgcolor: "#166534",
              },
            }}
          >
            Ajouter
          </Button>
        </Box>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          borderRadius: 1,
          border: "1px solid #E5E7EB",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
            px: 2,
            py: 2,
            bgcolor: "#F9FAFB",
          }}
        >
          <Typography sx={{ fontWeight: 600 }}>Nom</Typography>

          <Typography sx={{ fontWeight: 600 }}>Type</Typography>

          <Typography sx={{ fontWeight: 600 }}>Terrain</Typography>

          <Typography sx={{ fontWeight: 600 }}>Date</Typography>

          <Typography sx={{ fontWeight: 600 }}>Action</Typography>
        </Box>

        {documents.map((doc) => (
          <Box
            key={doc.id}
            sx={{
              display: "grid",
              gridTemplateColumns: "2fr 1fr 1fr 1fr 80px",
              px: 2,
              py: 2,
              alignItems: "center",
              borderTop: "1px solid rgba(17,24,39,0.06)",
            }}
          >
            <Typography sx={{ fontWeight: 500 }}>{doc.name}</Typography>

            <Typography sx={{ color: "#6B7280" }}>{doc.type}</Typography>

            <Typography>{doc.terrain}</Typography>

            <Typography sx={{ color: "#6B7280" }}>{doc.date}</Typography>

            <IconButton onClick={() => setSelected(doc)}>
              <VisibilityOutlinedIcon />
            </IconButton>
          </Box>
        ))}
      </Paper>

      {/* Drawer */}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 500,
            p: 3,
          },
        }}
      >
        {selected && (
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  fontSize: 20,
                  fontWeight: 700,
                }}
              >
                Détails du document
              </Typography>

              <IconButton onClick={() => setSelected(null)}>
                <CloseIcon />
              </IconButton>
            </Box>

            <Paper
              variant="outlined"
              sx={{
                p: 2,
                mb: 2,
              }}
            >
              <Typography
                sx={{
                  fontSize: 18,
                  fontWeight: 600,
                }}
              >
                {selected.name}
              </Typography>

              <Typography
                sx={{
                  mt: 2,
                  color: "#6B7280",
                }}
              >
                Type : {selected.type}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#6B7280",
                }}
              >
                Terrain : {selected.terrain}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#6B7280",
                }}
              >
                Taille : {selected.size}
              </Typography>

              <Typography
                sx={{
                  mt: 1,
                  color: "#6B7280",
                }}
              >
                Date : {selected.date}
              </Typography>
            </Paper>

            <Box
              sx={{
                height: 300,
                borderRadius: 1,
                border: "1px dashed #D1D5DB",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <Typography
                sx={{
                  color: "#9CA3AF",
                }}
              >
                Aperçu PDF
              </Typography>
            </Box>

            <Button
              startIcon={<DownloadOutlinedIcon />}
              variant="contained"
              sx={{
                bgcolor: "#15803D",
                textTransform: "none",
              }}
            >
              Télécharger
            </Button>
          </>
        )}
      </Drawer>
    </Box>
  );
}
