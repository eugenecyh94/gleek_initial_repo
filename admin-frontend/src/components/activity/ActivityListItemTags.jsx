import { styled, Box } from "@mui/material";

const WrapperStyle = styled(Box)(() => ({
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
}));

const ActivityListItemTags = ({ tag }) => {
  return (
    <WrapperStyle>
      <span>${tag.theme}</span>
    </WrapperStyle>
  );
};

export default ActivityListItemTags;
