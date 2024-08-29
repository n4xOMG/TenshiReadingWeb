import DehazeIcon from "@mui/icons-material/Dehaze";
import { Box, Button, CircularProgress, Drawer, IconButton, List, ListItem, ListItemText } from "@mui/material";
import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
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
import { getBookByIdAction } from "../../redux/book/book.action";
export default function ChapterDetailPage() {
  const { bookId: paramBookId, chapterId: paramChapterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chapter, chapters, progresses = [] } = useSelector((store) => store.chapter);
  const { auth } = useSelector((store) => store);
  const { book } = useSelector((store) => store.book);
  const [bookId] = useState(paramBookId);
  const [chapterId, setChapterId] = useState(paramChapterId);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const flipBookRef = useRef(null);

  useEffect(() => {
    setLoading(true);
    dispatch(getAllChaptersByBookIdAction(bookId));
    dispatch(getChapterById(bookId, chapterId));
    if (!book) {
      dispatch(getBookByIdAction(bookId));
    }
    if (auth.user) {
      dispatch(getReadingProgressByUserAndChapter(auth.user.id, chapterId));
    }
    setLoading(false);
  }, [dispatch, bookId, chapterId, auth.user]);

  const getCharacterCount = useCallback(() => {
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
  }, []);

  const saveProgress = useCallback(async () => {
    if (!auth.user) {
      return;
    }
    let progress = 0;

    const pagesRead = Math.ceil((currentPage + 1) / 2);
    const totalFlipPages = Math.ceil(totalPages / 2);

    if (totalFlipPages > 1) {
      progress = (pagesRead / totalFlipPages) * 100;
      if (pagesRead >= totalFlipPages) {
        progress = 100;
      }
    } else if (totalFlipPages === 1) {
      progress = 100;
    }

    await dispatch(saveChapterProgressAction(bookId, chapterId, auth.user.id, progress));
  }, [dispatch, bookId, chapterId, auth.user, currentPage, totalPages]);

  const debouncedSaveProgress = useMemo(
    () =>
      debounce(async () => {
        await saveProgress();
      }, 300),
    [bookId, chapterId, auth.user?.id, currentPage, totalPages]
  );
  const handlePageFlip = useCallback(
    (pageIndex) => {
      if (pageIndex >= totalPages || pageIndex < 0) {
        return;
      }

      setCurrentPage(pageIndex);

      if (flipBookRef.current) {
        flipBookRef.current.pageFlip().flip(pageIndex);
      }

      if (pageIndex === totalPages - 1) {
        saveProgress();
      }
    },
    [totalPages, saveProgress]
  );
  const handleNavigation = (path) => {
    saveProgress();
    setTimeout(() => {
      navigate(path);
    }, 100);
  };

  const handleChapterClick = (chapterId) => {
    saveProgress();
    setCurrentPage(0);
    setTotalPages(0);
    setChapterId(chapterId);
    window.location.href = `/books/${bookId}/chapters/${chapterId}`;
  };

  const handleBackToBookPage = () => {
    handleNavigation(`/books/${bookId}`);
  };

  const pages = useMemo(() => {
    const contentPages = chapter ? splitContent(chapter.content, getCharacterCount()) : [];

    if (book && book.bookCover) {
      contentPages.unshift(`<img src="${book.bookCover}" alt="Book Cover" />`);
      contentPages.push(`<img src="${book.bookCover}" alt="Book Cover" />`);
    }

    // Remove any empty or whitespace-only pages
    const filteredPages = contentPages.filter((page) => page.trim() !== "");

    return filteredPages;
  }, [chapter, getCharacterCount, book]);
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "ArrowRight") {
        handlePageFlip(currentPage + 1);
      } else if (event.key === "ArrowLeft") {
        handlePageFlip(currentPage - 1);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [currentPage, handlePageFlip]);

  useEffect(() => {
    if (totalPages > 0) {
      const progress = Array.isArray(progresses) ? progresses.find((p) => Number(p.chapterId) === Number(chapterId)) : null;
      if (progress) {
        const pageIndex = Math.floor((progress.progress / 100) * totalPages);
        setCurrentPage(pageIndex);
      }
    }
  }, [totalPages, progresses, chapterId]);

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

  useEffect(() => {
    console.log("Pages:", pages);
    setTotalPages(pages.length);
  }, [pages]);

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
              pt: 5,
              width: "100%",
              height: "100%",
              minHeight: "100vh",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {chapter && currentPage !== undefined && (
              <Flipbook ref={flipBookRef} pages={pages} onFlip={(e) => handlePageFlip(e.data)} initialPage={currentPage} />
            )}
          </Box>
        </>
      )}
    </div>
  );
}
