import { Avatar, Box, Button, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import { createCommentAction, getAllCommentByBookAction } from "../../redux/book/book.action";
import { useDispatch } from "react-redux";

export function CommentSection({ book }) {
  const [comments, setComments] = useState(book.comments);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCreateComment = async () => {
    const reqData = {
      bookId: book.id,
      data: {
        content: newComment,
      },
    };
    await dispatch(createCommentAction(reqData));
    const results = await dispatch(getAllCommentByBookAction(book.id));
    setComments(results.payload);
    setNewComment("");
  };

  return (
    <Box bgcolor={"#f4f4f5"} p={2} borderRadius={2}>
      <Typography variant="h6" sx={{ mb: 2 }}>
        Comments
      </Typography>
      <List>
        {comments.map((comment, index) => (
          <ListItem key={index} alignItems="flex-start">
            <ListItemAvatar>
              <Avatar>{comment.username ? comment.username.charAt(0) : "?"}</Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={comment.username || "Anonymous"}
              secondary={
                <React.Fragment>
                  <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                    {comment.createdAt}
                  </Typography>
                  {" — "}
                  {comment.content}
                </React.Fragment>
              }
            />
          </ListItem>
        ))}
      </List>
      <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder="Enter your comment..."
          value={newComment}
          onChange={handleCommentChange}
          sx={{ bgcolor: "white", borderRadius: 1 }}
          onKeyPress={(e) => {
            if (e.key === "Enter") {
              handleCreateComment();
              console.log("Enter button pressed.", newComment);
            }
          }}
        />
        <Button variant="contained" color="primary" onClick={handleCreateComment} sx={{ ml: 2 }}>
          Submit
        </Button>
      </Box>
    </Box>
  );
}
