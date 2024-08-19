import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Box, Button, CircularProgress, Dialog, FormControl, InputLabel, MenuItem, Modal, Select, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editImageAction, getAllGalleryImages, getAllImageTags } from "../../redux/gallery/gallery.action";
import UploadToCloudinary from "../../utils/uploadToCloudinary";
export default function EditImageModal({ open, onClose, imageDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState([]);
  const [name, setName] = useState(imageDetails.name);
  const [imageUrl, setImageUrl] = useState(imageDetails.imageUrl);
  const [id, setId] = useState(imageDetails.id);

  useEffect(() => {
    if (open) {
      setId(imageDetails.id);
      setName(imageDetails.name);
      setImageUrl(imageDetails.imageUrl);

      setSelectedTags(imageDetails.tags.map((tag) => tag.name));

      const fetchTags = async () => {
        try {
          const results = await dispatch(getAllImageTags());
          setTags(results.payload);
        } catch (error) {
          console.error("Error fetching tags:", error);
        }
      };

      fetchTags();
    }
  }, [dispatch, imageDetails, open]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const json = {
      id: id,
      name: name,
      imageUrl: imageUrl,
      tags: selectedTags.map((tagName) => {
        const tag = tags.find((t) => t.name === tagName);
        return { id: tag.id, name: tag.name, description: tag.description };
      }),
    };
    console.log("Payload to be sent:", { data: json });
    await dispatch(editImageAction({ data: json }));
    await dispatch(getAllGalleryImages());
    onClose();
  };

  const handlePreviewImage = async (event) => {
    try {
      setLoading(true);
      const cloudinaryImageUrl = await UploadToCloudinary(event.target.files[0]);
      setImageUrl(cloudinaryImageUrl);
    } catch (e) {
      console.log("Error loading image", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Box component={"form"} onSubmit={handleSubmit} className="bg-gray-800 text-white p-4 rounded mx-auto my-20 w-1/3">
        <h2 className="text-xl mb-4">Edit Image</h2>

        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Image Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              InputLabelProps={{
                style: { color: "white" },
              }}
              InputProps={{
                style: { color: "white" },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="tags-label" style={{ color: "white" }}>
                Tags
              </InputLabel>
              <Select
                labelId="tags-label"
                id="tags"
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
                {tags?.map((tag, index) => (
                  <MenuItem key={index} value={tag.name}>
                    {tag.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <Button component="label" role={undefined} variant="contained" tabIndex={-1} startIcon={<CloudUploadIcon />}>
              Upload Image
              <input type="file" name="file" hidden onChange={handlePreviewImage} className="bg-gray-700 text-white mb-4" />
            </Button>
            {imageUrl && <img className="py-5 object-cover rounded-md max-w-96 max-h-96" src={imageUrl} alt="preview" />}
            <div className="flex justify-end space-x-4">
              <Button onClick={onClose} variant="contained" color="secondary">
                Cancel
              </Button>
              <Button type="submit" variant="contained" color="primary">
                Save Changes
              </Button>
            </div>
          </>
        )}
      </Box>
    </Dialog>
  );
}
