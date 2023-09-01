import React from "react";
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
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";

function LoginPage(props) {
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;
  const [showPassword, setShowPassword] = React.useState(false);

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
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
            id="username"
            required
            autoComplete
            placeholder="Username"
            label="Username"
            sx={{ marginTop: "32px" }}
          ></TextField>
          <FormControl
            sx={{ marginTop: "32px" }}
            size="small"
            required
            autoComplete
            variant="outlined"
          >
            <InputLabel htmlFor="outlined-adornment-password">
              Password
            </InputLabel>
            <OutlinedInput
              id="password"
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
          </FormControl>
          <Button
            sx={{ marginTop: "32px" }}
            mt={4}
            variant="contained"
            onClick={() => {}}
          >
            <Typography variant="body1">Login</Typography>
          </Button>
          <Button sx={{ marginTop: "16px" }} variant="text" onClick={() => {}}>
            <Typography fontWeight={700} color="secondary" variant="body2">
              Don't have an account? Sign Up
            </Typography>
          </Button>
          <Button sx={{ marginTop: "32px" }} variant="text" onClick={() => {}}>
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
