import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getCurrentUserByJwt } from "../redux/authentication/auth.actions";

export const useAuthCheck = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const checkAuth =
    (fn) =>
    async (...args) => {
      const jwt = localStorage.getItem("jwt");
      const result = await dispatch(getCurrentUserByJwt(jwt));
      const user = result?.payload;

      if (!user) {
        setOpen(true);
        return;
      }

      try {
        await fn(...args);
      } catch (error) {
        console.error("Error:", error);
      }
    };

  const handleClose = () => {
    setOpen(false);
  };

  const AuthDialog = () => (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>You haven't logged in</DialogTitle>
      <DialogContent>Please log in to continue.</DialogContent>
      <DialogActions>
        <Button onClick={handleClose} color="primary">
          Close
        </Button>
        <Button onClick={() => navigate("/sign-in")} color="primary">
          Log In
        </Button>
      </DialogActions>
    </Dialog>
  );

  return { checkAuth, AuthDialog };
};
