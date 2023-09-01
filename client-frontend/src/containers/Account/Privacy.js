import React from "react";
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
  MenuItem,
  Menu,
  Drawer,
  List,
  ListItem,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import AccountSidebar from "./AccountSidebar";

function Privacy(props) {

  const theme = useTheme();
  const tertiary = theme.palette.tertiary.main;
  const primary = theme.palette.primary.main;
  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="center"
      p={8}
      sx={{ width: "100%" }}
    >
      <Box width={"30%"}>
        <AccountSidebar />
      </Box>

      <Box
        display="flex"
        flexDirection="column"
        sx={{ width: "100%" }}
        p={6}
        flexWrap={"wrap"}
      >
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          marginBottom={2}
        >
          <Typography color="secondary" variant="h4">
            Privacy Settings
          </Typography>
        </Box>
        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="I agree to receive marketing updates from Gleek via email."
          />
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            label="I agree to the Terms & Conditions of Gleek."
            disabled={true}
          />
        </FormGroup>

        <Button
          sx={{ marginTop: "32px" }}
          mt={4}
          variant="contained"
          type="submit"
        >
          <Typography variant="body1">Update</Typography>
        </Button>
      </Box>
    </Box>
  );
}

export default Privacy;
