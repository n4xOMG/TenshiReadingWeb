import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { editTagAction, getAllImageTags } from "../../redux/gallery/gallery.action";
import { Box, Button, CircularProgress, Modal, TextField } from "@mui/material";

export default function EditTagModal({ open, onClose, tagDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(tagDetails.name || "");
  const [description, setDescription] = useState(tagDetails.description || "");
  const [id, setId] = useState(tagDetails.id || "");

  useEffect(() => {
    setId(tagDetails.id || "");
    setName(tagDetails.name || "");
    setDescription(tagDetails.description || "");
  }, [tagDetails]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const json = Object.fromEntries(data.entries());
      json.id = id;
      console.log("Payload to be sent:", { data: json });
      await dispatch(editTagAction({ data: json }));
      await dispatch(getAllImageTags());
      onClose();
    } catch (e) {
      console.log("Error trying to edit tag: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
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
              label="Tag's Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              id="description"
              label="Tag's Description"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
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
    </Modal>
  );
}
