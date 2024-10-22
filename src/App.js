import { CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./pages/Admin/Dashboard";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";
import SignIn from "./pages/Auth/SignIn";
import SignUp from "./pages/Auth/SignUp";
import { BookDetailPage } from "./pages/BookPage/BookDetailPage";
import ChapterDetailPage from "./pages/ChapterDetailPage/ChapterDetailPage";
import FAQ from "./pages/HomePage/FAQ";
import ImageGalleryPage from "./pages/HomePage/ImageGalleryPage";
import Profile from "./pages/HomePage/Profile";
import UserPages from "./pages/HomePage/UserPages";
import { getCurrentUserByJwt } from "./redux/authentication/auth.actions";
import { isTokenExpired, useAuthCheck } from "./utils/useAuthCheck";

function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((store) => store.auth, shallowEqual);
  const jwt = localStorage.getItem("jwt");
  const [loading, setLoading] = useState(false);
  const { AuthDialog } = useAuthCheck();
  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        if (jwt && !isTokenExpired(jwt) && !user) {
          await dispatch(getCurrentUserByJwt(jwt));
        }
      } catch (e) {
        console.log("Error loading app: ", e);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
    console.log("App rendered");
  }, [dispatch]);

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
        <Route path="/profile" element={<Profile />} />
        <Route path="/faq" element={<FAQ />} />
      </Routes>
      <AuthDialog />
    </div>
  );
}

export default App;
