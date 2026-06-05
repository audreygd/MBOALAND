import { Box, Paper, Typography, type SxProps } from "@mui/material";
import type { ReactNode } from "react";
import Row from "./Row";

interface Props {
  title?: string;
  value?: string;
  description?: ReactNode;
  color?: string;
  sx?: SxProps;
  icon?: ReactNode;
}

export default function StatCard({
  title,
  value,
  description,
  color,
  icon,
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
      <Row sx={{ alignItems: "flex-end", justifyContent: "space-between" }}>
        <Typography
          sx={{ fontSize: 18, fontWeight: 600 }}
          color="text.secondary"
        >
          {title}
        </Typography>
        {icon && <Box sx={{ ml: 2, borderRadius: 1 }}>{icon}</Box>}
      </Row>

      <Typography
        sx={{ color: color ?? "inherit", fontWeight: 600, mt: 1, fontSize: 32 }}
      >
        {value}
      </Typography>
      <Typography
        color="text.secondary"
        sx={{ mt: 1, fontSize: 14, fontWeight: 500 }}
      >
        {description}
      </Typography>
    </Paper>
  );
}
