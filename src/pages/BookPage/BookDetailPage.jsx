import { FavoriteBorder, MenuBook, Star } from "@mui/icons-material";
import { Box, Button, CircularProgress, Grid, IconButton, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { CommentSection } from "../../components/BookPageComponents/CommentSection";
import { getBookDetailsAndChaptersAction } from "../../redux/book/book.action";
import { isFollowedByReqUser } from "../../utils/isFollowedByReqUser";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { chapters, progresses } = useSelector((store) => store.chapter);
  const { book } = useSelector((store) => store.book);
  const { auth } = useSelector((store) => store);
  const commentSectionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);

  useEffect(() => {
    const fetchBookAndChapterDetails = async () => {
      if (auth.user) {
        setLoading(true);
        await dispatch(getBookDetailsAndChaptersAction(bookId, auth.user.id));
        setLoading(false);
      }
    };

    fetchBookAndChapterDetails();
  }, [dispatch, bookId, auth.user]);

  useEffect(() => {
    const isFollowed = async () => {
      if (book && isFollowedByReqUser(auth.user.id, book)) {
        setIsFavorite(true);
      }
    };
    isFollowed();
  }, [auth.user.id, book]);

  useEffect(() => {
    console.log("Book: ", book);
    console.log("Chapter: ", chapters);
    console.log("Progresses: ", progresses);

    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 650);
    return () => clearTimeout(timer);
  }, [book, chapters, progresses]);

  const scrollToCommentSection = () => {
    commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box className="container mx-auto px-4 py-8">
      {loading || !book ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Grid container spacing={8}>
          <Grid item md={4}>
            <Box
              component="img"
              src={book.bookCover}
              alt={`Cover of ${book.title}`}
              sx={{ width: "100%", borderRadius: 2, boxShadow: 3 }}
            />
            <Box sx={{ mt: 4, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                {[...Array(5)].map((_, i) => (
                  <Star key={i} sx={{ width: 20, height: 20, color: i < Math.floor(4) ? "yellow.400" : "gray.300" }} />
                ))}
                <Typography sx={{ ml: 2, color: "gray.600" }}>{4}</Typography>
              </Box>
              <IconButton
                onClick={() => setIsFavorite(!isFavorite)}
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
                <FavoriteBorder
                  sx={{
                    width: 16,
                    height: 16,
                    color: isFavorite ? "red.500" : "black",
                  }}
                />
                <span className="sr-only">Add to favorites</span>
              </IconButton>
            </Box>
            <Button
              fullWidth
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
                value={50}
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
              <Typography sx={{ textAlign: "right", color: "gray.600", mt: 1 }}>1% Complete</Typography>
            </Box>
            <Box sx={{ mb: 6 }}>
              <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
                Chapters
              </Typography>
              <List sx={{ spaceY: 2 }}>
                {chapters?.map((chapter, index) => {
                  const progress = progresses.find((p) => Number(p.chapterId) === Number(chapter.id));
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
                        <Typography variant="body2" sx={{ color: "gray" }}>
                          {progress ? `${progress.progress.toFixed(1)}%` : "0%"}
                        </Typography>
                      </Box>
                    </ListItem>
                  );
                })}
              </List>
            </Box>
            <Box sx={{ mb: 6 }}>
              {book && book.comments ? (
                <CommentSection comments={book.comments} book={book} />
              ) : (
                <Typography variant="body1">Loading comments...</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      )}
    </Box>
  );
}
