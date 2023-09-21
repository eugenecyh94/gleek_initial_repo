import React from "react";
import { Box, Typography, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const ErrorPage = (props) => {
  const navigate = useNavigate();
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Typography color="error">You do not access to this page</Typography>
      <Typography color="secondary" mt={8}>
        Try Login Instead
      </Typography>
      <Box mt={3}>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/login");
          }}
        >
          <Typography fontWeight={700} color="secondary" variant="body2">
            Login As Client
          </Typography>
        </Button>
        <Button
          variant="outlined"
          onClick={() => {
            navigate("/vendor/login");
          }}
          sx={{ marginLeft: "10px" }}
        >
          <Typography fontWeight={700} color="secondary" variant="body2">
            Login As Vendor
          </Typography>
        </Button>
      </Box>
    </Box>
  );
};

export default ErrorPage;
