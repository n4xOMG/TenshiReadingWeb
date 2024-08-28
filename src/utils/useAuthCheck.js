import { Button, Dialog, DialogActions, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const useAuthCheck = () => {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const checkAuth =
    (fn) =>
    async (...args) => {
      const token = localStorage.getItem("jwt");
      if (!token) {
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
      <DialogTitle>You havent logged in</DialogTitle>
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
