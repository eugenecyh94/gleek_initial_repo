import { Box } from "@mui/material";
import HomePageNavBar from "./navbar/HomePageNavBar";
import SideNavBar from "./navbar/SideNavBar";
import { useAdminStore } from "../zustand/GlobalStore";
import Grid from "@mui/material/Grid";
import { useTheme } from "@mui/material/styles";
import { useState } from "react";

const Layout = ({ children }) => {
  const { authenticated, admin } = useAdminStore();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const marginLeft = authenticated && isSidebarOpen ? "240px" : "0px";
  const navBarColumn = authenticated ? 2.5 : 0;
  const theme = useTheme();
  const backgroundColor = theme.palette.backgroundColor.main;

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <Box
      bgcolor={backgroundColor}
      minHeight="100vh"
      flexDirection="column"
      display="flex"
    >
      <Grid xs={12}>
        <HomePageNavBar toggleSidebar={toggleSidebar} />
      </Grid>
      {authenticated && (
        <Grid xs={navBarColumn}>
          <SideNavBar isSidebarOpen={isSidebarOpen} />
        </Grid>
      )}
      <Box
        flex={1}
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="top"
        marginLeft={marginLeft}
      >
        <Box flex={1}>{children}</Box>
      </Box>
    </Box>
  );
};

export default Layout;
