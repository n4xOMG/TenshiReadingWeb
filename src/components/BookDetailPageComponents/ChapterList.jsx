import { ExpandLess, ExpandMore } from "@mui/icons-material";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import {
  AppBar,
  Box,
  CircularProgress,
  Collapse,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tabs,
  Typography,
  useTheme,
} from "@mui/material";
import Tab from "@mui/material/Tab";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAdaptedChaptersByBookAndLanguageAction, getChaptersByBookAndLanguageAction } from "../../redux/chapter/chapter.action";
import { TabChapters } from "./ChapterListComponent/TabChapters";
import { TabPanel } from "./ChapterListComponent/TabPanel";
import { getReadingProgressByBookChaptersAndUser } from "../../redux/book/book.action";
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export const ChapterList = ({ languages, onCalculateProgress, onNavigate, bookId, user, onFirstChapterId }) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { chapters, adaptedChapters, progresses = [] } = useSelector((store) => store.chapter);
  const [selectedLanguageId, setSelectedLanguageId] = useState(null); // Initialize to null
  const theme = useTheme();
  const dispatch = useDispatch();

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleClick = () => {
    setOpen(!open);
  };

  const handleLanguageChange = (langId) => {
    if (langId !== selectedLanguageId) {
      // Avoid unnecessary re-fetching
      setSelectedLanguageId(langId);

      setTimeout(() => {
        fetchChapters(langId);
      }, 500); // Delay before fetching chapters
    }
  };

  const fetchChapters = useCallback(
    async (langId) => {
      setLoading(true);

      try {
        await dispatch(getChaptersByBookAndLanguageAction(bookId, langId));
        await dispatch(getAdaptedChaptersByBookAndLanguageAction(bookId, langId));
      } catch (error) {
        console.error("Error fetching chapters:", error);
      } finally {
        setLoading(false);
      }
    },
    [bookId, dispatch]
  );

  useEffect(() => {
    if (selectedLanguageId) {
      fetchChapters(selectedLanguageId);
    } else {
      setSelectedLanguageId(3); // Set the default language id to 3 once during initialization
    }
  }, [selectedLanguageId, fetchChapters]);

  useEffect(() => {
    if (user) {
      dispatch(getReadingProgressByBookChaptersAndUser(user.id, chapters));
    }
    if (chapters?.length > 0) {
      onFirstChapterId(chapters[0].id);
    }
  }, [chapters, dispatch, onFirstChapterId, user]);

  useEffect(() => {
    onCalculateProgress(chapters, progresses);
  }, [chapters, progresses, onCalculateProgress]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Box sx={{ mb: 6 }}>
          <List>
            <ListItemButton onClick={handleClick}>
              <ListItemIcon>
                <GTranslateIcon />
              </ListItemIcon>
              <ListItemText primary="Available Languages" />
              {open ? <ExpandLess /> : <ExpandMore />}
            </ListItemButton>
            <Collapse in={open} timeout="auto" unmountOnExit>
              {languages?.length > 0 ? (
                <List component="div" disablePadding>
                  {languages.map((lang) => (
                    <ListItemButton
                      key={lang.id}
                      sx={{ pl: 4 }}
                      onClick={() => handleLanguageChange(lang.id)}
                      selected={lang.id === selectedLanguageId} // Highlight the selected language
                    >
                      <ListItemText primary={lang.countryCode + " - " + lang.name} />
                    </ListItemButton>
                  ))}
                </List>
              ) : (
                <div>No languages available</div>
              )}
            </Collapse>
          </List>
          <Typography variant="h5" sx={{ mb: 2, textAlign: "left", fontWeight: "bold" }}>
            Chapters
          </Typography>

          <AppBar position="static" sx={{ boxShadow: "none" }}>
            <Tabs
              value={value}
              onChange={handleChange}
              indicatorColor="blue"
              textColor="black"
              variant="fullWidth"
              aria-label="Chapters tab"
              sx={{ backgroundColor: "grey.200" }}
            >
              <Tab label="All" {...a11yProps(0)} sx={{ color: "black", borderRight: 1, borderColor: "darkgrey" }} />
              <Tab label="Anime Adapted" {...a11yProps(1)} sx={{ color: "black" }} />
            </Tabs>
          </AppBar>

          <TabPanel value={value} index={0} dir={theme.direction}>
            <TabChapters chapters={chapters} progresses={progresses} onNavigate={onNavigate} bookId={bookId} />
          </TabPanel>
          <TabPanel value={value} index={1} dir={theme.direction}>
            <TabChapters chapters={adaptedChapters} progresses={progresses} onNavigate={onNavigate} bookId={bookId} />
          </TabPanel>
        </Box>
      )}
    </>
  );
};
