import styled from "@emotion/styled";
import SearchIcon from "@mui/icons-material/Search";
import {
  Button,
  InputBase,
  alpha,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { Fragment, useEffect, useState } from "react";
import ImageUpload from "./ImageUpload";
import AxiosConnect from "../../utils/AxiosConnect";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.light_purple.main, 0.15),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  marginTop: 16,
  marginBottom: 16,
  width: "100%",
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "20ch",
    },
  },
}));

const WrappedTextCell = (params) => {
  return <div style={{ whiteSpace: "normal" }}>{params.value}</div>;
};

const columns = [
  {
    field: "activityName",
    headerName: "Activity Name",
    flex: 1,
  },
  {
    field: "preSignedImages",
    headerName: "Image List",
    flex: 1,
    renderCell: (params) => <WrappedTextCell {...params} />,
  },
];

const ImageEdit = (props) => {
  const [isLoading, setIsLoading] = useState(true);
  const { testActivities } = props;
  const [activityToEdit, setActivityToEdit] = useState(undefined);
  const [imageListToEdit, setImageListToEdit] = useState([]);
  const [searchedRows, setSearchedRows] = useState([]);
  const [fileList, setFileList] = useState([]);

  const requestSearch = (searchedVal) => {
    const filteredRows = testActivities.data.filter((row) => {
      return row.activityName.toLowerCase().includes(searchedVal.toLowerCase());
    });
    setSearchedRows(filteredRows);
  };

  const handleRowClick = (event) => {
    setActivityToEdit(event);
    setImageListToEdit(event.preSignedImages);
    console.log(imageListToEdit);
  };

  const handleRemoveImage = (id) => {
    setImageListToEdit((oldState) => oldState.filter((item) => item !== id));
  };

  const handleReset = () => {
    setFileList([]);
    setActivityToEdit(undefined);
    setImageListToEdit([]);
  };

  const onClickSubmitUpdate = () => {
    console.log(imageListToEdit);
    console.log(activityToEdit);
    console.log(fileList);

    const formData = new FormData();
    formData.append("activityId", activityToEdit._id);
    imageListToEdit.forEach((item) =>
      formData.append("updatedImageList[]", item),
    );
    for (let i = 0; i < fileList.length; i++) {
      formData.append("images", fileList[i]);
    }
    console.log(formData.get("activityId"));
    console.log(formData.get("updatedImageList"));
    console.log(formData.get("images"));
    AxiosConnect.patchMultiPart("/testActivity/update", formData)
      .then((body) => {
        console.log("activity successfully updated", body);
        handleReset();
      })
      .catch((e) => {
        console.error(e.error);
      });
  };

  useEffect(() => {
    if (testActivities) {
      setIsLoading(false);
    }
    console.log("isloading?", isLoading);
    setSearchedRows(testActivities?.data || []);
  }, [setIsLoading, testActivities]);

  return (
    <Fragment>
      {isLoading ? (
        <CircularProgress sx={{ margin: "auto", marginTop: "32px" }} />
      ) : (
        <Box>
          <div style={{ display: "flex" }}>
            <Search>
              <SearchIconWrapper>
                <SearchIcon />
              </SearchIconWrapper>
              <StyledInputBase
                placeholder="Find an activity…"
                inputProps={{ "aria-label": "search" }}
                onChange={(event) => requestSearch(event.target.value)}
              />
            </Search>
          </div>
          <div style={{ height: 500, width: "99%" }}>
            <DataGrid
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25, page: 0 },
                },
              }}
              getRowId={(row) => row._id}
              rows={searchedRows}
              columns={columns}
              slots={{
                toolbar: GridToolbarFilterButton,
              }}
              getRowHeight={() => "auto"}
              onRowClick={(params) => handleRowClick(params.row)}
            />
          </div>

          <InputLabel htmlFor="outlined-adornment-password">
            Edit Activity (Pictures)
          </InputLabel>
          {imageListToEdit?.map((image, index) => {
            return (
              <Fragment key={index}>
                <img
                  src={image}
                  width="100px"
                  height="100px"
                  alt="placeholder grey 100px"
                />
                <button onClick={() => handleRemoveImage(image)}>X</button>
              </Fragment>
            );
          })}
          {activityToEdit ? (
            <ImageUpload
              limit={5 - imageListToEdit.length}
              name="test"
              size={2000000}
              fileList={fileList}
              setFileList={setFileList}
            />
          ) : (
            <></>
          )}
          {activityToEdit ? (
            <Fragment>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ py: "0.8rem", my: 2 }}
                onClick={() => {
                  onClickSubmitUpdate();
                }}
              >
                Update Activity Images
              </Button>
              <Button
                variant="contained"
                type="submit"
                fullWidth
                sx={{ py: "0.8rem", my: 2 }}
                onClick={() => {
                  handleReset();
                }}
              >
                Cancel Update
              </Button>
            </Fragment>
          ) : (
            <> </>
          )}
        </Box>
      )}
    </Fragment>
  );
};
export default ImageEdit;
