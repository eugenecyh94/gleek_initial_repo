import { Card, Link, styled, Typography, Box } from "@mui/material";
import { Link as RouteLink } from "react-router-dom";
import ActivityListItemTags from "./ActivityListItemTags";
import ActivityListItemPrice from "./ActivityListItemPrice";

// card style
// eslint-disable-next-line no-undef
const CardStyle = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),

  boxShadow: `rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 4px 8px -4px`,

  "&:hover": {
    boxShadow: `rgb(145 158 171 / 24%) 0px 0px 2px 0px, rgb(145 158 171 / 24%) 0px 16px 32px -4px`,
  },
}));

function ActivityPriceDisplay(props) {
  return null;
}

ActivityPriceDisplay.propTypes = {};
const ActivityListItem = (props) => {
  const { title, description, tag, price, image } = props.activity;

  return (
    <CardStyle>
      {/* Image with Label */}
      <Box sx={{ pt: "100%", position: "relative" }}>
        <Box
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            position: "absolute",
            top: 0,
          }}
          component="img"
          src={image}
          alt={title}
        />
      </Box>

      {/* bottom of the card */}
      <Box sx={{ py: 2.5, px: 3 }}>
        <Link component={RouteLink} to="/" underline="hover" color="inherit">
          <Typography variant="subtitle1" noWrap>
            {title}
          </Typography>
        </Link>

        {/* Price & Color box */}
        <Box
          sx={{
            mt: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          {/*<ActivityListItemTags tag={tag} limit={3} />*/}
          <ActivityListItemPrice price={price} priceSale={price} />
        </Box>
      </Box>
    </CardStyle>
  );
};

export default ActivityListItem;
