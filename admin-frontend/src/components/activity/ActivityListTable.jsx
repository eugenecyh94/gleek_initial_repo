import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import * as React from "react";
import { useEffect, useState } from "react";

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

const columns = [
  {
    field: "title",
    headerName: "Title",
    flex: 1,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
  },
  {
    field: "tag",
    headerName: "Tag",
    flex: 1,
  },
  {
    field: "price",
    headerName: "Price",
    flex: 1,
    valueFormatter: (params) => {
      return `$${params.value}`;
    },
  },
];

const ActivityListTable = (allActivities) => {
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

  return (
    <Box>
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
      <div style={{ height: 500, width: "100%" }}>
        <DataGrid
          initialState={{
            pagination: {
              paginationModel: { pageSize: 25, page: 0 },
            },
          }}
          getRowId={(row) => row._id}
          rows={
            searchedRows === []
              ? allActivities?.allActivities?.data
              : searchedRows
          }
          columns={columns}
          slots={{
            toolbar: GridToolbarFilterButton,
          }}
        />
      </div>
    </Box>
  );
};
export default ActivityListTable;
