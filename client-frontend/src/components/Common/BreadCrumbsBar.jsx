import * as React from "react";
import { useTheme } from "@emotion/react";
import { useNavigate, Link } from "react-router-dom";
import { Typography, Box, Breadcrumbs } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import styled from "@emotion/styled";
export default function BreadCrumbsBar({
  hasBackButton,
  breadcrumbNames,
  breadcrumbLinks,
  currentBreadcrumbName,
}) {
  const theme = useTheme();
  const navigate = useNavigate();
  const justifyContentValue = hasBackButton ? "space-between" : "flex-end";

  const StyledLink = styled(Link)`
    text-decoration: none;
    color: ${(props) => props.theme.palette.primary.light};
    transition: color 0.3s ease;

    &:hover {
      color: ${(props) => props.theme.palette.primary.dark};
    }
  `;

  return (
    <Box
      bgcolor={"white"}
      zIndex={1}
      top="64px"
      display="flex"
      flexDirection="row"
      p={1.5}
      justifyContent={justifyContentValue}
    >
      {hasBackButton && (
        <ArrowBackIosNewIcon
          onClick={() => navigate(-1)}
          sx={{ color: theme.palette.primary, cursor: "pointer" }}
        />
      )}

      <Breadcrumbs>
        {breadcrumbNames.map((breadcrumbName, index) => (
          <StyledLink
            color={theme.palette.primary}
            to={breadcrumbLinks[index]}
            key={index}
          >
            {breadcrumbName}
          </StyledLink>
        ))}
        <Typography color={theme.palette.primary.main}>
          {currentBreadcrumbName}
        </Typography>
      </Breadcrumbs>
    </Box>
  );
}
