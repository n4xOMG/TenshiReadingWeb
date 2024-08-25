import { Box, CircularProgress, Container, Grid, Link, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { getAllBookAction } from "../../redux/book/book.action";
import { getWebPUrl } from "../../utils/cloudinaryHandlePNG";
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

function duplicateImages(images, targetLength) {
  const result = [...images];
  while (result.length < targetLength) {
    result.push(...images.slice(0, targetLength - result.length));
  }
  return result;
}
export default function LandingPage() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const results = await dispatch(getAllBookAction());
        const shuffledBooks = shuffleArray(results.payload);
        const booksToDisplay = duplicateImages(shuffledBooks, 8).slice(0, 8);
        setBooks(booksToDisplay);
      } catch (error) {
        console.log("Error getting books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [dispatch]);

  const firstSectionBooks = books.length ? books.slice(0, 4) : [];
  const secondSectionBooks = books.length ? books.slice(4, 8) : [];
  return (
    <Box component="main" sx={{ flex: 1 }}>
      {loading || !books ? (
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
          <CircularProgress />
        </Box>
      ) : (
        <Box component="section" sx={{ width: "100%", py: { xs: 1, md: 3, lg: 5 }, backgroundColor: "background.paper" }}>
          <Container sx={{ display: "grid", gap: 8, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" }, gap: { lg: 16 } }}>
            <Box>
              <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
                The Angel Next Door Spoils Me Rotten
              </Typography>
              <Typography variant="body1" sx={{ mt: 4, maxWidth: 600, color: "text.secondary", lineHeight: 1.75 }}>
                Mahiru is a beautiful girl whose classmates all call her an “angel.” Not only is she a star athlete with perfect
                grades—she’s also drop-dead gorgeous. Amane, an average guy and self-admitted slob, has never thought much of the divine
                beauty, despite attending the same school. Everything changes, however, when he happens to see Mahiru sitting alone in a
                park during a rainstorm. Thus begins the strange relationship between this incredibly unlikely pair!
              </Typography>
              <Box sx={{ mt: 6 }}>
                <Link
                  href="#"
                  sx={{
                    display: "inline-flex",
                    height: 40,
                    alignItems: "center",
                    justifyContent: "center",
                    borderRadius: 1,
                    backgroundColor: "primary.main",
                    px: 6,
                    fontSize: "0.875rem",
                    fontWeight: "medium",
                    color: "primary.contrastText",
                    boxShadow: 1,
                    transition: "background-color 0.3s",
                    "&:hover": { backgroundColor: "primary.dark" },
                    "&:focus-visible": { outline: "none", ring: 1, ringColor: "primary.main" },
                    "&:disabled": { pointerEvents: "none", opacity: 0.5 },
                  }}
                >
                  Go enjoy the fluffs!
                </Link>
              </Box>
            </Box>
            <Grid container spacing={4}>
              {firstSectionBooks.map((book, index) => (
                <Grid item xs={6} key={index}>
                  <picture>
                    <source srcSet={getWebPUrl(book.bookCover)} type="image/webp" />
                    <img
                      src={book.bookCover}
                      alt={book.title}
                      loading="lazy"
                      style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
                    />
                  </picture>
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      <Box component="section" sx={{ width: "100%", py: { xs: 12, md: 24, lg: 32 } }}>
        <Container sx={{ display: "grid", gap: 8, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" }, gap: { lg: 16 } }}>
          <Grid container spacing={4}>
            {secondSectionBooks.map((book, index) => (
              <Grid item xs={6} key={index}>
                <picture>
                  <source srcSet={getWebPUrl(book.bookCover)} type="image/webp" />
                  <img
                    src={book.bookCover}
                    alt={book.title}
                    loading="lazy"
                    style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
                  />
                </picture>
              </Grid>
            ))}
          </Grid>
          <Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
              Explore the Gallery
            </Typography>
            <Typography variant="body1" sx={{ mt: 4, maxWidth: 600, color: "text.secondary", lineHeight: 1.75 }}>
              Discover the captivating artwork and illustrations that bring the enchanted world to life. Browse through our extensive
              gallery to immerse yourself in the magical visuals that complement the series.
            </Typography>
            <Box sx={{ mt: 6 }}>
              <Link
                href="#"
                sx={{
                  display: "inline-flex",
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  backgroundColor: "primary.main",
                  px: 6,
                  fontSize: "0.875rem",
                  fontWeight: "medium",
                  color: "primary.contrastText",
                  boxShadow: 1,
                  transition: "background-color 0.3s",
                  "&:hover": { backgroundColor: "primary.dark" },
                  "&:focus-visible": { outline: "none", ring: 1, ringColor: "primary.main" },
                  "&:disabled": { pointerEvents: "none", opacity: 0.5 },
                }}
              >
                View Gallery
              </Link>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
