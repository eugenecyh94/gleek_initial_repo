import { createTheme } from "@mui/material/styles";

// Color palette: https://colorhunt.co/palette/ffdbc39f91cc5c4b993d246c
const theme = createTheme({
  palette: {
    primary: {
      main: "#9F91CC",
    },
    secondary: {
      main: "#5C4B99",
    },
    backgroundColor: {
      main: "#F5F5F5",
    },
    tertiary: {
      main: "#FFDBC3",
    },
    accent: {
      main: "#3D246C",
    },
  },
  typography: {
    fontFamily: "Fredoka",
  },
});

export default theme;
