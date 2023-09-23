import styled from "@emotion/styled";
import {
  Avatar,
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  useTheme
} from "@mui/material";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useActivityStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";

const StyledAvatar = styled("div")(() => ({
  display: "flex",
  marginBottom: 16,
}));
const StyledVendorName = styled("div")(() => ({
  fontWeight: "bold",
}));
const Container = styled.div`
  display: flex;
  flex-direction: column;
`;
const StyledDiv = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;

const ActivityDetails = () => {
  const theme = useTheme();
  const { activityId } = useParams();
  const { getSingleActivity, activityDetails, isLoading } = useActivityStore();

  useEffect(() => {
    const fetchActivityDetails = async () => {
      await getSingleActivity(activityId);
    };
    fetchActivityDetails();
  }, [getSingleActivity, activityId]);

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
  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"View Published Activities"}
    >
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <Box>
          <Grid container spacing={2} alignItems="left" justifyContent="left">
            <Grid item xs={12}>
              <Typography
                fontSize={25}
                fontWeight={700}
                noWrap
                component="div"
                color={theme.palette.primary.main}
              >
                {activityDetails.title}
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <StyledAvatar>
                <Avatar
                  style={{ marginRight: 8, marginTop: 6 }}
                  {...stringAvatar(
                    activityDetails?.linkedVendor?.companyName,
                    theme
                  )}
                />
                <Container>
                  <Typography>
                    Vendor Partner
                    <StyledVendorName>
                      {activityDetails?.linkedVendor?.companyName}
                    </StyledVendorName>
                  </Typography>
                </Container>
              </StyledAvatar>
            </Grid>
            <Grid item xs={12}>
              <Typography color={theme.palette.primary.main} component="div">
                Activity Details
              </Typography>
              <Chip label={activityDetails?.activityType} />
              <Typography component="div">
                {activityDetails?.description}
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <Typography color={theme.palette.primary.main} component="div">
                Theme
              </Typography>
              <Typography component="div">
                {activityDetails?.theme?.name}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color={theme.palette.primary.main} component="div">
                Learning Points
              </Typography>

              {activityDetails?.subtheme?.map((s, index) => (
                <Chip key={index} label={s.name} />
              ))}
            </Grid>
            <Grid item xs={4}>
              <Typography color={theme.palette.primary.main} component="div">
                Duration
              </Typography>
              <Typography>{activityDetails?.duration} min</Typography>
              <Typography color={theme.palette.primary.main} component="div">
                Location
              </Typography>
              <Typography>{activityDetails?.location}</Typography>
              <Typography color={theme.palette.primary.main} component="div">
                Day Availabilities
              </Typography>
              <Typography>
                {activityDetails?.dayAvailabilities?.join(", ")}
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <Typography color={theme.palette.primary.main} component="div">
                Sustainability Development Goals
              </Typography>
              {activityDetails?.sdg?.map((s, index) => (
                <Chip key={index} label={s} style={{ paddingTop: 2 }} />
              ))}
            </Grid>
            {activityDetails?.activityType === "Popups (Food)" && (
              <Grid item xs={4}>
                <Typography color={theme.palette.primary.main} component="div">
                  Food Categories
                </Typography>
                {activityDetails?.foodCategory?.map((s, index) => (
                  <Chip key={index} label={s} style={{ paddingTop: 2 }} />
                ))}
              </Grid>
            )}
            {activityDetails?.activityType ===
              ("Popups (Food)" || "Popups (Non-food)") && (
              <Grid item xs={4}>
                <Typography color={theme.palette.primary.main} component="div">
                  Pop-up items sold
                </Typography>
                <Typography>{activityDetails?.popupItemsSold}</Typography>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography
                noWrap
                component="div"
                color={theme.palette.primary.main}
                paddingBottom={2}
              >
                Activity Pricing Rules
              </Typography>
              <Typography
                noWrap
                component="div"
                color={theme.palette.primary.main}
                paddingBottom={2}
              >
                Max Participants: {activityDetails?.maxParticipants}
              </Typography>
              <TableContainer component={Paper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Pax Interval</TableCell>
                      <TableCell>Price Per Pax</TableCell>
                      <TableCell>Weekend Addon</TableCell>
                      <TableCell>Public Holiday Addon</TableCell>
                      <TableCell>Online Addon</TableCell>
                      <TableCell>Offline Addon</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {activityDetails.activityPricingRules?.map((row) => (
                      <TableRow key={row._id}>
                        <TableCell>{row.paxInterval}</TableCell>
                        <TableCell>${row.pricePerPax}</TableCell>
                        <TableCell>${row.weekendAddon}</TableCell>
                        <TableCell>${row.publicHolidayAddon}</TableCell>
                        <TableCell>${row.onlineAddon}</TableCell>
                        <TableCell>${row.offlineAddon}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
              <Grid item xs={12} paddingTop={2}>
                <Typography
                  noWrap
                  component="div"
                  color={theme.palette.primary.main}
                  paddingBottom={2}
                >
                  Activity Images
                </Typography>
                <StyledDiv>
                  {activityDetails?.preSignedImages?.map((img, index) => (
                    <img src={img} key={index} style={{ maxWidth: "100px" }} />
                  ))}
                </StyledDiv>
              </Grid>
            </Grid>
          </Grid>
        </Box>
      )}
    </MainBodyContainer>
  );
};
export default ActivityDetails;
