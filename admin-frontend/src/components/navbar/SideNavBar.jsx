import { Typography, useTheme } from "@mui/material";
import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import { Link, useNavigate } from "react-router-dom";
import {
  useSelectedNavItemStore,
  activityStore,
  useAdminStore,
} from "../../zustand/GlobalStore";
import styled from "@emotion/styled";

const drawerWidth = 240;
const activityManagementList = [
  { "View Published Activities": "/viewPublishedActivities" },
  { "View Unpublished Activities": "/viewUnpublishedActivities" },
];
const userManagementList = [
  { "Admin Team": "/adminTeam" },
  { Clients: "/clients" },
  { "Vendor Partners": "/vendorPartners" },
];
const bookingManagementList = [{ "View Bookings": "/bookings" }];

const StyledLink = styled(Link)`
  text-decoration: none;
  color: ${({ theme }) => theme.palette.primary.main};
`;

const SideNavBar = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const selectedItem = useSelectedNavItemStore((state) => state.selectedItem);
  const { getActivity } = activityStore();
  const { token } = useAdminStore();
  const setSelectedItem = useSelectedNavItemStore(
    (state) => state.setSelectedItem
  );
  const handleItemClick = async (item, link) => {
    await getActivity(token);
    navigate(link);
    setSelectedItem(item);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: 120,
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
            {userManagementList.map((item, index) => (
              <StyledLink to={item[Object.keys(item)[0]]} key={index}>
                <ListItem disablePadding>
                  <ListItemButton
                    selected={selectedItem === Object.keys(item)[0]}
                    onClick={() => handleItemClick(Object.keys(item)[0])}
                  >
                    <ListItemText primary={Object.keys(item)[0]} />
                  </ListItemButton>
                </ListItem>
              </StyledLink>
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
            {activityManagementList.map((item, index) => (
              <div key={index}>
                <ListItem key={Object.keys(item)[0]} disablePadding>
                  <ListItemButton
                    selected={selectedItem === Object.keys(item)[0]}
                    onClick={() =>
                      handleItemClick(
                        Object.keys(item)[0],
                        item[Object.keys(item)[0]]
                      )
                    }
                  >
                    <ListItemText primary={Object.keys(item)[0]} />
                  </ListItemButton>
                </ListItem>
              </div>
            ))}
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
            {bookingManagementList.map((item, index) => (
              <StyledLink to={item[Object.keys(item)[0]]} key={index}>
                <ListItem key={Object.keys(item)[0]} disablePadding>
                  <ListItemButton
                    selected={selectedItem === Object.keys(item)[0]}
                    onClick={() => handleItemClick(Object.keys(item)[0])}
                  >
                    <ListItemText primary={Object.keys(item)[0]} />
                  </ListItemButton>
                </ListItem>
              </StyledLink>
            ))}
          </List>
        </Box>
      </Drawer>
    </Box>
  );
};

export default SideNavBar;
