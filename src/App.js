import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Authentication from "./pages/Auth/Authentication";
import { useEffect, useState } from "react";
import { getCurrentUserByJwt } from "./redux/authentication/auth.actions";
import UploadChapterPage from "./pages/UploadChapterPage/UploadChapterPage";
import CreateBookPage from "./pages/CreateBookPage/CreateBookPage";
import { CircularProgress } from "@mui/material";
import BookDetailPage from "./pages/BookPage/BookDetailPage";
import ChapterDetailPage from "./pages/ChapterDetailPage/ChapterDetailPage";
import ImageGalleryPage from "./pages/Gallery/ImageGalleryPage";
import Dashboard from "./pages/Admin/Dashboard";
import UserPages from "./pages/HomePage/UserPages";
import ProfilePage from "./pages/HomePage/ProfilePage";
import BooksPage from "./pages/HomePage/BooksPage";

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (jwt) {
      dispatch(getCurrentUserByJwt(jwt)).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, jwt]);

  if (loading) {
    return <CircularProgress />;
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/*" element={auth.user ? <UserPages /> : <Authentication />} />
        <Route path="/books/:bookId/uploadChapterPage" element={<UploadChapterPage />} />
        <Route path="/createBookPage" element={<CreateBookPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/books/:bookId/chapters/:chapterId" element={<ChapterDetailPage />} />
        <Route path="/admin" element={auth.user && auth.user.role.name === "ADMIN" ? <Dashboard /> : <UserPages />} />
        <Route path="/gallery" element={<ImageGalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="/books" element={<BooksPage />} />
      </Routes>
    </div>
  );
}

export default App;
