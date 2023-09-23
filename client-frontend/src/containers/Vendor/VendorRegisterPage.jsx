import React, { useEffect, useState } from "react";
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
  Grid,
  FormControlLabel,
  Checkbox,
  MenuItem,
  Select,
  Chip,
} from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import { useTheme } from "@mui/material/styles";
import LockPersonIcon from "@mui/icons-material/LockPerson";
import { useNavigate } from "react-router-dom";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import registerImage from "../../assets/register.png";
import { validator } from "../../utils/VendorFieldsValidator";
import TermsAndConditionsModal from "../../components/Modals/TermsAndConditionsModal";
import useVendorStore from "../../zustand/VendorStore";
const VendorRegisterPage = () => {
  // themes
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  // states
  // user input
  const [showPassword, setShowPassword] = useState(false);
  const { registerVendor } = useVendorStore();
  const { openSnackbar } = useSnackbarStore();
  const [showPasswordVerify, setShowPasswordVerify] = useState(false);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    password: "",
    companyUEN: "",
    companyEmail: "",
    companyName: "",
    companyAddress: "",
    companyPostalCode: "",
    companyPhoneNumber: "",
    passwordVerify: "",
    vendorType: "",
    vendorDetails: "",
    customCompanyType: "",
    // Client consent
    acceptTermsAndConditions: false,
    brandNames: [],
    companySocials: {},
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

  // Modal
  const [open, setOpen] = useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const vendorTypes = {
    B_CORP: "B Corp",
    SOCIAL_ENTERPRISE: "Social Enterprise",
    NON_PROFIT: "Non-profit",
    SMALL_BUSINESS: "Small Business",
    OTHER: "Other",
  };

  // functions
  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const handleClickShowPasswordVerify = () =>
    setShowPasswordVerify((show) => !show);

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

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

  const handleAcceptTermsChange = (event) => {
    const { checked } = event.target;

    setFormData((prevData) => ({
      ...prevData,
      acceptTermsAndConditions: checked,
    }));
  };

  const disableButton = () => {
    console.log(errorData);
    return (
      !Object.values(errorData).every((error) => error === "") ||
      !formData.acceptTermsAndConditions
    );
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

  const handleDeleteChip = (chipToDelete) => {
    setFormData((prevData) => ({
      ...prevData,
      brandNames: prevData.brandNames.filter((chip) => chip !== chipToDelete),
    }));
  };

  const handleSubmit = async (event) => {
    "";
    event.preventDefault();
    for (const fieldName in formData) {
      let errors = validator(formData, fieldName);
      setErrorData((prevData) => ({
        ...prevData,
        [fieldName]: errors[fieldName] || "",
      }));
    }
    for (let field of socialMediaFields) {
      const { platform, url } = field;
      handleSocialMediaValidate(platform);
      handleURLValidate(url);
    }
    if (!Object.values(errorData).every((error) => error === "")) {
      openSnackbar(
        "There are errors in your Vendor registration details.",
        "error",
      );
      return;
    }

    try {
      console.log(formData);
      const responseStatus = await registerVendor(formData);

      if (responseStatus) {
        openSnackbar("Register was successful!", "success");
        navigate("/");
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };

  // company socials
  const [socialMediaFields, setSocialMediaFields] = useState([
    { platform: "", url: "" },
  ]);

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

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
      minHeight="90vh"
    >
      <Box
        display="flex"
        component="form"
        flexDirection="column"
        p={4}
        bgcolor={"grey.50"}
        borderRadius={10}
        sx={{ minWidth: "25rem", width: "50%" }}
        alignItems="center"
        boxShadow={1}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          padding={3}
        >
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            width="50px"
            height="50px"
            bgcolor={primary}
            borderRadius="50%"
          >
            <LockPersonIcon fontSize="large" color="accent" />
          </Box>
          <Typography color="secondary" variant="h3">
            Register as a Vendor
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
              defaultValue="65"
              onChange={handleChange}
              onBlur={handleValidate}
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
              onChange={handleChange}
              onBlur={handleValidate}
              helperText={errorData.companyPostalCode}
              error={errorData.companyPostalCode.length > 0}
            />
          </Grid>
          {/* Password Field */}
          <Grid item xs={12} md={6}>
            <FormControl
              size="small"
              required
              variant="outlined"
              sx={{ width: "100%" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Password
              </InputLabel>
              <OutlinedInput
                id="password"
                name="password"
                onChange={handleChange}
                onBlur={handleValidate}
                value={formData.password}
                type={showPassword ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
              {errorData.password.length > 0 && (
                <FormHelperText error id="my-helper-text">
                  {errorData.password}
                </FormHelperText>
              )}
            </FormControl>
          </Grid>
          {/* Confirm Password Field */}
          <Grid item xs={12} md={6}>
            <FormControl
              size="small"
              required
              variant="outlined"
              sx={{ width: "100%" }}
            >
              <InputLabel htmlFor="outlined-adornment-password">
                Confirm your password
              </InputLabel>
              <OutlinedInput
                id="passwordVerify"
                name="passwordVerify"
                onChange={handleChange}
                onBlur={handleValidate}
                value={formData.passwordVerify}
                type={showPasswordVerify ? "text" : "password"}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPasswordVerify}
                      onMouseDown={handleMouseDownPassword}
                      edge="end"
                    >
                      {showPasswordVerify ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Confirm your password"
              />
              {errorData.passwordVerify.length > 0 && (
                <FormHelperText error id="my-helper-text">
                  {errorData.passwordVerify}
                </FormHelperText>
              )}
            </FormControl>
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
              helperText={errorData.vendorDetails}
              error={errorData.vendorDetails.length > 0}
              sx={{ width: "100%" }}
            />
          </Grid>
          <Grid item xs={12} md={12}>
            <Box display="flex" flexDirection="row">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={formData.acceptTermsAndConditions}
                    onChange={handleAcceptTermsChange} // Update formData.acceptTermsAndConditions
                    name="acceptTermsAndConditions"
                    color="primary"
                  />
                }
                label="I agree to the Terms & Conditions of Gleek."
              />

              <Button width="5rem" onClick={handleOpen}>
                Open T&C
              </Button>
              <TermsAndConditionsModal open={open} handleClose={handleClose} />
            </Box>
          </Grid>
        </Grid>

        <Button
          sx={{ marginTop: "24px" }}
          mt={4}
          variant="contained"
          type="submit"
          disabled={disableButton()}
          onClick={handleSubmit}
        >
          <Typography variant="body1">Register</Typography>
        </Button>
        <Button
          sx={{ marginTop: "16px" }}
          variant="text"
          onClick={() => {
            navigate("/vendor/login");
          }}
        >
          <Typography fontWeight={700} color="secondary" variant="body2">
            Already a Member? Login
          </Typography>
        </Button>
      </Box>

      <Box
        width={"30%"}
        component="img"
        sx={{
          maxHeight: "auto",
          maxWidth: "100%",
        }}
        alt="Communication illustrations by Storyset"
        src={registerImage}
      />
    </Box>
  );
};

export default VendorRegisterPage;
