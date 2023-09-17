import React from "react";
import {
  Box,
  Typography,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const RadioButtonGroup = (props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;

  return (
    <Box boxShadow={2} borderRadius={2} mt={3}>
      <Box
        bgcolor={primary}
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Typography p={1} fontWeight={700} variant="h6" color={accent}>
          {props.title}
        </Typography>
      </Box>
      <FormControl sx={{ m: 3 }} component="fieldset" variant="standard">
        <RadioGroup
          aria-labelledby="demo-radio-buttons-group-label"
          value={props.value}
          onChange={props.handleChange}
          name="radio-buttons-group"
        >
          {Object.entries(props.VALUES).map(([key, value]) => (
            <FormControlLabel
              key={key}
              value={value}
              label={value}
              control={<Radio />}
            />
          ))}
        </RadioGroup>
      </FormControl>
    </Box>
  );
};

export default RadioButtonGroup;
