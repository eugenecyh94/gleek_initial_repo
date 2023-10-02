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
import { useAdminStore } from "../zustand/GlobalStore";
import Layout from "./Layout";

const ForgotPassword = () => {
  // themes
  const theme = useTheme();
  const { recoverPassword } = useAdminStore();
  const secondary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  // states
  // user input
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  // functions

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!emailError && email != "") {
      const response = await recoverPassword(email);
      if (response) {
        window.alert(response);
      } else {
        window.alert("Error Ocurred while performing request!");
      }
    } else {
      setEmailError(validateEmail(email));
    }
  };

  const handleChange = async (event) => {
    const { value } = event.target;
    setEmailError(validateEmail(value));
    setEmail(value);
  };

  const validateEmail = (data) => {
    let error = "";
    if (data === "") {
      error = `Email is required!`;
    } else {
      const re =
        /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      const result = re.test(String(data).toLowerCase());
      if (!result) error = "Invalid Email address format!";
    }
    console.log(error);
    return error;
  };

  return (
    <>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
        marginTop={12}
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
            <Box display="flex" flexDirection="column" alignItems="center">
              <Box borderRadius="50%" bgcolor={primary} p={1}>
                <LockPersonIcon fontSize="large" color="accent" />
              </Box>

              <Typography variant="h5">Recover Password</Typography>
              <TextField
                size="small"
                autoComplete="on"
                id="email"
                required
                name="email"
                placeholder="Email"
                onChange={handleChange}
                onBlur={handleChange}
                label="Email"
                value={email}
                helperText={emailError}
                error={emailError.length > 0}
                sx={{ marginTop: "32px" }}
              ></TextField>
              <Button
                sx={{ marginTop: "24px" }}
                mt={4}
                variant="contained"
                type="submit"
                disabled={emailError != ""}
                onClick={handleSubmit}
              >
                <Typography variant="body1">Send Recovery Link</Typography>
              </Button>
            </Box>
          </Box>
        </form>
      </Box>
    </>
  );
};

export default ForgotPassword;
