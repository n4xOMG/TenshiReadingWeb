import { Box, Button, Card, CardContent, CardMedia, Chip, Typography } from "@mui/material";
import React from "react";
import LanguageIcon from "@mui/icons-material/Language";
import { useNavigate } from "react-router-dom";
import { MenuBook } from "@mui/icons-material";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
function truncateDescription(description, wordLimit) {
  if (!description) return "";
  const words = description.split(" ");
  if (words.length <= wordLimit) return description;
  return words.slice(0, wordLimit).join(" ") + "...";
}

export default function BookCard({ book }) {
  const navigate = useNavigate();
  const languages = book.languages?.map((language) => language.name).join(", ");

  return (
    <Card sx={{ maxWidth: 400, overflow: "hidden", cursor: "pointer" }} onClick={() => navigate(`/books/${book.id}`)}>
      <Box sx={{ position: "relative", height: 200, overflow: "hidden", textAlign: "left" }}>
        <CardMedia
          component="img"
          alt={`Cover of ${book.title}`}
          height="200"
          image={getOptimizedImageUrl(book.bookCover)}
          sx={{ objectFit: "cover" }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: "100%",
            background: "linear-gradient(to top, rgba(0, 0, 0, 0.7), transparent)",
            zIndex: 1,
          }}
        />
        <Box sx={{ position: "absolute", bottom: 0, left: 0, right: 0, p: 2, zIndex: 2 }}>
          <Typography variant="h6" sx={{ color: "white" }}>
            {book.title}
          </Typography>
          <Typography variant="body2" sx={{ color: "white" }}>
            by <span style={{ fontWeight: "bold", color: "#FFD700" }}>{book.authorName}</span> {book.artistName && `• Illustrated by `}
            {book.artistName && <span style={{ fontWeight: "bold", color: "#FFD700" }}>{book.artistName}</span>}
          </Typography>
        </Box>
      </Box>
      <CardContent>
        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1, mb: 2, fontWeight: "bold" }}>
          {book.categories?.map((category, index) => (
            <Chip key={index} label={category.name} variant="outlined" />
          ))}
        </Box>
        <Typography
          variant="body2"
          sx={{
            color: "text.secondary",
            mb: 2,
            height: 60,
            overflow: "hidden",
            textOverflow: "ellipsis",
            textAlign: "left",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {truncateDescription(book.description, 20)}
        </Typography>
        <Box>
          <Typography variant="subtitle2" sx={{ my: 1, textAlign: "left", fontWeight: "bold" }}>
            Available Languages:
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <LanguageIcon sx={{ fontSize: 16, color: "gray.500" }} />
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {languages}
            </Typography>
          </Box>
        </Box>
      </CardContent>
      <Box sx={{ p: 2 }}>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "black",
            color: "white",
            borderRadius: 2,
            "&:hover": {
              backgroundColor: "#fdf6e3",
              color: "black",
            },
          }}
          fullWidth
        >
          <MenuBook sx={{ mr: 1 }} /> Read Now
        </Button>
      </Box>
    </Card>
  );
}
