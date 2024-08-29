import { FavoriteBorder, MenuBook } from "@mui/icons-material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import FavoriteIcon from "@mui/icons-material/Favorite";
import {
  Box,
  Button,
  CircularProgress,
  Grid,
  IconButton,
  LinearProgress,
  List,
  ListItem,
  ListItemText,
  Rating,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CommentSection } from "../../components/BookPageComponents/CommentSection";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import {
  followBookAction,
  getAvgBookRating,
  getBookByIdAction,
  getBookDetailsAndChaptersAction,
  getBookRatingByUserAction,
  ratingBookAction,
} from "../../redux/book/book.action";
import { getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { useAuthCheck } from "../../utils/useAuthCheck";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { chapters, progresses = [] } = useSelector((store) => store.chapter);
  const { book, rating } = useSelector((store) => store.book);
  const { auth } = useSelector((store) => store);
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);
  const fetchBookAndChapterDetails = async () => {
    if (auth.user) {
      setLoading(true);
      await dispatch(getBookRatingByUserAction(bookId));
      await dispatch(getBookDetailsAndChaptersAction(bookId, auth.user.id));
      setLoading(false);
    } else {
      setLoading(true);
      await dispatch(getBookByIdAction(bookId));
      await dispatch(getAllChaptersByBookIdAction(bookId));
      await dispatch(getAvgBookRating(bookId));
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookAndChapterDetails();
  }, [dispatch, bookId, auth.user]);

  useEffect(() => {
    if (book && auth.user) {
      setIsFavorite(isFavouredByReqUser(auth.user.id, book));
    }
  }, [book, auth.user]);

  useEffect(() => {
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 650);
    return () => clearTimeout(timer);
  }, [book, chapters, progresses]);

  useEffect(() => {
    if (Array.isArray(progresses) && progresses.length > 0 && chapters.length > 0) {
      const totalProgress = progresses.reduce((acc, progress) => acc + (progress.progress || 0), 0);
      const averageProgress = totalProgress / chapters.length;
      const roundedProgress = Math.floor(averageProgress);
      console.log("Rounded progress: ", roundedProgress);
      setOverallProgress(roundedProgress);
    }
  }, [chapters, progresses]);

  const handleFollowBook = checkAuth(async () => {
    try {
      await dispatch(followBookAction(bookId));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error following book:", error);
    }
  });

  const handleRating = checkAuth(async (value) => {
    try {
      setLoading(true);
      await dispatch(ratingBookAction(bookId, value));
    } catch (error) {
      console.error("Error rating book: ", error);
    } finally {
      setLoading(false);
    }
  });
  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <IconButton
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        sx={{
          position: "fixed",
          top: 16,
          left: 16,
          zIndex: 2,
          backgroundColor: "white",
          border: "1px solid",
          borderColor: "grey.300",
          "&:hover": {
            backgroundColor: "grey.100",
          },
        }}
      >
        <DehazeIcon />
      </IconButton>

      <Box container={"true"} sx={{ mx: "auto", px: 10, py: 8, backgroundColor: "#f9fafb" }}>
        {loading || !book ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={8} sx={{ backgroundColor: "#f9fafb" }}>
            <Grid item md={3}>
              <Box
                component="img"
                src={book.bookCover}
                alt={`Cover of ${book.title}`}
                sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
              />
              <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Rating
                    name="simple-controlled"
                    value={rating ? rating.rating : 0}
                    onChange={(event, newValue) => handleRating(newValue)}
                  />
                  <Typography sx={{ ml: 2, color: "gray.600" }}>{rating ? rating.rating : 0}</Typography>
                </Box>
                <IconButton
                  onClick={handleFollowBook}
                  sx={{
                    backgroundColor: "white",
                    border: "1px solid",
                    borderColor: "grey.300",
                    height: 40,
                    width: 40,
                    "&:hover": {
                      backgroundColor: "grey.100",
                    },
                  }}
                >
                  {isFavorite ? (
                    <FavoriteIcon
                      sx={{
                        width: 16,
                        height: 16,
                        color: "red",
                      }}
                    />
                  ) : (
                    <FavoriteBorder
                      sx={{
                        width: 16,
                        height: 16,
                        color: "black",
                      }}
                    />
                  )}
                  <span className="sr-only">{isFavorite ? "Remove from favorites" : "Add to favorites"}</span>
                </IconButton>
              </Box>
              <Button
                fullWidth
                onClick={() => navigate(`/books/${bookId}/chapters/${chapters[0].id}`)}
                sx={{
                  mt: 4,
                  backgroundColor: "black",
                  color: "white",
                  height: 50,
                  borderRadius: 2,
                  "&:hover": {
                    backgroundColor: "darkgray",
                  },
                }}
              >
                <MenuBook sx={{ mr: 2, width: 16, height: 16 }} /> Start Reading
              </Button>
            </Grid>
            <Grid item md={8}>
              <Typography variant="h3" sx={{ mb: 2, textAlign: "left" }}>
                {book.title}
              </Typography>
              <Typography sx={{ color: "gray.600", mb: 4, textAlign: "left" }}>
                By{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {book.authorName}
                </Box>{" "}
                • Illustrated by{" "}
                <Box component="span" sx={{ fontWeight: "bold" }}>
                  {book.artistName}
                </Box>
              </Typography>
              <Typography sx={{ color: "gray.700", mb: 6, textAlign: "left" }}>{book.description}</Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
                  Overall Progress
                </Typography>
                <LinearProgress
                  variant="determinate"
                  value={overallProgress}
                  sx={{
                    width: "100%",
                    "& .MuiLinearProgress-root": {
                      backgroundColor: "gray",
                    },
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "black",
                    },
                  }}
                />
                <Typography sx={{ textAlign: "right", color: "gray.600", mt: 1 }}>{overallProgress}% Complete</Typography>
              </Box>
              <Box sx={{ mb: 6 }}>
                <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
                  Chapters
                </Typography>
                <List sx={{ spaceY: 2 }}>
                  {chapters?.map((chapter, index) => {
                    const progress = Array.isArray(progresses) ? progresses.find((p) => Number(p.chapterId) === Number(chapter.id)) : null;
                    return (
                      <ListItem
                        key={index}
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                          p: 2,
                          borderRadius: 2,
                          transition: "all 0.2s ease-in-out",
                          height: 60,
                          "&:hover": {
                            backgroundColor: "grey.100",
                            boxShadow: 3,
                            transform: "scale(1.02)",
                            cursor: "pointer",
                          },
                        }}
                        onClick={() => navigate(`/books/${bookId}/chapters/${chapter.id}`)}
                      >
                        <ListItemText primary={chapter.title} />
                        <Box sx={{ display: "flex", alignItems: "center" }}>
                          <LinearProgress
                            variant="determinate"
                            value={progress ? progress.progress : 0}
                            sx={{
                              width: 100,
                              mr: 2,
                              "& .MuiLinearProgress-root": {
                                backgroundColor: "gray",
                              },
                              "& .MuiLinearProgress-bar": {
                                backgroundColor: "black",
                              },
                            }}
                          />
                        </Box>
                      </ListItem>
                    );
                  })}
                </List>
              </Box>
              <Box sx={{ mb: 6 }}>
                {book && book.comments ? <CommentSection book={book} /> : <Typography variant="body1">Loading comments...</Typography>}
              </Box>
            </Grid>
          </Grid>
        )}
      </Box>
      <AuthDialog />
    </>
  );
}
