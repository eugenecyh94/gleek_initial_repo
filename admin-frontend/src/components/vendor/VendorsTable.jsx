import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { InputBase, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
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
    field: "companyName",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "companyUEN",
    headerName: "UEN",
    flex: 1,
  },
  {
    field: "companyAddress",
    headerName: "Address",
    flex: 1,
  },
  {
    field: "typeOfCompany",
    headerName: "Type",
    flex: 1,
    valueGetter: (params) => {
      return params.row.companyType === "Other"
        ? "Other - " + params.row.customCompanyType
        : params.row.companyType;
    },
  },
  {
    field: "companyNumber",
    headerName: "HP Number",
    flex: 1,
  },
  {
    field: "brandNames",
    headerName: "Brand Names",
    flex: 1,
  },
];

const VendorsTable = (allVendors) => {
  const { vendors } = allVendors;
  const [searchedRows, setSearchedRows] = useState([]);
  useEffect(() => {
    setSearchedRows(vendors);
  }, [vendors]);

  const requestSearch = (searchedVal) => {
    const filteredRows = vendors.filter((row) => {
      return row.companyName.toLowerCase().includes(searchedVal.toLowerCase());
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
          placeholder="Find a vendor…"
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
          rows={searchedRows}
          columns={columns}
          slots={{
            toolbar: GridToolbarFilterButton,
          }}
        />
      </div>
    </Box>
  );
};
export default VendorsTable;
