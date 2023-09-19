import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function TermsAndConditionsModal({ open, handleClose }) {
  const mockedData = {
    marketingUpdates: true,
  };

  const [formData, setFormData] = React.useState(mockedData);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  return (
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
        <Button width="5rem" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}

export default TermsAndConditionsModal;
