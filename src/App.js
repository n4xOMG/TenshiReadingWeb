import "./App.css";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import Authentication from "./pages/Auth/Authentication";
import LandingPage from "./pages/HomePage/HomePage";
import { useEffect, useState } from "react";
import { getCurrentUserByJwt } from "./redux/authentication/auth.actions";
import UploadChapterPage from "./pages/UploadChapterPage/UploadChapterPage";
import CreateBookPage from "./pages/CreateBookPage/CreateBookPage";
import { CircularProgress } from "@mui/material";
import BookDetailPage from "./pages/BookPage/BookDetailPage";
import ChapterDetailPage from "./pages/ChapterDetailPage/ChapterDetailPage";
import ManageGallery from "./pages/Gallery/ManageGallery";
import ImageGalleryPage from "./pages/Gallery/ImageGalleryPage";
import ManageTagPage from "./pages/Tag/ManageTagPage";
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
        <Route path="/*" element={auth.user ? <LandingPage /> : <Authentication />} />
        <Route path="/books/:bookId/uploadChapterPage" element={<UploadChapterPage />} />
        <Route path="/createBookPage" element={<CreateBookPage />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/books/:bookId/chapters/:chapterId" element={<ChapterDetailPage />} />
        <Route path="/manage-gallery" element={<ManageGallery />} />
        <Route path="/manage-tags" element={<ManageTagPage />} />
        <Route path="/gallery" element={<ImageGalleryPage />} />
      </Routes>
    </div>
  );
}

export default App;
