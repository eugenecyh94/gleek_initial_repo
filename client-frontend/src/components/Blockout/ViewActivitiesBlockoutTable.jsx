import { useTheme } from "@emotion/react";
import { Box, Button, Stack } from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import InfoIcon from "@mui/icons-material/Info";

const ViewActivitiesBlockoutTable = ({
  activities,
  selectedActivity,
  setSelectedActivity,
  setOpenModal,
  openModal,
}) => {
  const navigate = useNavigate();

  const theme = useTheme();

  const [currentTabRows, setCurrentTabRows] = useState(activities);

  useEffect(() => {
    if (Array.isArray(activities)) {
      setCurrentTabRows(activities);
    }
  }, [activities]);

  const handleViewButton = (activity) => {
    setSelectedActivity(activity);
    setOpenModal(true);
  };

  const columns = [
    {
      field: "title",
      headerName: "Title",
      flex: 1,
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
      field: "description",
      headerName: "Description",
      flex: 1,
      valueFormatter: (params) => {
        const maxLength = 70;
        if (params.value && params.value.length > maxLength) {
          return params.value.substring(0, maxLength) + "...";
        }
        return params.value;
      },
    },
    {
      field: "duration",
      headerName: "Duration",
      flex: 1,
    },
    {
      field: "location",
      headerName: "Location",
      flex: 1,
    },

    {
      field: "createdDate",
      headerName: "Date Created",
      flex: 1,
      valueFormatter: (params) => {
        const date = new Date(params.value);
        const formattedDate = date.toLocaleDateString(undefined, {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        });
        return formattedDate;
      },
    },
    {
      field: "approvalStatus",
      headerName: "Approval Status",
      flex: 1,
    },
    {
      field: "isDraft",
      headerName: "Draft",
      flex: 1,
      valueFormatter: (params) => {
        const val = params.value;
        return val ? "Yes" : "No";
      },
    },
    {
      field: "viewBlockouts",
      headerName: "Blockout Timings",
      type: "actions",
      flex: 1,
      renderCell: (params) => {
        const handleEditClick = () => {
          const activityId = params.row._id;
          navigate(`/vendor/activity/${activityId}/blockout`);
        };

        return (
          <Stack direction={"row"} spacing={1}>
            <Button
              variant="outlined"
              color="primary"
              onClick={handleEditClick}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => handleViewButton(params.row)}
            >
              View
            </Button>
          </Stack>
        );
      },
    },
  ];

  return (
    <Box paddingTop={2} marginLeft={2}>
      <DataGrid
        checkboxSelection={false}
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
    </Box>
  );
};

export default ViewActivitiesBlockoutTable;
