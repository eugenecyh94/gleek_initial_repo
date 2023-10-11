import React from "react";
import Popper from "@mui/material/Popper";
import Button from "@mui/material/Button";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import { styled } from "@mui/system";
import { css } from "@emotion/react";

import ListItem from "@mui/material/ListItem";
import List from "@mui/material/List";
import ListItemText from "@mui/material/ListItemText";

const StyledPopperDiv = styled("div")(
  ({ theme }) => css`
    background-color: #ffffff; /* Set background color to white */
    border-radius: 8px;
    border: 1px solid grey[700];
    box-shadow: ${`0px 4px 8px rgb(0 0 0 / 0.3)`};
    padding: 0.2rem;
  `,
);

const AdminNotificationPopper = ({
  open,
  anchorEl,
  onClose,
  onMarkAsRead,
  onDelete,
}) => {
  return (
    <Popper open={open} anchorEl={anchorEl} placement="bottom-end">
      {() => (
        <ClickAwayListener onClickAway={onClose}>
          <StyledPopperDiv>
            <List>
              <ListItem button onClick={onMarkAsRead}>
                <ListItemText primary="Mark as Read" />
              </ListItem>
              <ListItem button onClick={onDelete}>
                <ListItemText primary="Delete" />
              </ListItem>
            </List>
          </StyledPopperDiv>
        </ClickAwayListener>
      )}
    </Popper>
  );
};

export default AdminNotificationPopper;
