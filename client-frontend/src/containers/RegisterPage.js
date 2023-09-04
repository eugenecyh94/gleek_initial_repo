import React, { useState, useRef, useEffect } from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";

function RegisterPage(props) {
  // themes
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;
  // states
  // user input
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [isRedirected, setIsRedirected] = useState(true); // Initially set to true
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
  });
  // error
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
  // functions
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordVerify = () =>
    setShowPasswordVerify((show) => !show);
  const navigate = useNavigate();
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
    console.log(formData);
  };

  // Due to async nature of react, only this will log the updated state in real time
  // useEffect(() => {
  //   console.log(formData);
  // }, [formData]);

  const handleChange = (event) => {
    // name is field name
    // value is formData
    setIsRedirected(true);
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
  const handleSubmit = (event) => {
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
    console.log(formData);
  };

  // useEffect(() => {
  //   // Loop through the keys (field names) of the formData object
  //   for (const fieldName in formData) {
  //     let errors = validator(formData, fieldName);
  //     setErrorData((prevData) => ({
  //       ...prevData,
  //       [fieldName]: errors[fieldName] || "",
  //     }));
  //   }
  // }, []);

  const validator = (formData, fieldName) => {
    let errors = {};
    switch (fieldName) {
      case "name":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "jobTitle":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "team":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "companyName":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "officeAddress":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "billingAddress":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "billingPartyName":
        validateIsRequired(formData[fieldName], errors, fieldName);
        break;
      case "email":
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
      case "phoneNumber":
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
    if (data == "") {
      errors[fieldName] = `${fieldName} is required!`;
    }
  };

  const validateEmail = (data, errors, fieldName) => {
    if (data == "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re =
        /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) errors[fieldName] = "Invalid Email address format!";
    }
  };

  const validatePostalCode = (data, errors, fieldName) => {
    if (data == "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re = /^\d{6}$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) errors[fieldName] = "Invalid Postal Code!";
    }
  };

  const validatePhoneNumber = (data, errors, fieldName) => {
    if (data == "") {
      errors[fieldName] = `${fieldName} is required!`;
    } else {
      const re = /^65\d{8}$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) errors[fieldName] = "Invalid Phone Number!";
    }
  };

  const validatePassword = (data, errors, fieldName) => {
    if (data == "") {
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
    if (password != data) {
      errors[fieldName] = `Password does not match!`;
    }
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
            Register
          </Typography>
          <Box display="flex" flexDirection="row">
            <Box mr={3} display="flex" flexDirection="column">
              <TextField
                size="small"
                autoFocus
                autoComplete="on"
                id="name"
                required
                name="name"
                placeholder="Name"
                onChange={handleChange}
                onBlur={handleChange}
                label="Name"
                helperText={errorData.name}
                error={errorData.name.length > 0}
                sx={{ marginTop: "24px" }}
              ></TextField>
              <TextField
                size="small"
                autoComplete="on"
                id="email"
                required
                name="email"
                placeholder="Email"
                label="Email"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.email}
                error={errorData.email.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              <TextField
                size="small"
                autoComplete="on"
                id="phoneNumber"
                required
                name="phoneNumber"
                placeholder="Phone Number"
                label="Phone Number"
                defaultValue="65"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.phoneNumber}
                error={errorData.phoneNumber.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              <TextField
                size="small"
                autoComplete="on"
                id="jobTitle"
                required
                onChange={handleChange}
                onBlur={handleChange}
                name="jobTitle"
                placeholder="Job Title"
                label="Job Title"
                helperText={errorData.jobTitle}
                error={errorData.jobTitle.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
            </Box>
            <Box mr={3} display="flex" flexDirection="column">
              <TextField
                size="small"
                autoComplete="on"
                required
                id="team"
                name="team"
                placeholder="Team"
                label="Team"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.team}
                error={errorData.team.length > 0}
                sx={{ marginTop: "24px" }}
              ></TextField>
              <TextField
                size="small"
                autoComplete="on"
                id="companyName"
                required
                name="companyName"
                placeholder="Company Name"
                label="Company Name"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.companyName}
                error={errorData.companyName.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              <TextField
                size="small"
                multiline
                autoComplete="on"
                id="officeAddress"
                required
                name="officeAddress"
                placeholder="Office Address"
                label="Office Address"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.officeAddress}
                error={errorData.officeAddress.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
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
              <TextField
                size="small"
                autoComplete="on"
                id="billingPartyName"
                required
                name="billingPartyName"
                placeholder="Billing Party Name"
                label="Billing Party Name"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.billingPartyName}
                error={errorData.billingPartyName.length > 0}
                sx={{ marginTop: "24px" }}
              ></TextField>
              <TextField
                size="small"
                multiline
                autoComplete="on"
                id="billingAddress"
                required
                name="billingAddress"
                placeholder="Billing Address"
                label="Billing Address"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.billingAddress}
                error={errorData.billingAddress.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              <TextField
                size="small"
                autoComplete="on"
                id="billingOfficePostalCode"
                required
                name="billingOfficePostalCode"
                placeholder="Billing Office Postal Code"
                label="Billing Office Postal Code"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.billingOfficePostalCode}
                error={errorData.billingOfficePostalCode.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
              <TextField
                size="small"
                autoComplete="on"
                id="billingEmail"
                required
                name="billingEmail"
                placeholder="Billing Email"
                label="Billing Email"
                onChange={handleChange}
                onBlur={handleChange}
                helperText={errorData.billingEmail}
                error={errorData.billingEmail.length > 0}
                sx={{ marginTop: "16px" }}
              ></TextField>
            </Box>
          </Box>
          <Box display="flex" flexDirection="row">
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
              sx={{ marginTop: "24px", marginLeft: "16px" }}
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
              navigate("/login");
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
}

export default RegisterPage;
