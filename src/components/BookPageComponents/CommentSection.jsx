import { Avatar, Box, Button, CircularProgress, List, ListItem, ListItemAvatar, ListItemText, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction, getAllCommentByBookAction } from "../../redux/comment/comment.action";
import { useAuthCheck } from "../../utils/useAuthCheck";

export function CommentSection({ book }) {
  const { comments, loading, error } = useSelector((store) => store.comment);
  const [newComment, setNewComment] = useState("");
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const fetchComments = async () => {
    try {
      await dispatch(getAllCommentByBookAction(book.id));
    } catch (e) {
      console.log("Error fetching words: ", e);
    }
  };

  useEffect(() => {
    fetchComments();
  }, []);

  const handleCommentChange = (event) => {
    setNewComment(event.target.value);
  };

  const handleCreateComment = checkAuth(async () => {
    const reqData = {
      bookId: book.id,
      data: {
        content: newComment,
      },
    };
    await dispatch(createCommentAction(reqData));
    await dispatch(getAllCommentByBookAction(book.id));
    setNewComment("");
  });

  return (
    <Box bgcolor={"#f4f4f5"} p={2} borderRadius={2}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Comments
          </Typography>
          <List>
            {comments?.map((comment, index) => (
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
            {error && (
              <Typography color="error" sx={{ mt: 1 }}>
                {error.response.data}
              </Typography>
            )}
          </Box>
        </>
      )}
      <AuthDialog />
    </Box>
  );
}
