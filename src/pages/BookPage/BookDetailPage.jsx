import { ChevronLeft } from "@mui/icons-material";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CircularProgress,
  Divider,
  Grid,
  IconButton,
  List,
  ListItemText,
  Slide,
  Toolbar,
  Typography,
} from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BookCard } from "../../components/BookPageComponents/BookCard";
import { CommentSection } from "../../components/BookPageComponents/CommentSection";
import { getBookDetailsAndChaptersAction } from "../../redux/book/book.action";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { chapters, progresses } = useSelector((store) => store.chapter);
  const { book } = useSelector((store) => store.book);
  const { auth } = useSelector((store) => store);
  const commentSectionRef = useRef(null);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (auth.user) {
      setLoading(true);
      dispatch(getBookDetailsAndChaptersAction(bookId, auth.user.id));
      setLoading(false);
    }
  }, [dispatch, bookId, auth.user]);

  useEffect(() => {
    console.log("Book: ", book);
    console.log("Chapter: ", chapters);
    console.log("Progresses");
    const timer = setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 650);
    return () => clearTimeout(timer);
  }, []);

  const scrollToCommentSection = () => {
    commentSectionRef.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <div>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back home" onClick={() => navigate("/")}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, textAlign: "center" }}>
            IVY
          </Typography>
          <Avatar sx={{ marginLeft: "auto" }}>A</Avatar>
        </Toolbar>
      </AppBar>
      <Slide direction="left" in={true} timeout={500}>
        <Box component="main" sx={{ flexGrow: 3, p: 3, mt: 8 }}>
          {loading ? (
            <div className="flex justify-center">
              <CircularProgress />
            </div>
          ) : (
            <>
              <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                  {book ? (
                    <BookCard
                      book={book}
                      sx={{ height: "100%", transform: "scale(1.1)" }}
                      scrollToCommentSection={scrollToCommentSection}
                    />
                  ) : (
                    <Typography variant="body1">Loading...</Typography>
                  )}
                </Grid>
                <Grid item xs={12} md={6}>
                  <Typography variant="h6">Table of contents</Typography>
                  <List>
                    {chapters?.map((chapter, index) => (
                      <Card
                        onClick={() => navigate(`/books/${bookId}/chapters/${chapter.id}`)}
                        key={index}
                        sx={{
                          mb: 2,
                          cursor: "pointer",
                          transition: "transform 0.3s, box-shadow 0.3s",
                          "&:hover": {
                            transform: "scale(1.05)",
                            boxShadow: "0 4px 20px rgba(0, 0, 0, 0.2)",
                          },
                        }}
                      >
                        <CardContent sx={{ display: "flex", alignItems: "center" }}>
                          <Avatar sx={{ mr: 2 }}>
                            <CircularProgress
                              variant="determinate"
                              value={progresses && progresses[chapter.id] ? progresses[chapter.id] : 0}
                              size={40}
                              thickness={4}
                              sx={{
                                color: "primary.main",
                                position: "absolute",
                                top: 0,
                                left: 0,
                                zIndex: 1,
                              }}
                            />
                            <Box
                              sx={{
                                position: "absolute",
                                top: "50%",
                                left: "50%",
                                transform: "translate(-50%, -50%)",
                                backgroundColor: "white",
                                borderRadius: "50%",
                                width: "28px",
                                height: "28px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: 2,
                              }}
                            >
                              <Typography variant="caption" component="div" color="textSecondary" sx={{ position: "relative", zIndex: 2 }}>
                                {progresses && progresses[chapter.id] ? `${progresses[chapter.id]}%` : "0%"}
                              </Typography>
                            </Box>
                          </Avatar>
                          <ListItemText primary={chapter.title} secondary={`${chapter.chapterNum} Chapters`} />
                        </CardContent>
                      </Card>
                    ))}
                  </List>
                </Grid>
              </Grid>
              <Divider light sx={{ mt: 2, mb: 2 }} />
              <div ref={commentSectionRef}>
                {book && book.comments ? (
                  <CommentSection comments={book.comments} book={book} />
                ) : (
                  <Typography variant="body1">Loading comments...</Typography>
                )}
              </div>
            </>
          )}
          <Button onClick={() => navigate(`/books/${bookId}/uploadChapterPage`)}>Upload new chapter</Button>
        </Box>
      </Slide>
    </div>
  );
}
