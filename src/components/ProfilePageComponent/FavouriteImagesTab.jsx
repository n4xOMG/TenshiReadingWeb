import { Box, Card, CardContent, CardHeader } from "@mui/material";
import React from "react";
export default function FavouriteImagesTab({ favouriteImages, setSelectedImage }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Favorite Images" subheader="Visual inspirations from your reading." />
      <CardContent>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr 1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
          {favouriteImages?.map((img, index) => (
            <img
              key={index}
              onClick={() => setSelectedImage(img)}
              src={img.imageUrl}
              alt={`Favorite ${index + 1}`}
              style={{ width: "100%", height: "auto", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.1)" }}
            />
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
