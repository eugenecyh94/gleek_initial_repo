import React from "react";
import NavBar from "./NavBar";
import { Alert, Box, Snackbar } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Footer from "./Footer";
import useSnackbarStore from "../zustand/SnackbarStore";

const CustomSnackbar = () => {
  const { isOpen, message, type, closeSnackbar } = useSnackbarStore();

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    closeSnackbar();
  };

  return (
    <>
      {isOpen && (
        <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
          <Alert onClose={handleClose} severity={type} sx={{ width: "100%" }}>
            {message}
          </Alert>
        </Snackbar>
      )}
    </>
  );
};

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
     <CustomSnackbar/>
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
