/* eslint-disable react/prop-types */
import styled from "@emotion/styled";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogTitle,
  Stack,
  Typography,
} from "@mui/material";
import { Fragment, useCallback, useRef, useState } from "react";
import { ImageConfig } from "../../utils/ImageConfig";

export const CustomBox = styled(Box)(({ error }) => ({
  "&.MuiBox-root": {
    backgroundColor: "#fff",
    borderRadius: "2rem",
    boxShadow: `${
      error ? "rgba(211, 47, 47, 0.2)" : "rgba(149, 157, 165, 0.2)"
    } 0px 8px 24px`,
    padding: "1rem",
    border: error ? "1px solid rgba(211, 47, 47, 1)" : null,
  },
  "&.MuiBox-root:hover, &.MuiBox-root.dragover": {
    opacity: 0.6,
  },
}));

const ImageAndFileUpload = ({
  limit,
  name,
  size,
  setActivityImages,
  activityImages,
  setImageListToEdit,
  error,
  existingImageList,
}) => {
  const wrapperRef = useRef(null);

  const onDragEnter = () => wrapperRef.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current?.classList.remove("dragover");
  const [open, setOpen] = useState();

  const handleClose = () => {
    setOpen();
  };

  const onFileDrop = useCallback(
    (e) => {
      const target = e.target;
      if (!target.files) return;
      if (target.files[0].size > size) {
        setOpen(`Image size must be smaller than ${size / 1000000} MB`);
        return;
      }
      const newFiles = Object.values(target.files).map((file) => file);
      if (newFiles) {
        const updatedList = [...activityImages, ...newFiles];
        if (updatedList.length + existingImageList?.length > limit) {
          setOpen(`You cannot upload more than ${limit} images!`);
          return;
        }
        setActivityImages(updatedList);
        const newImg = [];
        updatedList.forEach((file) => {
          newImg.push({ src: URL.createObjectURL(file), file: file });
        });
        setImageListToEdit(newImg);
      }
    },
    [activityImages, limit]
  );

  // const calcSize = (size) => {
  //   return size < 1000000
  //     ? `${Math.floor(size / 1000)} KB`
  //     : `${Math.floor(size / 1000000)} MB`;
  // };

  return (
    <Fragment>
      <CustomBox error={error}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          sx={{
            position: "relative",
            width: "100%",
            height: "13rem",
            border: "2px dashed #4267b2",
            borderRadius: "20px",
          }}
          ref={wrapperRef}
          onDragEnter={onDragEnter}
          onDragLeave={onDragLeave}
          onDrop={onDragLeave}
        >
          <Stack justifyContent="center" sx={{ p: 1, textAlign: "center" }}>
            <Typography sx={{ color: "#ccc" }}>
              {limit > 1 ? "Browse files to upload" : "Browse file to upload"}
            </Typography>
            <div>
              <img
                src={ImageConfig["upload"]}
                alt="file upload"
                style={{ width: "5rem" }}
              />
            </div>
            <Typography variant="body1" component="span">
              <strong>Supported Files</strong>
            </Typography>
            <Typography variant="body2" component="span">
              JPG, JPEG, PNG, SVG
            </Typography>
            <Typography>
              You can upload to a maximum of {limit} images
            </Typography>
          </Stack>
          <input
            type="file"
            name={name}
            onChange={onFileDrop}
            accept="image/jpg, image/png, image/jpeg, image/svg"
            style={{
              opacity: 0,
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
              cursor: "pointer",
            }}
          />
        </Box>
      </CustomBox>
      <Dialog
        open={open}
        onClose={handleClose}
        sx={{
          "& .MuiDialog-paper": {
            border: "3px solid #D32F2F",
            borderRadius: "10px",
            boxShadow: "none",
          },
        }}
      >
        <DialogTitle>{open}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ImageAndFileUpload;
