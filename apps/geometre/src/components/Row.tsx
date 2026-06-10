import { Box, type BoxProps } from "@mui/material";

// Remplace Stack — composant utilitaire pour aligner des éléments en ligne
export default function Row({ children, sx, ...props }: BoxProps) {
  return (
    <Box
      sx={{ display: "flex", flexDirection: "row", alignItems: "center", ...sx }}
      {...props}
    >
      {children}
    </Box>
  );
}