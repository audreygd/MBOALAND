import { Box, Divider, Typography } from "@mui/material";
import Row from "../Row";

type FullData = {
  name: string;
  location: string;
  surface: string;
  price: string;
  photos?: File[];
  documents?: File[];
};

export default function Step3({ data }: { data: FullData }) {
  return (
    <Box>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
        Récapitulatif
      </Typography>

      <Box
        sx={{
          p: 4,
          border: "1px solid #e5e7eb",
          borderRadius: 1,
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Row sx={{ justifyContent: "space-between", width: "100%" }}>
          <Box sx={{ gap: 4, width: "48%" }}>
            <Box>
              <Row sx={{ justifyContent: "space-between" }}>
                <Typography>nom</Typography>
                <Typography sx={{ fontWeight: 600 }}>{data.name}</Typography>
              </Row>
              <Divider sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Row sx={{ justifyContent: "space-between" }}>
                <Typography>localisation</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {data.location}
                </Typography>
              </Row>
              <Divider sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Row sx={{ justifyContent: "space-between" }}>
                <Typography>Superficie</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {data.surface} m^2
                </Typography>
              </Row>
            </Box>
          </Box>
          <Divider orientation="vertical" flexItem />
          <Box sx={{ gap: 4, width: "48%" }}>
            <Box>
              <Row sx={{ justifyContent: "space-between" }}>
                <Typography>prix</Typography>
                <Typography sx={{ fontWeight: 600 }}>
                  {data.price} fcfa
                </Typography>
              </Row>
              <Divider sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Row sx={{ justifyContent: "space-between" }}>
                <Typography>photos</Typography>
                <Box sx={{ fontWeight: 600 }}>
                  {data.photos?.map((f) => f.name)}
                </Box>
              </Row>
              <Divider sx={{ mt: 2 }} />
            </Box>
            <Box sx={{ mt: 2 }}>
              <Row sx={{ justifyContent: "space-between" }}>
                <Typography>Documents</Typography>
                <Box sx={{ fontWeight: 600 }}>
                  {data.documents?.map((f) => f.name)}
                </Box>
              </Row>
            </Box>
          </Box>
        </Row>
      </Box>
    </Box>
  );
}
