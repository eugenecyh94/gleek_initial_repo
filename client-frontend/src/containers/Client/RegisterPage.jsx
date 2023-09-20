import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  InputAdornment,
  IconButton,
  FormControl,
  InputLabel,
  OutlinedInput,
  FormHelperText,
  Snackbar,
  Alert,
  Grid,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import registerImage from "../../assets/register.png";
import { validator } from "../../utils/ClientFieldsValidator";
import TermsAndConditionsModal from "../../components/Modals/TermsAndConditionsModal";

const RegisterPage = () => {
  // themes
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;
  // states
  // user input
  const [showPassword, setShowPassword] = useState(false);
  const { isLoading, clientError, register } = useClientStore();
  const { openSnackbar } = useSnackbarStore();
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
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
    // Client consent
    acceptTermsAndConditions: false,
  });

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

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  // functions
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordVerify = () =>
    setShowPasswordVerify((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
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

  const handleAcceptTermsChange = (event) => {
    const { checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      acceptTermsAndConditions: checked,
    }));
  };

  const disableButton = () => {
    return (
      !Object.values(errorData).every((error) => error === "") ||
      !formData.acceptTermsAndConditions
    );
  };

  const handleSubmit = async (event) => {
    "";
    event.preventDefault();
    for (const fieldName in formData) {
      let errors = validator(formData, fieldName);
      setErrorData((prevData) => ({
        ...prevData,
        [fieldName]: errors[fieldName] || "",
      }));
    }
    if (!Object.values(errorData).every((error) => error === "")) {
      openSnackbar("There are errors in your registration details.", "error");
      return;
    }
    try {
      const responseStatus = await register(formData);

      if (responseStatus) {
        openSnackbar("Register was successful!", "success");
        navigate("/");
      }
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
      alignItems="center"
      height="90vh"
    >
      <Box
        display="flex"
        component="form"
        flexDirection="column"
        p={4}
        bgcolor={"grey.50"}
        borderRadius={10}
        sx={{ minWidth: "25rem", width: "50%" }}
        alignItems="center"
        boxShadow={1}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={3}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="50px"
            height="50px"
            bgcolor={primary}
            borderRadius="50%"
          >
            <LockPersonIcon fontSize="large" color="accent" />
          </Box>
          <Typography color="secondary" variant="h3">
            Register as a Client
          </Typography>
        </Box>

        <Grid container spacing={3}>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoFocus
              autoComplete="on"
              id="name"
              required
              name="name"
              placeholder="Name"
              onChange={handleChange}
              onBlur={handleValidate}
              label="Name"
              helperText={errorData.name}
              error={errorData.name.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="email"
              required
              name="email"
              placeholder="Email"
              label="Email"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.email}
              error={errorData.email.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="phoneNumber"
              required
              name="phoneNumber"
              placeholder="Phone Number"
              label="Phone Number"
              defaultValue="65"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.phoneNumber}
              error={errorData.phoneNumber.length > 0}
            />
          </Grid>
          {/* Add the rest of the fields here */}
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="jobTitle"
              required
              name="jobTitle"
              placeholder="Job Title"
              label="Job Title"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.jobTitle}
              error={errorData.jobTitle.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              required
              id="team"
              name="team"
              placeholder="Team"
              label="Team"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.team}
              error={errorData.team.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="companyName"
              required
              name="companyName"
              placeholder="Company Name"
              label="Company Name"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.companyName}
              error={errorData.companyName.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              multiline
              autoComplete="on"
              id="officeAddress"
              required
              name="officeAddress"
              placeholder="Office Address"
              label="Office Address"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.officeAddress}
              error={errorData.officeAddress.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="officePostalCode"
              required
              name="officePostalCode"
              placeholder="Office Postal Code"
              label="Office Postal Code"
              value={formData.officePostalCode}
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.officePostalCode}
              error={errorData.officePostalCode.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="billingEmail"
              required
              name="billingEmail"
              placeholder="Billing Email"
              label="Billing Email"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.billingEmail}
              error={errorData.billingEmail.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="billingOfficePostalCode"
              required
              name="billingOfficePostalCode"
              placeholder="Billing Office Postal Code"
              label="Billing Office Postal Code"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.billingOfficePostalCode}
              error={errorData.billingOfficePostalCode.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="billingPartyName"
              required
              name="billingPartyName"
              placeholder="Billing Party Name"
              label="Billing Party Name"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.billingPartyName}
              error={errorData.billingPartyName.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              multiline
              autoComplete="on"
              id="billingAddress"
              required
              name="billingAddress"
              placeholder="Billing Address"
              label="Billing Address"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.billingAddress}
              error={errorData.billingAddress.length > 0}
            />
          </Grid>

          {/* Password Field */}
          <Grid item xs={12} md={6}>
            <FormControl
              size="small"
              required
              variant="outlined"
              sx={{ width: "100%" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                onChange={handleChange}
                onBlur={handleValidate}
                value={formData.password}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {errorData.password.length > 0 && (
                <FormHelperText error id="my-helper-text">
                  {errorData.password}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>

          {/* Confirm Password Field */}
          <Grid item xs={12} md={6}>
            <FormControl
              size="small"
              required
              variant="outlined"
              sx={{ width: "100%" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Confirm your password
              </InputLabel>
              <OutlinedInput
                id="passwordVerify"
                name="passwordVerify"
                onChange={handleChange}
                onBlur={handleValidate}
                value={formData.passwordVerify}
                type={showPasswordVerify ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordVerify}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPasswordVerify ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm your password"
              />
              {errorData.passwordVerify.length > 0 && (
                <FormHelperText error id="my-helper-text">
                  {errorData.passwordVerify}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          <Grid item xs={12} md={12}>
            <Box display="flex" flexDirection="row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTermsAndConditions}
                    onChange={handleAcceptTermsChange} // Update formData.acceptTermsAndConditions
                    name="acceptTermsAndConditions"
                    color="primary"
                  />
                }
                label="I agree to the Terms & Conditions of Gleek."
              />

              <Button width="5rem" onClick={handleOpen}>
                Open T&C
              </Button>
              <TermsAndConditionsModal open={open} handleClose={handleClose} />
            </Box>
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "24px" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={disableButton()}
          onClick={handleSubmit}
        >
          <Typography variant="body1">Register</Typography>
        </Button>
        <Button
          sx={{ marginTop: "16px" }}
          variant="text"
          onClick={() => {
            navigate("/login");
          }}
        >
          <Typography fontWeight={700} color="secondary" variant="body2">
            Already a Member? Login
          </Typography>
        </Button>
      </Box>

      <Box
        width={"30%"}
        component="img"
        sx={{
          maxHeight: "auto",
          maxWidth: "100%",
        }}
        alt="Communication illustrations by Storyset"
        src={registerImage}
      />
    </Box>
  );
};

export default RegisterPage;
