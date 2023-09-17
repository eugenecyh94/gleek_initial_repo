import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import AccountSidebar from "./AccountSidebar";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";

function AccountDetails(props) {
  const { client, updateAccount, clientError } = useClientStore();
  const { openSnackbar, closeSnackbar } = useSnackbarStore();
  const [formData, setFormData] = useState(client);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // const errors = validator(formData, name)
    // setErrorData((prevData) => ({
    //   ...prevData,
    //   [name]: errors[name] || "", // Replace the error with an empty string if it's empty
    // }))
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const responseStatus = await updateAccount(formData);

    if (responseStatus) {
      openSnackbar("Profile updated successfully!", "success");
    } else {
      const error =
        clientError?.response?.data?.errors?.[0]?.msg ||
        clientError?.response?.data ||
        null;

      openSnackbar(error, "error");
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="top"
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
          <Grid item xs={12}>
            <Typography color="primary" variant="h7">
              User Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="name"
              onChange={handleChange}
              name="name"
              placeholder="Name"
              label="Name"
              value={formData.name}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="email"
              onChange={handleChange}
              name="email"
              placeholder="Email"
              label="Email"
              value={formData.email}
              disabled={true}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="jobTitle"
              name="jobTitle"
              placeholder="Job Title"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="team"
              name="team"
              placeholder="Team"
              label="Team"
              value={formData.team}
              onChange={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary" variant="h7">
              Company Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="companyName"
              name="companyName"
              placeholder="Company Name"
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="officePostalCode"
              required
              name="officePostalCode"
              placeholder="Office Postal Code"
              label="Office Postal Code"
              value={formData.officePostalCode}
              onChange={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              multiline
              id="officeAddress"
              name="officeAddress"
              placeholder="Office Address"
              label="Office Address"
              value={formData.officeAddress}
              onChange={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary" variant="h7">
              Billing Information
            </Typography>
          </Grid>
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
          <Grid item xs={6}>
            <TextField
              id="billingOfficePostalCode"
              onChange={handleChange}
              name="billingOfficePostalCode"
              placeholder=""
              label="Billing Office Postal Code"
              value={formData.billingOfficePostalCode}
              disabled={false}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="billingEmail"
              onChange={handleChange}
              name="billingEmail"
              placeholder="Billing Email"
              label="Billing Email"
              value={formData.billingEmail}
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
          onClick={handleSubmit}
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default AccountDetails;
