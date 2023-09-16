import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import AccountSidebar from "./AccountSidebar";
import useClientStore from "../../zustand/ClientStore";

function PasswordChange(props) {
  const { changePassword } = useClientStore();
  const mockedData = {
    oldPassword: "",
    newPassword: "",
  };
  const [formData, setFormData] = useState(mockedData);
  const [errorData, setErrorData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    const newErrorData = { ...errorData };

    //validatePassword(value, newErrorData, name);

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    setErrorData(newErrorData);
  };

  const isFormValid =
    formData.oldPassword.trim() !== "" && formData.newPassword.trim() !== "";

  const handleSubmit = (e) => {
    e.preventDefault();
    changePassword(formData.oldPassword, formData.newPassword);
  };

  const validatePassword = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*/;
      let result = re.test(String(data));
      if (!result) {
        errors[fieldName] =
          "New password must contain at least one lower case letter, one upper case letter, number and special character.";
        result = false;
      } else if (data.length < 8) {
        errors[fieldName] = "Your password has less than 8 characters.";
        result = false;
      } else {
        // Valid password
        errors[fieldName] = "";
      }
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
              error={formData.oldPassword.trim() === ""}
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
                formData.oldPassword.trim() === ""
                  ? "Old Password is required"
                  : ""
              }
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              error={Boolean(errorData.newPassword)}
              id="newPassword"
              onChange={handleChange}
              name="newPassword"
              placeholder=""
              label="New Password"
              value={formData.newPassword}
              disabled={false}
              sx={{ width: "100%" }}
              required
              helperText={errorData.newPassword}
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