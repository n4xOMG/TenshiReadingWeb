import { Alert, Box, Button, CircularProgress, List, ListItem, Snackbar, TextField, Typography } from "@mui/material";
import React, { memo, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  createBookCommentAction,
  createReplyBookCommentAction,
  deleteCommentAction,
  getAllCommentByBookAction,
} from "../../redux/comment/comment.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import CommentItem from "./CommentItem";
const CommentSection = ({ bookId, user }) => {
  const { bookComments, error } = useSelector((store) => store.comment);
  const [loading, setLoading] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [newReply, setNewReply] = useState("");
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();

  const fetchComments = useCallback(async () => {
    try {
      setLoading(true);
      await dispatch(getAllCommentByBookAction(bookId));
    } catch (e) {
      console.error("Error fetching comments: ", e);
      setOpen(true);
    } finally {
      setLoading(false);
    }
  }, [bookId, dispatch]);

  useEffect(() => {
    fetchComments();
  }, [fetchComments]);

  const handleCommentChange = useCallback((event) => {
    setNewComment(event.target.value);
  }, []);

  const handleReplyChange = useCallback((event) => {
    setNewReply(event.target.value);
  }, []);

  const handleCreateComment = useCallback(
    checkAuth(async () => {
      if (newComment.trim()) {
        const reqData = {
          bookId: bookId,
          data: {
            content: newComment,
          },
        };
        await dispatch(createBookCommentAction(reqData));
        fetchComments();
        setNewComment("");
      } else {
        alert("Comment cannot be null!");
      }
    }),
    [newComment, bookId, dispatch, fetchComments]
  );

  const handleSubmitReply = useCallback(
    checkAuth(async (parentCommentId) => {
      if (newReply.trim()) {
        const reqData = {
          parentCommentId: parentCommentId,
          bookId: bookId,
          data: {
            content: newReply,
          },
        };
        await dispatch(createReplyBookCommentAction(reqData));
        fetchComments();
        setNewReply("");
      } else {
        alert("Reply cannot be null!");
      }
    }),
    [newReply, bookId, dispatch, fetchComments]
  );

  const handleDeleteComment = useCallback(
    checkAuth(async (commentId) => {
      await dispatch(deleteCommentAction(commentId));
      fetchComments();
    }),
    [dispatch, fetchComments]
  );

  const handleClose = useCallback((event, reason) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);
  return (
    <Box bgcolor={"#f4f4f5"} borderRadius={2}>
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
            {bookComments?.map((comment, index) => (
              <ListItem key={index} alignItems="flex-start">
                <CommentItem
                  comment={comment}
                  newReply={newReply}
                  checkAuth={checkAuth}
                  handleReplyChange={handleReplyChange}
                  handleSubmitReply={handleSubmitReply}
                  handleDeleteComment={handleDeleteComment}
                  user={user}
                />
              </ListItem>
            ))}
          </List>
          <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Enter your comment..."
              required
              value={newComment}
              onChange={handleCommentChange}
              sx={{ bgcolor: "white", borderRadius: 1 }}
              onKeyPress={(e) => {
                if (e.key === "Enter") {
                  handleCreateComment();
                }
              }}
            />
            <Button variant="contained" color="primary" onClick={handleCreateComment} sx={{ ml: 2 }}>
              Submit
            </Button>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose}>
              {error && (
                <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
                  {error}
                </Alert>
              )}
            </Snackbar>
          </Box>
        </>
      )}
      <AuthDialog />
    </Box>
  );
};

export default memo(CommentSection);
