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
import { useImageUploadTestStore } from "../../zustand/GlobalStore";
import AxiosConnect from "../../utils/AxiosConnect";
import MainBodyContainer from "../common/MainBodyContainer";
import ImageEdit from "./ImageEdit";
import ImageUpload from "./ImageUpload";

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
  const [allActivities, setAllActivities] = useState([]);
  //example to update state from zustand store instead of local state
  const { setTestActivities, testActivities } = useImageUploadTestStore();
  // for confirmation dialog
  const [open, setOpen] = useState(false);
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleRefresh = () => {
    AxiosConnect.get("/testActivity/all").then((body) => {
      console.log(body);
      setTestActivities(body.data);
      handleReset();
    });
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
    // formData.append("images", fileList);
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

  const handleReset = () => {
    setFileList([]);
    setActivityName("");
  };

  useEffect(() => {
    console.log(fileList);
  }, [fileList]);

  useEffect(() => {
    console.log(activityName);
  }, [activityName]);

  useEffect(() => {
    handleRefresh();
  }, []);

  return (
    <MainBodyContainer
      hasBackButton={false}
      breadcrumbNames={[]}
      breadcrumbLinks={[]}
      currentBreadcrumbName={"Upload Test"}
    >
      <Button onClick={handleRefresh}>Refresh</Button>
      <Button onClick={handleReset}>Reset</Button>
      <InputLabel htmlFor="outlined-adornment-password">
        Create Activity
      </InputLabel>
      <TextField
        label="Activity Name"
        name="name"
        onChange={(event) => {
          setActivityName(event.target.value);
        }}
        fullWidth
        margin="normal"
        value={activityName}
      />
      <ImageUpload
        limit={5}
        name="test"
        size={2000000}
        fileList={fileList}
        setFileList={setFileList}
      />

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

      <InputLabel htmlFor="outlined-adornment-password">
        Activity List
      </InputLabel>

      <ImageEdit testActivities={testActivities} />

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
    </MainBodyContainer>
  );
};

export default ImageAndFileUpload;
