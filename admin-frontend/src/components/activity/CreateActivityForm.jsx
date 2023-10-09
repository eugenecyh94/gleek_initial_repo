/* eslint-disable react/prop-types */
import styled from "@emotion/styled";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import {
  Avatar,
  Box,
  Button,
  Chip,
  FormControl,
  FormHelperText,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Step,
  StepLabel,
  Stepper,
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { TimePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs from "dayjs";
import { Fragment, useState } from "react";
import {
  ActivityDayAvailabilityEnum,
  ActivityTypeEnum,
  FoodCategoryEnum,
  LocationEnum,
  SustainableDevelopmentGoalsEnum,
} from "../../utils/TypeEnum";
import { useActivityStore, useSnackbarStore } from "../../zustand/GlobalStore";
import ImageAndFileUpload from "./ImageAndFileUpload";

const StyledButton = styled(Button)`
  padding-left: 6px;
`;

const StyledChip = styled(Chip)`
  &.Mui-disabled {
    color: #ffffff;
    background-color: #9f91cc;
    opacity: 1;
  }
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

const errorTextPricePerPax = "Please fill in Price per Pax!";
const errorTextEndInterval = "Please fill in end interval!";

const CreateActivityForm = ({ themes, theme, vendors, admin, activity }) => {
  const { createActivity, saveActivity } = useActivityStore();
  const { openSnackbar } = useSnackbarStore();
  const [selectedTheme, setSelectedTheme] = useState(
    activity?.theme?._id ?? null,
  );
  const [selectedSubTheme, setSelectedSubTheme] = useState(
    activity?.subtheme?.length > 0 ? activity?.subtheme?.map((x) => x._id) : [],
  );
  const [subthemes, setSubthemes] = useState(
    activity?.theme?._id
      ? themes?.find((theme) => theme.parent?._id === activity?.theme?._id)
          ?.children
      : [],
  );

  const [maxParticipants, setMaxParticipants] = useState(
    activity?.maxParticipants ?? null,
  );
  const [minParticipants, setMinParticipants] = useState(
    activity?.minParticipants ?? null,
  );
  const [markup, setMarkup] = useState(
    activity?.clientMarkupPercentage ?? null,
  );
  const [activityType, setActivityType] = useState(
    activity?.activityType ?? "",
  );
  const [title, setTitle] = useState(activity?.title ?? null);
  const [description, setDescription] = useState(activity?.description ?? null);
  const extractedFields =
    activity?.activityPricingRules?.map((pricingRule) => ({
      start: pricingRule.start,
      end: pricingRule.end,
      pricePerPax: pricingRule.pricePerPax,
      clientPrice: pricingRule.clientPrice,
    })) || [];
  const [pricingRanges, setPricingRanges] = useState(extractedFields);
  const initialPricingRangeErrors = activity?.activityPricingRules?.map(() => ({
    range: "",
    pricePerPax: null,
  }));
  const [pricingRangeError, setPricingRangeError] = useState(
    activity?.activityPricingRules?.length > 0 ? initialPricingRangeErrors : [],
  );
  const initialPricingRangeDone = activity?.activityPricingRules?.some(
    (pricingRule) => {
      return pricingRule?.end === activity?.maxParticipants;
    },
  );
  const [pricingRangeDone, setPricingRangeDone] = useState(
    activity?.activityPricingRules ? initialPricingRangeDone : false,
  );
  const [pricingAddons, setPricingAddons] = useState({
    weekendPricing: {
      amount: activity?.weekendPricing?.amount ?? null,
      isDiscount: activity?.weekendPricing?.amount
        ? activity?.weekendPricing?.isDiscount
        : false,
    },
    offlinePricing: {
      amount: activity?.offlinePricing?.amount ?? null,
      isDiscount: activity?.offlinePricing?.amount
        ? activity?.offlinePricing?.isDiscount
        : false,
    },
    onlinePricing: {
      amount: activity?.onlinePricing?.amount ?? null,
      isDiscount: activity?.onlinePricing?.amount
        ? activity?.onlinePricing?.isDiscount
        : false,
    },
  });
  const steps = [
    "Select number of participants",
    "Input pricing",
    "Input markup pricing",
    "Pricing addons / discounts",
  ];
  const [isFood, setIsFood] = useState(activity?.isFood ?? false);
  const [isFoodCertPending, setIsFoodCertPending] = useState(
    activity?.isFoodCertPending ?? false,
  );
  const [selectedFoodCat, setSelectedFoodCat] = useState(
    activity?.foodCategory ?? [],
  );
  const [foodCertDate, setFoodCertDate] = useState(
    activity?.foodCertDate ?? null,
  );
  const [location, setLocation] = useState(activity?.location ?? []);
  const [popupitems, setPopupitems] = useState(
    activity?.popupItemsSold ?? null,
  );
  const [sdg, setSdg] = useState(activity?.sdg ?? []);
  const [dayAvailabilities, setDayAvailabilities] = useState(
    activity?.dayAvailabilities ?? [],
  );
  const [duration, setDuration] = useState(activity?.duration ?? null);
  const [formErrors, setFormErrors] = useState();
  const [activityImages, setActivityImages] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(
    activity?.linkedVendor?._id ?? null,
  );
  const [pendingCertType, setPendingCertType] = useState(
    activity?.pendingCertType ?? null,
  );
  const [activeStep, setActiveStep] = useState(
    activity?.offlinePricing?.amount ||
      activity?.onlinePricing?.amount ||
      activity?.weekendPricing?.amount
      ? 3
      : activity?.clientMarkupPercentage
      ? 2
      : activity?.activityPricingRules?.length > 0
      ? 1
      : 0,
  );
  const [bookingNotice, setBookingNotice] = useState(
    activity?.bookingNotice ?? null,
  );
  const [startTime, setStartTime] = useState(activity?.startTime ?? null);
  const [endTime, setEndTime] = useState(activity?.endTime ?? null);
  const [capacity, setCapacity] = useState(activity?.capacity ?? null);

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

  const handleThemeChange = (event) => {
    const themeId = event.target.value;
    setSelectedTheme(themeId);
    setSubthemes(
      themes?.find((theme) => theme.parent?._id === themeId)?.children,
    );
    setSelectedSubTheme([]);
  };

  const handleSubThemeChange = (event) => {
    const themeId = event.target.value;
    setSelectedSubTheme(themeId);
  };

  const handleMinParticipantsChange = (event) => {
    setMinParticipants(event.target.value);
  };

  const isMaxSmallerThanMin = () => {
    return parseInt(maxParticipants) < parseInt(minParticipants);
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
  };

  const handleAddRange = (rowIndex) => {
    const currentData = [...pricingRanges];
    const errorData = [...pricingRangeError];
    const currentEnd = parseInt(pricingRanges?.[rowIndex]?.end);
    const currentStart = parseInt(pricingRanges?.[rowIndex]?.start);
    if (
      currentEnd >= parseInt(minParticipants) &&
      currentEnd <= parseInt(maxParticipants)
    ) {
      currentData.push({
        start: parseInt(currentEnd + 1),
        end: null,
        pricePerPax: null,
        clientPrice: null,
      });
      errorData.push({ range: "", pricePerPax: null });
      setPricingRanges(currentData);
      setPricingRangeError(errorData);
    } else {
      let message = "";
      if (currentEnd < currentStart) {
        message = "End Range must be less than Start Range";
      } else if (currentEnd > maxParticipants) {
        message = "End Range cannot be more than max participants";
      }
      const pricingErrors = [...pricingRangeError];
      pricingErrors[rowIndex]["range"] = message;
      setPricingRangeError(pricingErrors);
    }
  };

  const pricingRangeHasError = () => {
    return pricingRangeError.some((e) => e.range?.length > 0);
  };

  const handlePricingRangesChange = (event, rowIndex, columnName) => {
    const newVal = event.target.value;
    const updatedData = [...pricingRanges];
    const errors = [...pricingRangeError];

    if (parseInt(newVal) > maxParticipants) {
      errors[rowIndex]["range"] =
        "End Range cannot be more than max participants";
    } else if (
      updatedData?.[rowIndex]?.["start"] <= parseInt(newVal) &&
      parseInt(newVal) < maxParticipants
    ) {
      errors[rowIndex]["range"] = "";
      setPricingRangeDone(false);
    } else if (
      updatedData?.[rowIndex]?.["start"] <= parseInt(newVal) &&
      parseInt(newVal) === maxParticipants
    ) {
      errors[rowIndex]["range"] = "";
      setPricingRangeDone(true);
      const thing = updatedData.slice(0, rowIndex + 1);
      thing[rowIndex][columnName] = parseInt(newVal);
      setPricingRanges(thing);
      setPricingRangeError(errors);
      return;
    } else if (updatedData?.[rowIndex]?.["start"] > parseInt(newVal)) {
      errors[rowIndex]["range"] = "End Range must be more than Start Range";
    }
    updatedData[rowIndex][columnName] = parseInt(newVal);
    if (updatedData?.[rowIndex + 1]) {
      updatedData[rowIndex + 1]["start"] = parseInt(parseInt(newVal) + 1);
    }
    if (updatedData?.[rowIndex + 1]) {
      if (
        updatedData?.[rowIndex + 1]?.["start"] >
        updatedData?.[rowIndex + 1]?.["end"]
      ) {
        errors[rowIndex + 1]["range"] =
          "End Range must be more than Start Range";
      } else if (updatedData?.[rowIndex + 1]?.["end"] === maxParticipants) {
        errors[rowIndex + 1]["range"] = "";
        setPricingRangeDone(true);
      } else {
        errors[rowIndex + 1]["range"] = "";
      }
    }

    setPricingRanges(updatedData);
    setPricingRangeError(errors);
  };
  const handlePriceChange = (event, rowIndex, columnName) => {
    let error = [...pricingRangeError];
    const newPrice = parseInt(event.target.value);
    if (newPrice > 0) {
      error[rowIndex]["pricePerPax"] = null;
    } else if (newPrice === 0) {
      error[rowIndex]["pricePerPax"] = "Price per pax has to be more than 0";
    }
    const updatedData = [...pricingRanges];
    updatedData[rowIndex][columnName] = newPrice;
    setPricingRanges(updatedData);
    setPricingRangeError(error);
  };
  const handlePricingAddonChange = (event, type) => {
    const percentage = event.target.value;

    const newPricingAddons = { ...pricingAddons };
    newPricingAddons[type] = {
      ...pricingAddons[type],
      amount: isNaN(percentage) ? null : percentage,
    };
    setPricingAddons(newPricingAddons);
  };
  const handleDiscountChange = (type, isDiscount) => {
    const newPricingAddons = { ...pricingAddons };
    newPricingAddons[type] = {
      ...pricingAddons[type],
      isDiscount: isDiscount ?? pricingAddons[type]?.isDiscount,
    };
    setPricingAddons(newPricingAddons);
  };

  const handleBack = () => {
    if (activeStep === 1) {
      setPricingAddons({
        weekendPricing: { amount: null, isDiscount: false },
        offlinePricing: { amount: null, isDiscount: false },
        onlinePricing: { amount: null, isDiscount: false },
      });
      setPricingRanges([]);
      setPricingRangeError([]);
      setMarkup();
    }
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleNext = () => {
    if (activeStep === 0) {
      const newData = [];
      const errorData = [];
      if (!isMaxSmallerThanMin()) {
        newData.push({
          start: parseInt(minParticipants),
          end: null,
          pricePerPax: null,
          clientPrice: null,
        });
        errorData.push({ range: "", pricePerPax: null });
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
      setPricingRanges(newData);
      setPricingRangeError(errorData);
    } else if (activeStep === 1) {
      const errors = [...pricingRangeError];
      let hasErrors = false;
      pricingRanges.map((row, index) => {
        if (!row.pricePerPax) {
          errors[index]["pricePerPax"] = errorTextPricePerPax;
          hasErrors = true;
        }
        if (!row.end) {
          errors[index]["end"] = errorTextEndInterval;
          hasErrors = true;
        }
      });
      setPricingRangeError(errors);
      if (!hasErrors) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    } else if (activeStep === 2) {
      if (!markup) {
        const error = {
          ...formErrors,
          markup: "Please fill in pricing markup!",
        };
        setFormErrors(error);
      } else {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);
      }
    }
  };

  const handleMarkupChange = (event) => {
    const newMarkup = event.target.value;
    setMarkup(event.target.value);
    const newClientPrice = [...pricingRanges];
    newClientPrice.forEach((rule, index) => {
      const { pricePerPax } = rule;
      const clientPrice = Math.ceil(
        parseFloat(pricePerPax) * (parseFloat(newMarkup) / 100) +
          parseFloat(pricePerPax),
      );
      newClientPrice[index].clientPrice = clientPrice;
    });
    if (newMarkup) {
      const error = { ...formErrors, markup: "" };
      setFormErrors(error);
    }
    setPricingRanges(newClientPrice);
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

  const handleStartTimeChange = (date) => {
    setStartTime(date?.toISOString());
  };

  const handleEndTimeChange = (date) => {
    setEndTime(date?.toISOString());
  };

  const handleCapacityChange = (event) => {
    setCapacity(event.target.value);
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
  const handleBookingNoticeChange = (event) => {
    setBookingNotice(event.target.value);
  };
  const validateForm = () => {
    const errors = {};
    const priceError = {};
    pricingRanges.forEach((rule, rowIndex) => {
      if (rule.pricePerPax === null) {
        priceError[rowIndex] = errorTextPricePerPax;
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

    if (!location || location?.length === 0) {
      errors.location = "At least one Location is required!";
    }

    if (!duration) {
      errors.duration = "Duration is required!";
    }

    if (!maxParticipants) {
      errors.maxParticipants = "Max. Participants is required!";
    }

    if (!minParticipants) {
      errors.minParticipants = "Min. Participants is required!";
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

    if (!capacity) {
      errors.capacity = "Capacity is required!";
    }

    if (!startTime) {
      errors.startTime = "Earliest Start Time is required!";
    }

    if (!endTime) {
      errors.endTime = "Latest Start Time is required!";
    }

    if (startTime && endTime) {
      const time1 = new Date(startTime);
      const time2 = new Date(endTime);
      if (time1 > time2) {
        errors.startTime =
          "Earliest Start Time must be before Latest Start Time!";
        errors.endTime = "Latest Start Time must be after Earliest Start Time!";
      }
    }

    pricingRanges.map((row) => {
      if (!row.pricePerPax) {
        errors.pricing = "Please complete price setting!";
      }
      if (!row.end) {
        errors.pricing = "Please complete price setting!";
      }
    });

    // if (!activityImages || activityImages?.length === 0) {
    //   errors.activityImages =
    //     "Please upload at least one photo of your activity!";
    // }

    setFormErrors(errors);
    return Object.keys(errors).length === 0 && !pricingRangeHasError();
  };

  const validateDraft = () => {
    const errors = [...pricingRangeError];
    if (pricingRanges?.length > 0) {
      pricingRanges.map((row, index) => {
        if (!row?.end) {
          errors[index]["range"] = errorTextEndInterval;
        }
        if (!row?.pricePerPax) {
          errors[index].pricePerPax = errorTextPricePerPax;
        }
      });
      setPricingRangeError(errors);
    }
    return !pricingRangeHasError() && !isMaxSmallerThanMin();
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
    setIsFood(false);
    setIsFoodCertPending(false);
    setSelectedFoodCat([]);
    setFoodCertDate(null);
    setLocation([]);
    setPopupitems();
    setSdg([]);
    setDayAvailabilities([]);
    setDuration();
    setFormErrors({});
    setActivityImages([]);
    setSelectedVendor();
    setPricingAddons({
      weekendPricing: { amount: null, isDiscount: false },
      offlinePricing: { amount: null, isDiscount: false },
      onlinePricing: { amount: null, isDiscount: false },
    });
    setPricingRanges([]);
    setPricingRangeError([]);
    setStartTime(null);
    setEndTime(null);
    setBookingNotice();
    setActiveStep(0);
    setCapacity();
    setMinParticipants();
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
        : activityType,
    );
    formData.append("maxParticipants", maxParticipants);
    formData.append("clientMarkupPercentage", markup);
    formData.append("duration", duration);
    formData.append("theme", selectedTheme);
    if (bookingNotice) {
      formData.append("bookingNotice", bookingNotice);
    } else {
      formData.append("bookingNotice", 0);
    }

    formData.append("startTime", startTime);
    formData.append("endTime", endTime);
    formData.append("capacity", capacity);
    location.forEach((obj) => {
      formData.append("location", obj);
    });
    dayAvailabilities.forEach((obj) => {
      formData.append("dayAvailabilities", obj);
    });
    selectedSubTheme.forEach((obj) => {
      formData.append("subtheme", obj);
    });
    sdg.forEach((obj) => {
      formData.append("sdg", obj);
    });
    pricingRanges.forEach((obj) => {
      const pricingJSON = JSON.stringify(obj);
      formData.append("activityPricingRules", pricingJSON);
    });
    for (const key in pricingAddons) {
      formData.append(key, JSON.stringify(pricingAddons[key]));
    }

    if (activityType === ActivityTypeEnum.POPUP) {
      {
        formData.append("popupItemsSold", popupitems);
        if (isFood) {
          formData.append("isFoodCertPending", isFoodCertPending);
          if (isFoodCertPending) {
            formData.append("foodCertDate", foodCertDate?.toISOString());
            selectedFoodCat.forEach((obj) => {
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
        await createActivity(formData);
        openSnackbar("Activity Created Successfully!");
        resetForm();
      } catch (error) {
        openSnackbar(error, "error");
      }
    } else {
      openSnackbar(
        "Error creating form! Please fill in required fields.",
        "error",
      );
    }
  };

  const handleSaveDraft = async (event) => {
    event.preventDefault();
    const formData = new FormData();
    formData.append("adminCreated", admin._id);
    if (activity) {
      formData.append("activityId", activity._id);
    }
    formData.append("isDraft", true);
    formData.append("approvalStatus", "Pending Approval");
    if (title) {
      formData.append("title", title);
    }
    if (description) {
      formData.append("description", description);
    }
    if (activityType) {
      formData.append(
        "activityType",
        activityType === ActivityTypeEnum.POPUP
          ? isFood
            ? "Popups (Food)"
            : "Popups (Non-food)"
          : activityType,
      );
    }
    if (maxParticipants) {
      formData.append("maxParticipants", maxParticipants);
    }
    if (minParticipants) {
      formData.append("minParticipants", minParticipants);
    }

    if (markup) {
      formData.append("clientMarkupPercentage", markup);
    }

    if (duration) {
      formData.append("duration", duration);
    }

    if (selectedTheme) {
      formData.append("theme", selectedTheme);
    }

    if (bookingNotice) {
      formData.append("bookingNotice", bookingNotice);
    }

    if (startTime) {
      formData.append("startTime", startTime);
    }
    if (endTime) {
      formData.append("endTime", endTime);
    }

    if (capacity) {
      formData.append("capacity", capacity);
    }

    if (location.length > 0) {
      location.forEach((obj) => {
        formData.append("location", obj);
      });
    }

    if (dayAvailabilities.length > 0) {
      dayAvailabilities.forEach((obj) => {
        formData.append("dayAvailabilities", obj);
      });
    }

    if (selectedSubTheme.length > 0) {
      selectedSubTheme.forEach((obj) => {
        formData.append("subtheme", obj);
      });
    }

    if (sdg) {
      sdg.forEach((obj) => {
        formData.append("sdg", obj);
      });
    }

    if (pricingRanges.length > 0) {
      pricingRanges.forEach((obj) => {
        const pricingJSON = JSON.stringify(obj);
        formData.append("activityPricingRules", pricingJSON);
      });
    }
    if (activityType === ActivityTypeEnum.POPUP) {
      if (popupitems) {
        formData.append("popupItemsSold", popupitems);
      }
      if (isFood) {
        if (isFoodCertPending) {
          if (foodCertDate) {
            formData.append("foodCertDate", foodCertDate.toISOString());
          }
          if (selectedFoodCat) {
            selectedFoodCat.forEach((obj) => {
              formData.append("foodCategory", obj);
            });
          }
        }
        if (isFoodCertPending) {
          formData.append("isFoodCertPending", isFoodCertPending);
        }
      }
    }

    if (selectedVendor) {
      formData.append("linkedVendor", selectedVendor);
    }

    if (pendingCertType) {
      formData.append("pendingCertificationType", pendingCertType);
    }

    for (const key in pricingAddons) {
      formData.append(key, JSON.stringify(pricingAddons[key]));
    }
    if (validateDraft()) {
      try {
        await saveActivity(formData);
        openSnackbar("Activity Draft Saved Successfully!");
      } catch (error) {
        openSnackbar("Unexpected Server Error occured!", "error");
      }
    } else {
      openSnackbar(
        "Error saving draft! Please resolve highlighted errors before saving.",
        "error",
      );
    }
  };

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
                      ),
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
                  placeholder="Learning Points"
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
                <InputLabel id="location" required>
                  Location
                </InputLabel>
                <Select
                  labelId="locationLabel"
                  label="Location"
                  placeholder="Location"
                  onChange={handleLocationTypeChange}
                  value={location}
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
                    ),
                  )}
                </Select>
                <FormHelperText error>
                  {formErrors?.dayAvailabilities}
                </FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl
                fullWidth
                error={
                  (duration !== null && duration?.length === 0) ||
                  formErrors?.duration?.length > 0
                }
              >
                <InputLabel id="duration">Duration</InputLabel>
                <Select
                  labelId="durationLabel"
                  id="duration"
                  value={duration ?? ""}
                  label="Duration"
                  onChange={handleDurationChange}
                >
                  <MenuItem value={30}>30 min</MenuItem>
                  <MenuItem value={60}>60 min</MenuItem>
                  <MenuItem value={90}>90 min</MenuItem>
                  <MenuItem value={120}>120 min</MenuItem>
                  <MenuItem value={150}>150 min</MenuItem>
                  <MenuItem value={180}>180 min</MenuItem>
                </Select>
                <FormHelperText error>{formErrors?.duration}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth error={formErrors?.startTime?.length > 0}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Earliest Start Time"
                    minutesStep={30}
                    onChange={handleStartTimeChange}
                    value={startTime ? dayjs(startTime) : null}
                  />
                </LocalizationProvider>
                <FormHelperText>{formErrors?.startTime}</FormHelperText>
              </FormControl>
            </Grid>
            <Grid item xs={3}>
              <FormControl fullWidth error={formErrors?.endTime?.length > 0}>
                <LocalizationProvider dateAdapter={AdapterDayjs}>
                  <TimePicker
                    label="Latest Start Time"
                    minutesStep={30}
                    onChange={handleEndTimeChange}
                    value={endTime ? dayjs(endTime) : null}
                  />
                </LocalizationProvider>
                <FormHelperText>{formErrors?.endTime}</FormHelperText>
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
                      {parseInt(bookingNotice) === 1 ? <>day</> : <>days</>}
                    </InputAdornment>
                  ),
                }}
                value={bookingNotice ?? ""}
                onChange={handleBookingNoticeChange}
                error={
                  (bookingNotice !== null && bookingNotice === 0) ||
                  formErrors?.bookingNotice?.length > 0
                }
                helperText={formErrors?.bookingNotice}
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
                      {parseInt(capacity) === 1 ? <>client</> : <>clients</>}
                    </InputAdornment>
                  ),
                }}
                value={capacity ?? ""}
                onChange={handleCapacityChange}
                error={
                  (capacity !== null && capacity === 0) ||
                  formErrors?.capacity?.length > 0
                }
                helperText={formErrors?.capacity}
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
            <Grid item xs={12} justifyContent={"space-between"}>
              <Typography
                color={theme.palette.primary.main}
                component="div"
                paddingTop={2}
              >
                Participants and Pricing
              </Typography>
              {formErrors?.pricing && (
                <Typography
                  color={theme.palette.error.main}
                  style={{ display: "flex", alignItems: "center" }}
                >
                  <WarningAmberIcon />
                  {formErrors?.pricing}
                </Typography>
              )}
            </Grid>
            <Grid item xs={12}>
              <Stepper activeStep={activeStep}>
                {steps.map((label) => {
                  const stepProps = {};
                  const labelProps = {};
                  return (
                    <Step key={label} {...stepProps}>
                      <StepLabel {...labelProps}>{label}</StepLabel>
                    </Step>
                  );
                })}
              </Stepper>
              <Fragment>
                {activeStep === 0 && (
                  <Grid
                    container
                    spacing={1}
                    alignItems="left"
                    justifyContent="left"
                    paddingTop={2}
                  >
                    <Grid item xs={4}>
                      <TextField
                        required
                        id="minParticipants"
                        name="minParticipants"
                        label="Min. participants"
                        disabled={false}
                        fullWidth
                        type="number"
                        value={minParticipants ?? ""}
                        onChange={handleMinParticipantsChange}
                        error={
                          (minParticipants !== null && minParticipants === 0) ||
                          isMaxSmallerThanMin() ||
                          formErrors?.minParticipants?.length > 0
                        }
                        helperText={
                          isMaxSmallerThanMin()
                            ? "Min Participants must be smaller than Max Participants"
                            : formErrors?.minParticipants
                        }
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
                        value={maxParticipants ?? ""}
                        onChange={handleMaxParticipantsChange}
                        error={
                          (maxParticipants !== null && maxParticipants === 0) ||
                          isMaxSmallerThanMin() ||
                          formErrors?.maxParticipants?.length > 0
                        }
                        helperText={
                          isMaxSmallerThanMin()
                            ? "Max Participants must be greater than Min Participants"
                            : formErrors?.maxParticipants
                        }
                      />
                    </Grid>
                  </Grid>
                )}
                {activeStep === 1 && (
                  <>
                    <Grid item xs={12}>
                      <Typography
                        color={theme.palette.primary.main}
                        sx={{ paddingTop: 2 }}
                      >
                        Participant range: {minParticipants} - {maxParticipants}
                      </Typography>
                    </Grid>
                    <Grid item xs={12} paddingTop={2}>
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Start Range</TableCell>
                              <TableCell>End Range</TableCell>
                              <TableCell>Price Per Pax</TableCell>
                              <TableCell>Action</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pricingRanges.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                <TableCell>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "space-evenly",
                                    }}
                                  >
                                    <Box>{row.start}</Box>

                                    <Box sx={{ whiteSpace: "nowrap" }}>to</Box>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <TextField
                                      error={
                                        pricingRangeError?.[rowIndex]?.range
                                          ?.length > 0
                                      }
                                      helperText={
                                        pricingRangeError?.[rowIndex]?.range
                                      }
                                      type="number"
                                      onChange={(e) =>
                                        handlePricingRangesChange(
                                          e,
                                          rowIndex,
                                          "end",
                                        )
                                      }
                                      value={
                                        !isNaN(row?.end) && row?.end
                                          ? row?.end
                                          : ""
                                      }
                                    />
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <TextField
                                    type="number"
                                    error={
                                      pricingRangeError?.[rowIndex]?.pricePerPax
                                        ?.length > 0
                                    }
                                    helperText={
                                      pricingRangeError?.[rowIndex]?.pricePerPax
                                    }
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          $
                                        </InputAdornment>
                                      ),
                                    }}
                                    value={
                                      !isNaN(row?.pricePerPax) &&
                                      row?.pricePerPax
                                        ? row?.pricePerPax
                                        : ""
                                    }
                                    onChange={(e) =>
                                      handlePriceChange(
                                        e,
                                        rowIndex,
                                        "pricePerPax",
                                      )
                                    }
                                  />
                                </TableCell>
                                <TableCell>
                                  {rowIndex + 1 === pricingRanges.length &&
                                    !pricingRangeDone && (
                                      <Button
                                        disabled={pricingRangeHasError()}
                                        onClick={() => handleAddRange(rowIndex)}
                                      >
                                        Add
                                      </Button>
                                    )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </>
                )}
                {activeStep === 2 && (
                  <Grid
                    container
                    spacing={1}
                    alignItems="left"
                    justifyContent="left"
                    paddingTop={2}
                  >
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
                      <TableContainer component={Paper}>
                        <Table>
                          <TableHead>
                            <TableRow>
                              <TableCell>Start Range</TableCell>
                              <TableCell>End Range</TableCell>
                              <TableCell>Price Per Pax</TableCell>
                              <TableCell>Client Price</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {pricingRanges.map((row, rowIndex) => (
                              <TableRow key={rowIndex}>
                                <TableCell>
                                  <Box>{row.start}</Box>
                                </TableCell>
                                <TableCell>
                                  <div
                                    style={{
                                      display: "flex",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Box>{row?.end}</Box>
                                  </div>
                                </TableCell>
                                <TableCell>
                                  <Box>${row?.pricePerPax}</Box>
                                </TableCell>
                                <TableCell>
                                  $
                                  {!isNaN(row?.clientPrice) && (
                                    <>{row?.clientPrice}</>
                                  )}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Grid>
                  </Grid>
                )}
                {activeStep === 3 && (
                  <>
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
                          value={pricingAddons?.weekendPricing?.amount}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            ),
                          }}
                          onChange={(event) =>
                            handlePricingAddonChange(event, "weekendPricing")
                          }
                        />
                      </Grid>
                      <Grid item xs={4} paddingTop={2} paddingLeft={2}>
                        <Stack direction="row" spacing={1}>
                          <StyledChip
                            label="Discount"
                            onClick={() =>
                              handleDiscountChange("weekendPricing", true)
                            }
                            disabled={
                              pricingAddons?.weekendPricing?.isDiscount === true
                            }
                          />
                          <StyledChip
                            label="Addon"
                            onClick={() =>
                              handleDiscountChange("weekendPricing", false)
                            }
                            disabled={
                              pricingAddons?.weekendPricing?.isDiscount ===
                              false
                            }
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
                          disabled={false}
                          fullWidth
                          value={pricingAddons?.onlinePricing?.amount}
                          type="number"
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            ),
                          }}
                          onChange={(event) =>
                            handlePricingAddonChange(event, "onlinePricing")
                          }
                        />
                      </Grid>
                      <Grid item xs={4} paddingTop={2} paddingLeft={2}>
                        <Stack direction="row" spacing={1}>
                          <StyledChip
                            label="Discount"
                            onClick={() =>
                              handleDiscountChange("onlinePricing", true)
                            }
                            disabled={
                              pricingAddons?.onlinePricing?.isDiscount === true
                            }
                          />
                          <StyledChip
                            label="Addon"
                            onClick={() =>
                              handleDiscountChange("onlinePricing", false)
                            }
                            disabled={
                              pricingAddons?.onlinePricing?.isDiscount === false
                            }
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
                          disabled={false}
                          fullWidth
                          type="number"
                          value={pricingAddons?.offlinePricing?.amount}
                          InputProps={{
                            endAdornment: (
                              <InputAdornment position="start">
                                %
                              </InputAdornment>
                            ),
                          }}
                          onChange={(event) =>
                            handlePricingAddonChange(event, "offlinePricing")
                          }
                        />
                      </Grid>
                      <Grid item xs={4} paddingTop={2} paddingLeft={2}>
                        <Stack direction="row" spacing={1}>
                          <StyledChip
                            label="Discount"
                            onClick={() =>
                              handleDiscountChange("offlinePricing", true)
                            }
                            disabled={
                              pricingAddons?.offlinePricing?.isDiscount === true
                            }
                          />
                          <StyledChip
                            label="Addon"
                            onClick={() =>
                              handleDiscountChange("offlinePricing", false)
                            }
                            disabled={
                              pricingAddons?.offlinePricing?.isDiscount ===
                              false
                            }
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </>
                )}
                <Box sx={{ display: "flex", flexDirection: "row", pt: 2 }}>
                  <Button
                    color="inherit"
                    disabled={activeStep === 0}
                    onClick={handleBack}
                    sx={{ mr: 1 }}
                  >
                    Back
                  </Button>
                  <Box sx={{ flex: "1 1 auto" }} />
                  {activeStep < steps.length - 1 && (
                    <Button
                      disabled={
                        (!pricingRangeDone && activeStep === 1) ||
                        (activeStep === 0 &&
                          (!maxParticipants ||
                            !minParticipants ||
                            isMaxSmallerThanMin()))
                      }
                      onClick={handleNext}
                    >
                      Next
                    </Button>
                  )}
                </Box>
              </Fragment>
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
        <Grid item xs={6}>
          <StyledSubmitButton
            onClick={handleSubmit}
            type="submit"
            variant="contained"
            fullWidth
          >
            <Typography component="div">Submit</Typography>
          </StyledSubmitButton>
        </Grid>
        <Grid item xs={6}>
          <Button
            onClick={handleSaveDraft}
            type="submit"
            variant="outlined"
            fullWidth
          >
            <Typography component="div">Save draft</Typography>
          </Button>
        </Grid>
      </Grid>
    </form>
  );
};
export default CreateActivityForm;
