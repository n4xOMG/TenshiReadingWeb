import { AppBar, Box, LinearProgress, List, ListItem, ListItemText, Tabs, Typography, useTheme } from "@mui/material";
import Tab from "@mui/material/Tab";
import { useState } from "react";
import PropTypes from "prop-types";
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`full-width-tabpanel-${index}`}
      aria-labelledby={`full-width-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `full-width-tab-${index}`,
    "aria-controls": `full-width-tabpanel-${index}`,
  };
}
export const ChapterList = ({ chapters, adaptedChapters, progresses, onNavigate, bookId }) => {
  const [value, setValue] = useState(0);
  const theme = useTheme();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Box sx={{ mb: 6 }}>
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
      </TabPanel>
      <TabPanel value={value} index={1} dir={theme.direction}>
        <List sx={{ spaceY: 2 }}>
          {adaptedChapters?.map((chapter, index) => {
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
      </TabPanel>
    </Box>
  );
};
