import React, { useState, useEffect } from "react";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Box,
  Typography,
  List,
  ListItemText,
  Checkbox,
  Collapse,
  ListItemButton,
  CircularProgress,
} from "@mui/material";
import { useTheme } from "@mui/material/styles";
import useShopStore from "../../zustand/ShopStore";

const NestedCheckboxList = (props) => {
  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const accent = theme.palette.accent.main;

  const [openIndex, setOpenIndex] = useState(null);
  const {
    filter,
    setFilter,
    parentChecked,
    setParentChecked,
    childChecked,
    setChildChecked,
  } = useShopStore();
  const parentThemes = props.themes;

  // Loading state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if props.themes is available
    if (parentThemes && parentThemes.length > 0) {
      setParentChecked(Array(parentThemes.length).fill(false));
      setChildChecked(
        parentThemes.map((parentTheme) =>
          Array(parentTheme.children.length).fill(false),
        ),
      );
      setIsLoading(false);
    }
  }, [parentThemes]);

  useEffect(() => {
    // Create an array to collect IDs with 'true' values
    const checkedIds = [];

    // Iterate through the childChecked array and collect IDs
    for (
      let parentIndex = 0;
      parentIndex < childChecked.length;
      parentIndex++
    ) {
      for (
        let childIndex = 0;
        childIndex < childChecked[parentIndex].length;
        childIndex++
      ) {
        if (childChecked[parentIndex][childIndex]) {
          // Get the corresponding theme and child from props.themes
          const theme = props.themes[parentIndex];
          const child = theme.children[childIndex];

          // Collect the child's ID
          checkedIds.push(child._id);
        }
      }
    }

    // Update the filter state with the collected IDs
    setFilter({ ...filter, themes: checkedIds });
  }, [childChecked]);

  const handleParentCheckboxClick = async (index) => {
    if (!isLoading) {
      const newParentChecked = [...parentChecked];
      newParentChecked[index] = !newParentChecked[index];
      setParentChecked(newParentChecked);

      const newChildChecked = [...childChecked];
      newChildChecked[index] = newChildChecked[index].map(
        () => newParentChecked[index],
      );

      setChildChecked(newChildChecked);
    }
  };

  // Function to handle individual child checkbox click
  const handleChildCheckboxClick = (parentIndex, childIndex) => {
    // Ensure data is loaded before handling checkbox clicks
    if (!isLoading) {
      const newChildChecked = [...childChecked];
      newChildChecked[parentIndex][childIndex] =
        !newChildChecked[parentIndex][childIndex];
      setChildChecked(newChildChecked);

      // Update parent checkbox based on child checkboxes
      const newParentChecked = [...parentChecked];
      newParentChecked[parentIndex] = newChildChecked[parentIndex].every(
        (isChecked) => isChecked,
      );
      setParentChecked(newParentChecked);
    }
  };

  // Function to toggle the open/closed state of the parent item
  const handleToggleParent = (index) => {
    setOpenIndex(index === openIndex ? null : index); // Toggle open/closed state
  };

  return (
    <Box boxShadow={2} borderRadius={2} mt={3}>
      <Box
        bgcolor={primary}
        sx={{
          borderTopLeftRadius: "8px",
          borderTopRightRadius: "8px",
        }}
      >
        <Typography p={1} fontWeight={700} variant="h6" color={accent}>
          {props.title}
        </Typography>
      </Box>
      {isLoading && (
        <Box display="flex" mt={2} mb={2}>
          <CircularProgress sx={{ margin: "auto" }} />
        </Box>
      )}
      {!isLoading && (
        <List>
          {props.themes.map((item, index) => (
            <div key={index}>
              {/* Parent Checkbox */}
              <ListItemButton onClick={() => handleToggleParent(index)}>
                {openIndex === index ? <ExpandLess /> : <ExpandMore />}
                <Box
                  onClick={(e) => {
                    e.stopPropagation(); // Prevent event propagation
                    handleParentCheckboxClick(index);
                  }}
                >
                  <Checkbox checked={parentChecked[index]} color="primary" />
                </Box>
                <ListItemText primary={item.parent.name} />
              </ListItemButton>

              {/* Nested Child Checkboxes (Collapse Component) */}
              <Collapse in={openIndex === index} timeout="auto" unmountOnExit>
                <List component="div" disablePadding>
                  {item.children.map((child, childIndex) => (
                    <ListItemButton
                      key={`${index}-${childIndex}`} // Generate a unique key
                      style={{ paddingLeft: "30px" }}
                    >
                      <Box>
                        <Checkbox
                          checked={childChecked[index]?.[childIndex] || false}
                          onChange={(e) => {
                            e.stopPropagation(); // Prevent event propagation
                            handleChildCheckboxClick(index, childIndex);
                          }}
                          color="primary"
                        />
                      </Box>
                      <ListItemText primary={child.name} />
                    </ListItemButton>
                  ))}
                </List>
              </Collapse>
            </div>
          ))}
        </List>
      )}
    </Box>
  );
};

export default NestedCheckboxList;
