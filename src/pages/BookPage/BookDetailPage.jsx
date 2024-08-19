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
import React, { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { BookCard } from "../../components/BookPageComponents/BookCard";
import { CommentSection } from "../../components/BookPageComponents/CommentSection";
import { getBookByIdAction } from "../../redux/book/book.action";
import { getAllChaptersByBookIdAction, getReadingProgressByUserAndChapter } from "../../redux/chapter/chapter.action";

export default function BookDetailPage() {
  const navigate = useNavigate();
  const { bookId } = useParams();
  const dispatch = useDispatch();
  const { chapters, progress } = useSelector((store) => store.chapter);
  const { book } = useSelector((store) => store.book);
  const { auth } = useSelector((store) => store);
  const commentSectionRef = useRef(null);

  useEffect(() => {
    console.log("Use effect bookdetail called");
    dispatch(getBookByIdAction(bookId));
    dispatch(getAllChaptersByBookIdAction(bookId));
  }, [dispatch, bookId]);

  useEffect(() => {
    console.log("Chapters: ", chapters);
    if (chapters && auth.user) {
      chapters.forEach((chapter) => {
        dispatch(getReadingProgressByUserAndChapter(auth.user.id, chapter.id));
      });
    }
  }, [dispatch, chapters, auth.user]);

  useEffect(() => {
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
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              {book ? (
                <BookCard book={book} sx={{ height: "100%", transform: "scale(1.1)" }} scrollToCommentSection={scrollToCommentSection} />
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
                          value={progress && progress[chapter.id] ? progress[chapter.id] : 0}
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
                            {progress && progress[chapter.id] ? `${progress[chapter.id]}%` : "0%"}
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
          <Button onClick={() => navigate(`/books/${bookId}/uploadChapterPage`)}>Upload new chapter</Button>
        </Box>
      </Slide>
    </div>
  );
}
