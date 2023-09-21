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
  CircularProgress,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";
import useSnackbarStore from "../zustand/SnackbarStore.js";

import loginImage from "../assets/login.png";
import { validator } from "../utils/ClientFieldsValidator.js";

const LoginPage = (props) => {
  const theme = useTheme();
  const { openSnackbar, closeSnackbar } = useSnackbarStore();
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const [email, setEmail] = useState("");

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const [errorData, setErrorData] = useState({
    password: "",
    email: "",
  });

  const navigate = useNavigate();

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;

  // Client validator for email and password
  const handleChange = (event) => {
    const { name, value } = event.target;

    if (name === "email") {
      setEmail(value);
      const errors = validator({ [name]: value }, name);
      setErrorData((prevData) => ({
        ...prevData,
        [name]: errors[name] || "",
      }));
    } else if (name === "password") {
      setPassword(value);
      setErrorData((prevData) => ({
        ...prevData,
        password: !value ? "Password is required" : "",
      }));
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseStatus = await props.loginMethod(email, password);

      if (responseStatus) {
        openSnackbar("Logged in!", "success");
        navigate("/");
      }
    } catch (err) {
      console.error(err);
      openSnackbar(err.response.data.msg, "error");
    }
  };

  const disableButton = () => {
    return !Object.values(errorData).every((error) => error === "");
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
    >
      <form onSubmit={handleSubmit}>
        <Box
          display="flex"
          flexDirection="column"
          p={4}
          bgcolor={"grey.50"}
          borderRadius={10}
          sx={{ width: "25rem" }}
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
              {props.title}
            </Typography>
          </Box>

          <TextField
            size="small"
            autoFocus
            autoComplete="on"
            id="email"
            required
            name="email"
            placeholder="Email"
            onChange={handleChange}
            onBlur={handleChange}
            label="Email"
            value={email}
            helperText={errorData.email}
            error={!!errorData.email}
            sx={{ marginTop: "32px" }}
          ></TextField>
          <FormControl
            sx={{ marginTop: "32px" }}
            size="small"
            required
            variant="outlined"
          >
            <InputLabel
              error={!!errorData.password}
              htmlFor="outlined-adornment-password"
            >
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
              onChange={handleChange}
              onBlur={handleChange}
              name="password"
              value={password}
              error={!!errorData.password}
              helperText={errorData.password}
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
          {!props.loading && (
            <Button
              sx={{ marginTop: "32px" }}
              mt={4}
              variant="contained"
              type="submit"
              disabled={disableButton()}
            >
              <Typography variant="body1">Login</Typography>
            </Button>
          )}
          {props.loading && (
            <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
          )}
          <Button
            sx={{ marginTop: "16px" }}
            variant="text"
            onClick={() => {
              navigate(props.registerLink);
            }}
          >
            <Typography fontWeight={700} color="secondary" variant="body2">
              Don't have an account? Sign Up
            </Typography>
          </Button>
          <Button sx={{ marginTop: "32px" }} variant="text">
            <Typography color="secondary" variant="body2">
              Forgot Password?
            </Typography>
          </Button>
        </Box>
      </form>
      <Box
        width={"30%"}
        component="img"
        sx={{
          maxHeight: "auto",
          maxWidth: "100%",
        }}
        alt="Illustrations by Storyset"
        src={loginImage}
      />
    </Box>
  );
};

export default LoginPage;
