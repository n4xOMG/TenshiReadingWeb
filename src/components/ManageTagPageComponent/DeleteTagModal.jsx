import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { deleteTagAction, getAllImageTags } from "../../redux/gallery/gallery.action";
export default function DeleteTagModal({ open, onClose, deleteTag }) {
  const [tagId, setTagId] = useState(deleteTag.id);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log("Id: ", deleteTag.id);
    setTagId(deleteTag.id);
  }, [deleteTag]);
  const handleDelete = async (event) => {
    event.preventDefault();
    console.log("tagId: ", tagId);
    setLoading(true);
    try {
      await dispatch(deleteTagAction(tagId));
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
        <div className="flex justify-center">
          <CircularProgress />
        </div>
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
