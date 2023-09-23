import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import useClientStore from "../../../zustand/ClientStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";

const VendorResetPassword = () => {
  const { openSnackbar } = useSnackbarStore();
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    passwordVerify: "",
  });

  const [errorData, setErrorData] = useState({
    password: "",
    passwordVerify: "",
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleClickShowPasswordVerify = () =>
    setShowPasswordVerify((show) => !show);
  const navigate = useNavigate();
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
    console.log(formData);
  };
  const { resetPassword } = useClientStore();

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
    try {
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

      const response = await resetPassword(formData.password);
      if (response) {
        openSnackbar(response.data.msg, "success");
        navigate("/");
      }
    } catch (err) {
      openSnackbar(err.response.data.msg, "error");
    }
  };

  const validator = (formData, fieldName) => {
    let errors = {};
    switch (fieldName) {
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
  return (
    <div>
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
            bgcolor="grey.50"
            borderRadius={10}
            sx={{ minWidth: "25rem" }}
            boxShadow={2}
          >
            <Typography variant="h5">Reset Password</Typography>
            <Box display="flex" flexDirection="row">
              <FormControl
                sx={{ marginTop: "24px" }}
                size="small"
                required
                variant="outlined"
              >
                <InputLabel htmlFor="outlined-adornment-password">
                  New Password
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
            <Button
              sx={{ marginTop: "24px" }}
              mt={4}
              variant="contained"
              type="submit"
              disabled={
                !Object.values(errorData).every((error) => error === "")
              }
              onClick={handleSubmit}
            >
              <Typography variant="body1">Reset Password</Typography>
            </Button>
          </Box>
        </form>
        {/* <Box></Box> */}
      </Box>
    </div>
  );
};

export default VendorResetPassword;
