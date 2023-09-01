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

function LoginPage(props) {
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const [passwordError, setPasswordError] = useState("");

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    if (name === "username") {
      setUsername(value);
      if (value.trim() === "") {
        setError("Username is required");
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
  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = { username, password };
    console.log(formData);
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
          p={6}
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
          <Typography color="secondary" variant="h5">
            Login
          </Typography>
          <TextField
            size="small"
            autoFocus
            autoComplete="on"
            id="username"
            required
            name="username"
            placeholder="Username"
            onChange={handleChange}
            onBlur={handleChange}
            label="Username"
            value={username}
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
          <Button
            sx={{ marginTop: "32px" }}
            mt={4}
            variant="contained"
            type="submit"
          >
            <Typography variant="body1">Login</Typography>
          </Button>
          <Button sx={{ marginTop: "16px" }} variant="text" onClick={() => {}}>
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
      <Box>IMAGE TO BE ADDED LATER</Box>
    </Box>
  );
}

export default LoginPage;
