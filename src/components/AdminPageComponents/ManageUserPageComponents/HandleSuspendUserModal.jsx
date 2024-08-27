import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { getAllUsers, suspendUserAction, unsuspendUserAction } from "../../../redux/user/user.action";
import { Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from "@mui/material";
import { debounce } from "lodash";

export default function HandleSuspendUserModal({ page, open, onClose, user, actionType }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  const handleAction = debounce(async (event) => {
    event.preventDefault();
    console.log("userId: ", user.id);
    setLoading(true);
    if (actionType === "suspend") {
      await dispatch(suspendUserAction(user.id));
    } else {
      await dispatch(unsuspendUserAction(user.id));
    }
    await dispatch(getAllUsers(page, 5, ""));
    setLoading(false);
    onClose();
  }, 500);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Dialog open={open} onClose={onClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
          <DialogTitle id="alert-dialog-title">{actionType === "suspend" ? "Suspend this user?" : "Unsuspend this user?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {actionType === "suspend" ? "Do you want to suspend this user?" : "Do you want to unsuspend this user?"}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={onClose}>No</Button>
            <Button onClick={handleAction} autoFocus>
              Confirm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </>
  );
}
