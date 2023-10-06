import React, { useEffect } from "react";
import { Button, IconButton, Tooltip, useTheme } from "@mui/material";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import useBookmarkStore from "../../zustand/BookmarkStore";
import useSnackbarStore from "../../zustand/SnackbarStore";

const ActivityBookmarkButton = ({ activityId }) => {
  const { getBookmarkForActivity, currentBookmark, toggleActivityBookmark } =
    useBookmarkStore();
  const { openSnackbar } = useSnackbarStore();

  const theme = useTheme();
  const primary = theme.palette.primary.main;
  const primaryDark = theme.palette.primary.dark;

  useEffect(() => {
    const fetchBookmark = async () => {
      try {
        await getBookmarkForActivity(activityId);
      } catch (error) {
        console.error(error);
      }
    };

    fetchBookmark();
  }, [activityId, getBookmarkForActivity]);

  const toggleBookmark = async () => {
    try {
      await toggleActivityBookmark(activityId, !!currentBookmark?.isBookmarked);

      openSnackbar("Updated bookmarks.", "success");
    } catch (error) {
      openSnackbar("There was a problem updating your bookmarks.", "error");
    }
  };

  return (
    <Tooltip
      title={
        currentBookmark && currentBookmark.isBookmarked
          ? "Remove Activity Bookmark"
          : "Add Activity Bookmark"
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

export default ActivityBookmarkButton;
