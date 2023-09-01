import React from "react";
import NavBar from "./NavBar";
import { Box } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "./Footer";

const Layout = ({ children }) => {
  const theme = useTheme();
  const backgroundColor = theme.palette.backgroundColor.main;
  return (
    <Box
      bgcolor={backgroundColor}
      minHeight="100vh"
      flexDirection="column"
      display="flex"
    >
      <NavBar />
      <Box flex={1}>
        {/* Content will be rendered here */}
        {children}
      </Box>
      <Footer />
    </Box>
  );
};

export default Layout;
