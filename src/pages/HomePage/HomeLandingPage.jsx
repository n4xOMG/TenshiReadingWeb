import { MenuBook } from "@mui/icons-material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import { Box, Button, Card, CardContent, CardMedia, Rating, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllBookAction, getAvgBookRating } from "../../redux/book/book.action";
import BookCard from "../../components/LandingPageComponents/BookCard";

export default function HomeLandingPage() {
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { books, avgRating } = useSelector((store) => store.book);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBooksInfo = async () => {
      try {
        const results = await dispatch(getAllBookAction());
        if (results.payload.length > 0) {
          setSelectedBook(results.payload[results.payload.length - 1]);
        }
      } catch (error) {
        console.log("Error getting books: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBooksInfo();
  }, [dispatch]);

  useEffect(() => {
    const fetchRating = async () => {
      try {
        if (selectedBook) {
          await dispatch(getAvgBookRating(selectedBook?.id));
        }
      } catch (error) {
        console.log("Error getting books: ", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRating();
  }, [dispatch, selectedBook]);

  const displayedBooks = showAllBooks ? books : books?.slice(0, 4);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "white", color: "black", display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Box sx={{ flexGrow: 1, p: 4 }}>
              {selectedBook ? (
                <>
                  <Box sx={{ mb: 6, textAlign: "left" }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                      Last Updated
                    </Typography>
                    <Card
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", md: "row" },
                        borderColor: "grey.200",
                        alignItems: "flex-start",
                      }}
                    >
                      <CardMedia
                        component="img"
                        sx={{ width: { xs: "100%", md: "33%" }, height: 300 }}
                        image={selectedBook.bookCover}
                        alt="Book cover"
                      />
                      <CardContent sx={{ width: { xs: "100%", md: "67%" }, alignItems: "flex-start", textAlign: "left", pb: 5, px: 5 }}>
                        <Typography variant="h5">{selectedBook.title}</Typography>
                        <Typography variant="subtitle1" color="textSecondary">
                          By {selectedBook.authorName} | Illustrated by {selectedBook.artistName}
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: "left", mt: 3 }}>
                          {showFullDescription && selectedBook.description
                            ? selectedBook.description
                            : `${selectedBook.description?.slice(0, 100)}...`}
                        </Typography>
                        {selectedBook.description?.length > 200 && (
                          <Button
                            variant="text"
                            onClick={() => setShowFullDescription(!showFullDescription)}
                            sx={{ mt: 1, p: 0, textAlign: "left" }}
                          >
                            {showFullDescription ? "Read Less" : "Read More"}
                          </Button>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", mt: 2 }}>
                          <Rating name="read-only" value={avgRating ? avgRating : 5} readOnly />
                          <Typography variant="body2" color="textSecondary" sx={{ ml: 1 }}>
                            ({avgRating ? avgRating : 5} out of 5)
                          </Typography>
                        </Box>
                        <Button
                          variant="contained"
                          color="primary"
                          sx={{
                            mt: 3,
                            backgroundColor: "black",
                            color: "white",
                            borderRadius: 2,
                            alignSelf: "flex-start",
                            "&:hover": {
                              backgroundColor: "#fdf6e3",
                              color: "black",
                            },
                          }}
                          onClick={() => navigate(`/books/${selectedBook.id}`)}
                        >
                          <MenuBook sx={{ mr: 1 }} /> Read Now
                        </Button>
                      </CardContent>
                    </Card>
                  </Box>
                </>
              ) : (
                <Typography variant="h5" sx={{ mt: 8, mb: 4, textAlign: "left" }}>
                  Loading
                </Typography>
              )}

              <Box sx={{ mb: 6 }}>
                <Typography variant="h4" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
                  More Books
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr 1fr" }, gap: 2 }}>
                  {displayedBooks?.map((book, index) => (
                    <BookCard book={book} key={index} />
                  ))}
                </Box>
                {!showAllBooks && (
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 3,
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: 2,
                        alignSelf: "flex-start",
                        "&:hover": {
                          backgroundColor: "#fdf6e3",
                          color: "black",
                        },
                      }}
                      onClick={() => setShowAllBooks(true)}
                    >
                      Show More <ExpandMoreIcon sx={{ ml: 1 }} />
                    </Button>
                  </Box>
                )}
                {showAllBooks && (
                  <Box sx={{ textAlign: "center", mt: 3 }}>
                    <Button
                      variant="contained"
                      sx={{
                        mt: 3,
                        backgroundColor: "black",
                        color: "white",
                        borderRadius: 2,
                        alignSelf: "flex-start",
                        "&:hover": {
                          backgroundColor: "#fdf6e3",
                          color: "black",
                        },
                      }}
                      onClick={() => setShowAllBooks(false)}
                    >
                      Show Less <ExpandLessIcon sx={{ ml: 1 }} />
                    </Button>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Box>
      )}
    </>
  );
}
