import { Box, Button, Card, CardContent, CircularProgress, Grid, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookAction } from "../../redux/book/book.action";
import { getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";

export default function ManageBookPage() {
  const dispatch = useDispatch();
  const { books } = useSelector((store) => store.book);
  const { chapters } = useSelector((store) => store.chapter);
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);
  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        await dispatch(getAllBookAction());
      } catch (e) {
        console.log("Error trying to get all books in manage book page: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [dispatch]);
  useEffect(() => {
    if (books.length > 0) {
      setSelectedBookId(books[0].id);
    }
  }, [books]);
  useEffect(() => {
    const fetchChapterById = async () => {
      setLoading(true);
      try {
        await dispatch(getAllChaptersByBookIdAction(selectedBookId));
      } catch (e) {
        console.log("Error trying to get all books in manage book page: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchChapterById();
  }, [selectedBookId, dispatch]);

  return (
    <Box sx={{ display: "grid", minHeight: "100vh", width: "100%", gridTemplateColumns: "1fr 1fr", bgcolor: "background.default" }}>
      <Box component="aside" sx={{ borderRight: 1, borderColor: "divider", p: 4, bgcolor: "grey.100" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%", maxHeight: "100vh" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Books
            </Typography>
            <Button size="small">Add Book</Button>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {books?.map((book, index) => (
                  <Grid item xs={12} key={index}>
                    <Card
                      onClick={() => setSelectedBookId(book.id)}
                      sx={{ "&:hover": { bgcolor: "grey.300" }, transition: "background-color 0.3s", cursor: "pointer" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center" }}>
                        <img
                          src={book.bookCover}
                          alt={book.title}
                          width={80}
                          height={120}
                          style={{ borderRadius: "4px", marginRight: "16px", aspectRatio: "80/120", objectFit: "cover" }}
                        />
                        <Box sx={{ flexGrow: 1 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                            {book.title}
                          </Typography>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            {book.authorName}
                          </Typography>
                        </Box>
                      </Box>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
      <Box component="main" sx={{ p: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Chapters
            </Typography>
            <Button size="small">Add Chapter</Button>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                {chapters?.map((chapter, index) => (
                  <Grid item xs={12} key={index}>
                    <Card sx={{ "&:hover": { bgcolor: "grey.300" }, transition: "background-color 0.3s" }}>
                      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
                          {chapter.title}
                        </Typography>
                        <Button size="small">Edit</Button>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
