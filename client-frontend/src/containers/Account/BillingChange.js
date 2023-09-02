import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import AccountSidebar from "./AccountSidebar";

function BillingChange(props) {
  const mockedData = {
    billingAddress: "billingAddress",
    billingPartyName: "billingPartyName",
    billingEmail: "",
    billingOfficePostalCode: "",
  };

  const [formData, setFormData] = useState(mockedData);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

  };

  // const theme = useTheme();
  // const tertiary = theme.palette.tertiary.main;
  // const primary = theme.palette.primary.main;
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
            Update Billing Information
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="left" justifyContent="left">

          <Grid item xs={6}>
            <TextField
              id="billingAddress"
              onChange={handleChange}
              name="billingAddress"
              placeholder=""
              label="Billing Address"
              value={formData.billingAddress}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="billingPartyName"
              onChange={handleChange}
              name="billingPartyName"
              placeholder=""
              label="Billing Party Name"
              value={formData.billingPartyName}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          Etc.
        </Grid>

        <Button
          sx={{ marginTop: "32px" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={true}
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default BillingChange;
