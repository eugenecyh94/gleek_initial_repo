import React from "react";
import NavBar from "./NavBar";
import { Box } from "@mui/material";

const Layout = ({ children }) => {
  return (
    <div>
      <NavBar />
      <Box>
        {/* Content will be rendered here */}
        {children}
      </Box>
    </div>
  );
};

export default Layout;
