import { Box, Button, Typography } from "@mui/material";
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
      <Box>
        <Button variant="outlined" href="/vendor/blockout/create/mass">
          Apply Blockouts to Multiple Activities
        </Button>
        <Typography color="primary" variant="h5">
          Manage Blockouts for Activity
        </Typography>
      </Box>
    </Box>
  );
}

export default BlockoutDashboard;
