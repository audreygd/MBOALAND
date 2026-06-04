import { Stack, type StackProps } from "@mui/material";

export default function Row(props: StackProps) {
  return (
    <Stack {...props} sx={{ gap: 1, direction: "row", alignItems: "center" }}>
      {props.children}
    </Stack>
  );
}
