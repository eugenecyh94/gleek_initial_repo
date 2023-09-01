import { AppBar, Toolbar, Typography } from "@mui/material";

const HomePageNavBar = () => {
  return (
    <AppBar
      position="fixed"
      sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
    >
      <Toolbar style={{ paddingLeft: 16 }}>
        <Typography fontSize={25} fontWeight={700} noWrap component="div">
          Gleek Admin
        </Typography>
      </Toolbar>
    </AppBar>
  );
};
export default HomePageNavBar;
