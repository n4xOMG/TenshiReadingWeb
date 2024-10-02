import { React, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MangaChapterDetail from "./MangaChapterDetail";
import NovelChapterDetail from "./NovelChapterDetail";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getChapterById, getChaptersByBookAndLanguageAction, getReadingProgressByUserAndChapter } from "../../redux/chapter/chapter.action";
import { getBookByIdAction } from "../../redux/book/book.action";

export default function ChapterDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { chapter, chapters, readingProgress } = useSelector((store) => store.chapter);
  const { user } = useSelector((store) => store.auth);
  const { book } = useSelector((store) => store.book);

  const { bookId: paramBookId, chapterId: paramChapterId } = useParams();

  const [anchorEl, setAnchorEl] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isFloatingMenuVisible, setFloatingMenuVisible] = useState(false);
  const [bookId] = useState(paramBookId);
  const [chapterId, setChapterId] = useState(paramChapterId);
  const [loading, setLoading] = useState(true);
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

  const handleChapterChange = (nextChapterId) => {
    setChapterId(nextChapterId);
    navigate(`/books/${bookId}/chapters/${nextChapterId}`);
  };

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          {book.categories.some((category) => category.name.toLowerCase() === "manga") && (
            <MangaChapterDetail
              anchorEl={anchorEl}
              bookId={bookId}
              chapter={chapter}
              chapters={chapters}
              readingProgress={readingProgress}
              user={user}
              isFloatingMenuVisible={isFloatingMenuVisible}
              toggleFloatingMenu={toggleFloatingMenu}
              handleChapterChange={handleChapterChange}
              handleChapterListOpen={handleChapterListOpen}
              handleChapterListClose={handleChapterListClose}
            />
          )}
          {(book.categories.some((category) => category.name.toLowerCase() === "light novel") ||
            book.categories.some((category) => category.name.toLowerCase() === "web novel")) && (
            <NovelChapterDetail
              anchorEl={anchorEl}
              bookId={bookId}
              chapter={chapter}
              chapters={chapters}
              readingProgress={readingProgress}
              user={user}
              isFloatingMenuVisible={isFloatingMenuVisible}
              toggleFloatingMenu={toggleFloatingMenu}
              handleChapterChange={handleChapterChange}
              handleChapterListOpen={handleChapterListOpen}
              handleChapterListClose={handleChapterListClose}
            />
          )}
        </>
      )}
    </>
  );
}
