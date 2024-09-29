import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteCategoryAction, getAllCategories } from "../../../redux/book/book.action";
import LoadingSpinner from "../../LoadingSpinner";
export default function DeleteCategoryModal({ open, onClose, deleteCategory }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async (event) => {
    event.preventDefault();
    console.log("categoryId: ", deleteCategory.id);
    setLoading(true);
    try {
      await dispatch(deleteCategoryAction(deleteCategory.id));
      await dispatch(getAllCategories());
    } catch (e) {
      console.log("Error trying delete category: ", e);
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
          <DialogTitle id="alert-dialog-title">{"Delete this category?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete this category?</DialogContentText>
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
