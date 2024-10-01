import { ChevronLeft, ChevronRight, Fullscreen, Layers, MenuBook } from "@mui/icons-material";
import HomeIcon from "@mui/icons-material/Home";
import ListIcon from "@mui/icons-material/List";
import { Box, Fade, IconButton, Menu, MenuItem, Tooltip, useMediaQuery, useTheme } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import React from "react";
const viewModeIcon = {
  single: <Layers />,
  double: <MenuBook />,
};
const themeModeIcon = {
  light: <LightModeIcon />,
  dark: <DarkModeIcon />,
};
export default function FloatingMenu({
  anchorEl,
  bookId,
  currentChapterId,
  open,
  chapters,
  viewMode,
  themeMode,
  onChapterListOpen,
  onChapterListClose,
  onViewModeChange,
  onThemeModeChange,
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

  const handleViewModeChange = () => {
    const modes = ["single"];
    if (!isSmallScreen) {
      modes.push("double");
    }
    const currentIndex = modes.indexOf(viewMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onViewModeChange(modes[nextIndex]);
  };

  const handleThemeModeChange = () => {
    const modes = ["light", "dark"];
    const currentIndex = modes.indexOf(themeMode);
    const nextIndex = (currentIndex + 1) % modes.length;
    onThemeModeChange(modes[nextIndex]);
  };

  const currentChapterIndex = chapters.findIndex((chapter) => chapter.id === currentChapterId);

  return (
    <Fade in={open}>
      <Box
        sx={{
          position: "fixed",
          bottom: { xs: "20%", sm: "15%", md: "10%", lg: "5%" },
          left: "50%",
          transform: "translateX(-50%)",
          bgcolor: "#050505",
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
        <Tooltip
          title={
            <>
              <p>Previous chapter</p>
            </>
          }
        >
          <IconButton
            onClick={() => onChapterChange(chapters[currentChapterIndex - 1].id)}
            disabled={currentChapterIndex === 0}
            aria-label="Previous chapter"
            sx={{ color: "white", "&.Mui-disabled": { color: "grey" } }}
          >
            <ChevronLeft />
          </IconButton>
        </Tooltip>

        <Tooltip
          title={
            <>
              <p>Chapter List</p>
            </>
          }
        >
          <IconButton onClick={onChapterListOpen} aria-label="Chapters list" sx={{ color: "white" }}>
            <ListIcon />
          </IconButton>
        </Tooltip>

        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={onChapterListClose}>
          {chapters.map((chapter) => (
            <MenuItem
              key={chapter.id}
              onClick={() => {
                onChapterChange(chapter.id);
                onChapterListClose();
              }}
              sx={{ color: "black" }}
            >
              {chapter.chapterNum} {": " + chapter.title}
            </MenuItem>
          ))}
        </Menu>

        {viewMode && (
          <Tooltip
            title={
              <>
                <p>Change view mode</p>
                <p style={{ fontSize: "0.875rem", color: "text.secondary" }}>Current view mode: {viewMode}</p>
              </>
            }
          >
            <IconButton aria-label={`Current view mode: ${viewMode}`} onClick={handleViewModeChange} sx={{ color: "white" }}>
              {viewModeIcon[viewMode]}
            </IconButton>
          </Tooltip>
        )}
        {themeMode && (
          <Tooltip
            title={
              <>
                <p>Change theme mode</p>
                <p style={{ fontSize: "0.875rem", color: "text.secondary" }}>Current theme: {themeMode}</p>
              </>
            }
          >
            <IconButton
              aria-label={`Current theme: ${themeMode}`}
              onClick={handleThemeModeChange}
              sx={{ color: "white", "&.Mui-disabled": { color: "grey" } }}
            >
              {themeModeIcon[themeMode]}
            </IconButton>
          </Tooltip>
        )}

        <Tooltip title={<p>Back to book detail page</p>}>
          <IconButton onClick={onNavigate} aria-label="Back to Book Page" sx={{ color: "white" }}>
            <HomeIcon />
          </IconButton>
        </Tooltip>
        <Tooltip title={<p>Enter fullscreen mode</p>}>
          <IconButton onClick={handleFullScreen} aria-label="Full Screen" sx={{ color: "white" }}>
            <Fullscreen />
          </IconButton>
        </Tooltip>
        <Tooltip title={<p>Next chapter</p>}>
          <IconButton
            onClick={() => onChapterChange(chapters[currentChapterIndex + 1].id)}
            disabled={currentChapterIndex === chapters.length - 1}
            aria-label="Next chapter"
            sx={{ color: "white", "&.Mui-disabled": { color: "grey" } }}
          >
            <ChevronRight />
          </IconButton>
        </Tooltip>
      </Box>
    </Fade>
  );
}
