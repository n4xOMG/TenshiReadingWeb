import { Box, Card, CardContent, CardHeader, Typography } from "@mui/material";
import React from "react";
export default function FavouriteBooksTab({ favouriteBooks }) {
  return (
    <Card sx={{ mb: 4 }}>
      <CardHeader title="Favorite Books" subheader="Your top picks from your reading journey." />
      <CardContent>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr", lg: "1fr 1fr 1fr" }, gap: 4 }}>
          {favouriteBooks?.map((book, index) => (
            <Box key={index} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2 }}>
              <img
                src={book.bookCover}
                alt={`Cover of ${book.title}`}
                style={{
                  width: "128px",
                  height: "192px",
                  objectFit: "cover",
                  borderRadius: "8px",
                  boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                }}
              />
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="body1" sx={{ fontWeight: "medium" }}>
                  {book.title}
                </Typography>
                <Typography variant="body2" color="textSecondary">
                  {book.authorName}
                </Typography>
              </Box>
            </Box>
          ))}
        </Box>
      </CardContent>
    </Card>
  );
}
