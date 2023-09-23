import React from "react";
import {
  Box,
  Modal,
  Typography,
  Button,
  FormControlLabel,
  Checkbox,
} from "@mui/material";

function TermsAndConditionsModal({ open, handleClose }) {
  const mockedData = {
    marketingUpdates: true,
  };

  const [formData, setFormData] = React.useState(mockedData);

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: checked,
    }));
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "80%",
          bgcolor: "background.paper",
          boxShadow: 24,
          borderRadius: "25px",
          p: 4,
        }}
      >
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Terms & Conditions
        </Typography>
        <Typography
          id="modal-modal-description"
          overflow="auto"
          maxHeight="30em"
          sx={{ mt: 2 }}
        >
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Maecenas
          molestie enim risus, sed tincidunt felis dignissim et. Donec euismod
          dignissim tortor nec malesuada. Morbi arcu elit, hendrerit sed eros
          at, porta congue elit. Ut fermentum lacinia cursus. Praesent at tortor
          molestie nisl cursus faucibus non a ligula. Pellentesque augue massa,
          ultricies sed diam consectetur, feugiat tincidunt massa. Aenean
          finibus magna id odio facilisis, ac volutpat erat finibus. Interdum et
          malesuada fames ac ante ipsum primis in faucibus. Pellentesque in
          imperdiet purus. Maecenas bibendum elit at varius imperdiet. Vivamus
          iaculis nunc justo, vitae elementum urna aliquet vitae. Quisque quis
          urna vitae sapien blandit volutpat nec ac nisl. Proin vel ex
          condimentum, semper augue posuere, efficitur orci. Proin efficitur
          diam nibh, a molestie metus tincidunt et. Aliquam porttitor id diam in
          mattis. Morbi ornare nunc quis aliquet dignissim. Suspendisse euismod
          sodales lacinia. Praesent vitae rhoncus ipsum, ac vulputate dolor.
          Donec ullamcorper elementum commodo. Quisque fringilla ultricies lorem
          sed commodo. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
          Quisque elit nibh, fermentum pretium tempus id, porttitor quis tortor.
          Nulla ut vehicula libero. Cras erat leo, suscipit a ex eget,
          vestibulum lacinia enim. Curabitur molestie turpis ac erat faucibus
          euismod. Proin venenatis auctor fermentum. Donec porttitor risus
          mauris, sed elementum ante placerat sagittis. Sed ac sem quis quam
          ullamcorper dignissim. Proin nunc ante, tempus sit amet imperdiet
          molestie, vulputate at purus. Cras placerat accumsan rutrum.
          Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
          posuere cubilia curae; Ut nunc est, elementum id mauris ac, mattis
          mollis ante. Donec malesuada convallis imperdiet. Vestibulum ante
          ipsum primis in faucibus orci luctus et ultrices posuere cubilia
          curae; Aliquam vitae dictum nisi. Vestibulum ante ipsum primis in
          faucibus orci luctus et ultrices posuere cubilia curae; Praesent et
          sem gravida, fringilla nunc id, malesuada augue. Orci varius natoque
          penatibus et magnis dis parturient montes, nascetur ridiculus mus.
          Donec sit amet velit ut erat fringilla blandit. Maecenas pharetra
          mauris et sollicitudin scelerisque. Morbi vel efficitur dolor. Duis
          orci erat, tempor nec justo nec, interdum aliquet nulla. Pellentesque
          feugiat pellentesque orci nec aliquet. Fusce non velit nec odio semper
          venenatis. Quisque ipsum enim, scelerisque a maximus non, cursus vitae
          arcu. Etiam nunc lectus, facilisis vitae consectetur efficitur,
          convallis id nulla. Vivamus sit amet placerat justo. Praesent urna
          turpis, rhoncus eu sem at, euismod tempus ex. Nulla iaculis ipsum eget
          elit pharetra pulvinar. Mauris cursus aliquet ex eget ullamcorper.
          Vivamus quis luctus mi, at venenatis arcu. Ut sed malesuada metus.
        </Typography>
        <Button width="5rem" onClick={handleClose}>
          Close
        </Button>
      </Box>
    </Modal>
  );
}

export default TermsAndConditionsModal;
