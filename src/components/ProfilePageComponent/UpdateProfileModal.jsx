import { Backdrop, Box, Button, CircularProgress, Dialog, Grid, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { updateUserProfile } from "../../redux/authentication/auth.actions";

export default function UpdateProfileModal({ open, onClose, userDetails }) {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    console.log("User details: ", userDetails);
  }, [userDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    await dispatch(updateUserProfile(userDetails.id, json));
    setLoading(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, p: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="User email"
              name="email"
              defaultValue={userDetails?.email}
              disabled
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="username"
              label="Username"
              name="username"
              defaultValue={userDetails?.username ? userDetails.username : ""}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 3, mb: 2 }}>
          <Button onClick={onClose} variant="contained">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Save
          </Button>
        </Box>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Dialog>
  );
}
