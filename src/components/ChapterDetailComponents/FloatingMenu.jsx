import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { BottomNavigation, BottomNavigationAction } from "@mui/material";
export const FloatingMenu = ({ onNextChapter, onPreviousChapter }) => (
  <BottomNavigation
    showLabels
    sx={{
      position: "fixed",
      bottom: 0,
      width: "100%",
      zIndex: 3,
      bgcolor: "#202124",
      color: "white",
    }}
  >
    <BottomNavigationAction sx={{ color: "white" }} label="Previous Chapter" icon={<ArrowBackIcon />} onClick={onPreviousChapter} />
    <BottomNavigationAction sx={{ color: "white" }} label="Next Chapter" icon={<ArrowForwardIcon />} onClick={onNextChapter} />
  </BottomNavigation>
);
