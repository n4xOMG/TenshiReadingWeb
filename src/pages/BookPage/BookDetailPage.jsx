import { FavoriteBorder, MenuBook } from "@mui/icons-material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, CircularProgress, Grid, IconButton, Rating, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BookDetails } from "../../components/BookDetailPageComponents/BookDetails";
import { ChapterList } from "../../components/BookDetailPageComponents/ChapterList";
import { ProgressBar } from "../../components/BookDetailPageComponents/ProgressBar";
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

export const BookDetailPage = () => {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { chapters, progresses = [] } = useSelector((store) => store.chapter);
  const { book, rating } = useSelector((store) => store.book);
  const { user } = useSelector((store) => store.auth);
  const { checkAuth, AuthDialog } = useAuthCheck();

  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [overallProgress, setOverallProgress] = useState(0);

  const fetchBookAndChapterDetails = useCallback(async () => {
    setLoading(true);
    if (user) {
      await dispatch(getBookRatingByUserAction(bookId));
      await dispatch(getBookDetailsAndChaptersAction(bookId, user.id));
    } else {
      await dispatch(getBookByIdAction(bookId));
      await dispatch(getAllChaptersByBookIdAction(bookId));
      await dispatch(getAvgBookRating(bookId));
    }
    setLoading(false);
  }, [user, bookId, dispatch]);

  const calculateOverallProgress = useCallback(() => {
    if (Array.isArray(progresses) && progresses.length > 0 && chapters.length > 0) {
      const totalProgress = progresses.reduce((acc, progress) => acc + (progress.progress || 0), 0);
      const averageProgress = Math.floor(totalProgress / chapters.length);
      setOverallProgress(averageProgress);
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
      console.error("Error rating book:", error);
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    fetchBookAndChapterDetails();
  }, [fetchBookAndChapterDetails]);

  useEffect(() => {
    if (book && user) {
      setIsFavorite(isFavouredByReqUser(user.id, book));
    }
  }, [book, user]);

  useEffect(() => {
    calculateOverallProgress();
  }, [calculateOverallProgress]);

  return (
    <>
      <Sidebar isSidebarOpen={isSidebarOpen} isBackdropOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
              <BookDetails book={book} />
              <ProgressBar progress={overallProgress} />
              <ChapterList chapters={chapters} progresses={progresses} onNavigate={navigate} bookId={bookId} />
              <CommentSection book={book} />
            </Grid>
          </Grid>
        )}
      </Box>
      <AuthDialog />
    </>
  );
};
