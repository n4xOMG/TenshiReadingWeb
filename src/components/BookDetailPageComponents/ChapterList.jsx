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
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export const ChapterList = ({ languages, progresses, chapterCounts, onCalculateProgress, onNavigate, bookId, user, onFirstChapterId }) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { chapters, adaptedChapters } = useSelector((store) => store.chapter);
  const [selectedLanguageId, setSelectedLanguageId] = useState(() => {
    return localStorage.getItem("selectedLanguageId") || 3;
  });
  const [selectedLanguage, setSelectedLanguage] = useState(null);
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
      setSelectedLanguageId(langId);
      localStorage.setItem("selectedLanguageId", langId);
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
    setLoading(true);
    setTimeout(() => {
      const lang = languages.find((lang) => lang.id === selectedLanguageId);
      setSelectedLanguage(lang);
      fetchChapters(selectedLanguageId);
    }, 500);
  }, [selectedLanguageId, fetchChapters, onCalculateProgress]);

  useEffect(() => {
    if (user) {
      onCalculateProgress(chapters, progresses);
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
            <ListItemButton onClick={handleClick} sx={{ bgcolor: "primary.main", color: "white", borderRadius: 1, mb: 2 }}>
              <ListItemIcon>
                <GTranslateIcon sx={{ color: "white" }} />
              </ListItemIcon>
              <ListItemText
                primary={selectedLanguage ? `${selectedLanguage.countryCode} - ${selectedLanguage.name}` : "Available Languages"}
                primaryTypographyProps={{ fontWeight: "bold" }}
              />
              {open ? <ExpandLess sx={{ color: "white" }} /> : <ExpandMore sx={{ color: "white" }} />}
            </ListItemButton>
            <Collapse sx={{ bgcolor: "grey.100" }} in={open} timeout="auto" unmountOnExit>
              {languages?.length > 0 ? (
                <List component="div" disablePadding>
                  {languages.map((lang) => (
                    <ListItemButton
                      key={lang.id}
                      sx={{ pl: 4 }}
                      onClick={() => handleLanguageChange(lang.id)}
                      selected={lang.id === selectedLanguageId}
                    >
                      <ListItemText primary={`${lang.countryCode} - ${lang.name} (${chapterCounts[lang.id] || 0} chapters)`} />
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
              indicatorColor="primary"
              textColor="inherit"
              variant="fullWidth"
              aria-label="Chapters tab"
              sx={{
                backgroundColor: "#f9fafb",
                "& .Mui-selected": {
                  backgroundColor: "#f9fafb", // Same as background color
                  color: "black",
                },
                "& .MuiTab-root:not(.Mui-selected)": {
                  backgroundColor: "grey.300",
                  color: "black", // Gray color for non-selected tabs
                },
              }}
            >
              <Tab label="All" {...a11yProps(0)} />
              <Tab label="Anime Adapted" {...a11yProps(1)} />
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
