import React, { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  Typography,
  IconButton,
  FormControl,
  FormHelperText,
  Grid,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AccountSidebarVendor from "./AccountSidebarVendor";
import useVendorStore from "../../zustand/VendorStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import { validator } from "../../utils/VendorFieldsValidator";

function AccountDetailsVendor(props) {
  const { vendor, updateAccount } = useVendorStore();
  const { openSnackbar, closeSnackbar } = useSnackbarStore();
  const [formData, setFormData] = useState({
    ...vendor,
    customCompanyType: vendor.hasOwnProperty("customCompanyType")
      ? vendor.customCompanyType
      : "",
  });
  const [errorData, setErrorData] = useState({
    password: "",
    companyEmail: "",
    companyUEN: "",
    companyName: "",
    companyAddress: "",
    companyPostalCode: "",
    companyPhoneNumber: "",
    vendorType: "",
    passwordVerify: "",
    vendorDetails: "",
    customCompanyType: "",
    brandNames: "",
    socialMedia: "",
    url: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // When a field loses focus, validate the field.
  const handleValidate = (event) => {
    const { name, value } = event.target;
    const errors = validator(formData, name);
    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "", // Replace the error with an empty string if it's empty
    }));
  };

  // Vendor Type Select Manu
  const handleMenuChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      vendorType: value,
      // Clear the custom input when a predefined option is selected
      customCompanyType: "",
    }));
    setErrorData((prevData) => ({
      ...prevData,
      vendorType: "",
    }));
  };

  const handleVendorTypeErrorCheck = (event) => {
    const errors = validator(formData, "vendorType");
    setErrorData((prevData) => ({
      ...prevData,
      vendorType: errors["vendorType"] || "", // Replace the error with an empty string if it's empty
    }));
  };

  const handleVendorCustomTypeChange = (event) => {
    setFormData((prevData) => ({
      ...prevData,
      vendorType: "Other",
      customCompanyType: event.target.value,
    }));
  };

  // Chips
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const vendorTypes = {
    B_CORP: "B Corp",
    SOCIAL_ENTERPRISE: "Social Enterprise",
    NON_PROFIT: "Non-profit",
    SMALL_BUSINESS: "Small Business",
    OTHER: "Other",
  };

  const handleAddChip = () => {
    const trimmedValue = inputValue.trim();
    if (trimmedValue === "" || formData.brandNames.includes(trimmedValue)) {
      return;
    }
    setFormData((prevData) => ({
      ...prevData,
      brandNames: [...prevData.brandNames, inputValue],
    }));
    setInputValue("");
  };

  const handleBrandNamesValidate = () => {
    const trimmedValue = inputValue.trim();
    if (formData.brandNames.includes(trimmedValue)) {
      setErrorData((prevData) => ({
        ...prevData,
        brandNames: "This chip already exists." || "", // Replace the error with an empty string if it's empty
      }));
      return;
    }
    setErrorData((prevData) => ({
      ...prevData,
      brandNames: "", // Replace the error with an empty string if it's empty
    }));
  };

  // company socials
  const [socialMediaFields, setSocialMediaFields] = useState(
    Object.keys(vendor.companySocials).map((key) => ({
      platform: key.toString(),
      url: vendor.companySocials[key].toString(),
    })),
  );

  useEffect(() => {
    const updatedCompanySocials = {};
    for (const socialMedia of socialMediaFields) {
      updatedCompanySocials[socialMedia.platform] = socialMedia.url;
    }
    setFormData((prevData) => ({
      ...prevData,
      companySocials: updatedCompanySocials,
    }));
  }, [socialMediaFields]);

  const addField = () => {
    setSocialMediaFields([...socialMediaFields, { platform: "", url: "" }]);
  };

  const removeField = (index) => {
    const updatedFields = [...socialMediaFields];
    updatedFields.splice(index, 1);
    setSocialMediaFields(updatedFields);
  };

  const handlePlatformChange = (index, value) => {
    const updatedFields = [...socialMediaFields];
    updatedFields[index].platform = value;
    setSocialMediaFields(updatedFields);
  };

  const handleURLChange = (index, value) => {
    const updatedFields = [...socialMediaFields];
    updatedFields[index].url = value;
    setSocialMediaFields(updatedFields);
  };

  const handleSocialMediaValidate = (platform) => {
    platform = platform ? platform : "";
    const trimmedPlatform = platform.trim();
    if (trimmedPlatform === "") {
      setErrorData((prevData) => ({
        ...prevData,
        socialMedia: "Please do not leave any blanks for Social Media!",
      }));
      return;
    }
    setErrorData((prevData) => ({
      ...prevData,
      socialMedia: "",
    }));
  };

  const handleDeleteChip = (chipToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      brandNames: prevData.brandNames.filter((chip) => chip !== chipToDelete),
    }));
  };

  const handleURLValidate = (url) => {
    url = url ? url : "";
    const trimmedURL = url.trim();
    if (trimmedURL === "") {
      setErrorData((prevData) => ({
        ...prevData,
        url: "Please do not leave any blanks for URLs!",
      }));
      return;
    }
    if (!url.startsWith("http://") && !url.startsWith("https://")) {
      setErrorData((prevData) => ({
        ...prevData,
        url: "URLs must start with http:// or https://",
      }));
      return;
    }
    setErrorData((prevData) => ({
      ...prevData,
      url: "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    let customCompanyTypeError = "";
    for (const fieldName in formData) {
      let errors = validator(formData, fieldName);
      if (fieldName === "customCompanyType" && !errors) {
        customCompanyTypeError = "error";
      }
      setErrorData((prevData) => ({
        ...prevData,
        [fieldName]: errors[fieldName] || "",
      }));
    }
    console.log(errorData);
    for (let field of socialMediaFields) {
      const { platform, url } = field;
      handleSocialMediaValidate(platform);
      handleURLValidate(url);
    }
    if (
      customCompanyTypeError &&
      !Object.values(errorData).every((error) => error === "")
    ) {
      openSnackbar("There are errors in your Vendor update details.", "error");
      return;
    }

    try {
      console.log(formData);
      const responseStatus = await updateAccount(formData);

      if (responseStatus) {
        openSnackbar("Update was successful!", "success");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };

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
        <AccountSidebarVendor />
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
            Account Details
          </Typography>
        </Box>
        <Grid container spacing={3}>
          <Grid item p={0} xs={12} md={6}>
            {/*Company Name*/}
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="companyName"
              required
              name="companyName"
              placeholder="Company Name"
              value={formData.companyName}
              label="Company Name"
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.companyName}
              error={errorData.companyName.length > 0}
            />
          </Grid>
          {/*Company UEN*/}
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="companyUEN"
              required
              name="companyUEN"
              placeholder="Company UEN"
              label="Company UEN"
              value={formData.companyUEN}
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.companyUEN}
              error={errorData.companyUEN.length > 0}
            />
          </Grid>
          {/*Company Email*/}
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="companyEmail"
              required
              name="companyEmail"
              placeholder="Company Email"
              label="Company Email"
              onChange={handleChange}
              onBlur={handleValidate}
              value={formData.companyEmail}
              helperText={errorData.companyEmail}
              error={errorData.companyEmail.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="companyPhoneNumber"
              required
              name="companyPhoneNumber"
              placeholder="Company Phone Number"
              label="Company Phone Number"
              onChange={handleChange}
              onBlur={handleValidate}
              value={formData.companyPhoneNumber}
              helperText={errorData.companyPhoneNumber}
              error={errorData.companyPhoneNumber.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              multiline
              autoComplete="on"
              id="companyAddress"
              required
              name="companyAddress"
              placeholder="Company Address"
              label="Company Address"
              onChange={handleChange}
              onBlur={handleValidate}
              value={formData.companyAddress}
              helperText={errorData.companyAddress}
              error={errorData.companyAddress.length > 0}
            />
          </Grid>
          <Grid item p={0} xs={12} md={6}>
            <TextField
              sx={{ width: "100%" }}
              size="small"
              autoComplete="on"
              id="companyPostalCode"
              required
              name="companyPostalCode"
              placeholder="Company Postal Code"
              label="Company Postal Code"
              value={formData.companyPostalCode}
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.companyPostalCode}
              error={errorData.companyPostalCode.length > 0}
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
              Company Type:
            </Typography>
            <FormControl fullWidth size="small">
              <Select
                value={formData.vendorType}
                onChange={handleMenuChange}
                onOpen={handleVendorTypeErrorCheck}
              >
                <MenuItem disabled value="">
                  <em>Select an option</em>
                </MenuItem>
                {Object.values(vendorTypes).map((value) => (
                  <MenuItem key={value} value={value}>
                    {value}
                  </MenuItem>
                ))}
              </Select>
              {errorData.vendorType && (
                <FormHelperText error id="vendor-type-helper-text">
                  {errorData.vendorType}
                </FormHelperText>
              )}
            </FormControl>
            {formData.vendorType === "Other" && (
              <TextField
                id="customCompanyType"
                name="customCompanyType"
                label="Other"
                fullWidth
                size="small"
                onBlur={handleValidate}
                value={formData.customCompanyType}
                onChange={handleVendorCustomTypeChange}
                helperText={errorData.customCompanyType}
                error={errorData.customCompanyType.length > 0}
                sx={{ marginTop: "16px" }}
              />
            )}
          </Grid>
          <Grid item xs={24} md={12}>
            {" "}
            <Box>
              <Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
                Brand Names
              </Typography>
              <TextField
                label="Add a brand name"
                variant="outlined"
                value={inputValue}
                onChange={handleInputChange}
                helperText={errorData.brandNames}
                error={errorData.brandNames.length > 0}
                onBlur={handleBrandNamesValidate}
              />
              <Button
                onClick={handleAddChip}
                variant="outlined"
                style={{ marginLeft: "10px" }}
              >
                Add
              </Button>
              <Box>
                {formData.brandNames.map((chip, index) => (
                  <Chip
                    key={index}
                    label={chip}
                    onDelete={() => handleDeleteChip(chip)}
                    style={{ margin: "5px" }}
                  />
                ))}
              </Box>
            </Box>
          </Grid>
          <Grid item xs={24} md={14}>
            <Typography variant="body2" color="rgba(0, 0, 0, 0.6)">
              Company Socials
            </Typography>
            {errorData.socialMedia.length > 0 && (
              <Typography variant="body2" color="error">
                {errorData.socialMedia}
              </Typography>
            )}
            {errorData.url.length > 0 && (
              <Typography variant="body2" color="error">
                {errorData.url}
              </Typography>
            )}
            <Box mt={2}>
              {socialMediaFields.map((field, index) => (
                <Grid container spacing={2} key={index}>
                  <Grid item xs={4}>
                    <TextField
                      label="Social Media"
                      size="small"
                      id="socialMedia"
                      name="socialMedia"
                      fullWidth
                      variant="outlined"
                      value={field.platform}
                      onChange={(e) =>
                        handlePlatformChange(index, e.target.value)
                      }
                      onBlur={() => handleSocialMediaValidate(field.platform)}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      size="small"
                      label="URL"
                      id="url"
                      multiline
                      fullWidth
                      variant="outlined"
                      value={field.url}
                      onChange={(e) => handleURLChange(index, e.target.value)}
                      onBlur={() => handleURLValidate(field.url)}
                    />
                  </Grid>
                  <Grid item xs={1}>
                    {index > 0 && (
                      <IconButton onClick={() => removeField(index)}>
                        <DeleteIcon />
                      </IconButton>
                    )}
                  </Grid>
                </Grid>
              ))}
              <Grid item xs={1}>
                <IconButton onClick={addField}>
                  <AddIcon />
                </IconButton>
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={24} md={12}>
            <TextField
              size="large"
              multiline
              autoComplete="on"
              id="vendorDetails"
              required
              name="vendorDetails"
              placeholder="Vendor Details"
              label="Vendor Details"
              onChange={handleChange}
              onBlur={handleValidate}
              value={formData.vendorDetails}
              helperText={errorData.vendorDetails}
              error={errorData.vendorDetails.length > 0}
              sx={{ width: "100%" }}
            />
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "32px" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={!Object.values(errorData).every((error) => error === "")}
          onClick={handleSubmit}
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default AccountDetailsVendor;
