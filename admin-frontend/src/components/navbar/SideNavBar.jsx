import { Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";

const drawerWidth = 240;

const SideNavBar = () => {
  const theme = useTheme();

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <Box sx={{ paddingLeft: 2, paddingTop: 2 }}>
            <Typography
              fontWeight={700}
              color={theme.palette.primary.main}
              fontSize={20}
            >
              User Management
            </Typography>
          </Box>

          <List>
            {["Admin Team", "Clients", "Vendor Partners"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <Box sx={{ paddingLeft: 2, paddingTop: 2 }}>
            <Typography
              fontWeight={700}
              color={theme.palette.primary.main}
              fontSize={20}
            >
              Activity Management
            </Typography>
          </Box>
          <List>
            {["View Published Activities", "View Unpublished Activities"].map(
              (text, index) => (
                <ListItem key={text} disablePadding>
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              )
            )}
          </List>
          <Divider />
          <Box sx={{ paddingLeft: 2, paddingTop: 2 }}>
            <Typography
              fontWeight={700}
              color={theme.palette.primary.main}
              fontSize={20}
            >
              Booking Management
            </Typography>
          </Box>
          <List>
            {["View Bookings"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideNavBar;
