import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { Box, Card, Grid, IconButton, Typography } from "@mui/material";
import React from "react";
import LazyLoad from "react-lazyload";
import { getOptimizedImageUrl, getResponsiveImageUrl } from "../../../utils/optimizeImages";
export const BookItem = React.memo(({ book, onSelect, onEdit, onDelete, style }) => {
  return (
    <Grid item xs={12} style={style}>
      <Card
        sx={{
          "&:hover": { bgcolor: "grey.300" },
          transition: "background-color 0.3s",
          cursor: "pointer",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }} onClick={() => onSelect(book.id)}>
          <LazyLoad height={200} offset={100}>
            <img
              src={getOptimizedImageUrl(book.bookCover)}
              alt={`Cover of ${book.title}`}
              loading="lazy"
              width={80}
              height={120}
              style={{
                borderRadius: "4px",
                marginRight: "16px",
                aspectRatio: "80/120",
                objectFit: "cover",
              }}
            />
          </LazyLoad>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
              {book.title}
            </Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {book.authorName}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onEdit(book);
              }}
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              onClick={(event) => {
                event.stopPropagation();
                onDelete(book);
              }}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
      </Card>
    </Grid>
  );
});
