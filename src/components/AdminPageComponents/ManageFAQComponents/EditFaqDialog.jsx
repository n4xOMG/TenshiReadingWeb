import { Autocomplete, Box, Button, Dialog, DialogTitle, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { editFaq, getAllFaq } from "../../../redux/faq/faq.action";
import LoadingSpinner from "../../LoadingSpinner";
import { useDispatch } from "react-redux";

export default function EditFaqDialog({ open, onClose, languages, editingFAQ, setFilteredFAQs }) {
  const [language, setLanguage] = useState(editingFAQ?.language || null);
  const [question, setQuestion] = useState(editingFAQ?.question || "");
  const [answer, setAnswer] = useState(editingFAQ?.answer || "");
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    if (editingFAQ) {
      setQuestion(editingFAQ.question);
      setAnswer(editingFAQ.answer);
      setLanguage(editingFAQ.language);
    }
  }, [editingFAQ]);

  const handleEdit = async (event) => {
    event.preventDefault();
    setLoading(true);
    try {
      const updatedFaq = {
        id: editingFAQ.id,
        question,
        answer,
        language,
      };
      await dispatch(editFaq({ data: updatedFaq }));
      const results = await dispatch(getAllFaq());
      setFilteredFAQs(results.payload);
    } catch (e) {
      console.log("Error adding faq: ", e);
    } finally {
      onClose();
      setLoading(false);
    }
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Dialog open={open} onClose={onClose}>
          <DialogTitle>Edit FAQ</DialogTitle>
          <Box component={"form"} onSubmit={handleEdit}>
            <TextField
              fullWidth
              label="Question"
              name="question"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
            <TextField
              fullWidth
              label="Answer"
              name="answer"
              multiline
              rows={4}
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              sx={{ marginBottom: "16px" }}
            />
            <Autocomplete
              id="language"
              name="language"
              options={languages}
              value={language}
              getOptionLabel={(option) => option.name}
              onChange={(event, newValue) => setLanguage(newValue)}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              renderInput={(params) => <TextField {...params} label="Language" placeholder="Language" />}
              sx={{ width: "500px" }}
            />
            <Button type="submit" variant="contained">
              Save Changes
            </Button>
          </Box>
        </Dialog>
      )}
    </>
  );
}
