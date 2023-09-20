//react component of a profile card, that will take in props like field name and field value and card title
import React from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@emotion/react";

<<<<<<< HEAD
const ProfileCard = ({ title, icon, fieldNames, fieldValues }) => {
=======
const ProfileCard = ({ title, fieldNames, fieldValues }) => {
>>>>>>> develop
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth="225px"
      alignItems="left"
      boxShadow={1}
<<<<<<< HEAD
      border={`1px solid ${theme.palette.light_purple.main}`}
=======
      border={`1px solid ${theme.palette.primary.main}`}
>>>>>>> develop
      borderRadius={5}
      p={2}
      m={2}
      flex={1}
    >
<<<<<<< HEAD
      <Box display="flex" flexDirection="row" alignItems="center">
        {icon}
        <Typography
          fontSize={20}
          fontWeight={700}
          color={theme.palette.primary.main}
          ml={1}
        >
          {title}
        </Typography>
      </Box>
=======
      <Typography
        fontSize={20}
        fontWeight={700}
        color={theme.palette.primary.main}
      >
        {title}
      </Typography>
>>>>>>> develop
      {fieldNames.map((fieldName, index) => (
        <Typography
          key={index}
          fontSize={15}
          color={theme.palette.dark_purple.main}
        >
          <strong>{fieldName}</strong>: {fieldValues[index]}
        </Typography>
      ))}
    </Box>
  );
};

export default ProfileCard;
