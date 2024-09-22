import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Route, Routes, useNavigate } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Admin/Dashboard";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import { BookDetailPage } from "./pages/BookPage/BookDetailPage";
import ChapterDetailPage from "./pages/ChapterDetailPage/ChapterDetailPage";
import ImageGalleryPage from "./pages/Gallery/ImageGalleryPage";
import ProfilePage from "./pages/HomePage/ProfilePage";
import UserPages from "./pages/HomePage/UserPages";
import { getCurrentUserByJwt } from "./redux/authentication/auth.actions";
import { useAuthCheck } from "./utils/useAuthCheck";

function App() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(true);
  const { AuthDialog } = useAuthCheck();
  useEffect(() => {
    console.log("Auth state:", user);
    if (jwt) {
      dispatch(getCurrentUserByJwt(jwt))
        .then((result) => {
          if (result && result.error === "UNAUTHORIZED") {
            navigate("/sign-in");
          }
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [dispatch, jwt, navigate]);

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
        <Route path="/admin/*" element={user?.role.name === "ADMIN" ? <Dashboard /> : <UserPages />} />
        <Route path="/gallery" element={<ImageGalleryPage />} />
        <Route path="/profile" element={<ProfilePage />} />
      </Routes>
      <AuthDialog />
    </div>
  );
}

export default App;
