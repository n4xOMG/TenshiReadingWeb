import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteImageAction, getAllGalleryImages } from "../../redux/gallery/gallery.action";
export default function DeleteImageModal({ open, onClose, deleteImage }) {
  const [imageId, setImageId] = useState(deleteImage.id);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Id: ", deleteImage.id);
    setImageId(deleteImage.id);
  }, [deleteImage]);
  const handleDelete = async (event) => {
    event.preventDefault();
    console.log("imageId: ", imageId);
    setLoading(true);
    await dispatch(deleteImageAction(imageId));
    await dispatch(getAllGalleryImages(0, 4));
    setLoading(false);
    onClose();
  };
  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Delete this image?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete this image?</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>No</Button>
            <Button onClick={handleDelete} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
