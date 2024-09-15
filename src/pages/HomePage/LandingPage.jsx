import { Box, Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import LazyLoad from "react-lazyload";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";

export default function LandingPage() {
  const firstSectionImages = [
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405683/LN_V1_Cover_zgaqma.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405683/LN_V2_Cover_ulgkj3.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405682/LN_V3_Cover_qz78il.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405777/LN_V4_Cover_lle0fy.webp",
    },
  ];

  const secondSectionImages = [
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405457/devilish_Mahiru_z2qfjf.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405457/Mahiru_sitting_on_the_desk_bccqmn.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405457/Summer_Mahiru_u00vzs.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1726405460/Mahiru_at_the_beach_dpyvyj.jpg",
    },
  ];

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Box component="section" sx={{ width: "100%", py: { xs: 1, md: 3, lg: 5 }, backgroundColor: "background.paper" }}>
        <Container sx={{ display: "grid", gap: { xs: 4, md: 6, lg: 16 }, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" } }}>
          <Box>
            <Typography variant="h3" component="h2" sx={{ fontWeight: "bold", lineHeight: 1.2 }}>
              The Angel Next Door Spoils Me Rotten
            </Typography>
            <Typography variant="body1" sx={{ mt: 4, maxWidth: 600, color: "text.secondary", lineHeight: 1.75 }}>
              Mahiru is a beautiful girl whose classmates all call her an “angel.” Not only is she a star athlete with perfect grades—she’s
              also drop-dead gorgeous. Amane, an average guy and self-admitted slob, has never thought much of the divine beauty, despite
              attending the same school. Everything changes, however, when he happens to see Mahiru sitting alone in a park during a
              rainstorm. Thus begins the strange relationship between this incredibly unlikely pair!
            </Typography>
            <Box sx={{ mt: 6 }}>
              <Link
                href="/books"
                sx={{
                  display: "inline-flex",
                  height: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: 1,
                  backgroundColor: "primary.main",
                  px: 6,
                  mb: 2,
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
            {firstSectionImages.map((image, index) => (
              <Grid item xs={6} key={index}>
                <LazyLoad height={50} offset={50}>
                  <img
                    src={getOptimizedImageUrl(image.url, 300)}
                    alt="Nothing"
                    style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
                  />
                </LazyLoad>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box component="section" sx={{ width: "100%", py: { xs: 12, md: 24, lg: 32 } }}>
        <Container sx={{ display: "grid", gap: { xs: 6, md: 8, lg: 16 }, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" } }}>
          <Grid container spacing={4}>
            {secondSectionImages.map((image, index) => (
              <Grid item xs={6} key={index}>
                <img
                  src={getOptimizedImageUrl(image.url, 300)}
                  alt="Nothing"
                  style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
                />
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
                href="/gallery"
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
