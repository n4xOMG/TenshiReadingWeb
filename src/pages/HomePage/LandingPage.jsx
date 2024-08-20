import { Box, Card, CardContent, CircularProgress, Container, Grid, Link, Slide, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getAllBookAction } from "../../redux/book/book.action";
import BookItem from "../../components/HomePageComponents/BookItem";
import Slider from "react-slick";
function getSliderSettings(slidesToShow, isDotsNeeded, isInfinite, isAutoPlay) {
  const responsiveSettings = [
    { breakpoint: 1366, slidesToShow: slidesToShow > 1 ? slidesToShow - 1 : slidesToShow },
    { breakpoint: 1280, slidesToShow: slidesToShow > 2 ? slidesToShow - 2 : slidesToShow },
    { breakpoint: 1024, slidesToShow: slidesToShow > 2 ? slidesToShow - 2 : slidesToShow },
    { breakpoint: 600, slidesToShow: 1 },
    { breakpoint: 480, slidesToShow: 1 },
  ];

  return {
    dots: isDotsNeeded,
    infinite: isInfinite,
    autoplay: isAutoPlay,
    autoplaySpeed: 3000,
    cssEase: "linear",
    speed: 500,
    slidesToShow: slidesToShow,
    slidesToScroll: 1,
    initialSlide: 0,
    arrows: false,
    draggable: true,
    mobileFirst: true,
    swipe: true,
    swipeToSlide: true,
    responsive: responsiveSettings.map(({ breakpoint, slidesToShow, initialSlide }) => ({
      breakpoint,
      settings: {
        slidesToShow,
        slidesToScroll: slidesToShow,
        infinite: isInfinite,
        dots: isDotsNeeded,
        ...(initialSlide !== undefined && { initialSlide }),
      },
    })),
  };
}
export default function LandingPage() {
  const [books, setBooks] = useState(null);
  const [loading, setLoading] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    const fetchBooks = async () => {
      setLoading(true);
      try {
        const results = await dispatch(getAllBookAction());
        setBooks(results.payload);
      } catch (error) {
        console.log("Error getting books: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBooks();
  }, [dispatch]);
  return (
    <Box component="main" sx={{ flex: 1 }}>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Box component="section" sx={{ width: "100%", py: { xs: 12, md: 24, lg: 32 } }}>
          <Container sx={{ px: { xs: 4, md: 6 } }}>
            {books && books.length > 0 ? (
              <Slider {...getSliderSettings(4, true, false, false)}>
                {Array.isArray(books) &&
                  books.map((item, i) => (
                    <div className="slider-container" key={i} onClick={() => navigate(`/books/${item.id}`)}>
                      <BookItem item={item} />
                    </div>
                  ))}
              </Slider>
            ) : (
              <Typography variant="h6" component="div" sx={{ textAlign: "center", mt: 4 }}>
                No books available
              </Typography>
            )}
          </Container>
        </Box>
      )}
      <Box component="section" sx={{ width: "100%", py: { xs: 12, md: 24, lg: 32 }, backgroundColor: "background.paper" }}>
        <Container sx={{ display: "grid", gap: 8, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" }, gap: { lg: 16 } }}>
          <Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
              The Enchanted Series
            </Typography>
            <Typography variant="body1" sx={{ mt: 4, maxWidth: 600, color: "text.secondary", lineHeight: 1.75 }}>
              Mahiru is a beautiful girl whose classmates all call her an “angel.” Not only is she a star athlete with perfect grades—she’s
              also drop-dead gorgeous. Amane, an average guy and self-admitted slob, has never thought much of the divine beauty, despite
              attending the same school. Everything changes, however, when he happens to see Mahiru sitting alone in a park during a
              rainstorm. Thus begins the strange relationship between this incredibly unlikely pair!
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
                Explore the Gallery
              </Link>
            </Box>
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Box component="section" sx={{ width: "100%", py: { xs: 12, md: 24, lg: 32 } }}>
        <Container sx={{ display: "grid", gap: 8, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" }, gap: { lg: 16 } }}>
          <Grid container spacing={4}>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
            <Grid item xs={6}>
              <img
                src="/placeholder.svg"
                width="300"
                height="300"
                alt="Book Cover"
                style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
              />
            </Grid>
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
