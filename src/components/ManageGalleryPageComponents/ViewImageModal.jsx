import CloseIcon from "@mui/icons-material/Close";
import { Box, Dialog, IconButton } from "@mui/material";
import React from "react";

export default function ViewImageModal({ open, onClose, image }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <Box className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75">
        <div className="relative bg-black rounded-lg shadow-lg max-h-screen max-w-screen">
          <IconButton
            aria-label="close"
            onClick={onClose}
            className="absolute top-10 right-0 text-white bg-gray-800 hover:bg-gray-600 rounded-full shadow-lg"
            style={{ fontSize: "1.5rem" }}
          >
            <CloseIcon />
          </IconButton>
          <img src={image.imageUrl} alt={image.name} className="h-auto w-auto max-h-screen max-w-screen object-contain rounded-md pb-5" />
        </div>
      </Box>
    </Dialog>
  );
}
