import { createTheme } from "@mui/material/styles";

// Color palette: https://colorhunt.co/palette/fff3dadfccfbd0bfffbeadfa
const theme = createTheme({
  palette: {
    primary: {
      main: "#5C4B99",
    },
    secondary: {
      main: "#FFDBC3",
    },
    backgroundColor: {
      secondary: "#F5F5F5",
    },
    light_purple: {
      main: "#9F91CC",
    },
    dark_purple: {
      main: "#3D246C",
    },
    grey: {
      pale_grey: "#FAFAFA",
    },
    error: {
      main: "#D32F2F",
    },
    unselected: {
      main: "#919191",
    },
  },
  typography: {
    fontFamily: "Fredoka",
  },
});

export default theme;
