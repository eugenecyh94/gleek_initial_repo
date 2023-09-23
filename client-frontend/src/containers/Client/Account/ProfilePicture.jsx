import { useTheme } from "@emotion/react";
import { Avatar, Box, Button, Grid, Typography } from "@mui/material";
import React, { useState } from "react";
import AxiosConnect from "../../../utils/AxiosConnect";
import useClientStore from "../../../zustand/ClientStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import AccountSidebar from "./AccountSidebar";
function AccountDetails(props) {
  const [formData, setFormData] = useState();
  const { openSnackbar } = useSnackbarStore();
  const { setClient } = useClientStore();
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
    if (allowedTypes.includes(selectedFile?.type)) {
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

  const handleUploadProfilePicture = async (event) => {
    event.preventDefault();
    if (!newProfilePictureData.file) {
      console.error("No file has been attached");
      return;
    }
    const formData = new FormData();
    formData.append("image", newProfilePictureData.file);
    try {
      // Send the multipart form data using Axios
      const response = await AxiosConnect.patchMultipart(
        "/gleek/client/updateProfilePicture",
        formData,
      );
      console.log(response);

      setClient(response.data.client);
      openSnackbar("Uploaded image!", "success");
    } catch (error) {
      console.error("Error uploading file:", error);
      // Handle the error as needed (e.g., show a message to the user)
    }
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
