import React from "react";
import { Box, Typography, Slider } from "@mui/material";
import { useTheme } from "@mui/material/styles";

const PriceFilter = (props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;

  const valueText = (value) => {
    return value;
  };
  return (
    <Box boxShadow={2} borderRadius={2}>
      <Box
        bgcolor={primary}
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Typography p={1} fontWeight={700} variant="h6" color={accent}>
          Price Range
        </Typography>
      </Box>
      <Box p={3}>
        <Slider
          getAriaLabel={() => "Price range"}
          value={props.sliderValue}
          onChange={props.handleSliderChange}
          valueLabelDisplay="auto"
          getAriaValueText={valueText}
          min={props.minRangeValue} // Minimum range value prop
          max={props.maxRangeValue} // Maximum range value prop
          color="secondary"
        />
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Typography>{props.minRangeValue}</Typography>
          <Typography>{props.maxRangeValue}</Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default PriceFilter;
