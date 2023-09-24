import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

export default function BreadCrumbsBar({
  hasBackButton,
  breadcrumbNames,
  breadcrumbLinks,
  currentBreadcrumbName,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const justifyContentValue = hasBackButton ? "space-between" : "flex-end";

  return (
    <Box
      boxShadow={4}
      position="sticky"
      bgcolor={"white"}
      zIndex={2}
      top="64px"
      display="flex"
      flexDirection="row"
      p={1.4}
      justifyContent={justifyContentValue}
    >
      {hasBackButton && (
        <ArrowBackIosNewIcon
          onClick={() => navigate(-1)}
          sx={{ color: theme.palette.dark_purple.main, cursor: "pointer" }}
        />
      )}

      <Breadcrumbs aria-label="breadcrumb">
        {breadcrumbNames.map((breadcrumbName, index) => (
          <Link
            underline="hover"
            color={theme.palette.light_purple.main}
            to={breadcrumbLinks[index]}
            key={index}
          >
            {breadcrumbName}
          </Link>
        ))}
        <Typography color={theme.palette.primary.main}>
          {currentBreadcrumbName}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
}
