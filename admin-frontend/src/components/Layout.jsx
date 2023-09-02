import { Box } from "@mui/material";
import HomePageNavBar from "./navbar/HomePageNavBar";
import SideNavBar from "./navbar/SideNavBar";

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <HomePageNavBar />
      <SideNavBar />
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <div style={{ flexGrow: 1 }}>{children}</div>
      </Box>
    </Box>
  );
};

export default Layout;
