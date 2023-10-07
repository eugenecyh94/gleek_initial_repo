import { Box, Typography } from "@mui/material";
import React from "react";

function BlockoutDashboard() {
  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="left"
      p={5}
      width={"100%"}
    >
      <Typography color="secondary" variant="h3">
        Manage Blockout Timings
      </Typography>
    </Box>
  );
}

export default BlockoutDashboard;
