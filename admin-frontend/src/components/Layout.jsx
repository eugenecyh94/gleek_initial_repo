import { Box } from "@mui/material";
import HomePageNavBar from "./navbar/HomePageNavBar";
import SideNavBar from "./navbar/SideNavBar";
import { useAdminStore } from "../zustand/GlobalStore";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";

const Layout = ({ children }) => {
  const { authenticated, admin } = useAdminStore();
  const mainContentColumn = authenticated ? 9.5 : 12;
  const navBarColumn = authenticated ? 2.5 : 0;
  const theme = useTheme();
  const backgroundColor = theme.palette.backgroundColor.main;

  return (
    <Box bgcolor={backgroundColor} minHeight="100vh" flexDirection="column" display="flex">
      <Grid xs={12}>
        <HomePageNavBar />
      </Grid>
      {authenticated && (
        <Grid xs={navBarColumn}>
          <SideNavBar />
        </Grid>
      )}
      <Grid xs={mainContentColumn}>
        <Box
          flex={1}
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
          alignItems="center"
        >
          <Box flex={1}>{children}</Box>
        </Box>
      </Grid>
    </Box>
  );
};

export default Layout;
