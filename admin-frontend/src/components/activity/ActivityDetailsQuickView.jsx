import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  Checkbox,
  Chip,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  ImageList,
  ImageListItem,
  ImageListItemBar,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useTheme,
} from "@mui/material";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import PropTypes from "prop-types";
import {
  ActivityDayAvailabilityEnum,
  ActivityTypeEnum,
  FoodCategoryEnum,
  LocationEnum,
  SustainableDevelopmentGoalsEnum,
} from "../../utils/TypeEnum";

const StyledAvatar = styled("div")(() => ({
  display: "flex",
  marginBottom: 16,
}));
const StyledVendorName = styled("div")(() => ({
  fontWeight: "bold",
}));
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledContainer = styled(Paper)`
  padding: 20px;
  padding-top: 6px;
  border-radius: 10px;
  box-shadow: 4px 4px 0px 0px rgb(159 145 204 / 40%);
`;
const StyledChip = styled(Chip)`
  &.Mui-disabled {
    color: #ffffff;
    background-color: #9f91cc;
    opacity: 1;
  }
`;

const ActivityDetailsQuickView = ({ activity, imgs }) => {
  const theme = useTheme();
  const foodCategories = Object.values(FoodCategoryEnum);

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

  const sdgList = Object.values(SustainableDevelopmentGoalsEnum);
  const columns = 4;
  const optionsPerColumn = 5;

  const columnsArray = [];
  for (let i = 0; i < columns; i++) {
    const startIndex = i * optionsPerColumn;
    const endIndex = startIndex + optionsPerColumn;
    columnsArray.push(sdgList.slice(startIndex, endIndex));
  }
  return (
    <Box padding={2} sx={{ backgroundColor: "FAFAFA" }}>
      <Grid container spacing={2} alignItems="left" justifyContent="left">
        <Grid item xs={12}>
          <Typography
            fontSize={25}
            fontWeight={700}
            noWrap
            component="div"
            color={theme.palette.primary.main}
          >
            {activity.title}
          </Typography>
        </Grid>
        <Grid item xs={12}>
          <StyledAvatar>
            <Avatar
              style={{ marginRight: 8, marginTop: 6 }}
              {...stringAvatar(activity?.linkedVendor?.companyName, theme)}
            />
            <Container>
              <Typography>
                Vendor Partner
                <StyledVendorName>
                  {activity?.linkedVendor?.companyName}
                </StyledVendorName>
              </Typography>
            </Container>
          </StyledAvatar>
        </Grid>
      </Grid>
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
                fontSize={"1.25rem"}
              >
                Basic Information
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                InputProps={{
                  readOnly: true,
                }}
                required
                variant="standard"
                id="title"
                name="title"
                placeholder="Title"
                label="Title"
                disabled={false}
                fullWidth
                value={activity.title}
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
                  defaultValue={activity?.theme?.name}
                  inputProps={{ readOnly: true }}
                >
                  <MenuItem value={activity.theme?.name}>
                    {activity.theme?.name}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <InputLabel id="subThemeLabel">Learning Points</InputLabel>
                <Select
                  labelId="subThemeLabel"
                  label="Sub-Theme"
                  placeholder="Learning Points"
                  multiple
                  defaultValue={activity.subtheme.map((s) => s?.name)}
                  readOnly={true}
                >
                  {activity.subtheme?.map((subtheme) => (
                    <MenuItem key={subtheme?._id} value={subtheme?.name}>
                      {subtheme?.name}
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
                InputProps={{
                  readOnly: true,
                }}
                value={activity.description}
                required
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
                fontSize={"1.25rem"}
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
                  inputProps={{ readOnly: true }}
                  defaultValue={activity.activityType}
                >
                  <MenuItem value={activity.activityType}>
                    {activity.activityType}
                  </MenuItem>
                </Select>
              </FormControl>

              {(activity.activityType === "Popups (Food)" ||
                activity.activityType === "Popups (Non-food)") && (
                <Grid paddingBottom={2} paddingTop={2}>
                  <Grid item xs={6}>
                    <FormControl>
                      <FormLabel id="popupIsFood">
                        Selling food items?
                      </FormLabel>
                      <RadioGroup
                        aria-labelledby="demo-radio-buttons-group-label"
                        defaultValue={activity.isFood.toString()}
                        name="radio-buttons-group"
                      >
                        <FormControlLabel
                          value="true"
                          control={<Radio readOnly />}
                          label="Yes"
                        />
                        <FormControlLabel
                          value="false"
                          control={<Radio readOnly />}
                          label="No"
                        />
                      </RadioGroup>
                    </FormControl>
                  </Grid>
                  <Grid item xs={12}>
                    <TextField
                      InputProps={{
                        readOnly: true,
                      }}
                      required
                      variant="standard"
                      name="popupItems"
                      placeholder="Popup items sold"
                      label="Popup items sold"
                      fullWidth
                      defaultValue={activity.popupItemsSold}
                    />
                  </Grid>
                </Grid>
              )}
            </Grid>
            <Grid item xs={3} paddingTop={2}>
              {activity.activityType === "Popups (Food)" && activity.isFood && (
                <FormGroup>
                  <InputLabel id="foodCategory" required>
                    Food Category
                  </InputLabel>
                  {foodCategories.map((label) => (
                    <FormControlLabel
                      key={label}
                      control={
                        <Checkbox
                          checked={activity.foodCategory.includes(label)}
                          name={label}
                          readOnly
                        />
                      }
                      label={label}
                    />
                  ))}
                </FormGroup>
              )}
            </Grid>
            <Grid item xs={3} paddingTop={2}>
              {activity.activityType === "Popups (Food)" &&
                activity.isFood === true && (
                  <FormControl>
                    <FormLabel id="popupIsFood">
                      Is my food cert pending?
                    </FormLabel>
                    <RadioGroup
                      aria-labelledby="demo-radio-buttons-group-label"
                      defaultValue="yes"
                      name="radio-buttons-group"
                      value={activity.isFoodCertPending.toString()}
                    >
                      <FormControlLabel
                        value="true"
                        control={<Radio />}
                        label="Yes"
                      />
                      {activity.isFoodCertPending && (
                        <Grid>
                          <Grid item>
                            <TextField
                              required
                              variant="standard"
                              id="pendingCertType"
                              name="pendingCertType"
                              placeholder="Pending cert type"
                              label="Pending cert type"
                              fullWidth
                              InputProps={{ readOnly: true }}
                              value={activity.pendingCertificationType}
                            />
                          </Grid>
                          <Grid item paddingTop={2}>
                            <FormControl fullWidth>
                              <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DatePicker
                                  label="Expected certified date"
                                  renderInput={(params) => (
                                    <TextField
                                      sx={{ width: "100%" }}
                                      {...params}
                                    />
                                  )}
                                  readOnly={true}
                                  defaultValue={dayjs(activity.foodCertDate)}
                                />
                              </LocalizationProvider>
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
              <FormControl fullWidth>
                <InputLabel id="location" required>
                  Location
                </InputLabel>
                <Select
                  inputProps={{ readOnly: true }}
                  labelId="locationLabel"
                  label="Location"
                  placeholder="Location"
                  defaultValue={activity.location}
                  multiple
                  renderValue={(selected) => (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                      {selected.map((value) => (
                        <Chip key={value} label={value} />
                      ))}
                    </Box>
                  )}
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
                  defaultValue={activity.dayAvailabilities}
                  multiple
                  readOnly={true}
                >
                  {Object.values(ActivityDayAvailabilityEnum).map(
                    (enumValue) => (
                      <MenuItem key={enumValue} value={enumValue}>
                        {enumValue}
                      </MenuItem>
                    ),
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <InputLabel id="duration">Duration</InputLabel>
                <Select
                  labelId="durationLabel"
                  id="duration"
                  defaultValue={activity.duration ?? ""}
                  label="Duration"
                  readOnly={true}
                >
                  <MenuItem value={activity.duration}>
                    {activity.duration}
                  </MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Earliest Start Time"
                    minutesStep={30}
                    value={dayjs(activity.startTime)}
                    inputProps={{ readOnly: true }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Latest Start Time"
                    minutesStep={30}
                    value={dayjs(activity.endTime)}
                    inputProps={{ readOnly: true }}
                  />
                </LocalizationProvider>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <TextField
                id="bookingNotice"
                name="bookingNotice"
                label="Advance Booking Notice"
                disabled={false}
                fullWidth
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {activity.bookingNotice === 1 ? <>day</> : <>days</>}
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                value={activity.bookingNotice ?? ""}
              />
            </Grid>
            <Grid item xs={3}>
              <TextField
                required
                id="capacity"
                name="capacity"
                label="Capacity"
                disabled={false}
                fullWidth
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      {activity.capacity === 1 ? <>client</> : <>clients</>}
                    </InputAdornment>
                  ),
                  readOnly: true,
                }}
                value={activity.capacity ?? ""}
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
              <InputLabel id="sdg" required>
                Sustainability Development Goals
              </InputLabel>
            </Grid>
            {columnsArray.map((column, columnIndex) => (
              <Grid item xs={3} key={columnIndex}>
                {column.map((option) => (
                  <FormControlLabel
                    key={option}
                    control={
                      <Checkbox
                        checked={activity.sdg.includes(option)}
                        name={option}
                        readOnly={true}
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
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                paddingTop={2}
                component="div"
                fontSize={"1.25rem"}
              >
                Participants and Pricing
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="minParticipants"
                name="minParticipants"
                label="Min. participants"
                disabled={false}
                fullWidth
                type="number"
                value={activity.minParticipants ?? ""}
                inputProps={{ readOnly: true }}
              />
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
                value={activity.maxParticipants ?? ""}
                inputProps={{ readOnly: true }}
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                required
                id="markup"
                name="markup"
                label="Markup Percentage"
                fullWidth
                type="number"
                value={activity.clientMarkupPercentage ?? ""}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={12} paddingTop={2}>
              <TableContainer
                component={Paper}
                sx={{
                  borderRadius: "10px",
                }}
              >
                <Table>
                  <TableHead>
                    <TableRow
                      sx={{ backgroundColor: "rgba(159 145 204 / 0.12)" }}
                    >
                      <TableCell width={"25%"} sx={{ fontSize: "1rem" }}>
                        <span style={{ color: "#3D246C" }}>Start Range</span>
                      </TableCell>
                      <TableCell width={"25%"} sx={{ fontSize: "1rem" }}>
                        <span style={{ color: "#3D246C" }}>End Range</span>
                      </TableCell>
                      <TableCell width={"25%"} sx={{ fontSize: "1rem" }}>
                        <span style={{ color: "#3D246C" }}>Price Per Pax</span>
                      </TableCell>
                      <TableCell width={"25%"} sx={{ fontSize: "1rem" }}>
                        <span style={{ color: "#3D246C" }}>
                          Client Price&nbsp;
                        </span>
                        <span style={{ color: "#9F91CC" }}>
                          (after {activity.clientMarkupPercentage}% markup)
                        </span>
                      </TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activity.activityPricingRules.map((row, rowIndex) => (
                      <TableRow key={rowIndex}>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-evenly",
                            }}
                          >
                            <Box width={"50%"}>{row.start}</Box>
                            <Box width={"50%"} sx={{ whiteSpace: "nowrap" }}>
                              to
                            </Box>
                          </div>
                        </TableCell>
                        <TableCell>
                          <TextField
                            sx={{ fontSize: "0.875rem" }}
                            type="number"
                            InputProps={{
                              readOnly: true,
                              style: { fontSize: "0.875rem" },
                              endAdornment: (
                                <InputAdornment position="end">
                                  pax
                                </InputAdornment>
                              ),
                            }}
                            value={row.end}
                          />
                        </TableCell>
                        <TableCell>
                          <TextField
                            sx={{ fontSize: "0.875rem" }}
                            type="number"
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                              readOnly: true,
                              style: { fontSize: "0.875rem" },
                            }}
                            value={row.pricePerPax}
                          />
                        </TableCell>
                        <TableCell>
                          <div
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "start",
                            }}
                          >
                            <Box>$ {row.clientPrice}</Box>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Grid>
          </Grid>
          <Grid item xs={12}>
            <Typography
              color={theme.palette.primary.main}
              paddingTop={2}
              component="div"
              fontSize={"1rem"}
            >
              Pricing Add-ons/ Discounts
            </Typography>
          </Grid>
          <Grid
            container
            spacing={1}
            alignItems="left"
            justifyContent="left"
            paddingTop={2}
            paddingLeft={2}
          >
            <Grid sx={4}>
              <TextField
                id="weekendPrice"
                name="weekendPrice"
                label="Weekend Pricing"
                fullWidth
                value={activity.weekendPricing?.amount}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={4} paddingTop={2} paddingLeft={2}>
              <Stack direction="row" spacing={1}>
                <StyledChip
                  label="Discount"
                  disabled={activity.weekendPricing?.isDiscount === true}
                />
                <StyledChip
                  label="Addon"
                  disabled={activity.weekendPricing?.isDiscount === false}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            alignItems="left"
            justifyContent="left"
            paddingTop={2}
            paddingLeft={2}
          >
            <Grid sx={4}>
              <TextField
                id="onlinePrice"
                name="onlinePrice"
                label="Online Pricing"
                fullWidth
                value={activity.onlinePricing?.amount}
                type="number"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={4} paddingTop={2} paddingLeft={2}>
              <Stack direction="row" spacing={1}>
                <StyledChip
                  label="Discount"
                  disabled={activity.onlinePricing?.isDiscount === true}
                />
                <StyledChip
                  label="Addon"
                  disabled={activity.onlinePricing?.isDiscount === false}
                />
              </Stack>
            </Grid>
          </Grid>
          <Grid
            container
            spacing={1}
            alignItems="left"
            justifyContent="left"
            paddingTop={2}
            paddingLeft={2}
          >
            <Grid sx={4}>
              <TextField
                id="offlinePrice"
                name="offlinePrice"
                label="Offline Pricing"
                fullWidth
                type="number"
                value={activity.offlinePricing?.amount}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="start">%</InputAdornment>
                  ),
                  readOnly: true,
                }}
              />
            </Grid>
            <Grid item xs={4} paddingTop={2} paddingLeft={2}>
              <Stack direction="row" spacing={1}>
                <StyledChip
                  label="Discount"
                  disabled={activity.offlinePricing?.isDiscount === true}
                />
                <StyledChip
                  label="Addon"
                  disabled={activity.offlinePricing?.isDiscount === false}
                />
              </Stack>
            </Grid>
          </Grid>
        </StyledContainer>
        <StyledContainer elevation={3}>
          <Grid container spacing={1} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                color={theme.palette.primary.main}
                component="div"
                paddingTop={2}
                paddingBottom={2}
                fontSize={"1.25rem"}
              >
                Activity Images
              </Typography>
            </Grid>
            <Grid item xs={6}>
              <ImageList>
                {imgs?.map((image, index) => {
                  return (
                    <ImageListItem key={index}>
                      <img src={image} loading="lazy" />
                      <ImageListItemBar
                        sx={{ background: "none" }}
                        position="top"
                        actionPosition="left"
                      />
                    </ImageListItem>
                  );
                })}
              </ImageList>
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
                fontSize={"1.25rem"}
              >
                Approval Status Changelog
              </Typography>
            </Grid>
          </Grid>
        </StyledContainer>
      </div>
    </Box>
  );
};
ActivityDetailsQuickView.propTypes = {
  activity: PropTypes.object.isRequired,
  imgs: PropTypes.array.isRequired,
};
export default ActivityDetailsQuickView;
