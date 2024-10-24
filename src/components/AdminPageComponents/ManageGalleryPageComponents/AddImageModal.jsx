import { Box, Button, CircularProgress, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { addImageAction, getAllGalleryImages, getAllImageTags } from "../../../redux/gallery/gallery.action";
import UploadToCloudinary from "../../../utils/uploadToCloudinary";
import LoadingSpinner from "../../LoadingSpinner";
export default function AddImageModal({ open, onClose }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [tags, setTags] = useState([]);
  const [name, setName] = useState();
  const [selectedTags, setSelectedTags] = useState([]);
  const handlePreviewImage = async (event) => {
    try {
      setLoading(true);
      const file = event.target.files[0];
      setSelectedFile(file);
      // Upload to the temporary folder for preview
      const imageUrl = await UploadToCloudinary(file, "temp_folder"); // Use a temporary folder
      setSelectedImage(imageUrl);
    } catch (e) {
      console.log("Error loading image", e);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const json = {
      name: name,
      imageUrl: selectedImage,
      tags: selectedTags.map((tagName) => {
        const tag = tags.find((t) => t.name === tagName);
        return { id: tag.id, name: tag.name, description: tag.description };
      }),
    };

    try {
      console.log("Data: ", json);

      // Re-upload the image to the gallery folder
      const galleryImageUrl = await UploadToCloudinary(selectedFile, "gallery_folder"); // Use the gallery folder
      json.imageUrl = galleryImageUrl; // Update imageUrl to the gallery image

      await dispatch(addImageAction({ data: json }));
      await dispatch(getAllGalleryImages(0, 4));
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error uploading image:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchTags = async () => {
      try {
        const results = await dispatch(getAllImageTags());
        setTags(results.payload);
      } catch (error) {
        console.error("Error fetching tags:", error);
      }
    };

    fetchTags();
  }, [dispatch]);
  return (
    <>
      <Modal open={open} onClose={onClose}>
        <Box component={"form"} onSubmit={handleSubmit} className="bg-gray-800 text-white p-4 rounded mx-auto my-20 w-1/3">
          {loading ? (
            <LoadingSpinner />
          ) : (
            <>
              <h2 className="text-xl mb-4">Upload Image</h2>
              <TextField
                margin="normal"
                variant="outlined"
                required
                fullWidth
                id="name"
                label="Image caption"
                name="name"
                onChange={(e) => setName(e.target.value)}
                InputLabelProps={{
                  style: { color: "white" },
                }}
                InputProps={{
                  style: { color: "white" },
                }}
              />
              <FormControl fullWidth margin="normal">
                <InputLabel id="tags-label" name="tags" style={{ color: "white" }}>
                  Tags
                </InputLabel>
                <Select
                  labelId="tags-label"
                  id="tags"
                  name="tags"
                  multiple
                  value={selectedTags}
                  onChange={(e) => setSelectedTags(e.target.value)}
                  renderValue={(selected) => selected.join(", ")}
                  sx={{
                    color: "white",
                    ".MuiSvgIcon-root": {
                      color: "white",
                    },
                  }}
                >
                  {tags.map((tag) => (
                    <MenuItem key={tag.id} value={tag.name}>
                      {tag.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
                Upload Image
                <input type="file" name="file" hidden onChange={handlePreviewImage} className="bg-gray-700 text-white mb-4" />
              </Button>
              {selectedImage && <img className="py-5 object-cover rounded-md max-w-96 max-h-96" src={selectedImage} alt="preview" />}
              <div className="flex justify-end space-x-4">
                <Button onClick={onClose} variant="contained" color="secondary">
                  Cancel
                </Button>
                <Button type="submit" variant="contained" color="primary">
                  Confirm Upload
                </Button>
              </div>
            </>
          )}
        </Box>
      </Modal>
    </>
  );
}
