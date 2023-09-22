import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";
import {
  Alert,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  IconButton,
  MenuItem,
  Select,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { validator } from "../../utils/VendorFieldsValidator";

const CreateVendorForm = ({ vendorTypes, addVendor, admin }) => {
  const [formData, setFormData] = useState({
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
    brandNames: [],
    companySocials: {},
    adminCreated: admin.id,
  });
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setError] = useState(false);
  const [errorData, setErrorData] = useState({
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
  const [socialMediaFields, setSocialMediaFields] = useState([
    { platform: "", url: "" },
  ]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

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

  const handleValidate = (event) => {
    const { name, value } = event.target;
    const errors = validator(formData, name);
    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "", // Replace the error with an empty string if it's empty
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

  const updateCompanySocials = () => {
    const updatedCompanySocials = socialMediaFields.reduce(
      (acc, { platform, url }) => {
        acc[platform] = url;
        return acc;
      },
      {}
    );

    setFormData((prevData) => ({
      ...prevData,
      companySocials: updatedCompanySocials,
    }));
  };

  const handlePlatformChange = (index, value) => {
    const updatedFields = [...socialMediaFields];
    updatedFields[index].platform = value;
    setSocialMediaFields(updatedFields);
    updateCompanySocials();
  };

  const handleURLChange = (index, value) => {
    const updatedFields = [...socialMediaFields];
    updatedFields[index].url = value;
    setSocialMediaFields(updatedFields);
    updateCompanySocials();
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

  const addField = () => {
    setSocialMediaFields([...socialMediaFields, { platform: "", url: "" }]);
    updateCompanySocials();
  };

  const removeField = (index) => {
    const updatedFields = [...socialMediaFields];
    updatedFields.splice(index, 1);
    setSocialMediaFields(updatedFields);
    updateCompanySocials();
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setIsOpen(false);
      setError(false);
      return;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    for (const fieldName in formData) {
      let errors = validator(formData, fieldName);
      const newdata = { [fieldName]: errors[fieldName] };
      setErrorData({ ...errorData, ...newdata });
    }
    for (let field of socialMediaFields) {
      const { platform, url } = field;
      handleSocialMediaValidate(platform);
      handleURLValidate(url);
    }
    for (const key in errorData) {
      if (errorData[key] !== "") {
        setError(true);
        return;
      }
    }
    if (!Object.values(errorData).every((error) => error === "")) {
      setError(true);
    }

    try {
      const responseStatus = await addVendor(formData);
      if (responseStatus) {
        console.log("success");
        setIsOpen(true);
      }
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      setError(true);
    }
  };
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
      minHeight="90vh"
    >
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
            <Typography
              variant="body2"
              color="rgba(0, 0, 0, 0.6)"
              style={{ paddingBottom: "10px" }}
            >
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
              style={{
                marginLeft: "10px",
                marginTop: "10px",
                marginBottom: "10px",
              }}
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
              <Grid container spacing={2} key={index} paddingBottom={2}>
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
                  <IconButton onClick={() => removeField(index)}>
                    <DeleteIcon />
                  </IconButton>
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
        <Grid item xs={24} md={12}>
          <Button
            sx={{ marginTop: "24px" }}
            mt={4}
            variant="contained"
            type="submit"
            onClick={handleSubmit}
          >
            <Typography variant="body1">Add Vendor</Typography>
          </Button>
        </Grid>
      </Grid>

      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Vendor Created Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {!errorData
            ? "Error creating form!"
            : Object.values(errorData)?.map((item, key) => (
                <div key={key}>{item}</div>
              ))}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default CreateVendorForm;
