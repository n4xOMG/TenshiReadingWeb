import { CircularProgress } from "@mui/material";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteLanguageAction, getAllLanguages } from "../../../redux/book/book.action";
import LoadingSpinner from "../../LoadingSpinner";
export default function DeleteLanguageModal({ open, onClose, deleteLanguage }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      await dispatch(deleteLanguageAction(deleteLanguage.id));
      await dispatch(getAllLanguages());
    } catch (e) {
      console.log("Error trying delete language: ", e);
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
          <DialogTitle id="alert-dialog-title">{"Delete this language?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete this language?</DialogContentText>
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
