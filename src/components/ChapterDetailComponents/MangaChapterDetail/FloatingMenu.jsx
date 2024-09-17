import { ChevronLeft, ChevronRight, Fullscreen, Layers, MenuBook } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import { Box, Fade, IconButton, Menu, MenuItem, useMediaQuery, useTheme } from "@mui/material";
import React from "react";
const viewModeIcon = {
  single: <Layers />,
  double: <MenuBook />,
};
export default function FloatingMenu({
  anchorEl,
  bookId,
  currentChapterId,
  open,
  chapters,
  viewMode,
  onChapterListOpen,
  onChapterListClose,
  onViewModeChange,
  onChapterChange,
  onNavigate,
}) {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleFullScreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      document.documentElement.requestFullscreen();
    }
  };

  // Handle view mode change
  const handleViewModeChange = () => {
    const modes = ["single"];
    if (!isSmallScreen) {
      modes.push("double");
    }
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onViewModeChange(modes[nextIndex]);
  };

  return (
    <>
      <Fade in={open}>
        <Box
          sx={{
            position: "fixed",
            bottom: { xs: "25%", sm: "25%", md: "15%", lg: "15%" },
            left: "50%",
            transform: "translateX(-50%)",
            bgcolor: "background.paper",
            backdropFilter: "blur(10px)",
            borderRadius: 2,
            boxShadow: 3,
            p: { xs: 1, sm: 2 },
            display: "flex",
            alignItems: "center",
            gap: 1,
            zIndex: (theme) => theme.zIndex.drawer + 2,
            height: "auto",
          }}
        >
          <IconButton onClick={() => onChapterChange(currentChapterId - 1)} disabled={currentChapterId === 1} aria-label="Previous chapter">
            <ChevronLeft />
          </IconButton>

          <IconButton onClick={onChapterListOpen} aria-label="Chapters list">
            <ListIcon />
          </IconButton>

          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onChapterListClose}>
            {chapters.map((chapter) => (
              <MenuItem
                key={chapter.id}
                onClick={() => {
                  onChapterChange(chapter.id);
                  onChapterListClose();
                }}
              >
                {chapter.title}
              </MenuItem>
            ))}
          </Menu>

          {/* Use viewModeIcon button to change view mode */}
          <IconButton aria-label={`Current view mode: ${viewMode}`} onClick={handleViewModeChange}>
            {viewModeIcon[viewMode]}
          </IconButton>

          <IconButton
            onClick={() => onChapterChange(currentChapterId + 1)}
            disabled={currentChapterId === chapters.length}
            aria-label="Next chapter"
          >
            <ChevronRight />
          </IconButton>
          <IconButton onClick={onNavigate} aria-label="Back to Book Page">
            <HomeIcon />
          </IconButton>
          <IconButton onClick={handleFullScreen} aria-label="Full Screen">
            <Fullscreen />
          </IconButton>
        </Box>
      </Fade>
    </>
  );
}
