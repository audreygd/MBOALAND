import { Paper, Typography, Box, type SxProps } from "@mui/material";
import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  description?: ReactNode;
  icon?: ReactNode;
  color?: string;
  trend?: ReactNode;
  sx?: SxProps;
}

export default function StatCard({
  title,
  value,
  description,
  icon,
  color = "#10b981",
  trend,
  sx,
}: StatCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #e2e8f0",
        background: "linear-gradient(180deg, #ffffff, #f8fafc)",
        transition: "0.2s",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 8px 20px rgba(0,0,0,0.08)",
        },
        ...sx,
      }}
    >
      {/* HEADER */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        {/* ✅ color="text.secondary" valeur MUI — OK. fontWeight dans sx */}
        <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
          {title}
        </Typography>
        {icon && <Box sx={{ color: "#64748b" }}>{icon}</Box>}
      </Box>

      {/* VALUE — ✅ tout dans sx, color vient de la prop */}
      <Typography sx={{ color, fontWeight: 800, mt: 2, fontSize: 34 }}>
        {value}
      </Typography>

      {/* DESCRIPTION */}
      <Box sx={{ mt: 1 }}>
        {description}
      </Box>

      {/* TREND */}
      {trend && (
        <Box sx={{ mt: 1, fontSize: 12, fontWeight: 600, color }}>
          {trend}
        </Box>
      )}
    </Paper>
  );
}