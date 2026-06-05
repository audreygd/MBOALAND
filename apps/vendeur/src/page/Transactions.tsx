import { Button, Box, Link, Typography } from "@mui/material";

import StatCard from "../components/StatCard";
import Row from "../components/Row";
import LandTable from "../components/LandTable";

export const TransactionPage = () => {
  return (
    <Box sx={{ bgcolor: "#f8fafc" }}>
      <Box
        sx={{
          position: "sticky",
          top: 104,
          bgcolor: "#f8fafc",
          py: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            px: 2,
          }}
        >
          <Button
            variant="contained"
            sx={{
              borderColor: "#15803d",
              borderRadius: 0.5,
              px: 3,
              textTransform: "none",
              backgroundColor: "#15803d",
            }}
          >
            <Typography sx={{ fontWeight: 600, color: "#fff" }}>
              Ajouter un terrain
            </Typography>
          </Button>
        </Box>
        {/* cards */}
        <Row
          sx={{
            gap: 4,
            p: 2,
            flex: 1,
            width: "100%",
          }}
          direction={"row"}
        >
          <Box sx={{ flex: 1 }}>
            <StatCard
              title=" Terrains en vente"
              value="5"
              color="#15803d"
              sx={{ width: "100%" }}
              description={
                <Link href="/terrains" underline="hover" color="#15803d">
                  <Typography variant="body2">Voir les terrains</Typography>
                </Link>
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="En attente"
              value="8"
              color="#2563eb"
              sx={{ width: "100%" }}
              description={
                <Link href="/offres" underline="hover" color="#2563eb">
                  <Typography variant="body2">Voir les offres</Typography>
                </Link>
              }
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <StatCard
              title="vendus"
              value="3"
              color="#d97706"
              sx={{ width: "100%" }}
              description={
                <Link href="/transactions" underline="hover" color="#d97706">
                  <Typography variant="body2">Voir les transactions</Typography>
                </Link>
              }
            />
          </Box>
        </Row>
      </Box>

      <Box sx={{ m: 2, overflow: "auto" }}>
        <Box>
          <LandTable />
        </Box>
      </Box>
    </Box>
    // <Paper
    //   elevation={1}
    //   sx={{
    //     p: 3,
    //     borderRadius: 1,
    //   }}
    // >
    //   <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
    //     {title}
    //   </Typography>

    //   <Table>
    //     <TableHead>
    //       <TableRow>
    //         <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
    //           Terrain
    //         </TableCell>
    //         <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>
    //           Superficie
    //         </TableCell>
    //         <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>Prix</TableCell>
    //         <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>Statut</TableCell>
    //         <TableCell sx={{ fontSize: 16, fontWeight: 600 }}>Action</TableCell>
    //       </TableRow>
    //     </TableHead>

    //     <TableBody>
    //       {lands.map((land) => (
    //         <TableRow key={land.name}>
    //           <TableCell>{land.name}</TableCell>

    //           <TableCell>{land.surface}</TableCell>

    //           <TableCell>{land.price}</TableCell>

    //           <TableCell>
    //             <Chip
    //               label={land.status}
    //               color={land.status === "En vente" ? "success" : "warning"}
    //             />
    //           </TableCell>
    //           <TableCell>
    //             <Button variant="outlined" size="small">
    //               Voir
    //             </Button>{" "}
    //           </TableCell>
    //         </TableRow>
    //       ))}
    //     </TableBody>
    //   </Table>
    // </Paper>
  );
};
export default TransactionPage;

// const lands = [
//   {
//     name: "Terrain à Odza",
//     surface: "1000 m²",
//     price: "15 000 000 FCFA",
//     status: "En vente",
//   },
//   {
//     name: "Terrain à Kribi",
//     surface: "2000 m²",
//     price: "25 000 000 FCFA",
//     status: "En attente",
//   },
//   {
//     name: "Terrain à Douala",
//     surface: "450 m²",
//     price: "18 000 000 FCFA",
//     status: "En vente",
//   },
// ];
