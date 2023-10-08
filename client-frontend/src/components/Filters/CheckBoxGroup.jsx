import React from "react";
import {
  Box,
  Typography,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";

const CheckBoxGroup = (props) => {
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
        <FormGroup>
          {Object.entries(props.VALUES).map(([key, value]) => (
            <Box key={key}>
              <FormControlLabel
                key={key}
                control={
                  <Checkbox
                    checked={props.state[value]}
                    onChange={props.handleChange}
                    name={value}
                  />
                }
                label={value}
              />
              <Box mt={1} mb={1}>
                <Divider />
              </Box>
            </Box>
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default CheckBoxGroup;
