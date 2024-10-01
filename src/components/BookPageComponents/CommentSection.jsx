import {
  Alert,
  Avatar,
  Box,
  Button,
  CircularProgress,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Menu,
  MenuItem,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createCommentAction, deleteCommentAction, getAllCommentByBookAction } from "../../redux/comment/comment.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
import { formatDate } from "../../utils/formatDate";
import MoreVertIcon from "@mui/icons-material/MoreVert";
export function CommentSection({ book }) {
  const { comments, loading, error } = useSelector((store) => store.comment);
  const { user } = useSelector((store) => store.auth);
  const [newComment, setNewComment] = useState("");
  const [selectedComment, setSelectedComment] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const fetchComments = async () => {
    try {
      await dispatch(getAllCommentByBookAction(book.id));
    } catch (e) {
      console.log("Error fetching words: ", e);
      setOpen(true);
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
  const handleMenuOpen = (event, comment) => {
    setAnchorEl(event.currentTarget);
    setSelectedComment(comment);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    setSelectedComment(null);
  };

  const handleDeleteComment = async () => {
    await dispatch(deleteCommentAction(selectedComment.id));
    await fetchComments();
    handleMenuClose();
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
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
                  <Avatar>{comment.user.username ? comment.user.username.charAt(0) : "?"}</Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={comment.user.username || "Anonymous"}
                  secondary={
                    <React.Fragment>
                      <Typography sx={{ display: "inline" }} component="span" variant="body2" color="text.primary">
                        {formatDate(comment.createdAt)}
                      </Typography>
                      {" — "}
                      {comment.content}
                    </React.Fragment>
                  }
                />
                {(user?.id === comment.user.id || user?.role?.name === "ADMIN") && (
                  <>
                    <IconButton onClick={(event) => handleMenuOpen(event, comment)}>
                      <MoreVertIcon />
                    </IconButton>

                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem onClick={handleDeleteComment}>Delete</MenuItem>
                    </Menu>
                  </>
                )}
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
}
