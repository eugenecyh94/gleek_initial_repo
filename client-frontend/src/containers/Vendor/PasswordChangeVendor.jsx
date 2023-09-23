import React, { useState } from "react";
import { Box, TextField, Button, Typography, Grid } from "@mui/material";
import AccountSidebarVendor from "./AccountSidebarVendor";
import useVendorStore from "../../zustand/VendorStore";
import { validator } from "../../utils/VendorFieldsValidator";
import useSnackbarStore from "../../zustand/SnackbarStore";
function PasswordChangeVendor(props) {
  const { changePassword } = useVendorStore();
  const { openSnackbar } = useSnackbarStore();
  const mockedData = {
    oldPassword: "",
    newPassword: "",
  };
  const [formData, setFormData] = useState(mockedData);
  const [errorData, setErrorData] = useState({
    oldPassword: "",
    newPassword: "",
  });

  const disableButton = () => {
    return !Object.values(errorData).every((error) => error === "");
  };

  // When a field loses focus, validate the field.
  const handleValidate = (event) => {
    const { name, value } = event.target;
    const errors = validator(formData, name);
    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "", // Replace the error with an empty string if it's empty
    }));
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      for (const fieldName in formData) {
        let errors = validator(formData, fieldName);
        setErrorData((prevData) => ({
          ...prevData,
          [fieldName]: errors[fieldName] || "",
        }));
      }

      if (!Object.values(errorData).every((error) => error === "")) {
        openSnackbar(
          "There are errors in your password reset details.",
          "error",
        );
        return;
      }

      // Assuming changePassword is an asynchronous function
      const responseStatus = await changePassword(
        formData.oldPassword,
        formData.newPassword,
      );
      if (responseStatus) {
        openSnackbar("Password reset was successful!", "success");
      }
      // Handle success after changing the password
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
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
        <AccountSidebarVendor />
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
              id="oldPassword"
              onChange={handleChange}
              onBlur={handleValidate}
              name="oldPassword"
              placeholder=""
              label="Old Password"
              value={formData.oldPassword}
              disabled={false}
              sx={{ width: "100%" }}
              required
              helperText={errorData.oldPassword}
              error={errorData.oldPassword.length > 0}
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              id="newPassword"
              onChange={handleChange}
              onBlur={handleValidate}
              name="newPassword"
              placeholder=""
              label="New Password"
              value={formData.newPassword}
              disabled={false}
              sx={{ width: "100%" }}
              required
              helperText={errorData.newPassword}
              error={errorData.newPassword.length > 0}
            />
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "32px", width: "fit-content" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={disableButton()}
        >
          <Typography variant="body1">Reset</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default PasswordChangeVendor;
