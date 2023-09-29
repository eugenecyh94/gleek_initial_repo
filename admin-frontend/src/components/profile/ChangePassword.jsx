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
  Toolbar,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../zustand/GlobalStore";
import Layout from "../Layout";
import ManageProfileSidebar from "./ManageProfileSidebar";
import MainBodyContainer from "../common/MainBodyContainer";

const ChangePassword = () => {
  // themes
  const theme = useTheme();
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const background = theme.palette.backgroundColor.secondary;
  // states
  // user input
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    passwordVerify: "",
  });
  // error
  const [errorData, setErrorData] = useState({
    password: "",
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
  const { changePassword } = useAdminStore();

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

    const responseStatus = await changePassword(formData.password);
    if (responseStatus) {
      navigate("/");
    } else {
      console.log(responseStatus);
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
    <MainBodyContainer
      hasBackButton={true}
      breadcrumbNames={["Account Details"]}
      breadcrumbLinks={["/manageProfile"]}
      currentBreadcrumbName={"Change Password"}
    >
      <Typography
        alignItems={"center"}
        fontSize={25}
        fontWeight={700}
        noWrap
        component="div"
        color={theme.palette.primary.main}
        paddingBottom={2}
        style={{
          display: "flex",
        }}
      >
        Manage Account
      </Typography>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        // alignItems="left"
        p={3}
        width={"100%"}
      >
        <Box width={"20%"}>
          <ManageProfileSidebar />
        </Box>
        <form>
          <Box
            display="flex"
            flexDirection="column"
            p={6}
            bgcolor={background}
            borderRadius={10}
            boxShadow={2}
          >
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box borderRadius="50%" bgcolor={primary} p={1}>
                <LockPersonIcon fontSize="large" color="accent" />
              </Box>

              <Typography variant="h5">Change Password</Typography>
              <Box
                display="flex"
                flexDirection="column"
                sx={{ width: "400px" }}
              >
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
                <Typography variant="body1">Change Password</Typography>
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </MainBodyContainer>
  );
};

export default ChangePassword;
