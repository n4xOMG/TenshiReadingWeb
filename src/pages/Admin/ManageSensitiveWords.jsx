import { Badge, Box, CircularProgress, IconButton, Input, InputBase, List, ListItem, Typography } from "@mui/material";
import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import { addNewSensitiveWord, deleteSensitiveWord, getAllSensitiveWord } from "../../redux/comment/comment.action";
export default function ManageSensitiveWords() {
  const { sensitiveWords, loading, error } = useSelector((store) => store.comment);
  const [newWord, setNewWord] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const dispatch = useDispatch();

  const fetchSensitiveWords = async () => {
    try {
      await dispatch(getAllSensitiveWord());
    } catch (e) {
      console.log("Error fetching words: ", e);
    }
  };

  useEffect(() => {
    fetchSensitiveWords();
  }, []);

  const addWord = async () => {
    if (newWord && !sensitiveWords.includes(newWord)) {
      const reqData = {
        data: {
          word: newWord,
        },
      };
      await dispatch(addNewSensitiveWord(reqData));
      fetchSensitiveWords();
      setNewWord("");
    }
  };

  const deleteWord = async (wordId) => {
    await dispatch(deleteSensitiveWord(wordId));
    fetchSensitiveWords();
  };
  const filteredWords = useMemo(() => {
    return sensitiveWords.filter((word) => word.word.toLowerCase().includes(searchTerm.toLowerCase()));
  }, [sensitiveWords, searchTerm]);

  return (
    <Box sx={{ maxWidth: 400, mx: "auto", p: 3, spaceY: 3 }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Sensitive Words Manager
          </Typography>

          <Box sx={{ display: "flex", gap: 1, pb: 3 }}>
            <Input
              type="text"
              placeholder="Enter a sensitive word"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && addWord()}
              aria-label="New sensitive word"
              sx={{ flexGrow: 1 }}
            />
            <IconButton onClick={addWord} aria-label="Add word">
              <AddIcon />
            </IconButton>
          </Box>
          <Box sx={{ position: "relative", display: "flex", alignItems: "center", border: 1 }}>
            <SearchIcon
              sx={{
                position: "absolute",
                left: 8,
                top: "50%",
                transform: "translateY(-50%)",
                height: 16,
                width: 16,
                color: "text.secondary",
              }}
            />
            <InputBase
              type="text"
              placeholder="Search words..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search sensitive words"
              sx={{ pl: 4, width: "100%" }}
            />
          </Box>
          <Box sx={{ height: 300, overflowY: "auto", border: 1, borderColor: "divider", borderRadius: 1, p: 2 }}>
            <Typography variant="h6" component="h2" gutterBottom>
              Sensitive Words List
            </Typography>
            {filteredWords?.length === 0 ? (
              <Typography color="text.secondary">No sensitive words added yet.</Typography>
            ) : (
              <List>
                {filteredWords?.map((word, index) => (
                  <ListItem key={index} sx={{ display: "flex", justifyContent: "space-between" }}>
                    <Badge badgeContent={word.word} color="secondary" />
                    <IconButton edge="end" aria-label={`Delete ${word.word}`} onClick={() => deleteWord(word.id)}>
                      <DeleteIcon />
                    </IconButton>
                  </ListItem>
                ))}
              </List>
            )}
          </Box>
        </>
      )}
    </Box>
  );
}
