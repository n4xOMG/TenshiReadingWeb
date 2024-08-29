import { Box, LinearProgress, List, ListItem, ListItemText, Typography } from "@mui/material";

export const ChapterList = ({ chapters, progresses, onNavigate, bookId }) => (
  <Box sx={{ mb: 6 }}>
    <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
      Chapters
    </Typography>
    <List sx={{ spaceY: 2 }}>
      {chapters?.map((chapter, index) => {
        const progress = Array.isArray(progresses) ? progresses.find((p) => Number(p.chapterId) === Number(chapter.id)) : null;
        return (
          <ListItem
            key={index}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              p: 2,
              borderRadius: 2,
              transition: "all 0.2s ease-in-out",
              height: 60,
              "&:hover": {
                backgroundColor: "grey.100",
                boxShadow: 3,
                transform: "scale(1.02)",
                cursor: "pointer",
              },
            }}
            onClick={() => onNavigate(`/books/${bookId}/chapters/${chapter.id}`)}
          >
            <ListItemText primary={chapter.title} />
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <LinearProgress
                variant="determinate"
                value={progress ? progress.progress : 0}
                sx={{
                  width: 100,
                  mr: 2,
                  "& .MuiLinearProgress-root": {
                    backgroundColor: "gray",
                  },
                  "& .MuiLinearProgress-bar": {
                    backgroundColor: "black",
                  },
                }}
              />
            </Box>
          </ListItem>
        );
      })}
    </List>
  </Box>
);
