import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { deleteUserAction, getAllUsers } from "../../../redux/user/user.action";

export default function DeleteUserModal({ page, open, onClose, deleteUser }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleDelete = async (event) => {
    event.preventDefault();
    console.log("userId: ", deleteUser.id);
    setLoading(true);
    await dispatch(deleteUserAction(deleteUser.id));
    await dispatch(getAllUsers(page, 5, ""));
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
          <DialogTitle id="alert-dialog-title">{"Delete this user?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">Do you want to delete this user?</DialogContentText>
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
