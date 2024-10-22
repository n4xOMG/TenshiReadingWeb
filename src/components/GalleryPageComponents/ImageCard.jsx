import { Box, Button, Card, CardContent, Chip, Grid, Typography } from "@mui/material";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import { FavoriteBorder } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
export function ImageCard({ img, userFavImages, handleFavoriteToggle, setSelectedImage }) {
  const isFavouredByUser = (imageId) => {
    return userFavImages.some((favImg) => favImg.id === imageId);
  };

  return (
    <Grid item xs={12} md={6} lg={4} key={img.id}>
      <Card sx={{ maxWidth: 345, overflow: "hidden" }}>
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ position: "relative" }}>
            <Box
              component="img"
              onClick={() => setSelectedImage(img)}
              src={getOptimizedImageUrl(img.imageUrl)}
              srcSet={getOptimizedImageUrl(img.imageUrl)}
              alt={img.name}
              sx={{ width: "100%", height: 192, objectFit: "cover", cursor: "pointer" }}
            />
            <Button
              variant="contained"
              size="small"
              sx={{
                position: "absolute",
                top: 8,
                right: 8,
                color: "white",
                bgcolor: "rgba(0, 0, 0, 0.2)",
                "&:hover": {
                  bgcolor: "rgba(0, 0, 0, 0.4)",
                },
                borderRadius: "50%",
                width: 40,
                height: 40,
                minWidth: 0,
              }}
              onClick={() => handleFavoriteToggle(img.id)}
            >
              {isFavouredByUser(img.id) ? <FavoriteIcon sx={{ fontSize: 20, color: "red" }} /> : <FavoriteBorder sx={{ fontSize: 20 }} />}
            </Button>
            <Box sx={{ position: "absolute", bottom: 8, left: 8, display: "flex", flexWrap: "wrap", gap: 1 }}>
              {img.tags.map((tag, index) => (
                <Chip
                  key={index}
                  label={tag.name}
                  variant="outlined"
                  sx={{
                    bgcolor: "rgba(0, 0, 0, 0.5)",
                    color: "white",
                    "&:hover": {
                      bgcolor: "rgba(0, 0, 0, 0.7)",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
          <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
            {img.name}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}
