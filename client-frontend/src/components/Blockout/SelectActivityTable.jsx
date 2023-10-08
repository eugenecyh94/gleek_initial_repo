import { useTheme } from "@emotion/react";
import styled from "@emotion/styled";
import { Badge, Box, Button, Stack } from "@mui/material";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const StyledBadge = styled(Badge)(({ theme }) => ({
  "& .MuiBadge-badge": {
    right: -3,
    top: 13,
    border: `2px solid ${theme.palette.background.paper}`,
    padding: "0 4px",
    color: "white",
  },
}));

const SelectActivityTable = ({
  activities,
  selectedRows,
  setSelectedRows,
  setOpenModal,
  openModal,
  selectedActivity,
  setSelectedActivity,
}) => {
  const navigate = useNavigate();

  const theme = useTheme();

  const [currentTabRows, setCurrentTabRows] = useState(activities);

  useEffect(() => {
    if (Array.isArray(activities)) {
      setCurrentTabRows(activities);
    }
  }, [activities]);

  // const handleViewButton = (activity) => {
  //   navigate(`/vendor/activity/${activity._id}`);
  // };

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
    // {
    //   field: "activityType",
    //   headerName: "Activity Type",
    //   flex: 1,
    //   renderCell: (params) => <WrappedTextCell {...params} />,
    // },
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
    // {
    //   field: "activityPricingRules",
    //   headerName: "Price (Lowest)",
    //   flex: 1,
    //   valueFormatter: (params) => {
    //     return `$${params.value}`;
    //   },
    //   valueGetter: (params) => {
    //     const p = params.value;
    //     p.sort((a, b) => a?.pricePerPax - b?.pricePerPax);
    //     return p[0]?.pricePerPax;
    //   },
    // },
    // {
    //   field: "priceHighest",
    //   headerName: "Price (Highest)",
    //   flex: 1,
    //   valueFormatter: (params) => {
    //     return `$${params.value}`;
    //   },
    //   valueGetter: (params) => {
    //     const p = params.row.activityPricingRules;
    //     p.sort((a, b) => b?.pricePerPax - a?.pricePerPax);
    //     return p[0]?.pricePerPax;
    //   },
    // },
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
        return (
          <Stack direction={"row"}>
            <Button
              variant="contained"
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
    <Box maxWidth={"99%"} paddingTop={2}>
      <DataGrid
        checkboxSelection
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
    </Box>
  );
};

export default SelectActivityTable;
