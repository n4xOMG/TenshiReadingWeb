import { Button, Dialog, DialogContent, IconButton } from "@mui/material";
import React from "react";
import { FavoriteBorder } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useSwipeable } from "react-swipeable";
import { isFavouredByReqUser } from "../../../utils/isFavouredByReqUser";

export default function ViewImageModal({ open, user, onClose, image, onNext, onPrev }) {
  const handlers = useSwipeable({
    onSwipedLeft: () => onNext(),
    onSwipedRight: () => onPrev(),
    preventDefaultTouchmoveEvent: true,
    trackMouse: true,
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{
        style: {
          maxWidth: "none",
          width: "auto",
          height: "auto",
          margin: 0,
        },
      }}
    >
      <DialogContent
        {...handlers}
        sx={{
          padding: 0,
          background: "grey",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          position: "relative",
        }}
      >
        {/* Previous Button */}
        <Button
          onClick={onPrev}
          sx={{
            position: "absolute",
            left: 0,
            top: 0,
            bottom: 0,
            width: "20%",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 0,
            padding: 8,
            opacity: 0,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              opacity: 1,
            },
          }}
        >
          <ArrowBackIcon />
        </Button>

        {/* Image */}
        <img
          src={image.imageUrl}
          srcSet={image.imageUrl}
          alt="Selected"
          style={{
            objectFit: "contain",
            maxHeight: "90vh",
            maxWidth: "90vw",
            height: "auto",
            width: "auto",
          }}
        />
        {/* Next Button */}
        <Button
          onClick={onNext}
          sx={{
            position: "absolute",
            right: 0,
            top: 0,
            bottom: 0,
            width: "5%",
            color: "white",
            backgroundColor: "rgba(0, 0, 0, 0.1)",
            borderRadius: 0,
            padding: 8,
            opacity: 0,
            "&:hover": {
              backgroundColor: "rgba(0, 0, 0, 0.3)",
              opacity: 1,
            },
          }}
        >
          <ArrowForwardIcon />
        </Button>
      </DialogContent>
    </Dialog>
  );
}
