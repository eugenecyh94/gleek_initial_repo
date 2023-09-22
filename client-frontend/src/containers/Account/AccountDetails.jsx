import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid, Alert } from "@mui/material";
import AccountSidebar from "./AccountSidebar";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import { validator } from "../../utils/ClientFieldsValidator";

function AccountDetails(props) {
  const { client, updateAccount, clientError } = useClientStore();
  const { openSnackbar, closeSnackbar } = useSnackbarStore();
  const [formData, setFormData] = useState(client);
  const [errorData, setErrorData] = useState({
    password: "",
    email: "",
    name: "",
    jobTitle: "",
    team: "",
    companyName: "",
    officeAddress: "",
    billingAddress: "",
    billingPartyName: "",
    billingEmail: "",
    officePostalCode: "",
    billingOfficePostalCode: "",
    phoneNumber: "",
    passwordVerify: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const errors = validator(formData, name);

    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseStatus = await updateAccount(formData);

      responseStatus &&
        openSnackbar("Profile updated successfully!", "success");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };

  useEffect(() => {
    console.log(client);
  }, []);

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
              required
              id="name"
              onChange={handleChange}
              onBlur={handleChange}
              name="name"
              placeholder="Name"
              label="Name"
              value={formData.name}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.name}
              error={!!errorData.name}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="email"
              onChange={handleChange}
              onBlur={handleChange}
              name="email"
              placeholder="Email"
              label="Email"
              value={formData.email}
              disabled={true}
              sx={{ width: "100%" }}
              helperText={errorData.email}
              error={!!errorData.email}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="phoneNumber"
              name="phoneNumber"
              placeholder="Phone Number"
              label="Phone Number"
              value={formData.phoneNumber}
              onChange={handleChange}
              onBlur={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.phoneNumber}
              error={!!errorData.phoneNumber}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="jobTitle"
              name="jobTitle"
              placeholder="Job Title"
              label="Job Title"
              value={formData.jobTitle}
              onChange={handleChange}
              onBlur={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.jobTitle}
              error={!!errorData.jobTitle}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="team"
              name="team"
              placeholder="Team"
              label="Team"
              value={formData.team}
              onChange={handleChange}
              onBlur={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.team}
              error={!!errorData.team}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary" variant="h7">
              Company Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="companyName"
              name="companyName"
              placeholder="Company Name"
              label="Company Name"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.companyName}
              error={!!errorData.companyName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="officePostalCode"
              name="officePostalCode"
              placeholder="Office Postal Code"
              label="Office Postal Code"
              value={formData.officePostalCode}
              onChange={handleChange}
              onBlur={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.officePostalCode}
              error={!!errorData.officePostalCode}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              required
              multiline
              id="officeAddress"
              name="officeAddress"
              placeholder="Office Address"
              label="Office Address"
              value={formData.officeAddress}
              onChange={handleChange}
              onBlur={handleChange}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.officeAddress}
              error={!!errorData.officeAddress}
            />
          </Grid>
          <Grid item xs={12}>
            <Typography color="primary" variant="h7">
              Billing Information
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="billingAddress"
              onChange={handleChange}
              onBlur={handleChange}
              name="billingAddress"
              placeholder=""
              label="Billing Address"
              value={formData.billingAddress}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.billingAddress}
              error={!!errorData.billingAddress}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="billingPartyName"
              onChange={handleChange}
              onBlur={handleChange}
              name="billingPartyName"
              placeholder=""
              label="Billing Party Name"
              value={formData.billingPartyName}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.billingPartyName}
              error={!!errorData.billingPartyName}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="billingOfficePostalCode"
              onChange={handleChange}
              onBlur={handleChange}
              name="billingOfficePostalCode"
              placeholder=""
              label="Billing Office Postal Code"
              value={formData.billingOfficePostalCode}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.billingOfficePostalCode}
              error={!!errorData.billingOfficePostalCode}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              required
              id="billingEmail"
              onChange={handleChange}
              onBlur={handleChange}
              name="billingEmail"
              placeholder="Billing Email"
              label="Billing Email"
              value={formData.billingEmail}
              disabled={false}
              sx={{ width: "100%" }}
              helperText={errorData.billingEmail}
              error={!!errorData.billingEmail}
            />
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "32px" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={!Object.values(errorData).every((error) => error === "")}
          onClick={handleSubmit}
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default AccountDetails;
