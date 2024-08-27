import { Box, Container, Grid, Link, Typography } from "@mui/material";
import React from "react";
import { getWebPUrl } from "../../utils/cloudinaryHandlePNG";

export default function LandingPage() {
  const firstSectionImages = [
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772102/V1_ydkbtk.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772070/V6_nj0nmo.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772071/V9_a3nx8a.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772071/V11_myvzyz.jpg",
    },
  ];

  const secondSectionImages = [
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772070/V7_sok4wb.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772070/V8_tbbm0s.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772071/V10_zzldnu.jpg",
    },
    {
      url: "https://res.cloudinary.com/ds2ykbawv/image/upload/v1724772070/V5.5_t4ofef.jpg",
    },
  ];

  return (
    <Box component="main" sx={{ flex: 1 }}>
      <Box component="section" sx={{ width: "100%", py: { xs: 1, md: 3, lg: 5 }, backgroundColor: "background.paper" }}>
        <Container sx={{ display: "grid", gap: 8, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" }, gap: { lg: 16 } }}>
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
            {firstSectionImages.map((image, index) => (
              <Grid item xs={6} key={index}>
                <picture>
                  <source srcSet={getWebPUrl(image.url)} type="image/webp" />
                  <img
                    src={image.url}
                    alt="Nothing"
                    loading="lazy"
                    effect="blur"
                    style={{ borderRadius: "8px", objectFit: "cover", aspectRatio: "1 / 1" }}
                  />
                </picture>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
      <Box component="section" sx={{ width: "100%", py: { xs: 12, md: 24, lg: 32 } }}>
        <Container sx={{ display: "grid", gap: 8, px: { xs: 4, md: 6 }, gridTemplateColumns: { lg: "1fr 1fr" }, gap: { lg: 16 } }}>
          <Grid container spacing={4}>
            {secondSectionImages.map((image, index) => (
              <Grid item xs={6} key={index}>
                <picture>
                  <source srcSet={getWebPUrl(image.url)} type="image/webp" />
                  <img
                    src={image.url}
                    alt="Nothing"
                    loading="lazy"
                    effect="blur"
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
