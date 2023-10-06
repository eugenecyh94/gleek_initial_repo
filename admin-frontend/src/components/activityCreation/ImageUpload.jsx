import { Box, IconButton, Stack, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageConfig } from "../../utils/ImageConfig";

//custom styles for boxed components
export const CustomBox = styled(Box)({
  "&.MuiBox-root": {
    backgroundColor: "#fff",
    borderRadius: "2rem",
    boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
    padding: "1rem",
  },
  "&.MuiBox-root:hover, &.MuiBox-root.dragover": {
    opacity: 0.6,
  },
});

const ImageUpload = (ImageUploadProps) => {
  //can always pass down methods from parent to uplift fileList changes to parent.
  const { limit, name, size, fileList, setFileList } = ImageUploadProps;

  const wrapperRef = useRef(null);

  //Toggle the dragover class
  const onDragEnter = () => wrapperRef.current?.classList.add("dragover");
  const onDragLeave = () => wrapperRef.current?.classList.remove("dragover");

  const onFileDrop = useCallback(
    (e) => {
      const target = e.target;
      if (!target.files) return;
      console.log(target.files);
      if (target.files[0].size > size) {
        return alert(`Image size must be smaller than ${size / 1000000} MB`);
      }
      const newFiles = Object.values(target.files).map((file) => file);
      if (newFiles) {
        const updatedList = [...fileList, ...newFiles];
        if (updatedList.length > limit) {
          return alert(`Image must not be more than ${limit}`);
        }
        setFileList(updatedList);
      }
    },
    [fileList, limit],
  );

  const fileRemove = (file) => {
    const updatedList = [...fileList];
    updatedList.splice(fileList.indexOf(file), 1);
    setFileList(updatedList);
  };

  const calcSize = (size) => {
    return size < 1000000
      ? `${Math.floor(size / 1000)} KB`
      : `${Math.floor(size / 1000000)} MB`;
  };

  return (
    <Fragment>
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
          <Typography>You can upload to a maximum of {limit} images</Typography>
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
      {fileList.length > 0 ? (
        <Stack spacing={2} sx={{ my: 2 }}>
          {fileList.map((item, index) => {
            console.log("item type is::", item.type);
            const imageType = item.type.split("/")[1];
            console.log("image type is::", imageType);
            return (
              <Box
                key={index}
                sx={{
                  position: "relative",
                  backgroundColor: "#f5f8ff",
                  borderRadius: 1.5,
                  p: 0.5,
                }}
              >
                <Box display="flex">
                  <img
                    src={ImageConfig[`${imageType}`]}
                    alt="upload"
                    style={{
                      height: "3.5rem",
                      objectFit: "contain",
                    }}
                  />
                  <Box sx={{ ml: 1 }}>
                    <Typography>{item.name}</Typography>
                    <Typography variant="body2">
                      {calcSize(item.size)}
                    </Typography>
                  </Box>
                </Box>
                <IconButton
                  onClick={() => fileRemove(item)}
                  sx={{
                    color: "#df2c0e",
                    position: "absolute",
                    right: "1rem",
                    top: "50%",
                    transform: "translateY(-50%)",
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Box>
            );
          })}
        </Stack>
      ) : null}
    </Fragment>
  );
};

export default ImageUpload;
