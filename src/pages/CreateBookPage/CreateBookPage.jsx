import { Backdrop, Box, Button, CircularProgress, TextField } from "@mui/material";
import React, { useState } from "react";
import { addNewBookAction } from "../../redux/book/book.action";
import { useDispatch } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
import { useNavigate } from "react-router-dom";

export default function CreateBookPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [selectedImage, setSelectedImage] = useState(null);
  const [open, setOpen] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setOpen(true); // Show backdrop
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    json.bookCover = selectedImage;
    await dispatch(addNewBookAction({ data: json }));
    setOpen(false); // Hide backdrop
    navigate("/");
  };

  const handleImageUpload = async (event) => {
    try {
      setOpen(true);
      const imageUrl = await UploadToCloudinary(event.target.files[0]);
      setSelectedImage(imageUrl);
    } catch (e) {
      console.log("Error loading image", e);
    } finally {
      setOpen(false);
    }
  };

  return (
    <div>
      <Box className="flex flex-col items-center" component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
        <TextField margin="normal" required fullWidth id="title" label="Book title" name="title" />
        <TextField margin="normal" required fullWidth id="authorName" label="Author's name" name="authorName" />
        <TextField margin="normal" required fullWidth id="artistName" label="Aritst's name" name="artistName" />
        <TextField margin="normal" required fullWidth id="description" label="Book description" name="description" />
        <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
          Upload Book Cover
          <input type="file" hidden onChange={handleImageUpload} />
        </Button>
        {selectedImage && <img className="py-5 object-cover rounded-md max-w-96 max-h-96" src={selectedImage} alt="preview" />}
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Create
        </Button>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={open}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
