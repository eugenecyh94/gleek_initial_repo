import React from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AccountSidebar from "./AccountSidebar";

function AccountDetails(props) {
  const user = {
    name: "client.name",
    email: "client.email",
    phone: "client.phone",
    companyName: "client.companyName",
    companyAddress: "client.companyAddress",
  };

  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
      p={8}
      width={"100%"}
    >
      <Box width={"30%"}>
        <AccountSidebar />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        width={"100%"}
        p={6}
        flexWrap={"wrap"}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
          marginBottom={2}
        >
          <Typography color="secondary" variant="h4">
            Account Details
          </Typography>
        </Box>

        <Grid container spacing={2} alignItems="left" justifyContent="left">
          <Grid item xs={6}>
            <TextField
              id={user.name}
              name="name"
              placeholder="Name"
              label={"Name"}
              value={user.name}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id={user.email}
              name="email"
              placeholder="Email"
              label="Email"
              value={user.email}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "32px" }}
          mt={4}
          variant="contained"
          type="submit"
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default AccountDetails;
