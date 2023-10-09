import styled from "@emotion/styled";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import DoDisturbIcon from "@mui/icons-material/DoDisturb";
import DoneIcon from "@mui/icons-material/Done";
import QueryBuilderIcon from "@mui/icons-material/QueryBuilder";
import TaskAltIcon from "@mui/icons-material/TaskAlt";
import { Badge, Button, Tab, Tabs, Typography, alpha } from "@mui/material";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useState } from "react";
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

const VendorsTable = ({ vendors, updateVendor }) => {
  const handleStatusUpdate = async (id, row, newStatus) => {
    const approvedRow = { ...row, status: newStatus };
    await updateVendor(id, approvedRow);
  };

  const badgeNumber = vendors.filter(
    (vendor) => vendor.status === "PENDING",
  ).length;

  const filterCriteria = {
    approvedTab: { status: "APPROVED" },
    pendingTab: { status: "PENDING" },
    rejectedTab: { status: "REJECTED" },
  };

  const [selectedTab, setSelectedTab] = useState("approvedTab");
  const [currentTabRows, setCurrentTabRows] = useState(() => {
    return vendors.filter(
      (vendors) => vendors.status === filterCriteria[selectedTab].status,
    );
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentTabRows(
      vendors.filter(
        (vendors) => vendors.status === filterCriteria[newValue].status,
      ),
    );
  };

  const navigate = useNavigate();

  const handleRowClick = (vendor) => {
    navigate(`/viewVendor/${vendor._id}`);
  };

  const handleCreateButtonClick = () => {
    navigate("/addVendor");
  };

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
        return params.row.vendorType === "Other"
          ? "Other - " + params.row.customCompanyType
          : params.row.vendorType;
      },
    },
    {
      field: "companyPhoneNumber",
      headerName: "HP Number",
      flex: 1,
    },
    {
      field: "brandNames",
      headerName: "Brand Names",
      flex: 1,
    },
  ];

  if (selectedTab === "pendingTab") {
    columns.push({
      field: "approve",
      headerName: "Approve?",
      type: "actions",
      flex: 1,
      getActions: (params) => [
        <GridActionsCellItem
          key={params.row.id}
          icon={<DoneIcon />}
          onClick={async () =>
            await handleStatusUpdate(params.row._id, params.row, "APPROVED")
          }
          label="approve"
        />,
        <GridActionsCellItem
          key={params.row.id}
          icon={<CloseIcon />}
          onClick={async () =>
            await handleStatusUpdate(params.row._id, params.row, "REJECTED")
          }
          label="reject"
        />,
      ],
    });
  }
  if (selectedTab === "approvedTab") {
    columns.push({
      field: "approvedDate",
      headerName: "Approved Date",
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
    });
  }

  return (
    <Box>
      <div style={{ display: "flex" }}>
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
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Approved" value="approvedTab" icon={<TaskAltIcon />} />
        <Tab
          label="To be Approved"
          value="pendingTab"
          icon={
            <Badge color="error" badgeContent={badgeNumber}>
              <QueryBuilderIcon />
            </Badge>
          }
        />
        <Tab label="Rejected" value="rejectedTab" icon={<DoDisturbIcon />} />
      </Tabs>
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
            rows={currentTabRows}
            columns={columns}
            slots={{
              toolbar: GridToolbarFilterButton,
            }}
            onRowClick={(params) => handleRowClick(params.row)}
          />
        </Box>
      </div>
    </Box>
  );
};
VendorsTable.propTypes = {
  vendors: PropTypes.array.isRequired,
  updateVendor: PropTypes.func.isRequired,
};
export default VendorsTable;
