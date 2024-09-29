import React from "react";
import { Dialog, DialogTitle, Box, TextField, Button, Autocomplete } from "@mui/material";

export default function AddFaqDialog({ open, onClose, handleAdd, languages, setChosenLanguage }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New FAQ</DialogTitle>
      <Box component="form" onSubmit={handleAdd}>
        <TextField fullWidth label="Question" name="question" sx={{ marginBottom: "16px" }} />
        <TextField fullWidth label="Answer" name="answer" multiline rows={4} sx={{ marginBottom: "16px" }} />
        <Autocomplete
          id="language"
          options={languages}
          getOptionLabel={(option) => option.name}
          onChange={(event, newValue) => setChosenLanguage(newValue)}
          isOptionEqualToValue={(option, value) => option.id === value.id}
          renderInput={(params) => <TextField {...params} label="Language" placeholder="Language" />}
          sx={{ width: "500px" }}
        />
        <Button type="submit" variant="contained">
          Add FAQ
        </Button>
      </Box>
    </Dialog>
  );
}
