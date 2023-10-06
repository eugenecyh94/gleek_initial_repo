import React, { useEffect } from "react";
import { Button, IconButton, Tooltip, useTheme } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import useBookmarkStore from "../../zustand/BookmarkStore";
import useSnackbarStore from "../../zustand/SnackbarStore";

const VendorBookmarkButton = ({ vendorId }) => {
  const { getBookmarkForVendor, currentBookmark, toggleVendorBookmark } =
    useBookmarkStore();
  const { openSnackbar } = useSnackbarStore();

  const theme = useTheme();
  const secondary = theme.palette.secondary.main;

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        await getBookmarkForVendor(vendorId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmark();
  }, [vendorId, getBookmarkForVendor]);

  const toggleBookmark = async () => {
    try {
      await toggleVendorBookmark(vendorId, !!currentBookmark?.isBookmarked);

      openSnackbar("Updated bookmarks.", "success");
    } catch (error) {
      openSnackbar("There was a problem updating your bookmarks.", "error");
    }
  };

  return (
    <Tooltip
      title={
        currentBookmark && currentBookmark.isBookmarked
          ? "Remove Vendor Bookmark"
          : "Add Vendor Bookmark"
      }
    >
      <Button
        onClick={toggleBookmark}
        variant={
          currentBookmark && currentBookmark.isBookmarked
            ? "contained" 
            : "outlined" 
        }
        color="secondary"
        startIcon={
          currentBookmark && currentBookmark.isBookmarked ? (
            <BookmarkIcon />
          ) : (
            <BookmarkBorderIcon />
          )
        }
      >
        {currentBookmark && currentBookmark.isBookmarked
          ? "Unbookmark"
          : "Bookmark"}
      </Button>
    </Tooltip>
  );
};

export default VendorBookmarkButton;
