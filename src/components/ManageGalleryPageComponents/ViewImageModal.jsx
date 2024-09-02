import { Dialog, DialogContent } from "@mui/material";
import React from "react";

export default function ViewImageModal({ open, onClose, image }) {
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
        className="flex items-center justify-center p-0 bg-gray-700"
        style={{
          padding: 0,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <img
          src={image.imageUrl}
          alt="Seleted Image"
          className="object-contain"
          style={{
            maxHeight: "90vh",
            maxWidth: "90vw",
            height: "auto",
            width: "auto",
          }}
        />
      </DialogContent>
    </Dialog>
  );
}
