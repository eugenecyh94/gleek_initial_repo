import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import { Button, InputBase, Typography, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import AddIcon from "@mui/icons-material/Add";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAdminStore } from "../../zustand/GlobalStore";
import MainBodyContainer from "../common/MainBodyContainer";

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

const columns = [
  {
    field: "name",
    headerName: "Name",
    flex: 1,
  },
  {
    field: "email",
    headerName: "Email",
    flex: 1,
  },
  {
    field: "role",
    headerName: "Role",
    flex: 1,
  },
  {
    field: "verified",
    headerName: "Verified",
    flex: 1,
  },
  {
    field: "creationDate",
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

const AdminsTable = (admins) => {
  const navigate = useNavigate();
  const [searchedRows, setSearchedRows] = useState([]);
  const { admin } = useAdminStore();
  useEffect(() => {
    setSearchedRows(admins.admins);
    console.log(admins);
  }, [admins]);

  const handleCreateButtonClick = () => {
    navigate("/adminTeam/addAdmin");
  };
  const requestSearch = (searchedVal) => {
    const filteredRows = admins.admins.filter((row) => {
      return row.name.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearchedRows(filteredRows);
  };

  return (
    <Box>
      <div style={{ display: "flex" }}>
        <Search>
          <SearchIconWrapper>
            <SearchIcon />
          </SearchIconWrapper>
          <StyledInputBase
            placeholder="Find an admin…"
            inputProps={{ "aria-label": "search" }}
            onChange={(event) => requestSearch(event.target.value)}
          />
        </Search>
        {admin.role === "MANAGERIAL" && (
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
        )}
      </div>
      <div style={{ flex: 1, maxHeight: "500px", overflow: "auto" }}>
        <Box
          flexDirection="column"
          justifyItems="center"
          display="flex"
          width={"99%"}
          height={500}
        >
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
        </Box>
      </div>
    </Box>
  );
};
export default AdminsTable;
