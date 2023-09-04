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
      <Footer />
    </Box>
  );
};

export default Layout;
