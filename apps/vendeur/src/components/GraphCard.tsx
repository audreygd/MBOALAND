import { Paper, Typography, Box, type SxProps } from "@mui/material";

interface GraphCardProps {
  title: string;
  subtitle?: string;
  data: number[];
  labels?: string[];
  color?: string;
  sx?: SxProps;
}

const GRAPH_WIDTH = 640;
const GRAPH_HEIGHT = 280;
const GRAPH_PADDING = 32;

export default function GraphCard({
  title,
  subtitle,
  data,
  labels,
  color = "#15803d",
  sx,
}: GraphCardProps) {
  const xLabels = labels ?? data.map((_, index) => `J${index + 1}`);
  const maxValue = Math.max(...data, 1);
  const minValue = Math.min(...data, 0);
  const range = maxValue - minValue || 1;

  const points = data.map((value, index) => {
    const x =
      GRAPH_PADDING +
      (index * (GRAPH_WIDTH - GRAPH_PADDING * 2)) /
        Math.max(data.length - 1, 1);
    const normalized = (value - minValue) / range;
    const y =
      GRAPH_HEIGHT -
      GRAPH_PADDING -
      normalized * (GRAPH_HEIGHT - GRAPH_PADDING * 2);
    return { x, y };
  });

  const linePath = `M${points.map((point) => `${point.x},${point.y}`).join(" L")}`;

  return (
    <Paper
      elevation={1}
      sx={{ p: 3, borderRadius: 1, border: "1px solid #e5e7eb", ...sx }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          gap: 2,
          flexWrap: "wrap",
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            {title}
          </Typography>
          {subtitle ? (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          ) : null}
        </Box>
        <Typography variant="body2" sx={{ color, fontWeight: 600 }}>
          +14% ce mois
        </Typography>
      </Box>

      <Box sx={{ mt: 3, width: "100%", overflow: "hidden" }}>
        <svg
          viewBox={`0 0 ${GRAPH_WIDTH} ${GRAPH_HEIGHT}`}
          width="100%"
          height="320"
          role="img"
          aria-label="Graphique de performance"
        >
          <defs>
            <linearGradient id="graphGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.25" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>

          <line
            x1={GRAPH_PADDING}
            y1={GRAPH_PADDING}
            x2={GRAPH_PADDING}
            y2={GRAPH_HEIGHT - GRAPH_PADDING}
            stroke="#e5e7eb"
            strokeWidth="1"
          />
          <line
            x1={GRAPH_PADDING}
            y1={GRAPH_HEIGHT - GRAPH_PADDING}
            x2={GRAPH_WIDTH - GRAPH_PADDING}
            y2={GRAPH_HEIGHT - GRAPH_PADDING}
            stroke="#e5e7eb"
            strokeWidth="1"
          />

          {[0, 1, 2, 3].map((tick) => {
            const y =
              GRAPH_PADDING + tick * ((GRAPH_HEIGHT - GRAPH_PADDING * 2) / 3);
            const value = Math.round(maxValue - (tick * range) / 3);
            return (
              <g key={`grid-${tick}`}>
                <line
                  x1={GRAPH_PADDING}
                  y1={y}
                  x2={GRAPH_WIDTH - GRAPH_PADDING}
                  y2={y}
                  stroke="#e5e7eb"
                  strokeWidth="1"
                  opacity={0.35}
                />
                <text
                  x={GRAPH_PADDING - 10}
                  y={y + 4}
                  textAnchor="end"
                  fontSize="12"
                  fill="#6b7280"
                >
                  {value}
                </text>
              </g>
            );
          })}

          <path
            d={linePath}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinejoin="round"
            strokeLinecap="round"
          />

          <path
            d={`${linePath} L${GRAPH_PADDING},${GRAPH_HEIGHT - GRAPH_PADDING} L${GRAPH_WIDTH - GRAPH_PADDING},${GRAPH_HEIGHT - GRAPH_PADDING} Z`}
            fill="url(#graphGradient)"
            opacity="0.7"
          />

          {points.map((point, index) => (
            <circle
              key={`point-${index}`}
              cx={point.x}
              cy={point.y}
              r="5"
              fill={color}
              stroke="#fff"
              strokeWidth="2"
            />
          ))}

          {points.map((point, index) => (
            <text
              key={`label-${index}`}
              x={point.x}
              y={GRAPH_HEIGHT - GRAPH_PADDING + 18}
              textAnchor="middle"
              fontSize="12"
              fill="#6b7280"
            >
              {xLabels[index]}
            </text>
          ))}
        </svg>
      </Box>
    </Paper>
  );
}
