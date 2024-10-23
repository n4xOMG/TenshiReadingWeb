import ExpandLessIcon from "@mui/icons-material/ExpandLess";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { Box, Button, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import BookCard from "../../components/LandingPageComponents/BookCard";
import LatestBookCard from "../../components/LandingPageComponents/LatestBookCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllBookAction, getLatestUpdateBook } from "../../redux/book/book.action";

export default function HomeLandingPage() {
  const [showAllBooks, setShowAllBooks] = useState(false);
  const [loading, setLoading] = useState(false);
  const { books, latestUpdateBook } = useSelector((store) => store.book, shallowEqual);
  const { user } = useSelector((store) => store.auth, shallowEqual);
  const dispatch = useDispatch();

  const fetchBooksInfo = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([dispatch(getAllBookAction()), dispatch(getLatestUpdateBook())]);
    } catch (error) {
      console.error("Error getting books: ", error);
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    fetchBooksInfo();
  }, [fetchBooksInfo]);

  const displayedBooks = showAllBooks ? books : books?.slice(0, 4);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ minHeight: "100vh", bgcolor: "white", color: "black", display: "flex", flexDirection: "column" }}>
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Box sx={{ flexGrow: 1, p: 4 }}>
              {latestUpdateBook ? (
                <>
                  <Box sx={{ mb: 6, textAlign: "left" }}>
                    <Typography variant="h4" sx={{ mb: 2, fontWeight: "bold" }}>
                      Last Updated
                    </Typography>
                    <LatestBookCard book={latestUpdateBook} user={user} />
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
                      onClick={() => {
                        console.log("Show more books");
                        setShowAllBooks(true);
                      }}
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
                      onClick={() => {
                        console.log("Show less books");
                        setShowAllBooks(false);
                      }}
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
