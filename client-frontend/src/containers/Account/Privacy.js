import React from "react";
import {
  Box,
  Button,
  Typography,
  Modal,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

import AccountSidebar from "./AccountSidebar";

function Privacy(props) {
  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;

  // Modal
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
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
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="I agree to receive marketing updates from Gleek via email."
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="I agree to the Terms & Conditions of Gleek."
            disabled={true}
          />
          <Button width="5rem" onClick={handleOpen}>
            Open T&C
          </Button>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="modal-modal-title"
            aria-describedby="modal-modal-description"
          >
            <Box
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                transform: "translate(-50%, -50%)",
                width: "80%",
                bgcolor: "background.paper",
                boxShadow: 24,
                borderRadius: "25px",
                p: 4,
              }}
            >
              <Typography id="modal-modal-title" variant="h6" component="h2">
                Terms & Conditions
              </Typography>
              <Typography
                id="modal-modal-description"
                overflow="auto"
                maxHeight="30em"
                sx={{ mt: 2 }}
              >
                {new Array(2000).fill("text").join(" ")}
              </Typography>
            </Box>
          </Modal>
        </FormGroup>

        <Button
          sx={{ marginTop: "32px" }}
          mt={4}
          variant="contained"
          type="submit"
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default Privacy;
