import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputBase, Typography, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

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

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.light_purple.main, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginTop: 16,
  marginBottom: 16,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const columns = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
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
    field: "description",
    headerName: "Description",
    flex: 1,
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
];

const ActivityListTable = (allActivities) => {
  const navigate = useNavigate();
  const [searchedRows, setSearchedRows] = useState([]);
  useEffect(() => {
    setSearchedRows(allActivities.allActivities.data);
  }, [allActivities.allActivities.data]);

  const requestSearch = (searchedVal) => {
    const filteredRows = allActivities.allActivities.data.filter((row) => {
      return row.title.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearchedRows(filteredRows);
  };

  const handleCreateButtonClick = () => {
    navigate("/createActivity");
  };
  const handleRowClick = (activity) => {
    console.log("clicked", activity._id);
    navigate(`/viewActivity/${activity._id}`);
  };

  return (
    <Box>
      <div style={{ display: "flex" }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Find an activity…"
            inputProps={{ "aria-label": "search" }}
            onChange={(event) => requestSearch(event.target.value)}
          />
        </Search>
        <StyledDiv>
          <StyledButton
            variant="contained"
            color="light_purple"
            onClick={handleCreateButtonClick}
          >
            <Typography
              style={{
                display: "flex",
              }}
              component="div"
              color="white"
            >
              <AddIcon />
              Create
            </Typography>
          </StyledButton>
        </StyledDiv>
      </div>
      <div style={{ height: 500, width: "99%" }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={searchedRows}
          columns={columns}
          slots={{
            toolbar: GridToolbarFilterButton,
          }}
          getRowHeight={() => "auto"}
          onRowClick={(params) => handleRowClick(params.row)}
        />
      </div>
    </Box>
  );
};
export default ActivityListTable;
