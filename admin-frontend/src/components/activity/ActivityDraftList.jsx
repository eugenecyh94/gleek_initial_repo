import styled from "@emotion/styled";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import EditNoteIcon from "@mui/icons-material/EditNote";
import TaskIcon from "@mui/icons-material/Task";
import { Badge, Box, Button, Tab, Tabs, Typography } from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useActivityStore, useSnackbarStore } from "../../zustand/GlobalStore";

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
  const { selectedTab, setSelectedTab } = useActivityStore();
  const { openSnackbar } = useSnackbarStore();
  const filterCriteria = {
    publishedTab: { approvalStatus: "Published", isDraft: false },
    draftTab: { approvalStatus: "Pending Approval", isDraft: true },
  };
  const [selectedRows, setSelectedRows] = useState([]);
  const [currentTabRows, setCurrentTabRows] = useState(() => {
    if (Array.isArray(activities)) {
      return activities?.filter(
        (activity) =>
          activity.approvalStatus ===
            filterCriteria[selectedTab].approvalStatus &&
          activity.isDraft === filterCriteria[selectedTab].isDraft
      );
    } else {
      return [];
    }
  });
  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentTabRows(
      activities?.filter(
        (activity) =>
          activity.approvalStatus === filterCriteria[newValue].approvalStatus &&
          activity.isDraft === filterCriteria[newValue].isDraft
      )
    );
  };
  useEffect(() => {
    if (Array.isArray(activities)) {
      const filteredRows = activities.filter(
        (activity) =>
          activity.approvalStatus ===
            filterCriteria[selectedTab].approvalStatus &&
          activity.isDraft === filterCriteria[selectedTab].isDraft
      );
      setCurrentTabRows(filteredRows);
    }
  }, [activities, selectedTab]);

  const handleEditButton = (activity) => {
    navigate(`/editActivityDraft/${activity._id}`);
  };
  const handleDeleteButton = async (activity) => {
    const snackbarMessage = await deleteActivity(activity?._id);
    openSnackbar(snackbarMessage);
  };
  const handleBulkDelete = async () => {
    const snackbarMessage = await bulkDeleteActivity(selectedRows);
    setSelectedRows([]);
    openSnackbar(snackbarMessage);
  };
  const publishedBadgeNumber = Array.isArray(activities)
    ? activities.filter((activity) => activity.approvalStatus === "Published")
        .length
    : null;
  const draftBadgeNumber = Array.isArray(activities)
    ? activities.filter(
        (activity) =>
          activity.isDraft === true &&
          activity.approvalStatus === "Pending Approval"
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
    columns.push({
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
    });
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
  return (
    <Box>
      <Box display={"flex"} justifyContent={"space-between"}>
        <Tabs value={selectedTab} onChange={handleTabChange} centered>
          <Tab
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
        </Tabs>
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
            >
              Delete
            </Button>
          </Box>
        )}
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
        />
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
