import React, { useEffect } from "react";
import { IconButton, useTheme } from "@mui/material";
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
    <IconButton
      onClick={toggleBookmark}
      style={{ color: primary, borderColor: primaryDark }}
    >
      {currentBookmark && currentBookmark.isBookmarked ? (
        <BookmarkIcon />
      ) : (
        <BookmarkBorderIcon />
      )}
    </IconButton>
  );
};

export default ActivityBookmarkButton;
