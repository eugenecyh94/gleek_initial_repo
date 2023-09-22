import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Avatar,
} from "@mui/material";
import AccountSidebar from "./AccountSidebar";
import { useTheme } from "@emotion/react";
import AxiosConnect from "../../utils/AxiosConnect";

function AccountDetails(props) {
  const [formData, setFormData] = useState();
  const [newProfilePictureData, setNewProfilePictureData] = useState({
    file: null,
    preview: null,
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    // const errors = validator(formData, name)
    // setErrorData((prevData) => ({
    //   ...prevData,
    //   [name]: errors[name] || "", // Replace the error with an empty string if it's empty
    // }))
  };

  const handleSelectProfilePicture = (e) => {
    const allowedTypes = ["image/jpeg", "image/png", "image/jpeg"];
    //Can consider implementing file size limit check
    const selectedFile = e.target.files && e.target.files[0];
    if (allowedTypes.includes(selectedFile.type)) {
      console.log("Valid file selected:", selectedFile);
      setNewProfilePictureData({
        file: selectedFile,
        preview: URL.createObjectURL(selectedFile),
      });
    } else {
      alert("Please select a valid PNG, JPG or JPEG image.");
      e.target.value = "";
    }
  };

  const handleUploadProfilePicture = (e) => {
    if (!newProfilePictureData.file) {
      console.error("No file has been attached");
      return;
    }
    const formData = new FormData();
    formData.append("image", newProfilePictureData.file);
    AxiosConnect.patchMultipart("/gleek/client/updateProfilePicture", formData);
  };

  const theme = useTheme();
  const primary = theme.palette.primary.main;

  // const theme = useTheme();
  // const tertiary = theme.palette.tertiary.main;
  // const primary = theme.palette.primary.main;
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="top"
      p={8}
      width={"100%"}
    >
      <Box width={"30%"}>
        <AccountSidebar />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        width={"100%"}
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
            Change Profile Picture
          </Typography>
        </Box>
        <Grid container spacing={2} alignItems="left" justifyContent="left">
          <Grid item xs={12}>
            Image Preview
            <Avatar
              sx={{ bgcolor: primary, width: 200, height: 200 }}
              variant="rounded"
              src={
                !newProfilePictureData.file
                  ? "https://i.imgur.com/ZTevUo0.png"
                  : newProfilePictureData.preview
              }
            >
              Gleek Client
            </Avatar>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              component="label"
              sx={{ width: "fit-content", marginRight: 2 }}
              onChange={handleSelectProfilePicture}
            >
              Upload File
              <input type="file" hidden />
            </Button>

            <Button
              variant="contained"
              component="label"
              sx={{ width: "fit-content" }}
              disabled={!newProfilePictureData.file}
              onClick={handleUploadProfilePicture}
            >
              Update
            </Button>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default AccountDetails;
