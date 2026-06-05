import { Box, TextField, Typography } from "@mui/material";
import type { Dispatch, SetStateAction } from "react";

type FullData = {
  name: string;
  location: string;
  surface: string;
  price: string;
  photos?: File[];
  documents?: File[];
};

export default function Step1({
  data,
  errors,
  onChange,
}: {
  data: FullData;
  errors?: Record<string, string>;
  onChange: Dispatch<SetStateAction<Partial<FullData>>>;
}) {
  return (
    <>
      <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 3 }}>
        Informations du terrain
      </Typography>
      <Box
        sx={{ display: "grid", gap: 6, gridTemplateColumns: "1fr 1fr", mt: 6 }}
      >
        <TextField
          label="Nom du terrain"
          value={data.name}
          onChange={(e) => onChange({ name: e.target.value })}
          error={!!errors?.name}
          helperText={errors?.name}
          fullWidth
          variant="outlined"
          required
        />
        <TextField
          label="Localisation"
          value={data.location}
          onChange={(e) => onChange({ location: e.target.value })}
          error={!!errors?.location}
          helperText={errors?.location}
          fullWidth
          required
        />
        <TextField
          label="Superficie"
          value={data.surface}
          onChange={(e) => onChange({ surface: e.target.value })}
          error={!!errors?.surface}
          helperText={errors?.surface}
          fullWidth
          required
        />
        <TextField
          label="Prix"
          value={data.price}
          onChange={(e) => onChange({ price: e.target.value })}
          error={!!errors?.price}
          helperText={errors?.price}
          fullWidth
          required
        />
      </Box>
    </>
  );
}
