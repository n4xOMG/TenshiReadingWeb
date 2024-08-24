import { Button, Card, CardContent, Grid, Typography } from "@mui/material";
import React from "react";

export const ChapterItem = React.memo(({ chapter, onEdit, onDelete, style }) => {
  return (
    <Grid item xs={12} style={style}>
      <Card sx={{ "&:hover": { bgcolor: "grey.300" }, transition: "background-color 0.3s" }}>
        <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="subtitle1" sx={{ fontWeight: "medium" }}>
            {chapter.title}
          </Typography>
          <Button
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onEdit(chapter);
            }}
          >
            Edit
          </Button>
          <Button
            size="small"
            onClick={(event) => {
              event.stopPropagation();
              onDelete(chapter);
            }}
          >
            Delete
          </Button>
        </CardContent>
      </Card>
    </Grid>
  );
});
