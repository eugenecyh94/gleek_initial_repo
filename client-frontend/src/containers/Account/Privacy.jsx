import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import AccountSidebar from "./AccountSidebar";
import TermsAndConditionsModal from "../../components/Modals/TermsAndConditionsModal";
import AxiosConnect from "../../utils/AxiosConnect";
import useSnackbarStore from "../../zustand/SnackbarStore";

function Privacy(props) {
  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const { openSnackbar, closeSnackbar } = useSnackbarStore();
  const [settings, setSettings] = useState({});
  useEffect(() => {
    const subscribeConsent = async () => {
      try {
        const response = await AxiosConnect.get("/gleek/client/consent");

        setSettings(response.data.consent || {}); // Provide an initial value here
      } catch (err) {
        console.error(err);
        openSnackbar(err.msg, "error");
      }
    };
    subscribeConsent();
  }, []);

  const updateConsent = async (event) => {
    event.preventDefault();
    try {
      const response = await AxiosConnect.patch(
        "/gleek/client/consent",
        settings,
      );

      openSnackbar(response.data.msg, "success");
    } catch (err) {
      console.error(err);
      openSnackbar(err.msg, "error");
    }
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setSettings((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="top"
      p={8}
      sx={{ width: "100%" }}
    >
      <Box width={"30%"}>
        <AccountSidebar />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        sx={{ width: "100%" }}
        p={6}
        flexWrap={"wrap"}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="left"
          marginBottom={2}
        >
          <Typography color="secondary" variant="h4">
            Privacy Settings
          </Typography>
        </Box>
        <form onSubmit={updateConsent}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!settings.receiveMarketing}
                  onChange={handleCheckboxChange}
                  name="receiveMarketing"
                  color="primary"
                />
              }
              label="I agree to receive marketing updates from Gleek via email."
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!settings.receiveEmails}
                  onChange={handleCheckboxChange}
                  name="receiveEmails"
                  color="primary"
                />
              }
              label="I agree to receive email updates from Gleek."
              
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={!!settings.acceptTermsAndConditions}
                  onChange={handleCheckboxChange}
                  name="acceptTermsAndConditions"
                  color="primary"
                />
              }
              label="I agree to the Terms & Conditions of Gleek."
              disabled
            />

            <Button width="5rem" onClick={handleOpen}>
              Open T&C
            </Button>
            <TermsAndConditionsModal open={open} handleClose={handleClose} />
            <Button
              sx={{ marginTop: "32px" }}
              mt={4}
              variant="contained"
              type="submit"
            >
              <Typography variant="body1">Update</Typography>
            </Button>
          </FormGroup>
        </form>
      </Box>
    </Box>
  );
}

export default Privacy;
