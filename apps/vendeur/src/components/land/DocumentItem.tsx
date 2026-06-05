import { Box, IconButton, Stack, Typography } from "@mui/material";
import { UserIcon } from "../../assets/icons";

interface DocumentItemProps {
  name: string;
  onView?: () => void;
  onDownload?: () => void;
}

const styles = {
  container: {
    p: 2,
    border: 1,
    borderColor: "divider",
    borderRadius: 2,
    bgcolor: "background.paper",
  },

  content: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 1.5,
  },

  fileName: {
    fontWeight: 500,
  },

  actions: {
    flexDirection: "row",
  },
};

export default function DocumentItem({
  name,
  onView,
  onDownload,
}: DocumentItemProps) {
  return (
    <Box sx={styles.container}>
      <Stack sx={styles.content}>
        <Stack sx={styles.left}>
          <UserIcon />

          <Typography sx={styles.fileName}>{name}</Typography>
        </Stack>

        <Stack sx={styles.actions}>
          <IconButton size="small" onClick={onView}>
            <UserIcon />
          </IconButton>

          <IconButton size="small" onClick={onDownload}>
            <UserIcon />
          </IconButton>
        </Stack>
      </Stack>
    </Box>
  );
}
