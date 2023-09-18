import React, { useState } from "react";
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
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";

const VendorRegisterPage = () => {
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

  const [formData, setFormData] = useState({
    companyName: "",
    companyUEN: "",
    companyAddress: "",
    companyPhoneNumber: "",
    companyEmail: "",
    vendorDetails: "",
    password: "",
    companyType: "",
    customCompanyType: "",
    brandNames: [],
    companyLogo: "",
    signupDate: "",
    companySocials: "",
    passwordVerify: "",
    officePostalCode: "",
  });
  // error
  const [errorData, setErrorData] = useState({
    companyName: "",
    companyUEN: "",
    companyAddress: "",
    companyPhoneNumber: "",
    companyEmail: "",
    vendorDetails: "",
    password: "",
    companyType: "",
    customCompanyType: "",
    brandNames: [],
    companyLogo: "",
    signupDate: "",
    companySocials: "",
    passwordVerify: "",
    officePostalCode: "",
  });

  // functions
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordVerify = () =>
    setShowPasswordVerify((show) => !show);
  const navigate = useNavigate();
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  const handleChange = (event) => {
    // name is field name
    // value is formData
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
    const errors = validator(formData, name);
    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "", // Replace the error with an empty string if it's empty
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    for (const fieldName in formData) {
      let errors = validator(formData, fieldName);
      setErrorData((prevData) => ({
        ...prevData,
        [fieldName]: errors[fieldName] || "",
      }));
    }

    if (!Object.values(errorData).every((error) => error === "")) {
      return;
    }

    const responseStatus = await register(formData);

    if (responseStatus) {
      openSnackbar("Register was successful!", "success");
      navigate("/");
    } else {
      const error =
        clientError &&
        clientError.response &&
        clientError.response.data &&
        (clientError.response.data.errors?.[0]?.msg ||
          clientError.response.data);
      openSnackbar(error, "error");
    }
  };

  const validator = (formData, fieldName) => {
    let errors = {};
    switch (fieldName) {
      case "companyName":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "companyUEN":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "team":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "companyAddress":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "vendorDetails":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "billingPartyName":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "companyEmail":
        validateEmail(formData[fieldName], errors, fieldName);
        break;
      case "billingEmail":
        validateEmail(formData[fieldName], errors, fieldName);
        break;
      case "billingOfficePostalCode":
        validatePostalCode(formData[fieldName], errors, fieldName);
        break;
      case "officePostalCode":
        validatePostalCode(formData[fieldName], errors, fieldName);
        break;
      case "companyPhoneNumber":
        validatePhoneNumber(formData[fieldName], errors, fieldName);
        break;
      case "password":
        validatePassword(formData[fieldName], errors, fieldName);
        break;
      case "passwordVerify":
        validatePasswordVerify(
          formData[fieldName],
          formData.password,
          errors,
          fieldName,
        );
        break;
      default:
    }
    return errors;
  };

  const validateIsRequired = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required!`;
    }
  };

  const validateEmail = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re =
        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) errors[fieldName] = "Invalid Email address format!";
    }
  };

  const validatePostalCode = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re = /^\d{6}$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) errors[fieldName] = "Invalid Postal Code!";
    }
  };

  const validatePhoneNumber = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re = /^65\d{8}$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) errors[fieldName] = "Invalid Phone Number!";
    }
  };

  const validatePassword = (data, errors, fieldName) => {
    if (data === "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*/;
      let result = re.test(String(data));
      console.log(result);
      if (!result) {
        errors[fieldName] =
          "Password must contain at least one lower case letter, one \n upper case letter, number and special character.";
        result = false;
      } else if (data.length < 8) {
        errors[fieldName] = "Your password has less than 8 characters.";
        result = false;
      }
    }
  };

  const validatePasswordVerify = (data, password, errors, fieldName) => {
    if (password !== data) {
      errors[fieldName] = `Password does not match!`;
    }
  };

  const [selectedValue, setSelectedValue] = useState("");
  const [customValue, setCustomValue] = useState("");

  const handleMenuChange = (event) => {
    setSelectedValue(event.target.value);
    // Clear the custom input when a predefined option is selected
    setCustomValue("");
  };

  const handleCustomValueChange = (event) => {
    setSelectedValue("custom");
    setCustomValue(event.target.value);
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <form>
        <Box
          display="flex"
          flexDirection="column"
          p={4}
          bgcolor={tertiary}
          borderRadius={10}
          sx={{ minWidth: "25rem" }}
          boxShadow={2}
        >
          <Box display="flex" flexDirection="column" alignItems="center">
            <Box borderRadius="50%" bgcolor={primary} p={1}>
              <LockPersonIcon fontSize="large" color="accent" />
            </Box>
          </Box>
          <Typography color="secondary" variant="h5">
            Vendor Register
          </Typography>
          <Box display="flex" flexDirection="row">
            <Box mr={3} display="flex" flexDirection="column">
              {/*Company Name*/}
              <TextField
                size="small"
                autoFocus
                autoComplete="on"
                id="companyName"
                required
                name="companyName"
                placeholder="Company Name"
                onChange={handleChange}
                onBlur={handleChange}
                label="Company Name"
                helperText={errorData.companyName}
                error={errorData.companyName.length > 0}
                sx={{ marginTop: "24px" }}
              ></TextField>
              {/*Company UEN*/}
              <TextField
                size="small"
                autoComplete="on"
                id="companyUEN"
                required
                name="companyUEN"
                placeholder="Company UEN"
                onChange={handleChange}
                onBlur={handleChange}
                label="Company UEN"
                helperText={errorData.companyUEN}
                error={errorData.companyUEN.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              {/*Company Email*/}
              <TextField
                size="small"
                autoComplete="on"
                id="companyEmail"
                required
                name="companyEmail"
                placeholder="Company Email"
                label="Company Email"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.companyEmail}
                error={errorData.companyEmail.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              <Box mt={2}>
                <Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
                  Select an Option:
                </Typography>
                <FormControl fullWidth size="small">
                  <Select value={selectedValue} onChange={handleMenuChange}>
                    <MenuItem value="">Select an option</MenuItem>
                    <MenuItem value="option1">Option 1</MenuItem>
                    <MenuItem value="option2">Option 2</MenuItem>
                    <MenuItem value="option3">Option 3</MenuItem>
                    <MenuItem value="Other">Other</MenuItem>
                  </Select>
                </FormControl>
                {selectedValue === "Other" && (
                  <TextField
                    label="Other"
                    fullWidth
                    size="small"
                    value={customValue}
                    onChange={handleCustomValueChange}
                    sx={{ marginTop: "16px" }}
                  />
                )}
              </Box>
            </Box>
            <Box mr={3} display="flex" flexDirection="column">
              {/*Company Phone Number*/}
              <TextField
                size="small"
                autoComplete="on"
                id="companyPhoneNumber"
                required
                name="companyPhoneNumber"
                placeholder="Company Phone Number"
                label="Company Phone Number"
                defaultValue="65"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.companyPhoneNumber}
                error={errorData.companyPhoneNumber.length > 0}
                sx={{ marginTop: "24px" }}
              />
              {/* Company Address */}
              <TextField
                size="small"
                multiline
                autoComplete="on"
                id="companyAddress"
                required
                name="companyAddress"
                placeholder="Company Address"
                label="Company Address"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.companyAddress}
                error={errorData.companyAddress.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              {/*Company Postal Code*/}
              <TextField
                size="small"
                autoComplete="on"
                id="officePostalCode"
                required
                name="officePostalCode"
                placeholder="Office Postal Code"
                label="Office Postal Code"
                value={formData.officePostalCode}
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.officePostalCode}
                error={errorData.officePostalCode.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
            </Box>
            <Box mr={3} display="flex" flexDirection="column">
              <FormControl
                sx={{ marginTop: "24px" }}
                size="small"
                required
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Password
                </InputLabel>
                <OutlinedInput
                  id="password"
                  name="password"
                  onChange={handleChange}
                  onBlur={handleChange}
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
              <FormControl
                sx={{ marginTop: "24px" }}
                size="small"
                required
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  Confirm your password
                </InputLabel>
                <OutlinedInput
                  id="passwordVerify"
                  name="passwordVerify"
                  onChange={handleChange}
                  onBlur={handleChange}
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
                        {showPasswordVerify ? (
                          <VisibilityOff />
                        ) : (
                          <Visibility />
                        )}
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
            </Box>
          </Box>
          <Box>
            {/*Vendor Details*/}
            <TextField
              size="large"
              multiline
              autoComplete="on"
              id="vendorDetails"
              required
              name="vendorDetails"
              placeholder="Vendor Details"
              label="Vendor Details"
              onChange={handleChange}
              onBlur={handleChange}
              helperText={errorData.vendorDetails}
              error={errorData.vendorDetails.length > 0}
              sx={{ marginTop: "24px", width: "100%" }}
            />
          </Box>
          <Button
            sx={{ marginTop: "24px" }}
            mt={4}
            variant="contained"
            type="submit"
            disabled={!Object.values(errorData).every((error) => error === "")}
            onClick={handleSubmit}
          >
            <Typography variant="body1">Register</Typography>
          </Button>
          <Button
            sx={{ marginTop: "16px" }}
            variant="text"
            onClick={() => {
              navigate("/vendor/login");
            }}
          >
            <Typography fontWeight={700} color="secondary" variant="body2">
              Already a Member? Login
            </Typography>
          </Button>
        </Box>
      </form>
      <Box>IMAGE TO BE ADDED LATER</Box>
    </Box>
  );
};

export default VendorRegisterPage;
