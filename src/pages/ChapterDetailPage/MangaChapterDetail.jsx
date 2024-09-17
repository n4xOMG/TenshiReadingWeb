import { Backdrop, Box } from "@mui/material";
import { debounce } from "lodash";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import FloatingMenu from "../../components/ChapterDetailComponents/MangaChapterDetail/FloatingMenu";
import MangaPageContent from "../../components/ChapterDetailComponents/MangaChapterDetail/MangaPageContent";
import MangaPageNavigation from "../../components/ChapterDetailComponents/MangaChapterDetail/MangaPageNavigation";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getBookByIdAction } from "../../redux/book/book.action";
import {
  getChapterById,
  getChaptersByBookAndLanguageAction,
  getReadingProgressByUserAndChapter,
  saveChapterProgressAction,
} from "../../redux/chapter/chapter.action";

export default function MangaChapterDetail() {
  const { bookId: paramBookId, chapterId: paramChapterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { chapter, chapters, readingProgress } = useSelector((store) => store.chapter);
  const { user } = useSelector((store) => store.auth);
  const { book } = useSelector((store) => store.book);

  const [currentPage, setCurrentPage] = useState(0);
  const [hoverZone, setHoverZone] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookId] = useState(paramBookId);
  const [chapterId, setChapterId] = useState(paramChapterId);
  const [initialPageSet, setInitialPageSet] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFloatingMenuVisible, setFloatingMenuVisible] = useState(false);
  const [viewMode, setViewMode] = useState(() => {
    return localStorage.getItem("viewMode") || "single";
  });
  const [selectedLanguageId] = useState(() => {
    return localStorage.getItem("selectedLanguageId") || 0;
  });

  const fetchChapterDetail = useCallback(async () => {
    setLoading(true);
    try {
      await dispatch(getChaptersByBookAndLanguageAction(bookId, selectedLanguageId));
      await dispatch(getChapterById(bookId, chapterId));
      if (!book) {
        await dispatch(getBookByIdAction(bookId));
      }
      if (user) {
        await dispatch(getReadingProgressByUserAndChapter(chapterId));
      }
    } catch (e) {
      console.log("Error in manga chapter detail: ", e);
    } finally {
      setLoading(false);
    }
  }, [dispatch, bookId, chapterId, selectedLanguageId, book, user]);

  useEffect(() => {
    fetchChapterDetail();
  }, [fetchChapterDetail]);

  const totalPages = Math.max((chapter?.content.match(/<img/g) || []).length, 1);

  useEffect(() => {
    if (!initialPageSet && readingProgress && !isNaN(readingProgress.progress) && totalPages > 0) {
      const initialPage = Math.floor((readingProgress.progress / 100) * totalPages);
      console.log("Setting initialPage:", initialPage);
      if (initialPage >= totalPages) {
        setCurrentPage(totalPages - 1);
      } else if (initialPage - 1 > 0) {
        setCurrentPage(initialPage - 1);
      }
      setInitialPageSet(true);
    }
  }, [readingProgress, totalPages, initialPageSet]);

  const saveProgress = useCallback(async () => {
    if (!user) return;

    let progress = 0;
    if (viewMode === "double") {
      const pagesRead = Math.ceil((currentPage + 1) / 2);
      const totalFlipPages = Math.ceil(totalPages / 2);

      if (totalFlipPages > 1) {
        progress = (pagesRead / totalFlipPages) * 100;
        if (pagesRead >= totalFlipPages) progress = 100;
      } else if (totalFlipPages === 1) {
        progress = 100;
      }
    } else {
      progress = ((currentPage + 1) / totalPages) * 100;
      if (currentPage + 1 >= totalPages) progress = 100;
    }

    await dispatch(saveChapterProgressAction(bookId, chapterId, user.id, progress));
  }, [dispatch, bookId, chapterId, user, currentPage, totalPages, viewMode]);

  const debouncedSaveProgress = useMemo(() => debounce(saveProgress, 300), [saveProgress]);

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

  const handlePageChange = (newPage) => {
    const newCurrentPage = Math.max(0, Math.min(newPage, totalPages - 1));
    setCurrentPage(newCurrentPage);
  };

  const handleChapterChange = (chapterId) => {
    setChapterId(chapterId);
    setCurrentPage(0);
  };

  const handleViewModeChange = (value) => {
    setViewMode(value);
    localStorage.setItem("viewMode", value);
  };

  const handleKeyDown = useCallback(
    (e) => {
      if (viewMode === "double") {
        if (e.key === "ArrowLeft") {
          handlePageChange(currentPage - 2);
        } else if (e.key === "ArrowRight") {
          handlePageChange(currentPage + 2);
        }
      } else {
        if (e.key === "ArrowLeft") {
          handlePageChange(currentPage - 1);
        } else if (e.key === "ArrowRight") {
          handlePageChange(currentPage + 1);
        }
      }
    },
    [currentPage, viewMode]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const toggleFloatingMenu = () => {
    setFloatingMenuVisible((prev) => !prev);
  };

  const handleChapterListOpen = (event) => {
    if (menuOpen) {
      handleChapterListClose();
    } else {
      setAnchorEl(event.currentTarget);
      setMenuOpen(true);
    }
  };

  const handleChapterListClose = () => {
    setAnchorEl(null);
    setMenuOpen(false);
  };

  const handleBackToBookPage = () => {
    debouncedSaveProgress();
    navigate(`/books/${bookId}`);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box
          sx={{
            position: "relative",
            maxWidth: "100%",
            maxHeight: "100vh",
            display: "flex",
            flexDirection: "column",
            overflow: "hidden",
          }}
        >
          {chapter && (
            <>
              <MangaPageContent
                chapter={chapter}
                viewMode={viewMode}
                currentPage={currentPage}
                totalPages={totalPages}
                handlePageChange={handlePageChange}
                hoverZone={hoverZone}
                setHoverZone={setHoverZone}
                toggleFloatingMenu={toggleFloatingMenu}
              />
            </>
          )}

          {isFloatingMenuVisible && (
            <>
              <Backdrop
                sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1, bgcolor: "rgba(0, 0, 0, 0.5)" }}
                open={isFloatingMenuVisible}
                onClick={toggleFloatingMenu}
              />
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: 5,
                  zIndex: (theme) => theme.zIndex.drawer + 2,
                }}
              >
                <FloatingMenu
                  anchorEl={anchorEl}
                  bookId={bookId}
                  currentChapterId={chapter.id}
                  chapters={chapters}
                  open={isFloatingMenuVisible}
                  viewMode={viewMode}
                  onNavigate={handleBackToBookPage}
                  onChapterListOpen={handleChapterListOpen}
                  onChapterListClose={handleChapterListClose}
                  onViewModeChange={handleViewModeChange}
                  onChapterChange={handleChapterChange}
                />
                <MangaPageNavigation
                  totalPages={totalPages}
                  viewMode={viewMode}
                  currentPage={currentPage}
                  handlePageChange={handlePageChange}
                />
              </Box>
            </>
          )}
        </Box>
      )}
    </>
  );
}
