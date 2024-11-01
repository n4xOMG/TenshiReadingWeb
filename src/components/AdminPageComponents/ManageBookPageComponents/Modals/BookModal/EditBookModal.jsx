import { Autocomplete, Backdrop, Box, Button, CircularProgress, Dialog, Grid, TextField, Typography } from "@mui/material";
import { DateTimePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { editBookAction, getAllBookAction, getAllCategories, getAllLanguages } from "../../../../../redux/book/book.action";
import UploadToCloudinary from "../../../../../utils/uploadToCloudinary";
export default function EditBookModal({ open, onClose, bookDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { languages, categories } = useSelector((store) => store.book);
  const [chosenLanguages, setChosenLanguages] = useState(bookDetails.languages || []);
  const [chosenCategories, setChosenCategories] = useState(bookDetails.categories || []);
  const [publishDate, setPublishDate] = useState(dayjs(bookDetails?.publishDate || new Date()));

  const fetchLanguagesAndCategories = async () => {
    setLoading(true);
    try {
      await dispatch(getAllLanguages());
      await dispatch(getAllCategories());
    } catch (e) {
      console.error("Error fetching tags: ", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguagesAndCategories();
  }, [dispatch]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    json.bookCover = selectedImage;
    json.id = bookDetails.id;
    json.publishDate = publishDate.toISOString();
    json.languages = chosenLanguages;
    json.categories = chosenCategories;
    try {
      console.log("Edit data: ", { data: json });
      await dispatch(editBookAction({ data: json }));
      await dispatch(getAllBookAction());
      onClose();
    } catch (error) {
      console.error("Error editing book:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (event) => {
    setLoading(true);
    try {
      const imageUrl = await UploadToCloudinary(event.target.files[0], "book_covers");
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
            <TextField margin="normal" required fullWidth id="title" label="Book title" name="title" defaultValue={bookDetails?.title} />
            <TextField
              margin="normal"
              required
              fullWidth
              id="authorName"
              label="Author's name"
              name="authorName"
              defaultValue={bookDetails?.authorName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="artistName"
              label="Artist's name"
              name="artistName"
              defaultValue={bookDetails?.artistName}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              id="description"
              label="Book description"
              name="description"
              defaultValue={bookDetails?.description}
            />
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Publish Date"
                value={publishDate}
                onChange={(newValue) => setPublishDate(newValue)}
                renderInput={(params) => <TextField {...params} fullWidth margin="normal" required />}
              />
            </LocalizationProvider>
            <Autocomplete
              multiple
              limitTags={2}
              id="languages"
              options={languages}
              getOptionLabel={(option) => option.name}
              defaultValue={chosenLanguages}
              onChange={(event, newValue) => setChosenLanguages(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Languages" placeholder="Languages" />}
              sx={{ width: "500px" }}
            />
            <Autocomplete
              multiple
              limitTags={2}
              id="categories"
              options={categories}
              getOptionLabel={(option) => option.name}
              defaultValue={chosenCategories}
              onChange={(event, newValue) => setChosenCategories(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Categories" placeholder="Categories" />}
              sx={{ width: "500px" }}
            />
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
                position: "relative",
              }}
            >
              {selectedImage || bookDetails.bookCover ? (
                <>
                  <img
                    className="object-cover rounded-md max-w-full max-h-full"
                    src={selectedImage || bookDetails.bookCover}
                    alt="preview"
                    style={{ opacity: 0.6 }}
                  />
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      bgcolor: "rgba(0, 0, 0, 0.3)",
                      color: "white",
                      borderRadius: "4px",
                    }}
                  >
                    <Typography variant="h6">Change Image</Typography>
                  </Box>
                </>
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
