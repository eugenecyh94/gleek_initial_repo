import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import {
  AppBar,
  Badge,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Slide,
  Tab,
  Tabs,
  TextField,
  Toolbar,
  Typography,
  alpha,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  useActivityStore,
  useAdminStore,
  useSnackbarStore,
} from "../../zustand/GlobalStore";
import TaskIcon from "@mui/icons-material/Task";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import React from "react";
import ActivityDetailsQuickView from "./ActivityDetailsQuickView.jsx";
import AxiosConnect from "../../utils/AxiosConnect";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const StyledButton = styled(Button)`
  padding-left: 6px;
`;

const StyledDiv = styled("div")(({ theme }) => ({
  position: "relative",
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.light_purple.main, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginTop: 16,
  marginBottom: 16,
}));

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
  },
}));

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const ActivityListTable = ({ activities, pendingApprovalActivities }) => {
  const navigate = useNavigate();
  const [currentTabRows, setCurrentTabRows] = useState(activities);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [activityToReject, setActivityToReject] = useState();
  const [rejectionReason, setRejectionReason] = useState();
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState();
  const [imgs, setImgs] = useState([]);
  const [vendorProfile, setVendorProfile] = useState();
  const {
    selectedActivityTab,
    setSelectedActivityTab,
    approveActivity,
    rejectActivity,
    setPendingApprovalActivities,
  } = useActivityStore();

  const [markup, setMarkup] = useState();
  const [pricingRanges, setPricingRanges] = useState();

  const { openSnackbar } = useSnackbarStore();
  const { admin } = useAdminStore();
  const filterCriteria = {
    publishedTab: { approvalStatus: "Published" },
    pendingApprovalTab: { approvalStatus: "Pending Approval" },
  };

  useEffect(() => {
    if (Array.isArray(activities)) {
      const filteredRows =
        filterCriteria[selectedActivityTab].approvalStatus === "Published"
          ? activities
          : pendingApprovalActivities;
      setCurrentTabRows(filteredRows);
    }
    setActivityToReject();
  }, [activities, pendingApprovalActivities, selectedActivityTab]);

  const handleRowClick = async (activity) => {
    // navigate(`/viewActivity/${activity._id}`);
    const res = await AxiosConnect.get(`/activity/getImages/${activity._id}`);
    setImgs(res.data.activityImages);
    setVendorProfile(res.data.vendorProfileImage);
    setOpenViewModal(true);
    setSelectedActivity(activity);
  };
  const handleTabChange = (event, newValue) => {
    setSelectedActivityTab(newValue);
    const filteredRows =
      filterCriteria[selectedActivityTab].approvalStatus === "Published"
        ? activities
        : pendingApprovalActivities;
    setCurrentTabRows(filteredRows);
  };
  const handleApproveButton = async (activity) => {
    if (!markup) {
      openSnackbar(
        "Please fill up markup percentage before approving!",
        "error",
      );
    } else {
      const successMessage = await approveActivity(
        activity._id,
        admin._id,
        markup,
      );
      setPendingApprovalActivities(
        pendingApprovalActivities.filter((a) => a._id !== activity._id),
      );
      setOpenViewModal(false);
      openSnackbar(successMessage);
    }
  };
  const handleSubmitRejectButton = async () => {
    const successMessage = await rejectActivity(
      activityToReject._id,
      rejectionReason,
      admin._id,
    );
    setRejectModalOpen(false);
    setOpenViewModal(false);
    setPendingApprovalActivities(
      pendingApprovalActivities.filter((a) => a._id !== activityToReject._id),
    );
    openSnackbar(successMessage);
  };
  const handleOpenRejectModal = (activity) => {
    setRejectModalOpen(true);
    setActivityToReject(activity);
  };
  const handleCloseRejectModal = () => {
    setRejectModalOpen(false);
  };
  const handleRejectReasonChange = (event) => {
    setRejectionReason(event.target.value);
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };
  const publishedBadgeNumber = Array.isArray(activities)
    ? activities.length
    : null;
  const pendingApprovalBadgeNumber = Array.isArray(pendingApprovalActivities)
    ? pendingApprovalActivities.length
    : null;
  const columns = [];

  if (selectedActivityTab === "publishedTab") {
    columns.push(
      {
        field: "title",
        headerName: "Title",
        flex: 1,
      },
      {
        field: "linkedVendor",
        headerName: "Hosted By",
        flex: 1,
        valueGetter: (params) => {
          return params.value?.companyName;
        },
      },
      {
        field: "activityType",
        headerName: "Activity Type",
        flex: 1,
        renderCell: (params) => <WrappedTextCell {...params} />,
      },
      {
        field: "theme",
        headerName: "Theme",
        flex: 1,
        valueGetter: (params) => {
          return params.value?.name;
        },
      },
      {
        field: "subtheme",
        headerName: "Learning Topics",
        flex: 1,
        valueGetter: (params) => {
          return params.value.map((x) => x.name);
        },
      },
      {
        field: "duration",
        headerName: "Duration",
        flex: 1,
        valueFormatter: (params) => {
          return `${params.value} min`;
        },
      },
      {
        field: "activityPricingRules",
        headerName: "Price (Lowest)",
        flex: 1,
        valueFormatter: (params) => {
          return `$${params.value}`;
        },
        valueGetter: (params) => {
          const p = params.value;
          p.sort((a, b) => a?.pricePerPax - b?.pricePerPax);
          return p[0]?.pricePerPax;
        },
      },
      {
        field: "priceHighest",
        headerName: "Price (Highest)",
        flex: 1,
        valueFormatter: (params) => {
          return `$${params.value}`;
        },
        valueGetter: (params) => {
          const p = params.row.activityPricingRules;
          p.sort((a, b) => b?.pricePerPax - a?.pricePerPax);
          return p[0]?.pricePerPax;
        },
      },
      {
        field: "modifiedDate",
        headerName: "Published",
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.value);
          const formattedDate = date.toLocaleDateString(undefined, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          });
          const formattedTime = date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return (
            <div style={{ display: "flex" }}>
              <Typography color="#9F91CC" fontSize={"0.875rem"}>
                Published on&nbsp;
                <span style={{ color: "black" }}>
                  {formattedDate} at {formattedTime}
                </span>
              </Typography>
            </div>
          );
        },
      },
      {
        field: "approvedDate",
        headerName: "Approved",
        flex: 1,
        renderCell: (params) => {
          const list = params.row.approvalStatusChangeLog;
          const changeLog = list.find(
            (item) => item.approvalStatus === "Ready to Publish",
          );
          const date = changeLog?.date ? new Date(changeLog?.date) : null;
          const formattedDate = date?.toLocaleDateString(undefined, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          });
          const formattedTime = date?.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return date ? (
            <div style={{ display: "flex" }}>
              <Typography fontSize={"0.875rem"}>
                <span style={{ color: "#2e7d32" }}>Approved on&nbsp;</span>
                <span style={{ color: "black" }}>
                  {formattedDate} at {formattedTime}&nbsp;
                </span>
                by admin&nbsp;
                <span style={{ color: "#9F91CC" }}>
                  {changeLog?.admin?.name}
                </span>
              </Typography>
            </div>
          ) : (
            <div>-</div>
          );
        },
      },
    );
  }
  if (selectedActivityTab === "pendingApprovalTab") {
    columns.push(
      {
        field: "title",
        headerName: "Title",
        flex: 1,
      },
      {
        field: "linkedVendor",
        headerName: "Hosted By",
        flex: 1,
        valueGetter: (params) => {
          return params.value?.companyName;
        },
      },
      {
        field: "createdDate",
        headerName: "Created",
        flex: 1,
        renderCell: (params) => {
          const date = new Date(params.value);
          const formattedDate = date.toLocaleDateString(undefined, {
            year: "2-digit",
            month: "2-digit",
            day: "2-digit",
          });
          const formattedTime = date.toLocaleTimeString(undefined, {
            hour: "numeric",
            minute: "numeric",
            hour12: true,
          });
          return (
            <div style={{ display: "flex" }}>
              <Typography color="#9F91CC" fontSize={"0.875rem"}>
                Created on&nbsp;
                <span style={{ color: "black" }}>
                  {formattedDate} at {formattedTime}
                </span>
              </Typography>
            </div>
          );
        },
      },
      {
        field: "action",
        headerName: "Approve?",
        type: "actions",
        flex: 1,
        renderCell: (params) => {
          return (
            <div style={{ display: "flex", paddingTop: 4, paddingBottom: 4 }}>
              <Box>
                <Button
                  variant="contained"
                  color="light_purple"
                  onClick={() => handleApproveButton(params.row)}
                >
                  <DoneIcon fontSize="small" sx={{ color: "white" }} />
                  <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                    Approve
                  </Typography>
                </Button>
              </Box>
              <Box paddingLeft={2}>
                <Button
                  variant="contained"
                  color="error"
                  sx={{ minWidth: 0 }}
                  onClick={() => handleOpenRejectModal(params.row)}
                >
                  <CloseIcon fontSize="small" />
                  <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                    Reject
                  </Typography>
                </Button>
                <Dialog
                  open={rejectModalOpen}
                  onClose={handleCloseRejectModal}
                  sx={{
                    "& .MuiDialog-paper": {
                      border: "3px solid #D32F2F",
                      borderRadius: "10px",
                      boxShadow: "none",
                    },
                  }}
                >
                  <DialogTitle sx={{ paddingBottom: 0 }}>
                    <div style={{ display: "flex" }}>
                      <Typography fontSize={"1.25rem"}>
                        Rejecting activity&nbsp;
                      </Typography>
                      <Typography color="#9F91CC" fontSize={"1.25rem"}>
                        {activityToReject?.title}
                      </Typography>
                    </div>
                  </DialogTitle>
                  <DialogTitle sx={{ paddingTop: 0 }}>
                    <div style={{ display: "flex" }}>
                      <Typography fontSize={"1rem"}>Hosted By&nbsp;</Typography>
                      <Typography color="#9F91CC" fontSize={"1rem"}>
                        {activityToReject?.linkedVendor?.companyName}
                      </Typography>
                    </div>
                  </DialogTitle>

                  <DialogContent>
                    <DialogContentText>
                      Provide a reason for rejecting activity creation request!
                    </DialogContentText>
                    <TextField
                      autoFocus
                      margin="dense"
                      id="reject"
                      label="Reject Reason"
                      fullWidth
                      variant="standard"
                      onChange={handleRejectReasonChange}
                    />
                  </DialogContent>
                  <DialogActions>
                    <Button onClick={() => handleCloseRejectModal()}>
                      Cancel
                    </Button>
                    <Button
                      onClick={() => handleSubmitRejectButton()}
                      variant="contained"
                      color="error"
                      disabled={!rejectionReason || rejectionReason === ""}
                    >
                      REJECT
                    </Button>
                  </DialogActions>
                </Dialog>
              </Box>
            </div>
          );
        },
      },
    );
  }

  return (
    <Box>
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <Tabs value={selectedActivityTab} onChange={handleTabChange} centered>
          <Tab
            sx={{ left: 10 }}
            label="Published"
            value="publishedTab"
            icon={
              <StyledBadge
                color={
                  selectedActivityTab === "publishedTab"
                    ? "light_purple"
                    : "unselected"
                }
                badgeContent={publishedBadgeNumber}
                showZero
              >
                <TaskIcon />
              </StyledBadge>
            }
          />
          <Tab
            label="To Be Reviewed"
            value="pendingApprovalTab"
            icon={
              <StyledBadge
                color={"error"}
                badgeContent={pendingApprovalBadgeNumber}
              >
                <QueryBuilderIcon />
              </StyledBadge>
            }
          />
        </Tabs>
      </div>
      <div style={{ height: 500, width: "99%" }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={currentTabRows}
          columns={columns}
          slots={{
            toolbar: GridToolbarFilterButton,
          }}
          getRowHeight={() => "auto"}
          onRowClick={(params) => handleRowClick(params.row)}
          sx={{
            borderRadius: "10px",
            boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
            border: "none",
            backgroundColor: "white",
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
        />
        <Dialog
          fullScreen
          open={openViewModal}
          onClose={handleCloseViewModal}
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-paper": {
              backgroundColor: "#FAFAFA",
            },
          }}
        >
          <AppBar sx={{ position: "sticky", backgroundColor: "#9f91cc" }}>
            <Toolbar sx={{ justifyContent: "space-between" }}>
              <div style={{ display: "flex" }}>
                <IconButton
                  edge="start"
                  color="inherit"
                  onClick={handleCloseViewModal}
                  aria-label="close"
                >
                  <CloseIcon />
                </IconButton>
                <Typography sx={{ alignSelf: "center" }}>
                  {selectedActivityTab === "publishedTab"
                    ? "View Published Activity"
                    : "Review Pending Activity"}
                </Typography>
              </div>

              {selectedActivityTab === "pendingApprovalTab" && (
                <div style={{ display: "flex" }}>
                  <div style={{ paddingRight: 2 }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={() => handleApproveButton(selectedActivity)}
                      sx={{ boxShadow: "none" }}
                    >
                      <DoneIcon fontSize="small" sx={{ color: "white" }} />
                      <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                        Approve
                      </Typography>
                    </Button>
                  </div>
                  <Button
                    variant="contained"
                    color="error"
                    sx={{ minWidth: 0, boxShadow: "none" }}
                    onClick={() => handleOpenRejectModal(selectedActivity)}
                  >
                    <CloseIcon fontSize="small" />
                    <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                      Reject
                    </Typography>
                  </Button>
                </div>
              )}
            </Toolbar>
          </AppBar>
          <ActivityDetailsQuickView
            activity={selectedActivity}
            imgs={imgs}
            vendorProfile={vendorProfile}
            approve={selectedActivityTab === "pendingApprovalTab"}
            setPricingRanges={setPricingRanges}
            setMarkup={setMarkup}
            markup={markup}
          />
        </Dialog>
      </div>
    </Box>
  );
};
ActivityListTable.propTypes = {
  activities: PropTypes.array.isRequired,
  pendingApprovalActivities: PropTypes.array.isRequired,
};
export default ActivityListTable;
