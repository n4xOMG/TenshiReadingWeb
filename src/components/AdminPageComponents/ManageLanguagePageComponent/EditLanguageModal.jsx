import { Box, Button, Modal, TextField } from "@mui/material";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { editLanguageAction, getAllLanguages } from "../../../redux/book/book.action";
import LoadingSpinner from "../../LoadingSpinner";

export default function EditLanguageModal({ open, onClose, languageDetails }) {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState(languageDetails.name || "");
  const [countryCode, setCountryCode] = useState(languageDetails.countryCode || "");

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const json = Object.fromEntries(data.entries());
      json.id = languageDetails.id;
      console.log("Payload to be sent:", { data: json });
      await dispatch(editLanguageAction({ data: json }));
      await dispatch(getAllLanguages());
      onClose();
    } catch (e) {
      console.log("Error trying to edit language: ", e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box component={"form"} onSubmit={handleSubmit} className="bg-gray-800 text-white p-4 rounded mx-auto my-20 w-1/3">
        <h2 className="text-xl mb-4">Edit Language</h2>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <>
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              id="name"
              label="Country Name"
              name="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              margin="normal"
              variant="outlined"
              required
              fullWidth
              id="countryCode"
              label="Language's country code"
              name="countryCode"
              value={countryCode}
              onChange={(e) => setCountryCode(e.target.value)}
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
