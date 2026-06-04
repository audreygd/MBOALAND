import { Paper, Typography, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

interface Props {
  title?: string;
  value?: string;
  description?: ReactNode;
  color?: string;
  sx?: SxProps;
}

export default function StatCard({
  title,
  value,
  description,
  color,
  sx,
}: Props) {
  return (
    <Paper
      elevation={1}
      sx={{
        p: 3,
        borderRadius: 1,
        border: "1px solid #e5e7eb",
        ...sx,
      }}
    >
      <Typography sx={{ fontSize: 18, fontWeight: 600 }} color="text.secondary">
        {title}
      </Typography>

      <Typography
        sx={{ color: color ?? "inherit", fontWeight: 500, mt: 1, fontSize: 30 }}
      >
        {value}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 1, fontSize: 14, fontWeight: 400 }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
