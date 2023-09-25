/* eslint-disable react/prop-types */
import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import {
  Alert,
  Avatar,
  Box,
  Button,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import Autocomplete from "@mui/material/Autocomplete";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import InputAdornment from "@mui/material/InputAdornment";
import Paper from "@mui/material/Paper";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import Snackbar from "@mui/material/Snackbar";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { useEffect, useState } from "react";
import {
  ActivityDayAvailabilityEnum,
  ActivityTypeEnum,
  FoodCategoryEnum,
  LocationEnum,
  SustainableDevelopmentGoalsEnum,
} from "../../utils/TypeEnum";
import { useActivityStore } from "../../zustand/GlobalStore";
import ImageAndFileUpload from "./ImageAndFileUpload";

const StyledButton = styled(Button)`
  padding-left: 6px;
`;
const StyledContainer = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  box-shadow: 4px 4px 0px 0px rgb(159 145 204 / 40%);
`;
const StyledSubmitButton = styled(Button)`
  && {
    background-color: ${({ theme }) => theme.palette.light_purple.main};
  }
`;

const CreateActivityForm = ({ themes, theme, vendors, admin }) => {
  const { createActivity } = useActivityStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setError] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState();
  const [selectedSubTheme, setSelectedSubTheme] = useState([]);
  const [subthemes, setSubthemes] = useState([]);

  const [maxParticipants, setMaxParticipants] = useState();
  const [markup, setMarkup] = useState();
  const [activityType, setActivityType] = useState("");
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const [activityPricingRuleList, setData] = useState([]);
  const [clientActivityPricingRule, setClientActivityPricingRule] = useState(
    []
  );
  const [isFood, setIsFood] = useState(false);
  const [isFoodCertPending, setIsFoodCertPending] = useState(false);
  const [selectedFoodCat, setSelectedFoodCat] = useState([]);
  const [foodCertDate, setFoodCertDate] = useState(null);
  const [location, setLocation] = useState("");
  const [popupitems, setPopupitems] = useState();
  const [sdg, setSdg] = useState([]);
  const [dayAvailabilities, setDayAvailabilities] = useState([]);
  const [duration, setDuration] = useState();
  const [formErrors, setFormErrors] = useState();
  const [activityImages, setActivityImages] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState();
  const [pendingCertType, setPendingCertType] = useState();

  const foodCategories = Object.values(FoodCategoryEnum);
  const sdgList = Object.values(SustainableDevelopmentGoalsEnum);
  const columns = 4;
  const optionsPerColumn = 5;

  const stringAvatar = (name, theme) => {
    const initials = name
      ?.split(" ")
      ?.map((word) => word[0])
      ?.join("");
    return {
      sx: {
        bgcolor: theme.palette.light_purple.main,
      },
      children: initials,
    };
  };

  const columnsArray = [];
  for (let i = 0; i < columns; i++) {
    const startIndex = i * optionsPerColumn;
    const endIndex = startIndex + optionsPerColumn;
    columnsArray.push(sdgList.slice(startIndex, endIndex));
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      setIsOpen(false);
      setError(false);
      return;
    }
  };

  const handleThemeChange = (event) => {
    const themeId = event.target.value;
    setSelectedTheme(themeId);
    setSubthemes(
      themes?.find((theme) => theme.parent?._id === themeId)?.children
    );
  };

  const handleSubThemeChange = (event) => {
    const themeId = event.target.value;
    setSelectedSubTheme(themeId);
  };

  const handleMaxParticipantsChange = (event) => {
    const limitChar = 4;
    let newMaxParticipants = 0;
    if (event.target.value.toString().length <= limitChar) {
      newMaxParticipants = parseInt(event.target.value, 10) || null;
      setMaxParticipants(newMaxParticipants);
    } else {
      newMaxParticipants = maxParticipants;
    }

    const newData = [];
    for (let i = 0; i < Math.ceil(newMaxParticipants / 10); i++) {
      const startRange = i * 10 + 1;
      const endRange = startRange + 9;
      newData.push({
        paxInterval: `${startRange} - ${endRange}`,
        pricePerPax: null,
        weekendAddon: 0,
        publicHolidayAddon: 0,
        onlineAddon: 0,
        offlineAddon: 0,
      });
      if (startRange + 9 === 50 && newMaxParticipants > 50) {
        newData.push({
          paxInterval: `> ${50}`,
          pricePerPax: null,
          weekendAddon: 0,
          publicHolidayAddon: 0,
          onlineAddon: 0,
          offlineAddon: 0,
        });
        break;
      }
    }
    setData(newData);
  };

  const handlePricingRuleFieldChange = (event, rowIndex, columnName) => {
    const newVal = event.target.value;
    const updatedData = [...activityPricingRuleList];
    const updatedClientData = [...clientActivityPricingRule];
    const oldValue = updatedClientData?.[rowIndex]?.[columnName];
    if (oldValue !== undefined) {
      updatedClientData[rowIndex][columnName] = Math.ceil(
        parseFloat(newVal) * (parseFloat(markup) / 100) + parseFloat(newVal)
      );
    }
    updatedData[rowIndex][columnName] = newVal;
    setData(updatedData);
    setClientActivityPricingRule(updatedClientData);
  };

  const handleMarkupChange = (event) => {
    const newMarkup = event.target.value;
    setMarkup(event.target.value);
    const newActivityPricingRule = [];
    activityPricingRuleList.forEach((rule) => {
      const {
        paxInterval,
        pricePerPax,
        weekendAddon,
        publicHolidayAddon,
        onlineAddon,
        offlineAddon,
      } = rule;
      newActivityPricingRule.push({
        paxInterval,
        pricePerPax: Math.ceil(
          parseFloat(pricePerPax) * (parseFloat(newMarkup) / 100) +
            parseFloat(pricePerPax)
        ),
        weekendAddon: Math.ceil(
          parseFloat(weekendAddon) * (parseFloat(newMarkup) / 100) +
            parseFloat(weekendAddon)
        ),
        publicHolidayAddon: Math.ceil(
          parseFloat(publicHolidayAddon) * (parseFloat(newMarkup) / 100) +
            parseFloat(publicHolidayAddon)
        ),
        onlineAddon: Math.ceil(
          parseFloat(onlineAddon) * (parseFloat(newMarkup) / 100) +
            parseFloat(onlineAddon)
        ),
        offlineAddon: Math.ceil(
          parseFloat(offlineAddon) * (parseFloat(newMarkup) / 100) +
            parseFloat(offlineAddon)
        ),
      });
      return;
    });
    setClientActivityPricingRule(newActivityPricingRule);
  };

  const handleActivityTypeChange = (event) => {
    setActivityType(event.target.value);
  };

  const handleIsFoodChange = (event) => {
    setIsFood(event.target.value === "true" ? true : false);
  };

  const handleIsFoodCertPendingChange = (event) => {
    setIsFoodCertPending(event.target.value === "true" ? true : false);
  };

  const handleFoodCertDateChange = (date) => {
    setFoodCertDate(date);
  };

  const handleFoodCatChange = (event) => {
    const foodLabel = event.target.name;
    if (event.target.checked) {
      setSelectedFoodCat([...selectedFoodCat, foodLabel]);
    } else {
      setSelectedFoodCat(selectedFoodCat.filter((food) => food !== foodLabel));
    }
  };

  const handlePopupItemsChange = (event) => {
    setPopupitems(event.target.value);
  };

  const handleLocationTypeChange = (event) => {
    setLocation(event.target.value);
  };

  const handleTitleChange = (event) => {
    setTitle(event.target.value);
  };

  const handleDescriptionChange = (event) => {
    setDescription(event.target.value);
  };

  const handleSdgChange = async (event) => {
    const selectedSdg = event.target.name;
    if (event.target.checked) {
      setSdg([...sdg, selectedSdg]);
    } else {
      setSdg(sdg.filter((s) => s !== selectedSdg));
    }
  };

  const handleDayAvailabilitiesChange = async (event) => {
    setDayAvailabilities(event.target.value);
  };

  const handleDurationChange = async (event) => {
    setDuration(event.target.value);
  };

  const handleVendorChange = (event, newValue) => {
    if (newValue) {
      setSelectedVendor(newValue._id);
    } else {
      setSelectedVendor(null);
    }
  };
  const handlePendingCertTypeChange = (event) => {
    setPendingCertType(event.target.value);
  };

  const validateForm = () => {
    const errors = {};
    const priceError = {};
    activityPricingRuleList.forEach((rule, rowIndex) => {
      if (rule.pricePerPax === null) {
        priceError[rowIndex] = "Price per pax is required!";
      }
    });
    if (Object.keys(priceError).length > 0) {
      errors.activityPricingRules = priceError;
    }

    if (!selectedTheme || selectedTheme?.length === 0) {
      errors.theme = "Please select a theme!";
    }
    if (!selectedSubTheme || selectedSubTheme?.length === 0) {
      errors.subtheme = "Please select at least one learning point!";
    }

    if (!dayAvailabilities || dayAvailabilities?.length === 0) {
      errors.dayAvailabilities = "At least one Day Availability is required!";
    }
    if (!sdg || sdg?.length === 0) {
      errors.sdg = "At least one sustainability goal needs to be provided!";
    }
    if (!title) {
      errors.title = "Title is required!";
    }
    if (!description) {
      errors.description =
        "Please provide a short description of your activity!";
    }
    if (!activityType || activityType === "") {
      errors.activityType = "Activity Type is required!";
    }

    if (!location || location === "") {
      errors.location = "Location is required!";
    }

    if (!duration) {
      errors.duration = "Duration is required!";
    }

    if (!maxParticipants) {
      errors.maxParticipants = "Max. Participants is required!";
    }

    if (!markup) {
      errors.markup = "Markup percentage is required!";
    }

    if (
      activityType &&
      activityType === ActivityTypeEnum.POPUP &&
      (!popupitems || popupitems === "")
    ) {
      errors.popupitems = "Please fill in popup items sold!";
    }
    if (
      activityType &&
      activityType === ActivityTypeEnum.POPUP &&
      !selectedFoodCat
    ) {
      errors.foodCat = "Please select at least one food category!";
    }

    if (
      activityType &&
      activityType === ActivityTypeEnum.POPUP &&
      isFood &&
      isFoodCertPending &&
      (!pendingCertType || pendingCertType === "")
    ) {
      errors.pendingCertType = "Please fill in pending cert type!";
    }

    if (
      activityType &&
      activityType === ActivityTypeEnum.POPUP &&
      isFood &&
      isFoodCertPending &&
      !foodCertDate
    ) {
      errors.foodCertDate = "Please fill in expected certification date!";
    }

    if (!selectedVendor || selectedVendor === "") {
      errors.vendor = "Please select a vendor";
    }

    if (!activityImages || activityImages?.length === 0) {
      errors.activityImages =
        "Please upload at least one photo of your activity!";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setSelectedTheme();
    setSelectedSubTheme([]);
    setSubthemes([]);
    setMaxParticipants();
    setMarkup();
    setActivityType("");
    setTitle();
    setDescription();
    setData([]);
    setIsFood(false);
    setIsFoodCertPending(false);
    setSelectedFoodCat([]);
    setFoodCertDate(null);
    setLocation("");
    setPopupitems();
    setSdg([]);
    setDayAvailabilities([]);
    setDuration();
    setFormErrors({});
    setActivityImages([]);
    setSelectedVendor();
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("adminCreated", admin._id);
    formData.append("title", title);
    formData.append("description", description);
    formData.append(
      "activityType",
      activityType === ActivityTypeEnum.POPUP
        ? isFood
          ? "Popups (Food)"
          : "Popups (Non-food)"
        : activityType
    );
    formData.append("maxParticipants", maxParticipants);
    formData.append("clientMarkupPercentage", markup);
    formData.append("duration", duration);
    formData.append("theme", selectedTheme);
    formData.append("location", location);
    dayAvailabilities.forEach((obj, index) => {
      formData.append("dayAvailabilities", obj);
    });
    selectedSubTheme.forEach((obj, index) => {
      formData.append("subtheme", obj);
    });
    sdg.forEach((obj, index) => {
      formData.append("sdg", obj);
    });
    activityPricingRuleList.forEach((pricingRuleObj, index) => {
      const pricingJSON = JSON.stringify(pricingRuleObj);
      formData.append("activityPricingRules", pricingJSON);
    });
    clientActivityPricingRule.forEach((pricingRuleObj, index) => {
      const pricingJSON = JSON.stringify(pricingRuleObj);
      formData.append("clientActivityPricingRules", pricingJSON);
    });
    if (activityType === ActivityTypeEnum.POPUP) {
      {
        formData.append("popupItemsSold", popupitems);
        if (isFood) {
          formData.append("isFoodCertPending", isFoodCertPending);
          if (isFoodCertPending) {
            formData.append("foodCertDate", foodCertDate?.toISOString());
            selectedFoodCat.forEach((obj, index) => {
              formData.append("foodCategory", obj);
            });
          }
        }
      }
    }
    formData.append("linkedVendor", selectedVendor);
    formData.append("pendingCertificationType", pendingCertType);

    for (let i = 0; i < activityImages.length; i++) {
      formData.append("images", activityImages[i]);
    }

    if (validateForm()) {
      try {
        const responseStatus = await createActivity(formData);
        resetForm();
        setIsOpen(true);
      } catch (error) {
        setError(true);
      }
    } else {
      setError(true);
    }
  };

  useEffect(() => {
    if (selectedTheme && subthemes.length > 0) {
      setSelectedSubTheme([subthemes[0]._id]);
    }
  }, [selectedTheme, subthemes]);

  return (
    <form>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "16px",
        }}
      >
        <StyledContainer elevation={3}>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
              >
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                variant="standard"
                id="title"
                name="title"
                placeholder="Title"
                label="Title"
                disabled={false}
                fullWidth
                value={title ?? ""}
                onChange={handleTitleChange}
                helperText={formErrors?.title}
                error={
                  (title !== null && title?.length === 0) ||
                  formErrors?.title?.length > 0
                }
              />
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth error={formErrors?.theme?.length > 0}>
                <InputLabel id="themeLabel" required>
                  Theme
                </InputLabel>
                <Select
                  labelId="themeLabel"
                  label="Theme"
                  placeholder="Theme"
                  onChange={handleThemeChange}
                  value={selectedTheme || ""}
                >
                  {themes?.map(
                    (item, index) =>
                      item.parent && (
                        <MenuItem key={index} value={item.parent._id}>
                          {item.parent.name}
                        </MenuItem>
                      )
                  )}
                </Select>
                <FormHelperText error>{formErrors?.theme}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth error={formErrors?.subtheme?.length > 0}>
                <InputLabel id="subThemeLabel">Learning Points</InputLabel>
                <Select
                  labelId="subThemeLabel"
                  label="Sub-Theme"
                  placeholder="Theme"
                  multiple
                  onChange={handleSubThemeChange}
                  value={selectedSubTheme || ""}
                >
                  {subthemes.map((subtheme, index) => (
                    <MenuItem key={index} value={subtheme._id}>
                      {subtheme.name}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={formErrors?.subtheme?.length > 0}>
                  Select one or more learning points based on theme
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                id="filled-textarea"
                label="Description"
                placeholder="Write details about your activity here..."
                multiline
                rows={4}
                fullWidth
                onChange={handleDescriptionChange}
                value={description ?? ""}
                required
                helperText={formErrors?.description}
                error={
                  (description !== null && description?.length === 0) ||
                  formErrors?.description?.length > 0
                }
              />
            </Grid>
          </Grid>
        </StyledContainer>
        <StyledContainer elevation={3}>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
              >
                Vendor Details
              </Typography>
              <Grid item xs={6} paddingTop={2}>
                <FormControl fullWidth error={formErrors?.vendor?.length > 0}>
                  <Autocomplete
                    onChange={handleVendorChange}
                    disablePortal
                    id="combo-box-demo"
                    options={vendors}
                    sx={{ width: 300 }}
                    getOptionLabel={(vendor) => vendor.companyName}
                    renderOption={(props, vendor) => (
                      <div {...props}>
                        <Avatar
                          style={{ marginRight: 6 }}
                          src={vendor?.preSignedPhoto}
                          {...(vendor?.preSignedPhoto
                            ? {}
                            : stringAvatar(vendor?.companyName, theme))}
                        />
                        {vendor?.companyName} - {vendor?.companyUEN}
                      </div>
                    )}
                    renderInput={(params) => (
                      <TextField
                        error={formErrors?.vendor?.length > 0}
                        {...params}
                        label="Pick from existing vendor"
                      />
                    )}
                    value={
                      vendors.find((vendor) => vendor._id === selectedVendor) ||
                      null
                    }
                  />
                  <FormHelperText error>{formErrors?.vendor}</FormHelperText>
                </FormControl>
              </Grid>
              {/* <Grid item xs={6} paddingTop={2}>
                <Typography fontSize={"0.75rem"}>
                  Cannot find vendor?
                </Typography>
                <StyledButton variant="contained" color="light_purple">
                  <Typography
                    style={{
                      display: "flex",
                    }}
                    component="div"
                    color="white"
                  >
                    <AddIcon />
                    Add vendor
                  </Typography>
                </StyledButton>
              </Grid> */}
            </Grid>
          </Grid>
        </StyledContainer>
        <StyledContainer elevation={3}>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
              >
                More details on activity
              </Typography>
            </Grid>
            <Grid item xs={6} paddingTop={2}>
              <FormControl
                fullWidth
                error={formErrors?.activityType?.length > 0}
              >
                <InputLabel id="activityType" required>
                  Activity Type
                </InputLabel>
                <Select
                  labelId="activityTypeLabel"
                  label="Activity Type"
                  placeholder="Activity Type"
                  onChange={handleActivityTypeChange}
                  value={activityType}
                >
                  {Object.values(ActivityTypeEnum).map((enumValue) => (
                    <MenuItem key={enumValue} value={enumValue}>
                      {enumValue}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>
                  {formErrors?.activityType}
                </FormHelperText>
              </FormControl>

              {activityType === ActivityTypeEnum.POPUP && (
                <Grid paddingBottom={2} paddingTop={2}>
                  <Grid item xs={6}>
                    <FormControl>
                      <FormLabel id="popupIsFood">
                        Selling food items?
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue="yes"
                        name="radio-buttons-group"
                        value={isFood.toString()}
                        onChange={handleIsFoodChange}
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      required
                      variant="standard"
                      id="popupItems"
                      name="popupItems"
                      placeholder="Popup items sold"
                      label="Popup items sold"
                      disabled={false}
                      fullWidth
                      onChange={handlePopupItemsChange}
                      helperText={formErrors?.popupitems}
                      error={
                        (popupitems !== null && popupitems?.length === 0) ||
                        formErrors?.popupitems?.length > 0
                      }
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>

            <Grid item xs={3} paddingTop={2}>
              {activityType === ActivityTypeEnum.POPUP && isFood && (
                <FormGroup error={formErrors?.foodCat?.length > 0}>
                  <InputLabel
                    id="foodCategory"
                    required
                    error={formErrors?.foodCat?.length > 0}
                  >
                    Food Category
                  </InputLabel>
                  <FormHelperText error>{formErrors?.foodCat}</FormHelperText>
                  {foodCategories.map((label) => (
                    <FormControlLabel
                      key={label}
                      control={
                        <Checkbox
                          checked={selectedFoodCat.includes(label)}
                          onChange={handleFoodCatChange}
                          name={label}
                        />
                      }
                      label={label}
                      error={formErrors?.foodCat?.length > 0}
                    />
                  ))}
                </FormGroup>
              )}
            </Grid>
            <Grid item xs={3} paddingTop={2}>
              {activityType === ActivityTypeEnum.POPUP && isFood === true && (
                <FormControl>
                  <FormLabel id="popupIsFood">
                    Is my food cert pending?
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="yes"
                    name="radio-buttons-group"
                    value={isFoodCertPending.toString()}
                    onChange={handleIsFoodCertPendingChange}
                  >
                    <FormControlLabel
                      value="true"
                      control={<Radio />}
                      label="Yes"
                    />
                    {isFoodCertPending && (
                      <Grid>
                        <Grid item>
                          <TextField
                            required
                            variant="standard"
                            id="pendingCertType"
                            name="pendingCertType"
                            placeholder="Pending cert type"
                            label="Pending cert type"
                            disabled={false}
                            fullWidth
                            onChange={handlePendingCertTypeChange}
                            error={
                              pendingCertType === "" ||
                              formErrors?.pendingCertType?.length > 0
                            }
                          />
                        </Grid>
                        <Grid item paddingTop={2}>
                          <FormControl
                            fullWidth
                            error={formErrors?.foodCertDate?.length > 0}
                          >
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                              <DatePicker
                                error={formErrors?.foodCertDate?.length > 0}
                                label="Expected certified date"
                                onChange={handleFoodCertDateChange}
                                renderInput={(params) => (
                                  <TextField
                                    sx={{ width: "100%" }}
                                    {...params}
                                    error
                                    // error={formErrors?.foodCertDate?.length > 0}
                                  />
                                )}
                              />
                            </LocalizationProvider>
                            <FormHelperText>
                              {formErrors?.foodCertDate}
                            </FormHelperText>
                          </FormControl>
                        </Grid>
                      </Grid>
                    )}
                    <FormControlLabel
                      value="false"
                      control={<Radio />}
                      label="No"
                    />
                  </RadioGroup>
                </FormControl>
              )}
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth error={formErrors?.location?.length > 0}>
                <InputLabel id="activityType" required>
                  Location
                </InputLabel>
                <Select
                  labelId="locationLabel"
                  label="Location"
                  placeholder="Location"
                  onChange={handleLocationTypeChange}
                  value={location}
                >
                  {Object.values(LocationEnum).map((enumValue) => (
                    <MenuItem key={enumValue} value={enumValue}>
                      {enumValue}
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error>{formErrors?.location}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                fullWidth
                error={formErrors?.dayAvailabilities?.length > 0}
              >
                <InputLabel id="dayAvailabilities" required>
                  Day Availabilities
                </InputLabel>
                <Select
                  labelId="locationLabel"
                  label="Day Availabilities"
                  placeholder="Day Availabilities"
                  onChange={handleDayAvailabilitiesChange}
                  value={dayAvailabilities}
                  multiple
                >
                  {Object.values(ActivityDayAvailabilityEnum).map(
                    (enumValue) => (
                      <MenuItem key={enumValue} value={enumValue}>
                        {enumValue}
                      </MenuItem>
                    )
                  )}
                </Select>
                <FormHelperText error>
                  {formErrors?.dayAvailabilities}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="duration"
                label="Duration"
                placeholder="Duration"
                type="number"
                fullWidth
                onChange={handleDurationChange}
                required
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">min</InputAdornment>
                  ),
                }}
                value={duration ?? ""}
                error={
                  (duration !== null && duration?.length === 0) ||
                  formErrors?.duration?.length > 0
                }
                helperText={formErrors?.duration}
              />
            </Grid>
          </Grid>

          <Grid
            container
            spacing={2}
            alignItems="left"
            justifyContent="left"
            paddingTop={2}
          >
            <Grid item xs={12}>
              <InputLabel id="sdg" required error={formErrors?.sdg?.length > 0}>
                Sustainability Development Goals
              </InputLabel>
              <FormHelperText error>{formErrors?.sdg}</FormHelperText>
            </Grid>
            {columnsArray.map((column, columnIndex) => (
              <Grid item xs={3} key={columnIndex}>
                {column.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        onChange={handleSdgChange}
                        checked={sdg.includes(option)}
                        name={option}
                      />
                    }
                    label={option}
                    sx={{ width: "100%" }}
                  />
                ))}
              </Grid>
            ))}
          </Grid>
        </StyledContainer>
        <StyledContainer elevation={3}>
          <Grid container spacing={1} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                component="div"
                paddingTop={2}
              >
                Participants and Pricing
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="maxParticipants"
                name="maxParticipants"
                label="Max. participants"
                disabled={false}
                fullWidth
                type="number"
                value={maxParticipants ?? ""}
                onChange={handleMaxParticipantsChange}
                error={
                  (maxParticipants !== null && maxParticipants === 0) ||
                  formErrors?.maxParticipants?.length > 0
                }
                helperText={formErrors?.maxParticipants}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="markup"
                name="markup"
                label="Markup Percentage"
                disabled={false}
                fullWidth
                type="number"
                value={markup ?? ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                }}
                onChange={handleMarkupChange}
                error={
                  (markup !== null && markup?.length === 0) ||
                  formErrors?.markup?.length > 0
                }
                helperText={formErrors?.markup}
              />
            </Grid>
            <Grid item xs={12}>
              {maxParticipants > 0 && (
                <TableContainer component={Paper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Pax Interval</TableCell>
                        <TableCell>Price Per Pax</TableCell>
                        <TableCell>Weekend Addon</TableCell>
                        <TableCell>Public Holiday Addon</TableCell>
                        <TableCell>Online Addon</TableCell>
                        <TableCell>Offline Addon</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {activityPricingRuleList.map((row, rowIndex) => (
                        <TableRow key={rowIndex}>
                          <TableCell>{row.paxInterval}</TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextField
                                value={row?.pricePerPax ?? ""}
                                onChange={(e) =>
                                  handlePricingRuleFieldChange(
                                    e,
                                    rowIndex,
                                    "pricePerPax"
                                  )
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                                placeholder="0"
                                helperText={
                                  formErrors?.activityPricingRules?.[rowIndex]
                                }
                                error={
                                  formErrors?.activityPricingRules?.[rowIndex]
                                    ?.length > 0
                                }
                              />
                              {!isNaN(
                                clientActivityPricingRule?.[rowIndex]
                                  ?.pricePerPax
                              ) && (
                                <Box
                                  sx={{
                                    paddingLeft: 2,
                                    color: theme.palette.primary.main,
                                    flexDirection: "column",
                                    paddingBottom: 2,
                                  }}
                                >
                                  <Box sx={{ whiteSpace: "nowrap" }}>
                                    Client Price
                                  </Box>
                                  <Box sx={{ textAlign: "center" }}>
                                    <>
                                      $
                                      {
                                        clientActivityPricingRule?.[rowIndex]
                                          ?.pricePerPax
                                      }
                                    </>
                                  </Box>
                                </Box>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextField
                                value={row.weekendAddon}
                                onChange={(e) =>
                                  handlePricingRuleFieldChange(
                                    e,
                                    rowIndex,
                                    "weekendAddon"
                                  )
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {!isNaN(
                                clientActivityPricingRule?.[rowIndex]
                                  ?.weekendAddon
                              ) && (
                                <Box
                                  sx={{
                                    paddingLeft: 2,
                                    color: theme.palette.primary.main,
                                    flexDirection: "column",
                                    paddingBottom: 2,
                                  }}
                                >
                                  <Box sx={{ whiteSpace: "nowrap" }}>
                                    Client Price
                                  </Box>
                                  <Box sx={{ textAlign: "center" }}>
                                    <>
                                      $
                                      {
                                        clientActivityPricingRule?.[rowIndex]
                                          ?.weekendAddon
                                      }
                                    </>
                                  </Box>
                                </Box>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextField
                                value={row.publicHolidayAddon}
                                onChange={(e) =>
                                  handlePricingRuleFieldChange(
                                    e,
                                    rowIndex,
                                    "publicHolidayAddon"
                                  )
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {!isNaN(
                                clientActivityPricingRule?.[rowIndex]
                                  ?.publicHolidayAddon
                              ) && (
                                <Box
                                  sx={{
                                    paddingLeft: 2,
                                    color: theme.palette.primary.main,
                                    flexDirection: "column",
                                    paddingBottom: 2,
                                  }}
                                >
                                  <Box sx={{ whiteSpace: "nowrap" }}>
                                    Client Price
                                  </Box>
                                  <Box sx={{ textAlign: "center" }}>
                                    <>
                                      $
                                      {
                                        clientActivityPricingRule?.[rowIndex]
                                          ?.publicHolidayAddon
                                      }
                                    </>
                                  </Box>
                                </Box>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextField
                                value={row.onlineAddon}
                                onChange={(e) =>
                                  handlePricingRuleFieldChange(
                                    e,
                                    rowIndex,
                                    "onlineAddon"
                                  )
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {!isNaN(
                                clientActivityPricingRule?.[rowIndex]
                                  ?.onlineAddon
                              ) && (
                                <Box
                                  sx={{
                                    paddingLeft: 2,
                                    color: theme.palette.primary.main,
                                    flexDirection: "column",
                                    paddingBottom: 2,
                                  }}
                                >
                                  <Box sx={{ whiteSpace: "nowrap" }}>
                                    Client Price
                                  </Box>
                                  <Box sx={{ textAlign: "center" }}>
                                    <>
                                      $
                                      {
                                        clientActivityPricingRule?.[rowIndex]
                                          ?.onlineAddon
                                      }
                                    </>
                                  </Box>
                                </Box>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <div
                              style={{ display: "flex", alignItems: "center" }}
                            >
                              <TextField
                                value={row.offlineAddon}
                                onChange={(e) =>
                                  handlePricingRuleFieldChange(
                                    e,
                                    rowIndex,
                                    "offlineAddon"
                                  )
                                }
                                InputProps={{
                                  startAdornment: (
                                    <InputAdornment position="start">
                                      $
                                    </InputAdornment>
                                  ),
                                }}
                              />
                              {!isNaN(
                                clientActivityPricingRule?.[rowIndex]
                                  ?.offlineAddon
                              ) && (
                                <Box
                                  sx={{
                                    paddingLeft: 2,
                                    color: theme.palette.primary.main,
                                    flexDirection: "column",
                                    paddingBottom: 2,
                                  }}
                                >
                                  <Box sx={{ whiteSpace: "nowrap" }}>
                                    Client Price
                                  </Box>
                                  <Box sx={{ textAlign: "center" }}>
                                    {!isNaN(
                                      clientActivityPricingRule?.[rowIndex]
                                        ?.offlineAddon
                                    ) ? (
                                      <>
                                        $
                                        {
                                          clientActivityPricingRule?.[rowIndex]
                                            ?.offlineAddon
                                        }
                                      </>
                                    ) : null}
                                  </Box>
                                </Box>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            alignItems="left"
            justifyContent="left"
          ></Grid>
        </StyledContainer>
        <StyledContainer elevation={3}>
          <Grid item xs={12}>
            <Typography
              color={theme.palette.primary.main}
              component="div"
              paddingTop={2}
              paddingBottom={2}
            >
              Upload activity images
            </Typography>
            <FormGroup>
              <ImageAndFileUpload
                limit={4}
                name={"idk"}
                size={5000000}
                setActivityImages={setActivityImages}
                activityImages={activityImages}
                error={formErrors?.activityImages?.length > 0}
              />
              <FormHelperText error>
                {formErrors?.activityImages}
              </FormHelperText>
            </FormGroup>
          </Grid>
        </StyledContainer>
      </div>

      <Grid
        container
        paddingTop={2}
        spacing={1}
        alignItems="left"
        justifyContent="left"
      >
        <Grid item xs={12}>
          <StyledSubmitButton
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            fullWidth
          >
            <Typography component="div">Submit</Typography>
          </StyledSubmitButton>
        </Grid>
      </Grid>

      <Snackbar open={isOpen} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="success" sx={{ width: "100%" }}>
          Activity Created Successfully!
        </Alert>
      </Snackbar>
      <Snackbar open={isError} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity="error" sx={{ width: "100%" }}>
          {!formErrors
            ? "Error creating form!"
            : "Error creating form! Please fill in required fields."}
        </Alert>
      </Snackbar>
    </form>
  );
};
export default CreateActivityForm;
