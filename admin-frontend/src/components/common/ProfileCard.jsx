//react component of a profile card, that will take in props like field name and field value and card title
import React from "react";
import { Typography, Box } from "@mui/material";
import { useTheme } from "@emotion/react";

const ProfileCard = ({ title, fieldNames, fieldValues }) => {
  const theme = useTheme();
  return (
    <Box
      display="flex"
      flexDirection="column"
      minWidth="225px"
      alignItems="left"
      boxShadow={1}
      border={`1px solid ${theme.palette.primary.main}`}
      borderRadius={5}
      p={2}
      m={2}
      flex={1}
    >
      <Typography
        fontSize={20}
        fontWeight={700}
        color={theme.palette.primary.main}
      >
        {title}
      </Typography>
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
