import { Backdrop, Box, Button, CircularProgress, Grid, Typography } from "@mui/material";
import { debounce } from "lodash";
import React, { Suspense, useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBookAction } from "../../redux/book/book.action";
import { getAllChaptersByBookIdAction } from "../../redux/chapter/chapter.action";
import { BookList } from "../../components/AdminPageComponents/ManageBookPageComponents/BookList";
import { ChapterList } from "../../components/AdminPageComponents/ManageBookPageComponents/ChapterList";

const AddBookModal = React.lazy(() =>
  import("../../components/AdminPageComponents/ManageBookPageComponents/Modals/BookModal/AddBookModal")
);
const EditBookModal = React.lazy(() =>
  import("../../components/AdminPageComponents/ManageBookPageComponents/Modals/BookModal/EditBookModal")
);
const DeleteBookModal = React.lazy(() =>
  import("../../components/AdminPageComponents/ManageBookPageComponents/Modals/BookModal/DeleteBookModal")
);

const AddChapterModal = React.lazy(() =>
  import("../../components/AdminPageComponents/ManageBookPageComponents/Modals/ChapterModal/AddChapterModal")
);
const EditChapterModal = React.lazy(() =>
  import("../../components/AdminPageComponents/ManageBookPageComponents/Modals/ChapterModal/EditChapterModal")
);
const DeleteChapterModal = React.lazy(() =>
  import("../../components/AdminPageComponents/ManageBookPageComponents/Modals/ChapterModal/DeleteChapterModal")
);
export default function ManageBookPage() {
  const dispatch = useDispatch();
  const { books } = useSelector((store) => store.book);
  const { chapters } = useSelector((store) => store.chapter);
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(false);
  const [selectedBookId, setSelectedBookId] = useState(null);

  const handleOpenModal = (type, data = null) => {
    setLoading(false);
    setOpenModal({ type, data });
  };
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  useEffect(() => {
    const fetchBook = async () => {
      setLoading(true);
      try {
        await dispatch(getAllBookAction());
      } catch (e) {
        console.log("Error trying to get all books in manage book page: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchBook();
  }, [dispatch]);

  useEffect(() => {
    if (books.length > 0 && !selectedBookId) {
      setSelectedBookId(books[0].id);
    }
  }, [books, selectedBookId]);
  const debouncedSetSelectedBookId = useCallback(
    debounce((id) => setSelectedBookId(id), 300),
    []
  );
  useEffect(() => {
    if (selectedBookId) {
      const fetchChapterById = async () => {
        setLoading(true);
        try {
          await dispatch(getAllChaptersByBookIdAction(selectedBookId));
        } catch (e) {
          console.log("Error trying to get all chapters in manage book page: ", e);
        } finally {
          setLoading(false);
        }
      };
      fetchChapterById();
    }
  }, [selectedBookId, dispatch]);

  return (
    <Box
      sx={{
        display: "grid",
        maxWidth: "100%",
        width: "100%",
        height: "100%",
        gridTemplateColumns: "1fr 1fr",
        bgcolor: "background.default",
      }}
    >
      <Box component="aside" sx={{ height: "100%", borderRight: 1, borderColor: "divider", px: 4, pt: 4, bgcolor: "grey.100" }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3, height: "100%", maxHeight: "100vh" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Books
            </Typography>
            <Button size="small" onClick={() => handleOpenModal("addBook")}>
              Add Book
            </Button>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <BookList
                  books={books}
                  onSelectBook={debouncedSetSelectedBookId}
                  onEditBook={(book) => handleOpenModal("editBook", book)}
                  onDeleteBook={(book) => handleOpenModal("deleteBook", book)}
                />
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
      <Box component="main" sx={{ px: 4, pt: 4 }}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4, height: "100%" }}>
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Chapters
            </Typography>
            <Button size="small" onClick={() => handleOpenModal("addChapter")}>
              Add Chapter
            </Button>
          </Box>
          <Box sx={{ flex: 1, overflow: "auto" }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center" }}>
                <CircularProgress />
              </Box>
            ) : (
              <Grid container spacing={2}>
                <ChapterList
                  chapters={chapters}
                  onEditChapter={(chapter) => handleOpenModal("editChapter", chapter)}
                  onDeleteChapter={(chapter) => handleOpenModal("deleteChapter", chapter)}
                />
              </Grid>
            )}
          </Box>
        </Box>
      </Box>
      <Suspense fallback={<CircularProgress />}>
        {openModal.type === "addBook" && <AddBookModal open={true} onClose={handleCloseModal} />}
        {openModal.type === "editBook" && <EditBookModal open={true} onClose={handleCloseModal} bookDetails={openModal.data} />}
        {openModal.type === "deleteBook" && <DeleteBookModal open={true} onClose={handleCloseModal} deleteBook={openModal.data} />}
        {openModal.type === "addChapter" && <AddChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} />}
        {openModal.type === "editChapter" && (
          <EditChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} chapterDetails={openModal.data} />
        )}
        {openModal.type === "deleteChapter" && (
          <DeleteChapterModal open={true} onClose={handleCloseModal} bookId={selectedBookId} deleteChapter={openModal.data} />
        )}
      </Suspense>
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
