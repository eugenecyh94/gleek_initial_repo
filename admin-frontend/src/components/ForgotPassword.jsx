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
   const [error, setError] = useState("");

   // functions

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!error) {
         const response = await recoverPassword(email);
         if (response) {
            window.alert(response);
         } else {
            window.alert("Error Ocurred while performing request!");
         }
      }
   };

   const handleChange = async (event) => {
      const { value } = event.target;
      setError(validateEmail(value));
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
      return error;
   };

   return (
      <Layout>
         <Toolbar />
         <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
            alignItems="center">
            <form>
               <Box
                  display="flex"
                  flexDirection="column"
                  p={4}
                  bgcolor={secondary}
                  borderRadius={10}
                  sx={{ minWidth: "25rem" }}
                  boxShadow={2}>
                  <Box
                     display="flex"
                     flexDirection="column"
                     alignItems="center">
                     <Box borderRadius="50%" bgcolor={primary} p={1}>
                        <LockPersonIcon fontSize="large" color="accent" />
                     </Box>
                  </Box>
                  <Typography variant="h5">Recover Password</Typography>
                  <Box display="flex" flexDirection="row">
                     <FormControl
                        sx={{ marginTop: "24px" }}
                        size="small"
                        required
                        onChange={handleChange}
                        variant="outlined">
                        <InputLabel htmlFor="outlined-adornment-password">
                           Email Address
                        </InputLabel>
                        <OutlinedInput id="email" name="email" label="Email" />
                     </FormControl>
                  </Box>
                  <Button
                     sx={{ marginTop: "24px" }}
                     mt={4}
                     variant="contained"
                     type="submit"
                     disabled={!error === "" || email.length === 0}
                     onClick={handleSubmit}>
                     <Typography variant="body1">Send Recovery Link</Typography>
                  </Button>
               </Box>
            </form>
         </Box>
      </Layout>
   );
};

export default ForgotPassword;
