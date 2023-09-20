import DoneIcon from "@mui/icons-material/Done";
import CloseIcon from "@mui/icons-material/Close";
import { Tab, Tabs } from "@mui/material";
import Box from "@mui/material/Box";
import {
  DataGrid,
  GridActionsCellItem,
  GridToolbarFilterButton,
} from "@mui/x-data-grid";
import PropTypes from "prop-types";
import { useState } from "react";
import ClientDetails from "./ClientDetails";
import { useNavigate } from "react-router-dom";

const ClientsTable = ({ clients, updateClient }) => {
  const handleStatusUpdate = async (id, row, newStatus) => {
    const approvedRow = { ...row, status: newStatus };
    await updateClient(id, approvedRow);
  };

  const filterCriteria = {
    approvedTab: { status: "APPROVED" },
    pendingTab: { status: "PENDING" },
    rejectedTab: { status: "REJECTED" },
  };

  const [selectedTab, setSelectedTab] = useState("approvedTab");
  const [currentTabRows, setCurrentTabRows] = useState(() => {
    return clients.filter(
      (client) => client.status === filterCriteria[selectedTab].status,
    );
  });

  const handleTabChange = (event, newValue) => {
    setSelectedTab(newValue);
    setCurrentTabRows(
      clients.filter(
        (client) => client.status === filterCriteria[newValue].status,
      ),
    );
  };

  const navigate = useNavigate();
  // Handle row click to show client details
  const handleRowClick = (client) => {
    console.log("Row clicked", client);
    navigate(`/viewClient/${client._id}`);
  };

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
      field: "phoneNumber",
      headerName: "Phone Number",
      flex: 1,
    },
    {
      field: "signupDate",
      headerName: "Sign-Up Date",
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
      <Tabs value={selectedTab} onChange={handleTabChange} centered>
        <Tab label="Approved" value="approvedTab" />
        <Tab label="To be Approved" value="pendingTab" />
        <Tab label="Rejected" value="rejectedTab" />
      </Tabs>
      <div style={{ height: 500, width: "100%" }}>
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
      </div>
    </Box>
  );
};
ClientsTable.propTypes = {
  clients: PropTypes.array.isRequired,
  updateClient: PropTypes.func.isRequired,
};
export default ClientsTable;
