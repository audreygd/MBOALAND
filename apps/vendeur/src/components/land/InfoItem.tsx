import { Stack, Typography } from "@mui/material";

interface InfoItemProps {
  label: string;
  value: React.ReactNode;
}

const styles = {
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    py: 1,
  },

  label: {
    color: "text.secondary",
    fontWeight: 500,
  },

  value: {
    fontWeight: 600,
    textAlign: "right",
  },
};

export default function InfoItem({ label, value }: InfoItemProps) {
  return (
    <Stack sx={styles.container}>
      <Typography sx={styles.label}>{label}</Typography>

      <Typography sx={styles.value}>{value}</Typography>
    </Stack>
  );
}
