/* eslint-disable react/prop-types */
import {
  Alert,
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

const CreateActivityForm = ({ themes, theme }) => {
  const { createActivity } = useActivityStore();
  const [isOpen, setIsOpen] = useState(false);
  const [isError, setError] = useState(false);
  const [selectedTheme, setSelectedTheme] = useState(
    themes?.[0]?.parent?._id || ""
  );
  const [selectedSubTheme, setSelectedSubTheme] = useState([]);
  const [subthemes, setSubthemes] = useState([]);

  const [maxParticipants, setMaxParticipants] = useState();
  const [markup, setMarkup] = useState();
  const [activityType, setActivityType] = useState("");
  const [title, setTitle] = useState();
  const [description, setDescription] = useState();

  const [activityPricingRuleList, setData] = useState([]);
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

  const foodCategories = Object.values(FoodCategoryEnum);
  const sdgList = Object.values(SustainableDevelopmentGoalsEnum);
  const columns = 4;
  const optionsPerColumn = 5;

  const columnsArray = [];
  for (let i = 0; i < columns; i++) {
    const startIndex = i * optionsPerColumn;
    const endIndex = startIndex + optionsPerColumn;
    columnsArray.push(sdgList.slice(startIndex, endIndex));
  }

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setIsOpen(false);
    setError(false);
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
    console.log(selectedSubTheme);
  };

  const handleMaxParticipantsChange = (event) => {
    const newMaxParticipants = parseInt(event.target.value, 10) || 0;
    setMaxParticipants(newMaxParticipants);

    const newData = [];
    for (let i = 0; i < Math.ceil(newMaxParticipants / 10); i++) {
      const startRange = i * 10 + 1;
      const endRange = startRange + 9;
      newData.push({
        paxInterval: `${startRange} - ${endRange}`,
        pricePerPax: 0,
        weekendAddon: 0,
        publicHolidayAddon: 0,
        onlineAddon: 0,
        offlineAddon: 0,
      });
      if (startRange + 9 === 50 && newMaxParticipants > 50) {
        newData.push({
          paxInterval: `> ${50}`,
          pricePerPax: 0,
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

  const handleFieldChange = (event, rowIndex, columnName) => {
    const updatedData = [...activityPricingRuleList];
    updatedData[rowIndex][columnName] = event.target.value;
    setData(updatedData);
  };

  const handleMarkupChange = (event) => {
    setMarkup(event.target.value);
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
    console.log(sdg);
  };

  const handleDayAvailabilitiesChange = async (event) => {
    setDayAvailabilities(event.target.value);
    console.log(dayAvailabilities);
  };

  const handleDurationChange = async (event) => {
    setDuration(event.target.value);
  };

  const validateForm = () => {
    const errors = {};

    if (!dayAvailabilities || dayAvailabilities?.length === 0) {
      errors.dayAvailabilities = "At least one Day Availability is required";
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
    console.log(errors);
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const resetForm = () => {
    setSelectedTheme(themes?.[0]?.parent?._id || "");
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
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const payload = {
      title: title,
      description: description,
      activityType:
        activityType === ActivityTypeEnum.POPUP
          ? isFood
            ? "Popups (Food)"
            : "Popups (Non-food)"
          : activityType,
      maxParticipants: maxParticipants,
      clientMarkupPercentage: markup,
      duration: duration,
      theme: selectedTheme,
      subtheme: selectedSubTheme,
      location: location,
      sdg: sdg,
      dayAvailabilities: dayAvailabilities,
      activityPricingRules: activityPricingRuleList,
      isFoodCertPending:
        activityType === ActivityTypeEnum.POPUP && isFood
          ? isFoodCertPending
          : null,
      foodCertDate:
        activityType === ActivityTypeEnum.POPUP && isFood
          ? foodCertDate?.toISOString()
          : null,
      foodCategory: foodCategories,
      popupItemsSold:
        activityType === ActivityTypeEnum.POPUP ? popupitems : null,
    };
    console.log(payload);
    if (validateForm()) {
      try {
        const responseStatus = await createActivity(payload);
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
            error={title !== null && title?.length === 0}
          />
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
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
          </FormControl>
        </Grid>
        <Grid item xs={4}>
          <FormControl fullWidth>
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
            <FormHelperText>
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
            error={description !== null && description?.length === 0}
          />
        </Grid>
      </Grid>
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
          <FormControl fullWidth>
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
          </FormControl>

          {activityType === ActivityTypeEnum.POPUP && (
            <Grid paddingBottom={2} paddingTop={2}>
              <Grid item xs={6}>
                <FormControl>
                  <FormLabel id="popupIsFood">Selling food items?</FormLabel>
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
                  error={popupitems !== null && popupitems?.length === 0}
                />
              </Grid>
            </Grid>
          )}
        </Grid>

        <Grid item xs={3} paddingTop={2}>
          {activityType === ActivityTypeEnum.POPUP && isFood && (
            <FormGroup>
              <InputLabel id="foodCategory">Food Category</InputLabel>
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
                />
              ))}
            </FormGroup>
          )}
        </Grid>
        <Grid item xs={3} paddingTop={2}>
          {activityType === ActivityTypeEnum.POPUP && isFood === true && (
            <FormControl>
              <FormLabel id="popupIsFood">Is my food cert pending?</FormLabel>
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
                      />
                    </Grid>
                    <Grid item paddingTop={2}>
                      <LocalizationProvider dateAdapter={AdapterDayjs}>
                        <DatePicker
                          label="Expected certified date"
                          onChange={handleFoodCertDateChange}
                        />
                      </LocalizationProvider>
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
          <FormControl fullWidth>
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
          </FormControl>
        </Grid>
        <Grid item xs={3}>
          <FormControl fullWidth>
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
              {Object.values(ActivityDayAvailabilityEnum).map((enumValue) => (
                <MenuItem key={enumValue} value={enumValue}>
                  {enumValue}
                </MenuItem>
              ))}
            </Select>
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
              endAdornment: <InputAdornment position="end">min</InputAdornment>,
            }}
            value={duration ?? ""}
            error={duration !== null && duration?.length === 0}
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
          <InputLabel id="sdg">Sustainability Development Goals</InputLabel>
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
            error={maxParticipants !== null && maxParticipants === 0}
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
              endAdornment: <InputAdornment position="start">%</InputAdornment>,
            }}
            onChange={handleMarkupChange}
            error={markup !== null && markup?.length === 0}
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
                        <TextField
                          value={row.pricePerPax}
                          onChange={(e) =>
                            handleFieldChange(e, rowIndex, "pricePerPax")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={row.weekendAddon}
                          onChange={(e) =>
                            handleFieldChange(e, rowIndex, "weekendAddon")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={row.publicHolidayAddon}
                          onChange={(e) =>
                            handleFieldChange(e, rowIndex, "publicHolidayAddon")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={row.onlineAddon}
                          onChange={(e) =>
                            handleFieldChange(e, rowIndex, "onlineAddon")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
                      </TableCell>
                      <TableCell>
                        <TextField
                          value={row.offlineAddon}
                          onChange={(e) =>
                            handleFieldChange(e, rowIndex, "offlineAddon")
                          }
                          InputProps={{
                            startAdornment: (
                              <InputAdornment position="start">
                                $
                              </InputAdornment>
                            ),
                          }}
                        />
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
        paddingTop={2}
        spacing={1}
        alignItems="left"
        justifyContent="left"
      >
        <Grid item xs={12}>
          <Button onClick={handleSubmit} type="submit" variant="contained">
            <Typography component="div">Submit</Typography>
          </Button>
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
            : Object.values(formErrors)?.map((item, key) => (
                <div key={key}>{item}</div>
              ))}
        </Alert>
      </Snackbar>
    </form>
  );
};
export default CreateActivityForm;
