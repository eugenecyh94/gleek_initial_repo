import { Box } from "@mui/material";
import HomePageNavBar from "./navbar/HomePageNavBar";
import SideNavBar from "./navbar/SideNavBar";
import { useAdminStore } from "../zustand/GlobalStore";

const Layout = ({ children }) => {
  const { authenticated, admin } = useAdminStore();
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
        <Box flex={1} mt={8}>
          {children}
        </Box>
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
    </Box>
  );
};

export default Layout;
