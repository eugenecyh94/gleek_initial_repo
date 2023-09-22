import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import AxiosConnect from "../../utils/AxiosConnect";
import { Box } from "@mui/material";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import { CheckCircleOutline } from "@mui/icons-material";

// TODO: Look into: Verification will not work if the user is signed out of their account.

function VerifyEmail() {
  const { token } = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [status, setStatus] = useState("");
  const { verifyEmail } = useClientStore();
  const { openSnackbar } = useSnackbarStore();

  useEffect(() => {
    const getVerifyEmail = async () => {
      if (!token) {
        setIsLoading(false);
        return;
      }
      try {
        const response = await verifyEmail(token);

        setStatus(response.data.status);
      } catch (err) {
        console.log(err);
        openSnackbar(err.response.data.msg, "error");
        setStatus("error");
      } finally {
        setIsLoading(false);
      }
    };

    getVerifyEmail();
  }, []);

  const resendVerificationEmail = async () => {
    try {
      const response = await AxiosConnect.get(
        "/gleek/client/resendVerifyEmail",
      );
      openSnackbar(response.data.msg, "success");
    } catch (err) {
      console.log(err);
    }
  };

  if (isLoading) return <CircularProgress />;

  return (
    <Box display="flex" alignItems="center" justifyContent="center">
      <Box
        boxShadow={3}
        p={3}
        bgcolor="white"
        borderRadius={4}
        textAlign="center"
      >
        {status === "success" ||
          (status === "already-verified" && (
            <div>
              <CheckCircleOutline sx={{ fontSize: 48 }} />
              <Typography variant="h4" color="primary.dark">
                Email Verified!
              </Typography>

              <Typography variant="body1">
                Start exploring our thoughtfully curated collection of
                sustainability and employee wellness activities.
              </Typography>
              <Button
                variant="contained"
                color="tertiary"
                component={Link}
                to="/shop"
                sx={{ mt: 3 }}
              >
                Shop
              </Button>
            </div>
          ))}

        {status === "token-expired" && (
          <div>
            <Typography variant="h4">Expired Link</Typography>
            <Typography variant="body1">Your email link has expired</Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              onClick={resendVerificationEmail}
            >
              Request New Verification
            </Button>
          </div>
        )}

        {status === "token-expired" && (
          <div>
            <Typography variant="h4">Expired Link</Typography>
            <Typography variant="body1">Your email link has expired</Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              onClick={resendVerificationEmail}
            >
              Request New Verification
            </Button>
          </div>
        )}

        {!token && (
          <div>
            <Typography variant="h4">Verification Email Sent</Typography>
            <Typography variant="body1">
              An email has been sent to verify your account.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              component={Link}
              onClick={resendVerificationEmail}
            >
              Request New Verification
            </Button>
          </div>
        )}
      </Box>
    </Box>
  );
}

export default VerifyEmail;
