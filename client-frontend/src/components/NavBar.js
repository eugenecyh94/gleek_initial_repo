import React from "react";
import {
  AppBar,
  Typography,
  Button,
  Box,
  MenuItem,
  Menu,
  Link,
  IconButton,
  Icon,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import ShoppingBagOutlinedIcon from "@mui/icons-material/ShoppingBagOutlined";

function NavBar(props) {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const navigate = useNavigate();
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;
  return (
    <div>
      <AppBar position="static" elevation={0} bgcolor={primary}>
        <Box
          display="flex"
          flexDirection="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Link
            href="/"
            underline="none"
            onClick={() => {
              navigate("/");
            }}
          >
            <Typography
              fontWeight={700}
              ml={2}
              color={accent}
              my={1}
              variant="h4"
            >
              Gleek
            </Typography>
          </Link>
          <Box
            mr={2}
            display="flex"
            flexDirection="row"
            justifyContent="space-evenly"
            alignItems="center"
          >
            <IconButton
              onClick={() => {
                navigate("/Cart");
              }}
              disableRipple
              disableFocusRipple
              aria-label="cart"
              color="accent"
              sx={{ marginRight: "16px" }}
            >
              <ShoppingBagOutlinedIcon />
            </IconButton>
            <Button
              sx={{ marginRight: "16px" }}
              variant="text"
              onClick={() => {
                navigate("/Shop");
              }}
            >
              <Typography fontWeight={700} color={accent} variant="body1">
                Shop
              </Typography>
            </Button>
            <Box sx={{ marginRight: "24px" }}>
              <Button
                id="basic-button"
                aria-controls={open ? "basic-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                onClick={handleClick}
              >
                <Typography fontWeight={700} color={accent} variant="body1">
                  Welcome!
                </Typography>
              </Button>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  "aria-labelledby": "basic-button",
                }}
                slotProps={{
                  paper: {
                    elevation: 2,
                  },
                }}
              >
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate("/Login");
                  }}
                >
                  Login
                </MenuItem>
                <MenuItem
                  sx={{ px: "32px" }}
                  onClick={() => {
                    navigate("/Register");
                  }}
                >
                  Register
                </MenuItem>
              </Menu>
            </Box>
          </Box>
        </Box>
      </AppBar>
    </div>
  );
}

export default NavBar;
