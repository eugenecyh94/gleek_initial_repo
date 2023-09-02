import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import AccountSidebar from "./AccountSidebar";

function PasswordChange(props) {
  const mockedData = {
    oldPassword: "",
    newPassword: "",
  };

  const [formData, setFormData] = useState(mockedData);

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

  const isFormValid =
    formData.oldPassword.trim() !== "" && formData.newPassword.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

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
        width="100%"
        p={6}
        flexWrap="wrap"
        component="form"
        noValidate
        onSubmit={handleSubmit}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
          marginBottom={2}
        >
          <Typography color="secondary" variant="h4">
            Password Settings
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="left" justifyContent="left">
          <Grid item xs={12}>
            <Typography color="primary" variant="h7">
              Change Password
            </Typography>
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={!formData.oldPassword.trim()}
              id="oldPassword"
              onChange={handleChange}
              name="oldPassword"
              placeholder=""
              label="Old Password"
              value={formData.oldPassword}
              disabled={false}
              sx={{ width: "100%" }}
              required
              helperText={
                formData.oldPassword.trim() ? "" : "Old Password is required"
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={!formData.newPassword.trim()}
              id="newPassword"
              onChange={handleChange}
              name="newPassword"
              placeholder=""
              label="New Password"
              value={formData.newPassword}
              disabled={false}
              sx={{ width: "100%" }}
              required
              helperText={
                formData.newPassword.trim() ? "" : "New Password is required"
              }
            />
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "32px", width: "fit-content" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={!isFormValid}
        >
          <Typography variant="body1">Reset</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default PasswordChange;
