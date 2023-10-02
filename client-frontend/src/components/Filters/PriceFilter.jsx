import React from "react";
import { Box, Typography, Slider, CircularProgress } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useShopStore from "../../zustand/ShopStore";
const PriceFilter = (props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;
  const { priceFilterLoading } = useShopStore();

  const valueText = (value) => {
    return value;
  };
  return (
    <Box boxShadow={2} borderRadius={2} mt={5}>
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
      {priceFilterLoading && (
        <Box display="flex" mt={2} mb={2}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
      {!priceFilterLoading && (
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
          <Box
            display="flex"
            flexDirection="row"
            justifyContent="space-between"
          >
            <Typography>{props.minRangeValue}</Typography>
            <Typography>{props.maxRangeValue}</Typography>
          </Box>
        </Box>
      )}
    </Box>
  );
};

export default PriceFilter;
