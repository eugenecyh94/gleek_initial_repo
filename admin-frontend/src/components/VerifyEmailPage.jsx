import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import { Box, Snackbar, Alert, TextField } from "@mui/material";
import { useAdminStore } from "../zustand/GlobalStore";
import { CheckCircleOutline } from "@mui/icons-material";
import MainBodyContainer from "./common/MainBodyContainer";

// TODO: Look into: Verification will not work if the user is signed out of their account.

function VerifyEmailPage() {
   const { token } = useParams();
   const [status, setStatus] = useState("");
   const { verifyEmail, resendVerifyEmail, isLoading, admin, authenticated } =
      useAdminStore();
   const [open, setOpen] = useState(false);
   const [openError, setOpenError] = useState(false);
   const [emailError, setEmailError] = useState("");
   const [email, setEmail] = useState("");
   const navigate = useNavigate();

   const handleClose = (event, reason) => {
      if (reason === "clickaway") {
         return;
      }

      setOpen(false);
      setOpenError(false);
   };

   const handleChange = async (event) => {
      const { value } = event.target;
      // setEmailError(validateEmail(value));
      validateEmail(value);
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
      setEmailError(error);
   };

   const handleSubmit = async (event) => {
      event.preventDefault();

      if (!emailError && email != "") {
         try {
            const response = await resendVerifyEmail(email);
            window.alert(response.data.msg);
            setEmail("");
         } catch (err) {
            window.alert("Error Ocurred while performing request!");
         }
      } else {
         setEmailError(validateEmail(email));
      }
   };

   useEffect(() => {
      const getVerifyEmail = async () => {
         try {
            const response = await verifyEmail(token);
            setStatus(response.data.status);
            navigate("/manageProfile/ChangePassword");
         } catch (err) {
            console.log(err);
            setOpenError(true);
            setStatus("error");
         }
      };

      getVerifyEmail();
   }, []);

   if (isLoading)
      return (
         <Box display="flex" alignItems="center" justifyContent="center">
            <CircularProgress />
         </Box>
      );

   return (
      <MainBodyContainer
         hasBackButton={false}
         breadcrumbNames={[]}
         breadcrumbLinks={[]}
         currentBreadcrumbName={""}>
         <Box display="flex" alignItems="center" justifyContent="center">
            <Box
               boxShadow={3}
               p={3}
               bgcolor="white"
               borderRadius={4}
               textAlign="center">
               {(status === "success" || status === "already-verified") && (
                  <div>
                     <CheckCircleOutline sx={{ fontSize: 48 }} />
                     <Typography variant="h4">Email Verified!</Typography>

                     <Typography variant="body1">
                        Please secure your account by changing your password.
                     </Typography>
                  </div>
               )}

               {status === "token-expired" && (
                  <div>
                     <Typography variant="h4">Expired Link</Typography>
                     <Typography variant="body1">
                        Your email link has expired
                     </Typography>
                     <form
                        style={{
                           display: "flex",
                           flexDirection: "column",
                        }}>
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
                           error={emailError != ""}
                           sx={{ marginTop: "32px" }}></TextField>
                        <Button
                           sx={{ marginTop: "24px" }}
                           mt={4}
                           variant="contained"
                           type="submit"
                           disabled={emailError != ""}
                           onClick={handleSubmit}>
                           <Typography variant="body1">
                              Send Recovery Link
                           </Typography>
                        </Button>
                     </form>
                  </div>
               )}
            </Box>
         </Box>
      </MainBodyContainer>
   );
}

export default VerifyEmailPage;
