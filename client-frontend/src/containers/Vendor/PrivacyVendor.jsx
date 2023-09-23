import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

import AccountSidebarVendor from "./AccountSidebarVendor";
import TermsAndConditionsModal from "../../components/Modals/TermsAndConditionsModal";

function PrivacyVendor(props) {
  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

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
        <AccountSidebarVendor />
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
            Terms & Conditions
          </Typography>
        </Box>
        <FormControlLabel
          control={
            <Checkbox
              disabled
              checked
              name="acceptTermsAndConditions"
              color="primary"
            />
          }
          label="I agree to the Terms & Conditions of Gleek."
          disabled
        />
        <Button width="5rem" sx={{ marginTop: "12px" }} onClick={handleOpen}>
          Open T&C
        </Button>
        <TermsAndConditionsModal open={open} handleClose={handleClose} />
      </Box>
    </Box>
  );
}

export default PrivacyVendor;
