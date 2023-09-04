import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import AccountSidebar from "./AccountSidebar";

function AccountDetails(props) {
  const user = {
    email: "email@email.com",
    name: "name",
    jobTitle: "job",
    team: "team",
    companyName: "company name",
    officeAddress: "office address",
    billingAddress: "",
    billingPartyName: "",
    billingEmail: "",
    billingOfficePostalCode: "",
    officePostalCode: "123456",

    phoneNumber: "12311231",
    passwordVerify: "",
  };

  const [formData, setFormData] = useState(user);

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
              disabled={false}
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
        </Grid>
        Update when client model is confirmed.
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

export default AccountDetails;
