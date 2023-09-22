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
  Select,
  MenuItem,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../zustand/GlobalStore";

const AddAdminPage = () => {
  // themes
  const theme = useTheme();
  const tertiary = theme.palette.secondary.main;
  const primary = theme.palette.primary.main;
  // states
  // user input
  const { isLoading, adminError, register } = useAdminStore();
  const [formData, setFormData] = useState({
    email: "",
    name: "",
    role: "",
  });
  // error
  const [errorData, setErrorData] = useState({
    email: "",
    name: "",
    role: "",
  });

  // functions
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

    const responseStatus = await register({
      name: formData.name,
      email: formData.email,
      role: formData.role,
    });
    if (responseStatus) {
      navigate("/adminTeam");
    } else {
      const error =
        adminError &&
        adminError.response &&
        adminError.response.data &&
        (adminError.response.data.errors?.[0]?.msg || adminError.response.data);
      //  openSnackbar(error, "error");
    }
  };

  const validator = (formData, fieldName) => {
    let errors = {};
    switch (fieldName) {
      case "email":
        validateEmail(formData[fieldName], errors, fieldName);
        break;
      //  case "phoneNumber":
      //     validatePhoneNumber(formData[fieldName], errors, fieldName);
      //     break;
      default:
    }
    return errors;
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

  return (
    <Box>
      <Toolbar />
      <Box
        display="flex"
        width={"80%"}
        flexDirection="row"
        justifyContent="space-evenly"
        alignItems="center"
      >
        <Box>
          <Box display="flex" flexDirection="column" alignItems="center" m={3}>
            <Box borderRadius="50%" bgcolor={primary} p={1}>
              <LockPersonIcon fontSize="large" color="accent" />
            </Box>
          </Box>
          <Typography color="tertiary" variant="h5">
            Register
          </Typography>
        </Box>
        <form>
          <Box display="flex" flexDirection="row">
            <Box mr={1} display="flex" flexDirection="column">
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
              <InputLabel id="role-dropdown">Role</InputLabel>
              <Select
                labelId="role"
                name="role"
                id="role"
                label="Role"
                required
                value={formData.role}
                onChange={handleChange}
              >
                <MenuItem value={"MANAGERIAL"}>MANAGERIAL</MenuItem>
                <MenuItem value={"EXECUTIVE"}>EXECUTIVE</MenuItem>
              </Select>
            </Box>
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
        </form>
      </Box>
    </Box>
  );
};

export default AddAdminPage;
