import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import BrushIcon from "@mui/icons-material/Brush";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import CloseIcon from "@mui/icons-material/Close";
import DehazeIcon from "@mui/icons-material/Dehaze";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { Box, Button, Card, CardContent, CircularProgress, Drawer, IconButton, Typography, useMediaQuery, useTheme } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBookAction } from "../../redux/book/book.action";
import { getWebPUrl } from "../../utils/cloudinaryHandlePNG";
import { formatDate } from "../../utils/formatDate";

export default function BooksPage() {
  const { books } = useSelector((store) => store.book);
  const [selectedBook, setSelectedBook] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isSmallScreen);
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const bookRef = useRef();
  const [showFullDescription, setShowFullDescription] = useState(false);
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
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

    fetchBooks();
  }, [dispatch]);
  const handleBookSelect = (book) => {
    setSelectedBook(book);
    bookRef.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, minHeight: "100vh", bgcolor: "background.default" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          <Drawer
            variant={isSmallScreen ? "temporary" : "persistent"}
            anchor="left"
            open={isSidebarOpen}
            onClose={() => setIsSidebarOpen(false)}
            sx={{
              "& .MuiDrawer-paper": {
                width: { xs: "100%", md: "20rem" },
                padding: 3,
                borderRight: 1,
                borderColor: "divider",
                backgroundColor: "background.default",
                transition: "all 0.3s ease-in-out",
                position: { xs: "fixed", md: "relative" },
                zIndex: { xs: 40, md: "auto" },
              },
            }}
          >
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
              <Button variant="text" onClick={() => navigate("/")} sx={{ justifyContent: "flex-start", textAlign: "left", color: "black" }}>
                <ArrowBackIcon sx={{ marginRight: 1, height: 16, width: 16 }} />
                Back to Home
              </Button>
              <IconButton
                onClick={() => setIsSidebarOpen(false)}
                sx={{
                  zIndex: 2,
                  backgroundColor: "white",
                  border: "1px solid",
                  borderColor: "grey.300",
                  "&:hover": {
                    backgroundColor: "grey.100",
                  },
                }}
              >
                <CloseIcon />
              </IconButton>
            </Box>

            <Box sx={{ height: "calc(100vh - 2rem)" }}>
              <Typography variant="h4" sx={{ fontWeight: "bold", marginBottom: 1, textAlign: "left" }}>
                The Angle Next Door Spoils Me Rotten
              </Typography>
              <Typography variant="body2" color="textSecondary" sx={{ marginBottom: 2, textAlign: "left" }}>
                by Saekisan
              </Typography>

              <Box sx={{ display: "flex", alignItems: "center", marginBottom: 2, textAlign: "left" }}>
                <IconButton sx={{ color: "#facc15", marginRight: 1, height: 20, width: 20 }}>
                  <StarBorderIcon sx={{ color: "#facc15" }} />
                </IconButton>

                <Typography variant="body1" sx={{ fontWeight: "bold", textAlign: "left" }}>
                  4.7
                </Typography>
                <Typography variant="body2" color="textSecondary" sx={{ marginLeft: 1, textAlign: "left" }}>
                  Series Rating
                </Typography>
              </Box>

              <Typography variant="body2" sx={{ marginBottom: 3, textAlign: "left" }}>
                Mahiru is a beautiful girl whose classmates all call her an “angel.” Not only is she a star athlete with perfect
                grades—she’s also drop-dead gorgeous. Amane‚ an average guy and self-admitted slob‚ has never thought much of the divine
                beauty‚ despite attending the same school. Everything changes‚ however‚ when he happens to see Mahiru sitting alone in a
                park during a rainstorm. Thus begins the strange relationship between this incredibly unlikely pair!
              </Typography>

              <Box sx={{ marginBottom: 3, textAlign: "left" }}>
                <Typography variant="subtitle1" sx={{ fontWeight: "bold", marginBottom: 1, textAlign: "left" }}>
                  Series Information
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1, textAlign: "left" }}>
                  <strong>Total Books:</strong> 10
                </Typography>
                <Typography variant="body2" sx={{ marginBottom: 1, textAlign: "left" }}>
                  <strong>First Published:</strong>{" "}
                  {books.length > 0 && books[0].publishDate ? `${formatDate(books[0].publishDate)}` : "No publish date"}
                </Typography>
                <Typography variant="body2" sx={{ textAlign: "left" }}>
                  <strong>Latest Book:</strong>{" "}
                  {books.length > 0
                    ? `${books[books.length - 1]?.title} (${formatDate(books[books.length - 1]?.publishDate)})`
                    : "No books available"}
                </Typography>
              </Box>
            </Box>
          </Drawer>
          {!isSidebarOpen && (
            <IconButton
              onClick={() => setIsSidebarOpen(true)}
              sx={{
                position: "fixed",
                top: 16,
                left: 16,
                zIndex: 3,
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
          )}
          <Box component="main" sx={{ flex: 1, p: { xs: 4, md: 6 }, overflow: "auto", pt: { xs: 8, md: 6 } }}>
            {selectedBook ? (
              <>
                <Typography variant="h3" sx={{ mb: 6, textAlign: "left" }} ref={bookRef}>
                  {selectedBook.title}
                </Typography>
                <Box
                  sx={{
                    alignItems: "center",
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
                    gap: 6,
                    px: 4,
                    justifyContent: { xs: "center", md: "start" },
                  }}
                >
                  {/* Book Cover */}
                  <Card sx={{ overflow: "hidden", maxWidth: { xs: "100%", md: "300px" }, mx: { xs: "auto", md: 0 } }}>
                    <img
                      src={selectedBook.bookCover}
                      alt={`Cover of ${selectedBook.title}`}
                      style={{ width: "100%", height: "auto", objectFit: "cover" }}
                    />
                  </Card>

                  {/* Book Information */}
                  <Card>
                    <CardContent sx={{ p: 4 }}>
                      <Typography variant="h5" sx={{ mb: 2, textAlign: "left" }}>
                        Book Information
                      </Typography>
                      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                        <li style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", textAlign: "left" }}>
                          <CalendarTodayIcon sx={{ mr: 2, height: 24, width: 24 }} />
                          <span>Published in: {formatDate(selectedBook.uploadDate)}</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", textAlign: "left" }}>
                          <PersonOutlineIcon sx={{ mr: 2, height: 24, width: 24 }} />
                          <span>{selectedBook.authorName}</span>
                        </li>
                        <li style={{ display: "flex", alignItems: "center", marginBottom: "0.5rem", textAlign: "left" }}>
                          <BrushIcon sx={{ mr: 2, height: 24, width: 24 }} />
                          <span>{selectedBook.artistName}</span>
                        </li>
                      </ul>

                      <Box sx={{ mb: 4, textAlign: "left" }}>
                        <Typography variant="h6" sx={{ mb: 1, textAlign: "left" }}>
                          Description
                        </Typography>
                        <Typography variant="body2" sx={{ textAlign: "left" }}>
                          {showFullDescription && selectedBook.description
                            ? selectedBook.description
                            : `${selectedBook.description?.slice(0, 200)}...`}
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
                      </Box>

                      <Button
                        variant="contained"
                        sx={{
                          width: "100%",
                          mt: 4,
                          backgroundColor: "black",
                          color: "white",
                          height: 50,
                          borderRadius: 2,
                          "&:hover": {
                            backgroundColor: "darkgray",
                          },
                        }}
                        size="large"
                        onClick={() => navigate(`/books/${selectedBook.id}`)}
                      >
                        Read Now
                      </Button>
                    </CardContent>
                  </Card>
                </Box>
              </>
            ) : (
              <Typography variant="h5" sx={{ mt: 8, mb: 4, textAlign: "left" }}>
                No book selected
              </Typography>
            )}
            <Typography variant="h5" sx={{ mt: 8, mb: 4, textAlign: "left" }}>
              All Books in the Series
            </Typography>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr 1fr", sm: "1fr 1fr 1fr", lg: "1fr 1fr 1fr 1fr" },
                gap: { xs: 4, md: 6 },
              }}
            >
              {books?.map((book) => (
                <Card
                  key={book.id}
                  sx={{ overflow: "hidden", transition: "all 0.3s", "&:hover": { boxShadow: 6 }, cursor: "pointer" }}
                  onClick={() => handleBookSelect(book)}
                >
                  <picture>
                    <source srcSet={getWebPUrl(book.bookCover)} type="image/webp" />
                    <img
                      src={book.bookCover}
                      alt={`Cover of ${book.title}`}
                      loading="lazy"
                      style={{ width: "100%", height: "10rem", objectFit: "cover" }}
                    />
                  </picture>
                  <CardContent sx={{ p: { xs: 3, md: 4 }, textAlign: "left" }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: "bold", textAlign: "left" }}>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" color="textSecondary" sx={{ textAlign: "left" }}>
                      {formatDate(book.uploadDate)}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
}
