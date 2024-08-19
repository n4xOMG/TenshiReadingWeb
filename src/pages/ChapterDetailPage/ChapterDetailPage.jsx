import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { Flipbook } from "../../components/ChapterDetailComponents/Flipbook";
import { getBookByIdAction } from "../../redux/book/book.action";
import { getChapterById, saveChapterProgressAction } from "../../redux/chapter/chapter.action";
import { splitContent } from "./SplitContent";
import { AppBar, Avatar, Box, IconButton, Toolbar, Typography } from "@mui/material";
import { ChevronLeft } from "@mui/icons-material";

export default function ChapterDetailPage() {
  const { bookId, chapterId } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { chapter } = useSelector((store) => store.chapter);
  const { book } = useSelector((store) => store.book);
  const { auth } = useSelector((store) => store);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getBookByIdAction(bookId));
    dispatch(getChapterById(bookId, chapterId));
  }, [dispatch, bookId, chapterId]);

  const handlePageFlip = (e) => {
    const pageIndex = e.data;
    setCurrentPage(pageIndex);
  };

  const saveProgress = useCallback(() => {
    let progress = 0;
    if (totalPages > 1) {
      const pagesRead = Math.ceil((currentPage + 1) / 2);
      progress = (pagesRead / Math.ceil(totalPages / 2)) * 100;
    } else if (totalPages === 1) {
      progress = 100;
    }
    dispatch(saveChapterProgressAction(bookId, chapterId, auth.user.id, progress));
  }, [dispatch, bookId, chapterId, auth.user.id, currentPage, totalPages]);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      saveProgress();
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [saveProgress]);

  useEffect(() => {
    if (chapter) {
      setLoading(false);
    }
  }, [chapter]);

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
  if (book) {
    pages.unshift(`<img src="${book.bookCover}" style="width:600px;height:600px;object-fit:contain" alt="Book Cover" />`);
  }

  useEffect(() => {
    setTotalPages(pages.length);
  }, [pages]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="flex flex-col w-full h-full items-center bg-[#202124]">
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="back home" onClick={() => navigate("/")}>
            <ChevronLeft />
          </IconButton>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1, textAlign: "center" }}>
            NIX
          </Typography>
          <Avatar sx={{ marginLeft: "auto" }}>A</Avatar>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          backgroundColor: "#202124",
          flexGrow: 1,
          px: 3,
          pt: 3,
          pb: 20,
          mt: 8,
          width: "100%",
          height: "100%",
          minHeight: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1 className="w-full">Chapter Detail Page</h1>
        {chapter && <Flipbook pages={pages} onFlip={handlePageFlip} />}
      </Box>
    </div>
  );
}
