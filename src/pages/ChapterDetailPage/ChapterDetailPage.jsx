import DehazeIcon from "@mui/icons-material/Dehaze";
import { Box, Button, CircularProgress, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import { Flipbook } from "../../components/ChapterDetailComponents/Flipbook";
import {
  getAllChaptersByBookIdAction,
  getChapterById,
  getReadingProgressByUserAndChapter,
  saveChapterProgressAction,
} from "../../redux/chapter/chapter.action";
import { splitContent } from "./SplitContent";
import { debounce } from "lodash";
export default function ChapterDetailPage() {
  const { bookId: paramBookId, chapterId: paramChapterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chapter, chapters, progresses = [] } = useSelector((store) => store.chapter);
  const { auth } = useSelector((store) => store);
  const [bookId] = useState(paramBookId);
  const [chapterId, setChapterId] = useState(paramChapterId);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    dispatch(getAllChaptersByBookIdAction(bookId));
    dispatch(getChapterById(bookId, chapterId));
    dispatch(getReadingProgressByUserAndChapter(auth.user.id, chapterId));
  }, [dispatch, bookId, chapterId, auth.user.id]);

  useEffect(() => {
    setLoading(true);
    dispatch(getChapterById(bookId, chapterId)).finally(() => setLoading(false));
  }, [dispatch, bookId, chapterId]);

  const handlePageFlip = (e) => {
    const pageIndex = e.data;
    setCurrentPage(pageIndex);
  };

  const saveProgress = useCallback(async () => {
    setLoading(true);
    let progress = 0;
    if (totalPages > 1) {
      const pagesRead = Math.ceil((currentPage + 1) / 2);
      progress = (pagesRead / Math.ceil(totalPages / 2)) * 100;
    } else if (totalPages === 1) {
      progress = 100;
    }
    await dispatch(saveChapterProgressAction(bookId, chapterId, auth.user.id, progress));
    setLoading(false);
  }, [dispatch, bookId, chapterId, auth.user.id, currentPage, totalPages]);

  useEffect(() => {
    if (totalPages > 0) {
      const progress = Array.isArray(progresses) ? progresses.find((p) => Number(p.chapterId) === Number(chapterId)) : null;
      if (progress) {
        console.log("Progress: ", progress);
        const pageIndex = Math.floor((progress?.progress / 100) * totalPages);
        console.log("Page index: ", pageIndex);
        setCurrentPage(pageIndex);
      }
    }
  }, [totalPages, progresses, chapterId]);

  const debouncedSaveProgress = useCallback(
    debounce(async () => {
      setLoading(true);
      let progress = 0;
      if (totalPages > 1) {
        const pagesRead = Math.ceil((currentPage + 1) / 2);
        progress = (pagesRead / Math.ceil(totalPages / 2)) * 100;
      } else if (totalPages === 1) {
        progress = 100;
      }
      await dispatch(saveChapterProgressAction(bookId, chapterId, auth.user.id, progress));
      setLoading(false);
    }, 300), // Adjust the debounce delay as needed
    [dispatch, bookId, chapterId, auth.user.id, currentPage, totalPages]
  );

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      debouncedSaveProgress();
      event.preventDefault();
      event.returnValue = "";
    };

    const handleNavigation = () => {
      debouncedSaveProgress();
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    window.addEventListener("popstate", handleNavigation);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      window.removeEventListener("popstate", handleNavigation);
    };
  }, [debouncedSaveProgress]);

  const getCharacterCount = () => {
    const width = window.innerWidth;
    if (width < 300) {
      return 150;
    } else if (width < 400) {
      return 250;
    } else if (width < 500) {
      return 350;
    } else if (width < 600) {
      return 450;
    } else {
      return 700;
    }
  };

  const pages = chapter ? splitContent(chapter.content, getCharacterCount()) : [];

  useEffect(() => {
    setTotalPages(pages.length);
  }, [pages]);

  const handleNavigation = (path) => {
    saveProgress();
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleChapterClick = (chapterId) => {
    saveProgress();
    setChapterId(chapterId);
    navigate(`/books/${bookId}/chapters/${chapterId}`);
  };

  const handleBackToBookPage = () => {
    handleNavigation(`/books/${bookId}`);
  };

  return (
    <div className="flex flex-col w-full h-full items-center bg-[#202124]">
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <>
          <Drawer anchor="left" open={isSidebarOpen} onClose={() => setIsSidebarOpen(false)}>
            <div style={{ width: 250 }}>
              <Button
                variant="text"
                onClick={handleBackToBookPage}
                sx={{ justifyContent: "flex-start", textAlign: "left", color: "black" }}
              >
                <ArrowBackIcon sx={{ marginRight: 1, height: 16, width: 16 }} />
                Back to Book page
              </Button>
              <IconButton onClick={() => setIsSidebarOpen(false)}>
                <CloseIcon />
              </IconButton>
              <List>
                {chapters?.map((chapter) => (
                  <ListItem
                    button
                    key={chapter.id}
                    onClick={() => handleChapterClick(chapter.id)}
                    sx={{
                      "&:hover": {
                        backgroundColor: "grey.200",
                      },
                    }}
                  >
                    <ListItemText primary={`Chapter ${chapter.chapterNum}: ${chapter.title}`} />
                  </ListItem>
                ))}
              </List>
            </div>
          </Drawer>
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
          <Box
            component="main"
            sx={{
              backgroundColor: "#202124",
              flexGrow: 1,
              px: 3,
              pb: 5,
              mt: 3,
              width: "100%",
              height: "100%",
              minHeight: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {chapter && currentPage !== undefined && <Flipbook pages={pages} onFlip={handlePageFlip} initialPage={currentPage} />}
          </Box>
        </>
      )}
    </div>
  );
}
