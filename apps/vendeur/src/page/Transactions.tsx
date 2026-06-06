/* eslint-disable @typescript-eslint/no-explicit-any */
import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Chip,
  Drawer,
  IconButton,
  MenuItem,
  Paper,
  Select,
  Stack,
  Step,
  StepContent,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";
import Row from "../components/Row";

type TransactionStatus = "EN_COURS" | "EN_ATTENTE" | "TERMINEE" | "ANNULEE";

type Transaction = {
  id: string;
  code: string;
  createdAt: string; // libellé date
  time: string; // 14:30
  terrainName: string;
  buyerName: string;
  amountFCFA: number;
  status: TransactionStatus;
  updatedAt: string;
  updatedTime: string;
};

const formatFCFA = (n: number) =>
  new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 0 }).format(n) +
  " FCFA";

const statusMeta: Record<
  TransactionStatus,
  { label: string; chipBg: string; chipColor: string; dotBg: string }
> = {
  EN_COURS: {
    label: "En cours",
    chipBg: "#E7F7EF",
    chipColor: "#1B7B3A",
    dotBg: "#0B6B3A",
  },
  EN_ATTENTE: {
    label: "En attente",
    chipBg: "#FFF1E7",
    chipColor: "#C55B12",
    dotBg: "#C55B12",
  },
  TERMINEE: {
    label: "Terminées",
    chipBg: "#EEF3FF",
    chipColor: "#2646C8",
    dotBg: "#2646C8",
  },
  ANNULEE: {
    label: "Annulées",
    chipBg: "#F6F0FF",
    chipColor: "#6A38C7",
    dotBg: "#6A38C7",
  },
};

const statCardSx = (bg: string, borderColor = "rgba(17, 24, 39, 0.06)") => ({
  p: 2.2,
  borderRadius: 1,
  border: "1px solid",
  borderColor,
  background: "#fff",
});

const iconBubbleSx = (bg: string, color: string) => ({
  width: 44,
  height: 44,
  borderRadius: "30%",
  display: "grid",
  placeItems: "center",
  background: bg,
  color,
  fontWeight: 600,
});

function StatusChip({ status }: { status: TransactionStatus }) {
  const meta = statusMeta[status];
  return (
    <Chip
      size="medium"
      label={meta.label}
      sx={{
        backgroundColor: meta.chipBg,
        color: meta.chipColor,
        fontWeight: 500,
        borderRadius: 1,
        height: 28,
      }}
    />
  );
}
const StatCard = ({
  title,
  value,
  subtitle,
  bubbleBg,
  bubbleColor,
  iconText,
}: {
  title: string;
  value: number;
  subtitle: string;
  bubbleBg: string;
  bubbleColor: string;
  iconText: string;
}) => (
  <Paper elevation={0} sx={statCardSx("transparent")}>
    <Row sx={{ gap: 2, alignItems: "center", direction: "row" }}>
      <Box sx={iconBubbleSx(bubbleBg, bubbleColor)}>{iconText}</Box>
      <Box sx={{ gap: 3 }}>
        <Typography sx={{ fontWeight: 600, fontSize: 14 }} color="text.primary">
          {title}
        </Typography>
        <Typography sx={{ fontWeight: 600, fontSize: 20, mt: 0.3 }}>
          {value}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.2 }}>
          {subtitle}
        </Typography>
      </Box>
    </Row>
  </Paper>
);

