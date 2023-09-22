import { Box } from "@mui/material";
import HomePageNavBar from "./navbar/HomePageNavBar";
import SideNavBar from "./navbar/SideNavBar";
import { useAdminStore } from "../zustand/GlobalStore";
import Grid from "@mui/material/Grid";

const Layout = ({ children }) => {
  const { authenticated, admin } = useAdminStore();
<<<<<<< HEAD
  const mainContentColumn = authenticated ? 9.5 : 12;
  const navBarColumn = authenticated ? 2.5 : 0;
  console.log(mainContentColumn);
  console.log(navBarColumn);
  return (
    <Box minHeight="100vh" flexDirection="column" display="flex">
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
          //   alignItems="flex-start"
          alignItems="center"
        >
          <Box flex={1}>{children}</Box>
        </Box>
      </Grid>
=======
  return authenticated ? (
    <Box sx={{ display: "flex" }}>
      <HomePageNavBar />
      <SideNavBar />
      <Box
        component="main"
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
        sx={{ flexGrow: 1, p: 3 }}
      >
        <Box flex={1}>{children}</Box>
      </Box>
    </Box>
  ) : (
    <Box minHeight="100vh" flexDirection="column" display="flex">
      <HomePageNavBar />
      <Box
        flex={1}
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Box flex={1} mt={8}>
          {children}
        </Box>
      </Box>
>>>>>>> develop
    </Box>
  );
};

export default Layout;
