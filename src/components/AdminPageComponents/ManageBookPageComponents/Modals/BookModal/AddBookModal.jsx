import { Backdrop, Box, Button, CircularProgress, Dialog, Grid, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { addNewBookAction } from "../../../../../redux/book/book.action";
import UploadToCloudinary from "../../../../../utils/uploadToCloudinary";

export default function AddBookModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    json.bookCover = selectedImage;
    await dispatch(addNewBookAction({ data: json }));
    onClose();
  };

  const handleImageUpload = async (event) => {
    setLoading(true);
    try {
      const imageUrl = await UploadToCloudinary(event.target.files[0]);
      setSelectedImage(imageUrl);
    } catch (e) {
      console.log("Error loading image", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1, p: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField margin="normal" required fullWidth id="title" label="Book title" name="title" />
            <TextField margin="normal" required fullWidth id="authorName" label="Author's name" name="authorName" />
            <TextField margin="normal" required fullWidth id="artistName" label="Artist's name" name="artistName" />
            <TextField margin="normal" required fullWidth id="description" label="Book description" name="description" />
          </Grid>
          <Grid item xs={12} md={6} sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Button
              component="label"
              variant="outlined"
              sx={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                bgcolor: "white",
                border: "1px solid gray",
              }}
            >
              {selectedImage ? (
                <img className="object-cover rounded-md max-w-full max-h-full" src={selectedImage} alt="preview" />
              ) : (
                <span>Upload Book Cover</span>
              )}
              <input type="file" hidden onChange={handleImageUpload} />
            </Button>
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
  );
}