export default function TransactionsPage() {
  const transactions: Transaction[] = useMemo(
    () => [
      {
        id: "1",
        code: "TR-2024-0015",
        createdAt: "12 Mai 2024",
        time: "14:30",
        terrainName: "Terrain à Odza",
        buyerName: "Martin Kamga",
        amountFCFA: 12500000,
        status: "EN_COURS",
        updatedAt: "12 Mai 2024",
        updatedTime: "14:30",
      },
      {
        id: "2",
        code: "TR-2024-0014",
        createdAt: "10 Mai 2024",
        time: "11:15",
        terrainName: "Terrain à Mbankomo",
        buyerName: "Alice Nguimatsia",
        amountFCFA: 7500000,
        status: "EN_ATTENTE",
        updatedAt: "10 Mai 2024",
        updatedTime: "11:15",
      },
      {
        id: "3",
        code: "TR-2024-0014",
        createdAt: "08 Mai 2024",
        time: "16:45",
        terrainName: "Terrain à Kribi",
        buyerName: "Bernard Tchamda",
        amountFCFA: 22000000,
        status: "EN_COURS",
        updatedAt: "08 Mai 2024",
        updatedTime: "16:45",
      },
      {
        id: "4",
        code: "TR-2024-0012",
        createdAt: "02 Mai 2024",
        time: "09:20",
        terrainName: "Terrain à Bafoussam",
        buyerName: "Patricia Abega",
        amountFCFA: 6000000,
        status: "TERMINEE",
        updatedAt: "05 Mai 2024",
        updatedTime: "09:20",
      },
    ],
    [],
  );

  const [selected, setSelected] = useState<Transaction | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"ALL" | TransactionStatus>(
    "ALL",
  );
  const [terrainFilter, setTerrainFilter] = useState<string>("ALL");
  const [period, setPeriod] = useState<"ALL" | "7J" | "30J">("ALL");

  const terrains = useMemo(
    () => [
      "ALL",
      ...Array.from(new Set(transactions.map((t) => t.terrainName))),
    ],
    [transactions],
  );

  const filtered = useMemo(() => {
    return transactions.filter((t) => {
      const q = search.trim().toLowerCase();
      const matchesSearch =
        !q ||
        t.code.toLowerCase().includes(q) ||
        t.terrainName.toLowerCase().includes(q) ||
        t.buyerName.toLowerCase().includes(q);

      const matchesStatus =
        statusFilter === "ALL" ? true : t.status === statusFilter;
      const matchesTerrain =
        terrainFilter === "ALL" ? true : t.terrainName === terrainFilter;

      // period mock (tu peux brancher à une date réelle après)
      const matchesPeriod = period === "ALL" ? true : true;

      return matchesSearch && matchesStatus && matchesTerrain && matchesPeriod;
    });
  }, [transactions, search, statusFilter, terrainFilter, period]);

  const stats = useMemo(() => {
    const countBy = (s: TransactionStatus) =>
      transactions.filter((t) => t.status === s).length;
    return {
      enCours: countBy("EN_COURS"),
      enAttente: countBy("EN_ATTENTE"),
      terminees: countBy("TERMINEE"),
      annulees: countBy("ANNULEE"),
    };
  }, [transactions]);

  const steps = [
    {
      label: "Offre acceptée",
      date: selected?.createdAt,
    },
    {
      label: "Vérification géomètre",
      date: "14 Mai 2024",
    },
    {
      label: "Vérification notaire",
      date: "En cours",
    },
    {
      label: "Signature compromis",
      date: "À venir",
    },
    {
      label: "Paiement",
      date: "À venir",
    },
    {
      label: "Vente finalisée",
      date: "À venir",
    },
  ];

  const activeStep =
    selected?.status === "TERMINEE"
      ? 5
      : selected?.status === "EN_COURS"
        ? 2
        : selected?.status === "ANNULEE"
          ? 0
          : 0;

  const statusToStep = {
    OFFRE_ACCEPTEE: 0,
    VERIFICATION_GEOMETRE: 1,
    VERIFICATION_NOTAIRE: 2,
    SIGNATURE_COMPROMIS: 3,
    PAIEMENT: 4,
    TERMINEE: 5,
    EN_ATTENTE: 2,
    EN_COURS: 2,
    ANNULEE: 0,
  };
  const currentStep = selected ? (statusToStep[selected.status] ?? 0) : 0;
  // const currentStep =
  //   selected?.status === "TERMINEE"
  //     ? 5
  //     : selected?.status === "EN_COURS"
  //       ? 2
  //       : selected?.status === "ANNULEE"
  //         ? 0
  //         : 0;

  <Stepper
    activeStep={activeStep}
    orientation="vertical"
    sx={{
      "& .MuiStepLabel-label": {
        fontSize: 16,
        fontWeight: 600,
      },
      "& .MuiStepIcon-root.Mui-active": {
        color: "#0B6B3A",
      },
      "& .MuiStepIcon-root.Mui-completed": {
        color: "#0B6B3A",
      },
    }}
  >
    {steps.map((step) => (
      <Step key={step.label}>
        <StepLabel>{step.label}</StepLabel>

        <StepContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            {step.date}
          </Typography>
        </StepContent>
      </Step>
    ))}
  </Stepper>;

  return (
    <Box sx={{ p: { xs: 2, md: 3 }, pt: { xs: 2, md: 3 } }}>
      {/* Header page */}
      <Box sx={{ mb: 2.5 }}>
        <Typography
          variant="h4"
          sx={{ fontSize: { xs: 26, md: 30 }, fontWeight: 600 }}
        >
          Transactions
        </Typography>
        <Typography
          variant="body1"
          color="text.secondary"
          sx={{ mt: 0.5, maxWidth: 720 }}
        >
          Suivez l&apos;avancement de toutes vos transactions en cours et
          terminées.
        </Typography>
      </Box>

      {/* Stat cards */}
      <Row
        sx={{
          gap: 4,
          py: 3,
          px: 0,
          flex: 1,
          width: "100%",
          position: "sticky",
        }}
        direction={"row"}
      >
        <Box sx={{ flex: 1 }}>
          <StatCard
            title="En cours"
            value={stats.enCours}
            subtitle="Transactions actives"
            bubbleBg="#EAF8F0"
            bubbleColor="#1B7B3A"
            iconText="🔔"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          {" "}
          <StatCard
            title="En attente"
            value={stats.enAttente}
            subtitle="En attente d'action"
            bubbleBg="#FFF2E5"
            bubbleColor="#C55B12"
            iconText="⏳"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          {" "}
          <StatCard
            title="Terminées"
            value={stats.terminees}
            subtitle="Transactions finalisées"
            bubbleBg="#EEF3FF"
            bubbleColor="#2646C8"
            iconText="📨"
          />
        </Box>
        <Box sx={{ flex: 1 }}>
          {" "}
          <StatCard
            title="Annulées"
            value={stats.annulees}
            subtitle="Transactions annulées"
            bubbleBg="#F6F0FF"
            bubbleColor="#6A38C7"
            iconText="✖️"
          />
        </Box>
      </Row>

      {/* Filters */}
      <Paper
        elevation={0}
        sx={{
          p: 3,
          borderRadius: 0.6,
          border: "1px solid",
          borderColor: "rgba(17, 24, 39, 0.06)",
          mb: 2.2,
        }}
      >
        <Row
          sx={{
            direction: "row",
            spacing: 4,
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Row
            sx={{
              direction: "row",
              spacing: 2,
            }}
          >
            <TextField
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une transaction..."
              fullWidth
              size="small"
              sx={{ maxWidth: 420 }}
            />

            <Select
              size="small"
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              sx={{ minWidth: 160, bgcolor: "#fff" }}
            >
              <MenuItem value="ALL">Statut</MenuItem>
              <MenuItem value="EN_COURS">En cours</MenuItem>
              <MenuItem value="EN_ATTENTE">En attente</MenuItem>
              <MenuItem value="TERMINEE">Terminées</MenuItem>
              <MenuItem value="ANNULEE">Annulées</MenuItem>
            </Select>

            <Select
              size="small"
              value={terrainFilter}
              onChange={(e) => setTerrainFilter(e.target.value)}
              sx={{ minWidth: 180, bgcolor: "#fff" }}
            >
              {terrains.map((t) => (
                <MenuItem key={t} value={t}>
                  {t === "ALL" ? "Terrain" : t}
                </MenuItem>
              ))}
            </Select>

            <Select
              size="small"
              value={period}
              onChange={(e) => setPeriod(e.target.value as any)}
              sx={{ minWidth: 150, bgcolor: "#fff" }}
            >
              <MenuItem value="ALL">Période</MenuItem>
              <MenuItem value="7J">7 jours</MenuItem>
              <MenuItem value="30J">30 jours</MenuItem>
            </Select>
          </Row>

          <Button
            variant="contained"
            startIcon={<DownloadOutlinedIcon />}
            sx={{
              borderRadius: 1,
              bgcolor: "#0B6B3A",
              "&:hover": { bgcolor: "#095a2e" },
              justifyContent: "flex-end",
            }}
          >
            Exporter
          </Button>
        </Row>
      </Paper>

      {/* Table */}
      <Paper
        elevation={0}
        sx={{
          p: 0,
          borderRadius: 0.6,
          border: "1px solid",
          borderColor: "rgba(17, 24, 39, 0.06)",
          overflow: "hidden",
        }}
      >
        {/* Head */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: "1.1fr 1.1fr 1.1fr 0.7fr 0.8fr 1fr",
            gap: 1,
            px: 2,
            py: 1.2,
            background:
              "linear-gradient(180deg, rgba(17, 24, 39, 0.02), rgba(17, 24, 39, 0))",
          }}
        >
          {[
            "Transaction",
            "Terrain",
            "Acheteur",
            "Montant",
            "Statut",
            "Dernière mise à jour",
          ].map((h) => (
            <Typography
              key={h}
              variant="body2"
              sx={{ fontWeight: 700, color: "#55565B", fontSize: 18 }}
            >
              {h}
            </Typography>
          ))}
        </Box>

        {/* Body */}
        <Box>
          {filtered.map((t) => (
            <Box
              key={t.id}
              onClick={() => setSelected(t)}
              sx={{
                cursor: "pointer",
                display: "grid",
                gridTemplateColumns: "1.1fr 1.1fr 1.1fr 0.7fr 0.8fr 1fr",
                gap: 1,
                px: 2,
                py: 1.6,
                borderTop: "1px solid rgba(17, 24, 39, 0.06)",
                transition: "background-color 150ms",
                "&:hover": { backgroundColor: "rgba(11, 107, 58, 0.03)" },
              }}
            >
              {/* Transaction */}
              <Box>
                <Typography
                  sx={{ fontSize: 16, fontWeight: 600 }}
                  color="text.primary"
                >
                  {t.code}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {t.createdAt}
                </Typography>
              </Box>

              {/* Terrain */}
              <Box>
                <Typography
                  sx={{ fontSize: 16, fontWeight: 500 }}
                  color="text.primary"
                >
                  {t.terrainName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  1000 m² - Yaoundé
                </Typography>
              </Box>

              {/* Acheteur */}
              <Box>
                <Typography
                  sx={{ fontSize: 16, fontWeight: 500 }}
                  color="text.primary"
                >
                  {t.buyerName}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  +237 ...
                </Typography>
              </Box>

              {/* Montant */}
              <Box>
                <Typography
                  sx={{ fontSize: 16, fontWeight: 600 }}
                  color="text.primary"
                >
                  {formatFCFA(t.amountFCFA)}
                </Typography>
              </Box>

              {/* Statut */}
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <StatusChip status={t.status} />
              </Box>

              {/* Dernière mise à jour + actions */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "space-between",
                }}
              >
                <Box>
                  <Typography variant="body2" color="text.secondary">
                    {t.updatedAt}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ fontWeight: 600, color: "#232429" }}
                  >
                    {t.updatedTime}
                  </Typography>
                </Box>

                <Stack
                  sx={{ direction: "row", spacing: 0.5, alignItems: "center" }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <Button
                    size="small"
                    onClick={() => setSelected(t)}
                    sx={{ borderRadius: 0.6 }}
                    variant="outlined"
                  >
                    Voir
                  </Button>
                </Stack>
              </Box>
            </Box>
          ))}

          {filtered.length === 0 && (
            <Box sx={{ p: 4 }}>
              <Typography color="text.secondary">
                Aucune transaction ne correspond aux filtres.
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* Drawer Détails */}
      <Drawer
        anchor="right"
        open={Boolean(selected)}
        onClose={() => setSelected(null)}
        sx={{
          "& .MuiDrawer-paper": {
            width: 600,
            p: 2,
          },
        }}
      >
        <Row
          sx={{
            mb: 2,
            direction: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography variant="h6" sx={{ fontSize: 18, fontWeight: 600 }}>
            Détails de la transaction
          </Typography>
          <IconButton
            onClick={() => setSelected(null)}
            sx={{ borderRadius: 1 }}
          >
            <CloseIcon />
          </IconButton>
        </Row>

        {selected ? (
          <Box sx={{ overflowY: "auto", pr: 1 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2,
                borderRadius: 1,
                borderColor: "rgba(17, 24, 39, 0.10)",
              }}
            >
              <Row
                sx={{
                  m: 4,
                  direction: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <StatusChip status={selected.status} />
                <Typography sx={{ fontWeight: 600 }}>
                  {selected.code}
                </Typography>
              </Row>

              {/* Résumé */}
              <Typography sx={{ fontWeight: 600, mb: 1.2 }}>Résumé</Typography>

              <Stack
                sx={{
                  mb: 2,
                  direction: "row",
                  gap: 2,
                  p: 2,
                  border: "1px solid grey",
                  borderRadius: 0.5,
                }}
              >
                <Row sx={{ flex: 1, justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Terrain
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selected.terrainName}
                  </Typography>
                </Row>
                <Row sx={{ flex: 1, justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Acheteur
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selected.buyerName}
                  </Typography>
                </Row>
                <Row sx={{ flex: 1, justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Montant
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {formatFCFA(selected.amountFCFA)}
                  </Typography>
                </Row>
                <Row sx={{ flex: 1, justifyContent: "space-between" }}>
                  <Typography variant="body2" color="text.secondary">
                    Date de création
                  </Typography>
                  <Typography sx={{ fontWeight: 600 }}>
                    {selected.createdAt}
                  </Typography>
                </Row>
              </Stack>

              {/* Étapes */}
              <Typography sx={{ fontWeight: 600, my: 4 }}>
                Étapes de la transaction
              </Typography>
              <Stepper orientation="vertical" activeStep={-1}>
                {steps.map((step, index) => (
                  <Step
                    key={step.label}
                    active={index === currentStep}
                    completed={index < currentStep}
                  >
                    <StepLabel>{step.label}</StepLabel>

                    <StepContent>
                      <Typography variant="body2" color="text.secondary">
                        {step.date}
                      </Typography>
                    </StepContent>
                  </Step>
                ))}
              </Stepper>

              <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
                <Button
                  variant="outlined"
                  sx={{
                    flex: 1,
                    borderRadius: 0.6,
                    borderColor: "red",
                    color: "red",
                    textTransform: "none",
                    fontSize: 16,
                  }}
                >
                  Annuler
                </Button>
                <Button
                  variant="contained"
                  sx={{
                    flex: 1,
                    bgcolor: "#0B6B3A",
                    borderRadius: 0.6,

                    textTransform: "none",
                    fontSize: 16,
                    "&:hover": { bgcolor: "#095a2e" },
                  }}
                >
                  Contacter l'acheteur
                </Button>
              </Stack>
            </Paper>
          </Box>
        ) : (
          <Typography color="text.secondary">
            Sélectionnez une transaction pour voir ses détails.
          </Typography>
        )}
      </Drawer>
    </Box>
  );
}
