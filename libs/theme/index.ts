import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#15803d",
    },
    background: {
      default: "#f8fafc",
    },
    text: {
      primary: "#55565B",
      secondary: "#232429",
    },
  },

  shape: {
    borderRadius: 16,
  },

  typography: {
    fontFamily: "Inter, sans-serif",
  },
});
