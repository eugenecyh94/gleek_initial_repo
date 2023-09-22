import React, { useEffect, useState } from "react";
import { Box, TextField, Button, Typography, Grid, Alert } from "@mui/material";
import AccountSidebarVendor from "./AccountSidebarVendor";
import useClientStore from "../../zustand/ClientStore";
import useSnackbarStore from "../../zustand/SnackbarStore";
import { validator } from "../../utils/ClientFieldsValidator";

function AccountDetailsVendor(props) {
  const { client, updateAccount, clientError } = useClientStore();
  const { openSnackbar, closeSnackbar } = useSnackbarStore();
  const [formData, setFormData] = useState(client);
  const [errorData, setErrorData] = useState({
    password: "",
    email: "",
    name: "",
    jobTitle: "",
    team: "",
    companyName: "",
    officeAddress: "",
    billingAddress: "",
    billingPartyName: "",
    billingEmail: "",
    officePostalCode: "",
    billingOfficePostalCode: "",
    phoneNumber: "",
    passwordVerify: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    const errors = validator(formData, name);

    setErrorData((prevData) => ({
      ...prevData,
      [name]: errors[name] || "",
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const responseStatus = await updateAccount(formData);

      responseStatus &&
        openSnackbar("Profile updated successfully!", "success");
    } catch (error) {
      const errorMessage =
        error?.response?.data?.errors?.[0]?.msg ||
        error?.response?.data ||
        null;
      openSnackbar(errorMessage, "error");
    }
  };

  useEffect(() => {
    console.log(client);
  }, []);

  return (
    <Box
      display="flex"
      flexDirection="row"
      justifyContent="space-evenly"
      alignItems="top"
      p={8}
      width={"100%"}
    >
      <Box width={"30%"}>
        <AccountSidebarVendor />
      </Box>

      <Typography>Details</Typography>
    </Box>
  );
}

export default AccountDetailsVendor;
