import { ExpandLess, ExpandMore } from "@mui/icons-material";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import { AppBar, Box, Collapse, List, ListItemButton, ListItemIcon, ListItemText, Tabs, Typography, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import { TabChapters } from "./ChapterListComponent/TabChapters";
import { TabPanel } from "./ChapterListComponent/TabPanel";
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export const ChapterList = ({ languages, chapters, adaptedChapters, progresses, onNavigate, bookId }) => {
  const [value, setValue] = useState(0);
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const handleClick = () => {
    setOpen(!open);
  };
  return (
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
            languages.map((lang) => (
              <List component="div" disablePadding>
                <ListItemButton sx={{ pl: 4 }}>
                  <ListItemText primary={lang.countryCode + " - " + lang.name} />
                </ListItemButton>
              </List>
            ))
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
  );
};
