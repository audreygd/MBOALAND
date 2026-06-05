import { Stack, type StackProps } from "@mui/material";

export default function Row({ sx, children, ...props }: StackProps) {
  const mergedSx = sx
    ? Array.isArray(sx)
      ? [{ gap: 1 }, ...sx]
      : [{ gap: 1 }, sx]
    : [{ gap: 1 }];

  return (
    <Stack {...props} direction="row" sx={mergedSx}>
      {children}
    </Stack>
  );
}
