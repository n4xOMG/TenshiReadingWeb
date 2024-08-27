import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editUserAction, getAllUsers } from "../../../redux/user/user.action";
import { Backdrop, Box, Button, CircularProgress, Dialog, Grid, TextField } from "@mui/material";

export default function EditUserModal({ page, open, onClose, userDetails }) {
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
    await dispatch(editUserAction(userDetails.id, json));
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
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, p: 4 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6}>
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
                  id="role"
                  label="User's role"
                  name="role"
                  defaultValue={userDetails.role?.name}
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
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Save
            </Button>
          </Box>
          <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color="inherit" />
          </Backdrop>
        </Dialog>
      )}
    </>
  );
}
