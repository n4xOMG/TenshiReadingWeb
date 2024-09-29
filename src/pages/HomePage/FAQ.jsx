import React, { useEffect } from "react";

import DehazeIcon from "@mui/icons-material/Dehaze";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import PublicIcon from "@mui/icons-material/Public";
import SearchIcon from "@mui/icons-material/Search";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  IconButton,
  InputAdornment,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllFaqByLanguage, getAllLanguagesWithFaq } from "../../redux/faq/faq.action";

export default function FAQ() {
  const [searchQuery, setSearchQuery] = useState("");
  const { faqsByLanguage, languagesWithFaq } = useSelector((store) => store.faq);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [languageId, setLanguageId] = useState(2);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const fetchFaqsAndLanguages = async () => {
      setIsLoading(true);
      try {
        await dispatch(getAllFaqByLanguage(languageId));
        await dispatch(getAllLanguagesWithFaq());
      } catch (e) {
        console.log("Error getting faq by language: ", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqsAndLanguages();
  }, [languageId, dispatch]);

  const filteredFAQs = faqsByLanguage.filter(
    (faq) => faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ maxWidth: "800px", mx: "auto", py: 4 }}>
          <Sidebar isSidebarOpen={isSidebarOpen} isBackdropOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <IconButton
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            sx={{
              position: "fixed",
              top: 16,
              left: 16,
              zIndex: 2,
              backgroundColor: "white",
              border: "1px solid",
              borderColor: "grey.300",
              "&:hover": {
                backgroundColor: "grey.100",
              },
            }}
          >
            <DehazeIcon />
          </IconButton>
          <Typography variant="h4" align="center" gutterBottom>
            Frequently Asked Questions
          </Typography>

          {/* Search and Language Select */}
          <Box sx={{ display: "flex", flexDirection: { xs: "column", sm: "row" }, gap: 2, mb: 4 }}>
            {/* Search Input */}
            <TextField
              fullWidth
              placeholder="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              sx={{
                flexGrow: 1,
              }}
            />

            {/* Language Select */}
            <Select
              value={languageId}
              onChange={(e) => setLanguageId(e.target.value)}
              sx={{ minWidth: 180 }}
              startAdornment={<PublicIcon sx={{ mr: 1 }} />}
            >
              {languagesWithFaq?.map((item) => (
                <MenuItem key={item.id} value={item.id}>
                  {item.name}
                </MenuItem>
              ))}
            </Select>
          </Box>

          {/* FAQ Accordion */}
          {filteredFAQs.length > 0 ? (
            <Box>
              {filteredFAQs.map((faq, index) => (
                <Accordion key={index} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls={`panel-${index}-content`} id={`panel-${index}-header`}>
                    <Typography variant="subtitle1">{faq.question}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2">{faq.answer}</Typography>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          ) : (
            <Typography align="center" color="text.secondary">
              No FAQs found. Try adjusting your search.
            </Typography>
          )}
        </Box>
      )}
    </>
  );
}
