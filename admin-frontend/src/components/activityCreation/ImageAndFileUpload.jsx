import {
  Box,
  Button,
  IconButton,
  InputLabel,
  Stack,
  TextField,
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { Fragment, useCallback, useEffect, useRef, useState } from "react";
import DeleteIcon from "@mui/icons-material/Delete";
import { ImageConfig } from "../../utils/ImageConfig";
import {
  updateAllActivity,
  useImageUploadTestStore,
} from "../../zustand/GlobalStore";
import AxiosConnect from "../../utils/AxiosConnect";

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

const ImageAndFileUpload = (ImageUploadProps) => {
  //can always pass down methods from parent to uplift fileList changes to parent.
  const { limit, name, size } = ImageUploadProps;
  //local state
  const [fileList, setFileList] = useState([]);
  const [activityName, setActivityName] = useState("");
  //example to update state from zustand store instead of local state
  const { setImageList } = useImageUploadTestStore();
  // for confirmation dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
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
        setImageList(fileList);
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

  const onClickSubmit = () => {
    handleClickOpen();
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append("activityName", activityName);
    for (let i = 0; i < fileList.length; i++) {
      formData.append("images", fileList[i]);
    }
    // formData.append("images", fileList);s
    console.log(formData.get("activityName"));
    console.log(formData.get("images"));
    AxiosConnect.postMultiPart("/testActivity/create", formData)
      .then((body) => {
        console.log("activity successfully created", body);
      })
      .catch((e) => {
        console.error(e.error);
      });
    handleClose();
  };

  useEffect(() => {
    console.log(fileList);
  }, [fileList]);

  useEffect(() => {
    console.log(activityName);
  }, [activityName]);

  return (
    <Fragment>
      <CustomBox>
        <InputLabel htmlFor="outlined-adornment-password">
          Enter Activity Name
        </InputLabel>
        <TextField
          label="Activity Name"
          name="name"
          onChange={(event) => {
            setActivityName(event.target.value);
          }}
          fullWidth
          margin="normal"
        />
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
      <Button
        variant="contained"
        type="submit"
        fullWidth
        sx={{ py: "0.8rem", my: 2 }}
        onClick={() => {
          onClickSubmit();
        }}
      >
        Create Activity
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Confirm activity creation"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Activity called {activityName} will be created.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Fragment>
  );
};

export default ImageAndFileUpload;
