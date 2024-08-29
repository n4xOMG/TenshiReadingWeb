import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Admin/Dashboard";
import Authentication from "./pages/Auth/Authentication";
import ChapterDetailPage from "./pages/ChapterDetailPage/ChapterDetailPage";
import ImageGalleryPage from "./pages/Gallery/ImageGalleryPage";
import BooksPage from "./pages/HomePage/BooksPage";
import ProfilePage from "./pages/HomePage/ProfilePage";
import UserPages from "./pages/HomePage/UserPages";
import { getCurrentUserByJwt } from "./redux/authentication/auth.actions";
import { useAuthCheck } from "./utils/useAuthCheck";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import { BookDetailPage } from "./pages/BookPage/BookDetailPage";

function App() {
  const dispatch = useDispatch();
  const { auth } = useSelector((store) => store);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(true);
  const { AuthDialog } = useAuthCheck();
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
        <Route path="/" element={<UserPages />} />
        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/books/:bookId" element={<BookDetailPage />} />
        <Route path="/books/:bookId/chapters/:chapterId" element={<ChapterDetailPage />} />
        <Route path="/admin/*" element={auth.user && auth.user.role.name === "ADMIN" ? <Dashboard /> : <UserPages />} />
        <Route path="/gallery" element={<ImageGalleryPage />} />
        <Route path="/profile" element={auth.user ? <ProfilePage /> : <Authentication />} />
        <Route path="/books" element={<BooksPage />} />
      </Routes>
      <AuthDialog />
    </div>
  );
}

export default App;
