import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTagAction, getAllImageTags } from "../../../redux/gallery/gallery.action";
import LoadingSpinner from "../../LoadingSpinner";
export default function DeleteTagModal({ open, onClose, deleteTag }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const handleDelete = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await dispatch(deleteTagAction(deleteTag.id));
      await dispatch(getAllImageTags());
    } catch (e) {
      console.log("Error trying delete tag: ", e);
    } finally {
      setLoading(false);
      onClose();
    }
  };
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{"Delete this tag?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete this tag?</DialogContentText>
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
