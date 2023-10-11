import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import AddIcon from "@mui/icons-material/Add";
import TaskIcon from "@mui/icons-material/Task";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import BlockIcon from "@mui/icons-material/Block";

import {
  AppBar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  IconButton,
  Slide,
  Tab,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AxiosConnect from "../../../utils/AxiosConnect";
import CloseIcon from "@mui/icons-material/Close";
import useActivityStore from "../../../zustand/ActivityStore";
import useSnackbarStore from "../../../zustand/SnackbarStore";
import ActivityDetailsQuickView from "./ActivityDetailsQuickView.jsx";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});
const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
  },
}));

const ActivityDraftList = ({
  activities,
  deleteActivity,
  bulkDeleteActivity,
}) => {
  const navigate = useNavigate();
  const { selectedTab, setSelectedTab, publishActivity, setActivities } =
    useActivityStore();
  const { openSnackbar } = useSnackbarStore();
  const filterCriteria = {
    publishedTab: { approvalStatus: ["Published"], isDraft: false },
    draftTab: {
      approvalStatus: ["Rejected", "Pending Approval"],
      isDraft: true,
    },
    pendingApprovalTab: {
      approvalStatus: ["Pending Approval"],
      isDraft: false,
    },
    readyToPublishTab: { approvalStatus: ["Ready to Publish"], isDraft: false },
    rejectedTab: { approvalStatus: ["Rejected"], isDraft: false },
  };
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState();
  const [imgs, setImgs] = useState([]);
  const [vendorProfile, setVendorProfile] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentTabRows, setCurrentTabRows] = useState(() => {
    if (Array.isArray(activities)) {
      return activities.filter(
        (activity) =>
          activity.isDraft === filterCriteria[selectedTab].isDraft &&
          filterCriteria[selectedTab].approvalStatus.includes(
            activity.approvalStatus
          )
      );
    } else {
      return [];
    }
  });
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentTabRows(
      activities.filter(
        (activity) =>
          filterCriteria[newValue].approvalStatus.includes(
            activity.approvalStatus
          ) && activity.isDraft === filterCriteria[newValue].isDraft
      )
    );
  };
  useEffect(() => {
    if (Array.isArray(activities)) {
      const filteredRows = activities?.filter(
        (activity) =>
          filterCriteria[selectedTab].approvalStatus.includes(
            activity.approvalStatus
          ) && activity.isDraft === filterCriteria[selectedTab].isDraft
      );
      setCurrentTabRows(filteredRows);
    }
  }, [activities, selectedTab]);

  const handleCreateButtonClick = () => {
    navigate("/vendor/createActivity");
  };
  const handleEditButton = (activity) => {
    navigate(`/vendor/editActivityDraft/${activity._id}`);
  };
  const handleDeleteButton = async (activity) => {
    const snackbarMessage = await deleteActivity(activity?._id);
    openSnackbar(snackbarMessage);
  };
  const handlePublishButton = async (cur) => {
    const { message, activity } = await publishActivity(cur._id);
    const updatedActivities = activities.map((a) => {
      if (a._id === activity._id) {
        return activity;
      }
      return a;
    });
    setActivities(updatedActivities);
    openSnackbar(message);
  };
  const handleResubmitButton = async (activity) => {
    let path;
    if (activity.rejectedDraft) {
      path = activity.rejectedDraft._id;
    } else {
      path = activity._id;
    }
    navigate(`/vendor/editActivityDraft/${path}`);
  };
  const handleBulkDelete = async () => {
    const snackbarMessage = await bulkDeleteActivity(selectedRows);
    setSelectedRows([]);
    openSnackbar(snackbarMessage);
  };
  const handleRowClick = async (activity) => {
    if (
      selectedTab === "publishedTab" ||
      selectedTab === "pendingApprovalTab" ||
      selectedTab === "readyToPublishTab" ||
      selectedTab === "rejectedTab"
    ) {
      const res = await AxiosConnect.get(
        `/gleekVendor/activity/getImages/${activity._id}`
      );
      setImgs(res.data.activityImages);
      setVendorProfile(res.data.vendorProfileImage);
      setOpenViewModal(true);
      setSelectedActivity(activity);
    }
  };
  const handleCloseViewModal = () => {
    setOpenViewModal(false);
  };
  const publishedBadgeNumber = Array.isArray(activities)
    ? activities.filter((activity) => activity.approvalStatus === "Published")
        .length
    : null;
  const draftBadgeNumber = Array.isArray(activities)
    ? activities.filter((activity) => activity.isDraft === true).length
    : null;
  const pendingApprovalBadgeNumber = Array.isArray(activities)
    ? activities.filter(
        (activity) =>
          activity.isDraft === false &&
          activity.approvalStatus === "Pending Approval"
      ).length
    : null;
  const readyToPublishBadgeNumber = Array.isArray(activities)
    ? activities.filter(
        (activity) =>
          activity.isDraft === false &&
          activity.approvalStatus === "Ready to Publish"
      ).length
    : null;
  const rejectedBadgeNumber = Array.isArray(activities)
    ? activities.filter(
        (activity) =>
          activity.isDraft === false && activity.approvalStatus === "Rejected"
      ).length
    : null;

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
      renderCell: (params) => {
        const val = params.value ?? "Untitled";
        return val === "Untitled" ? (
          <span style={{ fontStyle: "italic" }}>{val}</span>
        ) : (
          val
        );
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
              {selectedTab === "publishedTab"
                ? "Published\u00A0"
                : "Created\u00A0"}
            </Typography>
            {formattedDate} at {formattedTime}
          </div>
        );
      },
    },
  ];

  if (selectedTab === "draftTab") {
    columns.push(
      {
        field: "modifiedDate",
        headerName: "Modified",
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
            <div>
              <Typography color="#9F91CC" fontSize={"0.875rem"}>
                Last Modified
              </Typography>
              {formattedDate} at {formattedTime}
            </div>
          );
        },
      },
      {
        field: "rejected",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => {
          const status = params.row.approvalStatus;
          return (
            <div>
              {status === "Rejected" ? (
                <Chip label="Re-submission" color="error" variant="outlined" />
              ) : (
                <Chip
                  label="New Draft"
                  variant="outlined"
                  sx={{ color: "#9F91CC" }}
                />
              )}
            </div>
          );
        },
      }
    );
    columns.push({
      field: "action",
      headerName: "Actions",
      type: "actions",
      flex: 1,
      renderCell: (params) => {
        return (
          <div style={{ display: "flex" }}>
            <Box>
              <Button
                variant="contained"
                color="light_purple"
                onClick={() => handleEditButton(params.row)}
              >
                <EditIcon fontSize="small" sx={{ color: "white" }} />
                <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                  Edit
                </Typography>
              </Button>
            </Box>
            <Box paddingLeft={2}>
              <Button
                variant="outlined"
                color="error"
                sx={{ minWidth: 0 }}
                onClick={() => handleDeleteButton(params.row)}
              >
                <DeleteIcon fontSize="small" />
              </Button>
            </Box>
          </div>
        );
      },
    });
  }
  if (selectedTab === "readyToPublishTab") {
    columns.push(
      {
        field: "approvedOn",
        headerName: "Approved",
        type: "actions",
        flex: 1,
        renderCell: (params) => {
          const list = params.row.approvalStatusChangeLog;
          const changeLog = list.find(
            (item) => item.approvalStatus === "Ready to Publish"
          );
          const date = new Date(changeLog?.date);
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
            <div>
              <Typography color="#9F91CC" fontSize={"0.875rem"}>
                Approved on
              </Typography>
              {formattedDate} at {formattedTime} by admin&nbsp;
              <span style={{ color: "#9F91CC" }}>{changeLog?.admin?.name}</span>
            </div>
          );
        },
      },
      {
        field: "action",
        headerName: "Actions",
        type: "actions",
        flex: 1,
        renderCell: (params) => {
          return (
            <div style={{ display: "flex" }}>
              <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Button
                  variant="contained"
                  color="light_purple"
                  onClick={() => handlePublishButton(params.row)}
                >
                  <EditIcon fontSize="small" sx={{ color: "white" }} />
                  <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                    Publish
                  </Typography>
                </Button>
              </Box>
            </div>
          );
        },
      }
    );
  }
  if (selectedTab === "rejectedTab") {
    columns.push(
      {
        field: "rejectedOn",
        headerName: "Rejected",
        type: "actions",
        flex: 1,
        headerAlign: "left",
        renderCell: (params) => {
          const list = params.row.approvalStatusChangeLog.sort(
            (a, b) => new Date(b?.date) - new Date(a?.date)
          );
          const changeLog = list.find(
            (item) => item.approvalStatus === "Rejected"
          );
          const date = new Date(changeLog?.date);
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
            <div>
              <Typography color="error" fontSize={"0.875rem"}>
                Rejected on&nbsp;
                <span style={{ color: "black" }}>
                  {formattedDate} at {formattedTime} by admin&nbsp;
                </span>
                <span style={{ color: "#9F91CC" }}>
                  {changeLog?.admin?.name}
                </span>
              </Typography>
            </div>
          );
        },
      },
      {
        field: "rejectionReason",
        headerName: "Reason for rejection",
        flex: 1,
      },
      {
        field: "action",
        headerName: "Actions",
        type: "actions",
        flex: 1,
        headerAlign: "left",
        align: "left",
        renderCell: (params) => {
          return (
            <div style={{ display: "flex" }}>
              <Box sx={{ paddingTop: 2, paddingBottom: 2 }}>
                <Button
                  variant="contained"
                  color="light_purple"
                  onClick={() => handleResubmitButton(params.row)}
                >
                  <EditIcon fontSize="small" sx={{ color: "white" }} />
                  <Typography sx={{ color: "white" }} fontSize={"0.875rem"}>
                    Re-submit
                  </Typography>
                </Button>
              </Box>
            </div>
          );
        },
      }
    );
  }
  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab
            sx={{ left: 10 }}
            label="Published"
            value="publishedTab"
            icon={
              <StyledBadge
                color={
                  selectedTab === "publishedTab" ? "light_purple" : "unselected"
                }
                badgeContent={publishedBadgeNumber}
                showZero
              >
                <TaskIcon />
              </StyledBadge>
            }
          />
          <Tab
            label="Drafts"
            value="draftTab"
            icon={
              <StyledBadge
                color={
                  selectedTab === "draftTab" ? "light_purple" : "unselected"
                }
                badgeContent={draftBadgeNumber}
                showZero
              >
                <EditNoteIcon />
              </StyledBadge>
            }
          />
          <Tab
            label="Pending Approval"
            value="pendingApprovalTab"
            icon={
              <StyledBadge
                color={
                  selectedTab === "pendingApprovalTab"
                    ? "light_purple"
                    : "unselected"
                }
                badgeContent={pendingApprovalBadgeNumber}
                showZero
              >
                <QueryBuilderIcon />
              </StyledBadge>
            }
          />
          <Tab
            label="Ready to Publish"
            value="readyToPublishTab"
            icon={
              <StyledBadge
                color={"success"}
                badgeContent={readyToPublishBadgeNumber}
              >
                <TaskAltIcon />
              </StyledBadge>
            }
          />
          <Tab
            label="Rejected"
            value="rejectedTab"
            icon={
              <StyledBadge color={"error"} badgeContent={rejectedBadgeNumber}>
                <BlockIcon />
              </StyledBadge>
            }
          />
        </Tabs>
        <Box display="flex">
          {selectedTab === "draftTab" && selectedRows.length > 0 && (
            <Box
              display="flex"
              flexDirection="column"
              justifyContent="center"
              alignItems="center"
              paddingRight={2}
            >
              <Button
                variant="contained"
                color="error"
                onClick={handleBulkDelete}
                style={{
                  justifyContent: "center",
                  paddingLeft: 2,
                  paddingRight: 6,
                }}
              >
                <Typography
                  style={{
                    display: "flex",
                    alignItems: "center",
                  }}
                  component="div"
                  color="white"
                  fontSize={"0.875rem"}
                >
                  <DeleteIcon fontSize="small" />
                  Delete
                </Typography>
              </Button>
            </Box>
          )}
          <Box
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            paddingRight={2}
          >
            <Button
              variant="contained"
              color="light_purple"
              onClick={handleCreateButtonClick}
              style={{
                paddingLeft: 2,
                justifyContent: "center",
                paddingRight: 6,
              }}
            >
              <Typography
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
                component="div"
                color="white"
                fontSize={"0.875rem"}
              >
                <AddIcon fontSize="small" />
                Create
              </Typography>
            </Button>
          </Box>
        </Box>
      </Box>

      <div style={{ height: 500, width: "99%" }}>
        <DataGrid
          checkboxSelection={selectedTab === "draftTab"}
          rowSelectionModel={selectedRows}
          onRowSelectionModelChange={(rows) => {
            setSelectedRows(rows);
          }}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={currentTabRows ?? []}
          columns={columns}
          slots={{
            toolbar: GridToolbarFilterButton,
          }}
          getRowHeight={() => "auto"}
          sx={{
            borderRadius: "10px",
            boxShadow: "4px 4px 0px 0px rgb(159 145 204 / 40%)",
            border: "none",
            backgroundColor: "white",
            "& .MuiDataGrid-cell:hover": {
              cursor: "pointer",
            },
          }}
          onRowClick={(params) => handleRowClick(params.row)}
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
                  <CloseIcon sx={{ color: "white" }} />
                </IconButton>
                <Typography sx={{ alignSelf: "center" }} color="white">
                  {selectedTab === "publishedTab" && "View Published Activity"}
                  {selectedTab === "readyToPublishTab" &&
                    "View Ready to Publish Activity"}
                  {selectedTab === "pendingApprovalTab" &&
                    "View Pending Approval Activity"}
                  {selectedTab === "rejectedTab" && "View Rejected Activity"}
                </Typography>
              </div>
            </Toolbar>
          </AppBar>
          <ActivityDetailsQuickView
            activity={selectedActivity}
            imgs={imgs}
            vendorProfile={vendorProfile}
          />
        </Dialog>
      </div>
    </Box>
  );
};
ActivityDraftList.propTypes = {
  activities: PropTypes.array.isRequired,
  deleteActivity: PropTypes.func.isRequired,
  bulkDeleteActivity: PropTypes.func.isRequired,
};
export default ActivityDraftList;
