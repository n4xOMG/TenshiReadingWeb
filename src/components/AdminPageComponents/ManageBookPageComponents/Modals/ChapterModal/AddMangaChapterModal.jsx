import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Dialog,
  FormControlLabel,
  Grid,
  IconButton,
  TextField,
} from "@mui/material";
import DOMPurify from "dompurify";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllLanguages } from "../../../../../redux/book/book.action";
import { addChapterAction, getAllChaptersByBookIdAction } from "../../../../../redux/chapter/chapter.action";
import UploadToCloudinary from "../../../../../utils/uploadToCloudinary";
import ViewImageModal from "../../../ManageGalleryPageComponents/ViewImageModal";
import CloseIcon from "@mui/icons-material/Close";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
export default function AddMangaChapterModal({ open, onClose, bookId }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const { user } = useSelector((store) => store.auth);
  const { languages } = useSelector((store) => store.book);
  const [chapter, setChapter] = useState({
    chapterNum: "",
    title: "",
    language: null,
    translatorId: user?.id || "",
    content: "",
    adaptationSeason: {
      season: "",
      episode: "",
      part: "",
    },
    showAdaptation: false,
  });

  const [images, setImages] = useState({
    imageFiles: [],
    imagePreviews: [],
    imageLinks: [],
  });
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setChapter((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAdaptationChange = (e) => {
    const { name, value } = e.target;
    setChapter((prev) => ({
      ...prev,
      adaptationSeason: {
        ...prev.adaptationSeason,
        [name]: value,
      },
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const previews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => ({
      ...prev,
      imageFiles: files,
      imagePreviews: previews,
    }));
  };
  const handleRemoveImage = (index) => {
    setImages((prev) => ({
      imageFiles: prev.imageFiles.filter((_, i) => i !== index),
      imagePreviews: prev.imagePreviews.filter((_, i) => i !== index),
    }));
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      // Upload all images to Cloudinary
      const uploadedImageLinks = await Promise.all(
        images.imageFiles.map((file) => UploadToCloudinary(file, `Chapter_${chapter.chapterNum}_${chapter.title}`))
      );

      // Update content with image links
      const serializedContent = JSON.stringify(chapter.content);
      const updatedContent = uploadedImageLinks.reduce(
        (acc, link) => acc + `<img src="${link}" alt="Chapter Image" />`,
        DOMPurify.sanitize(serializedContent)
      );

      const chapterData = {
        ...chapter,
        content: updatedContent,
        imageLinks: uploadedImageLinks,
      };

      if (chapter.showAdaptation) {
        chapterData.adaptationSeason = {
          season: chapter.adaptationSeason.season,
          episode: chapter.adaptationSeason.episode,
          part: chapter.adaptationSeason.part,
        };
      }
      await dispatch(addChapterAction(bookId, { data: chapterData }));
      await dispatch(getAllChaptersByBookIdAction(bookId));
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setLoading(false);
      onClose();
    }
  };

  const handlePreviewClick = (index) => {
    setSelectedImage(images.imagePreviews[index]);
  };
  const handleNextImage = () => {
    const currentIndex = images.imagePreviews.indexOf(selectedImage);
    const nextIndex = (currentIndex + 1) % images.imagePreviews.length;
    setSelectedImage(images.imagePreviews[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = images.imagePreviews.indexOf(selectedImage);
    const prevIndex = (currentIndex - 1 + images.imagePreviews.length) % images.imagePreviews.length;
    setSelectedImage(images.imagePreviews[prevIndex]);
  };
  useEffect(() => {
    const fetchLanguages = async () => {
      setLoading(true);
      try {
        await dispatch(getAllLanguages());
      } catch (e) {
        console.error("Error fetching tags: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchLanguages();
    setLoading(true);
  }, [dispatch]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <Box component="form" onSubmit={handleSubmit} noValidate sx={{ borderRadius: 1, borderColor: "#0c0a09", px: 3 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          name="chapterNum"
          label="Chapter number"
          value={chapter.chapterNum}
          onChange={handleInputChange}
        />
        <TextField margin="normal" fullWidth name="title" label="Chapter title" value={chapter.title} onChange={handleInputChange} />
        <Autocomplete
          limitTags={1}
          id="language"
          options={languages || []}
          getOptionLabel={(option) => option?.name || ""}
          value={chapter.language}
          onChange={(event, newValue) => setChapter((prev) => ({ ...prev, language: newValue }))}
          isOptionEqualToValue={(option, value) => option?.id === value?.id}
          renderInput={(params) => <TextField {...params} label="Language" placeholder="Language" />}
          sx={{ width: "500px" }}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={chapter.showAdaptation}
              onChange={(e) => setChapter((prev) => ({ ...prev, showAdaptation: e.target.checked }))}
              name="showAdaptation"
              color="primary"
            />
          }
          label="Adapted Chapter"
        />

        {/* Adaptation section */}
        {chapter.showAdaptation && (
          <>
            <TextField
              margin="normal"
              fullWidth
              name="season"
              label="Season"
              value={chapter.adaptationSeason.season}
              onChange={handleAdaptationChange}
            />
            <TextField
              type="number"
              margin="normal"
              fullWidth
              name="episode"
              label="Episode"
              value={chapter.adaptationSeason.episode}
              onChange={handleAdaptationChange}
            />
            <TextField
              type="number"
              margin="normal"
              fullWidth
              name="part"
              label="Part"
              value={chapter.adaptationSeason.part}
              onChange={handleAdaptationChange}
            />
          </>
        )}

        <Grid container spacing={2} sx={{ mt: 2 }}>
          <Grid item xs={6} sm={4} md={3} sx={{ position: "relative", cursor: "pointer" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                height: "100%",
                borderRadius: "8px",
                border: "2px dashed grey",
                position: "relative",
                overflow: "hidden",
              }}
            >
              <input
                type="file"
                multiple
                name="images"
                accept="image/*"
                onChange={handleImageChange}
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  opacity: 0,
                  cursor: "pointer",
                }}
              />
              <AddPhotoAlternateIcon sx={{ fontSize: 48, color: "grey" }} />
            </Box>
          </Grid>

          {images.imagePreviews.map((preview, index) => (
            <Grid item xs={6} sm={4} md={3} key={index} sx={{ position: "relative", cursor: "pointer" }}>
              <img
                src={preview}
                alt={`Preview ${index}`}
                style={{ width: "100%", height: "auto", borderRadius: "8px" }}
                onClick={() => handlePreviewClick(index)}
              />
              <IconButton
                onClick={() => handleRemoveImage(index)}
                sx={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "rgba(0, 0, 0, 0.8)",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Grid>
          ))}
        </Grid>
        <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
          Upload
        </Button>
      </Box>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
      {selectedImage && (
        <ViewImageModal
          open={true}
          image={{ imageUrl: selectedImage }}
          onClose={() => setSelectedImage(null)}
          onNext={handleNextImage}
          onPrev={handlePrevImage}
          user={user}
        />
      )}
    </Dialog>
  );
}
