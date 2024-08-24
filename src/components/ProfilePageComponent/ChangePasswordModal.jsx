import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, TextField, Typography } from "@mui/material";
import React from "react";

export default function ChangePasswordModal({ open, onClose }) {
  return (
    <div>
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 2 }}>
            Enter your current password and a new password to change it.
          </Typography>
          <Box sx={{ display: "grid", gap: 2, py: 2 }}>
            <TextField id="current" label="Current" type="password" fullWidth />
            <TextField id="new" label="New" type="password" fullWidth />
            <TextField id="confirm" label="Confirm" type="password" fullWidth />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit">Save changes</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
