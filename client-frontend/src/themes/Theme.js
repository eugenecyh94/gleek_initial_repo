import { createTheme } from "@mui/material/styles";

// Color palette: https://colorhunt.co/palette/ffdbc39f91cc5c4b993d246c
const theme = createTheme({
  palette: {
    primary: {
      main: "#9F91CC",
      light: "#B2A4D8",
      dark: "#8B7DBF",
    },
    secondary: {
      main: "#5C4B99",
    },
    backgroundColor: {
      main: "#FCFCFC",
    },
    tertiary: {
      main: "#FFDBC3",
    },
    accent: {
      main: "#3D246C",
    },
    grey: {
      50: "#FAFAFA",
      100: "#F5F5F5",
      200: "#EEEEEE",
      300: "#E0E0E0",
      400: "#BDBDBD",
      500: "#9E9E9E",
      600: "#757575",
      700: "#616161",
      800: "#424242",
      900: "#212121",
      A100: "#D5D5D5",
      A200: "#AAAAAA",
      A400: "#303030",
      A700: "#616161",
    },
    light_purple: {
      main: "#9F91CC",
    },
    dark_purple: {
      main: "#3D246C",
    },
    error: {
      main: "#D32F2F",
    },
    unselected: {
      main: "#919191",
    },
    success: {
      main: "#2e7d32",
    },
  },
  typography: {
    fontFamily: "Fredoka",
  },
});

export default theme;
