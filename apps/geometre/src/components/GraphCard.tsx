import { Paper, Typography, Box, type SxProps } from "@mui/material";

interface GraphCardProps {
  title: string;
  subtitle?: string;
  data: number[];
  labels?: string[];
  color?: string;
  sx?: SxProps;
}

const W = 640;
const H = 260;
const PAD = 36;

export default function GraphCard({
  title,
  subtitle,
  data,
  labels,
  color = "#10b981",
  sx,
}: GraphCardProps) {
  const xLabels = labels ?? data.map((_, i) => `J${i + 1}`);
  const maxVal = Math.max(...data, 1);
  const minVal = Math.min(...data, 0);
  const range = maxVal - minVal || 1;

  const points = data.map((val, i) => ({
    x: PAD + (i * (W - PAD * 2)) / Math.max(data.length - 1, 1),
    y: H - PAD - ((val - minVal) / range) * (H - PAD * 2),
  }));

  const linePath = `M ${points.map((p) => `${p.x},${p.y}`).join(" L ")}`;
  const areaPath = `${linePath} L ${points[points.length - 1].x},${H - PAD} L ${points[0].x},${H - PAD} Z`;

  return (
    <Paper
      elevation={2}
      sx={{ p: 3, borderRadius: 3, border: "1px solid #e2e8f0", ...sx }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: 1,
        }}
      >
        {/* TITRE + SOUS-TITRE — balise Typography bien fermée */}
        <Box>
          <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
            {title}
          </Typography>
          {subtitle && (
            <Typography variant="body2" sx={{ color: "text.secondary", mt: 0.5 }}>
              {subtitle}
            </Typography>
          )}
        </Box>

        <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
          +14% ce mois
        </Typography>
      </Box>

      <Box sx={{ mt: 3, width: "100%", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          width="100%"
          height="260"
          role="img"
          aria-label="Graphique d'activité terrain"
        >
          <defs>
            <linearGradient
              id={`grad-${color.replace("#", "")}`}
              x1="0" y1="0" x2="0" y2="1"
            >
              <stop offset="0%"   stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0"   />
            </linearGradient>
          </defs>

          {/* Axes */}
          <line x1={PAD} y1={PAD}      x2={PAD}      y2={H - PAD} stroke="#e5e7eb" strokeWidth="1" />
          <line x1={PAD} y1={H - PAD}  x2={W - PAD}  y2={H - PAD} stroke="#e5e7eb" strokeWidth="1" />

          {/* Grille horizontale + valeurs Y */}
          {[0, 1, 2, 3].map((tick) => {
            const y   = PAD + tick * ((H - PAD * 2) / 3);
            const val = Math.round(maxVal - (tick * range) / 3);
            return (
              <g key={tick}>
                <line
                  x1={PAD} y1={y} x2={W - PAD} y2={y}
                  stroke="#e5e7eb" strokeWidth="1" opacity={0.4}
                />
                <text x={PAD - 8} y={y + 4} textAnchor="end" fontSize="11" fill="#9ca3af">
                  {val}
                </text>
              </g>
            );
          })}

          {/* Aire sous la courbe */}
          <path d={areaPath} fill={`url(#grad-${color.replace("#", "")})`} />

          {/* Ligne */}
          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          {/* Points */}
          {points.map((p, i) => (
            <circle key={i} cx={p.x} cy={p.y} r="5" fill={color} stroke="#fff" strokeWidth="2" />
          ))}

          {/* Labels X */}
          {points.map((p, i) => (
            <text key={i} x={p.x} y={H - PAD + 18} textAnchor="middle" fontSize="11" fill="#9ca3af">
              {xLabels[i]}
            </text>
          ))}
        </svg>
      </Box>
    </Paper>
  );
}