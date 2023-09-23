/* eslint-disable react/no-unescaped-entities */
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
  CircularProgress,
  Snackbar,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { Navigate, useNavigate } from "react-router-dom";
import { useAdminStore } from "../zustand/GlobalStore.js";
import HomePageNavBar from "./navbar/HomePageNavBar.jsx";

function LoginPage(props) {
  const theme = useTheme();
  const { isLoading, AdminError, login, admin, authenticated } =
    useAdminStore(); // Destructure the relevant state and actions
  const tertiary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [passwordError, setPasswordError] = useState("");
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [openError, setOpenError] = useState(false);
  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "email") {
      setEmail(value);
      if (value.trim() === "") {
        setError("Email is required");
      } else {
        setError("");
      }
    } else if (name === "password") {
      setPassword(value);
      if (value.trim() === "") {
        setPasswordError("Password is required");
      } else {
        setPasswordError("");
      }
    }
  };
  const handleSubmit = async (event) => {
    event.preventDefault();

    const responseStatus = await login(email, password);
    if (responseStatus) {
      setOpen(true);
      navigate("/");
    } else {
      setOpenError(true);
    }
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
    setOpenError(false);
  };

  const handleForgotPassword = async (event) => {
    try {
      navigate("/forgotPassword");
    } catch (err) {
      console.log(err.message);
    }
  };

  return (
    <Box marginTop={"64px"}>
      {!isLoading && authenticated ? (
        <Navigate to="/" replace="true" />
      ) : (
        <Box
          display="flex"
          flexDirection="row"
          justifyContent="space-evenly"
          alignItems="center"
          p={5}
        >
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert
              onClose={handleClose}
              severity="success"
              sx={{ width: "100%" }}
            >
              Login is successful!
            </Alert>
          </Snackbar>
          <Snackbar
            open={openError}
            autoHideDuration={6000}
            onClose={handleClose}
          >
            <Alert
              onClose={handleClose}
              severity="error"
              sx={{ width: "100%" }}
            >
              {AdminError &&
                AdminError.response &&
                AdminError.response.data &&
                (AdminError.response.data.errors?.[0]?.msg ||
                  AdminError.response.data)}
            </Alert>
          </Snackbar>
          <form onSubmit={handleSubmit}>
            <Box
              display="flex"
              flexDirection="column"
              p={4}
              bgcolor={tertiary}
              borderRadius={10}
              sx={{ width: "25rem" }}
              boxShadow={2}
            >
              <Box display="flex" flexDirection="column" alignItems="center">
                <Box borderRadius="50%" bgcolor={primary} p={1}>
                  <LockPersonIcon fontSize="large" color="accent" />
                </Box>
              </Box>
              <Typography variant="h5">Login</Typography>
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
                helperText={error}
                error={error.length > 0}
                sx={{ marginTop: "32px" }}
              ></TextField>
              <FormControl
                sx={{ marginTop: "32px" }}
                size="small"
                required
                variant="outlined"
              >
                <InputLabel
                  error={passwordError.length > 0}
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
                  error={passwordError.length > 0}
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
                {passwordError.length > 0 && (
                  <FormHelperText error id="my-helper-text">
                    {passwordError}
                  </FormHelperText>
                )}
              </FormControl>
              {!isLoading && (
                <Button
                  sx={{ marginTop: "32px" }}
                  mt={4}
                  variant="contained"
                  type="submit"
                >
                  <Typography variant="body1">Login</Typography>
                </Button>
              )}
              {isLoading && (
                <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
              )}
              <Button sx={{ marginTop: "32px" }} variant="text">
                <Typography variant="body2" onClick={handleForgotPassword}>
                  Forgot Password?
                </Typography>
              </Button>
            </Box>
          </form>
          <Box>IMAGE TO BE ADDED LATER</Box>
        </Box>
      )}
    </Box>
  );
}

export default LoginPage;
