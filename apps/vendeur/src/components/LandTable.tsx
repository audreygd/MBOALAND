import {
  Paper,
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  Box,
  Link,
} from "@mui/material";
import { useState } from "react";
import LandDetailsDrawer from "./land/LandDetails";

const lands = [
  {
    name: "Terrain à Odza",
    surface: "1000 m²",
    price: "15 000 000 FCFA",
    status: "En vente",
  },
  {
    name: "Terrain à Kribi",
    surface: "2000 m²",
    price: "25 000 000 FCFA",
    status: "En attente",
  },
  {
    name: "Terrain à Douala",
    surface: "450 m²",
    price: "18 000 000 FCFA",
    status: "En vente",
  },
  {
    name: "Terrain à Odza",
    surface: "1000 m²",
    price: "15 000 000 FCFA",
    status: "En vente",
  },
  {
    name: "Terrain à Kribi",
    surface: "2000 m²",
    price: "25 000 000 FCFA",
    status: "En attente",
  },
  {
    name: "Terrain à Douala",
    surface: "450 m²",
    price: "18 000 000 FCFA",
    status: "En vente",
  },
  {
    name: "Terrain à Odza",
    surface: "1000 m²",
    price: "15 000 000 FCFA",
    status: "En vente",
  },
  {
    name: "Terrain à Kribi",
    surface: "2000 m²",
    price: "25 000 000 FCFA",
    status: "En attente",
  },
  {
    name: "Terrain à Douala",
    surface: "450 m²",
    price: "18 000 000 FCFA",
    status: "En vente",
  },
];

interface LandTableProps {
  showAll?: boolean;
}

export default function LandTable({ showAll }: LandTableProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  return (
    <>
      <Paper
        elevation={1}
        sx={{
          p: 3,
          borderRadius: 1,
        }}
      >
        <Box
          sx={{
            justifyContent: "space-between",
            flexDirection: "row",
            display: "flex",
            pb: 2,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Mes terrains
          </Typography>
          {showAll && (
            <Link
              href="#terrains"
              onClick={(e) => {
                e.preventDefault();
                window.location.hash = "#terrains";
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  borderColor: "#15803d",
                  borderRadius: 1,
                  px: 3,
                  textTransform: "none",
                }}
              >
                <Typography sx={{ fontWeight: 600, color: "#15803d" }}>
                  Voir tout
                </Typography>
              </Button>
            </Link>
          )}
        </Box>

        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
                Terrain
              </TableCell>
              <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
                Superficie
              </TableCell>
              <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>Prix</TableCell>
              <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
                Statut
              </TableCell>
              <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
                Action
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody sx={{ overflow: "scroll" }}>
            {lands.map((land) => (
              <TableRow key={land.name}>
                <TableCell>{land.name}</TableCell>

                <TableCell>{land.surface}</TableCell>

                <TableCell>{land.price}</TableCell>

                <TableCell>
                  <Chip
                    label={land.status}
                    color={land.status === "En vente" ? "success" : "warning"}
                  />
                </TableCell>
                <TableCell>
                  <Button
                    variant="outlined"
                    size="small"
                    sx={{ textTransform: "none" }}
                    onClick={() => setDetailsOpen(true)}
                  >
                    Voir
                  </Button>{" "}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <LandDetailsDrawer
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
      />
    </>
  );
}
