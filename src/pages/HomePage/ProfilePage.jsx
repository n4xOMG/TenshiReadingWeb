import DehazeIcon from "@mui/icons-material/Dehaze";
import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import { getCurrentUserByJwt } from "../../redux/authentication/auth.actions";
import { getAllUserFollowingBookAction } from "../../redux/book/book.action";
import { getReadingProgressByUser } from "../../redux/chapter/chapter.action";
import { getUserFavImages } from "../../redux/gallery/gallery.action";
import { formatDate } from "../../utils/formatDate";
import { useNavigate } from "react-router-dom";
import UpdateProfileModal from "../../components/ProfilePageComponent/UpdateProfileModal";

const getProgressColor = (progress) => {
  if (progress === 100) return "bg-green-500";
  if (progress >= 75) return "bg-blue-500";
  if (progress >= 50) return "bg-yellow-500";
  return "bg-red-500";
};
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("books");
  const [openModal, setOpenModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [favouredBooks, setFavouredBooks] = useState([]);
  const [favouredImages, setFavouredImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [progresses, setProgresses] = useState([]);
  const [loading, setLoading] = useState(true);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jwt = localStorage.getItem("jwt");

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      const userResponse = await dispatch(getCurrentUserByJwt(jwt));
      setUser(userResponse.payload);
      setLoading(false);
    };
    fetchUser();
  }, [dispatch, jwt]);

  useEffect(() => {
    if (user) {
      const fetchUserDetails = async () => {
        setLoading(true);
        const progressesResponse = await dispatch(getReadingProgressByUser(user.id));
        setProgresses(progressesResponse.payload);
        const favouredBooksResponse = await dispatch(getAllUserFollowingBookAction(user.id));
        setFavouredBooks(favouredBooksResponse.payload);
        const favouredImagesReponse = await dispatch(getUserFavImages(user.id));
        setFavouredImages(favouredImagesReponse.payload);

        setLoading(false);
      };
      fetchUserDetails();
    }
  }, [dispatch, user]);

  return (
    <>
      {loading ? (
        <div className="flex justify-center">
          <CircularProgress />
        </div>
      ) : (
        <Box container={"true"} sx={{ mx: "auto", p: 3 }}>
          <Sidebar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
          <Card sx={{ my: 8, border: 1, borderColor: "grey.100" }}>
            <CardHeader
              avatar={
                <Avatar sx={{ height: 40, width: 40 }}>
                  <Typography variant="h6">{user.username ? user.username.slice(0, 2).toUpperCase() : "NA"}</Typography>
                </Avatar>
              }
              title={
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <Typography variant="h5">{user?.username}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user?.email}
                  </Typography>
                </Box>
              }
              action={
                <Box>
                  <Button variant="outlined" onClick={() => setOpenModal(true)} sx={{ borderRadius: 3, fontSize: 10, padding: "4px 8px" }}>
                    Update Profile
                  </Button>
                  <UpdateProfileModal open={openModal} onClose={() => setOpenModal(false)} userDetails={user} />
                </Box>
              }
              sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}
            />
          </Card>

          <Tabs
            value={activeTab}
            variant="scrollable"
            scrollButtons="auto"
            allowScrollButtonsMobile
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{ mb: 8 }}
          >
            <Tab label="Following Books" value="books" />
            <Tab label="Favorite Images" value="images" />
            <Tab label="Reading History" value="history" />
          </Tabs>
          {activeTab === "books" && (
            <Grid container spacing={4}>
              {favouredBooks.map((book) => (
                <Grid item xs={12} md={4} lg={3} key={book.id}>
                  <Card
                    onClick={() => navigate(`/books/${book.id}`)}
                    sx={{
                      border: 1,
                      borderColor: "grey.100",
                      borderRadius: 3,
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
                      <img
                        src={book.bookCover}
                        alt={book.title}
                        style={{ width: "128px", height: "192px", objectFit: "cover", marginBottom: "16px" }}
                      />
                      <Typography variant="h6" align="center">
                        {book.title}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {activeTab === "images" && (
            <Grid container spacing={4}>
              {favouredImages.map((image) => (
                <Grid item xs={12} md={4} lg={3} key={image.id}>
                  <Card
                    onClick={() => setSelectedImage(image.imageUrl)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "transform 0.3s ease-in-out",
                      },
                      borderRadius: 3,
                    }}
                  >
                    <CardContent sx={{ p: 4 }}>
                      <img src={image.imageUrl} alt={image.name} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
          {activeTab === "history" && (
            <Box sx={{ spaceY: 4 }}>
              {progresses
                .sort((a, b) => new Date(b.lastReadAt) - new Date(a.lastReadAt))
                .map((progress, index) => (
                  <Card
                    onClick={() => navigate(`/books/${progress.bookId}/chapters/${progress.chapterId}`)}
                    key={index}
                    sx={{
                      border: 1,
                      borderColor: "grey.100",
                      borderRadius: 3,
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.01)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "start", p: 4 }}>
                      <img
                        src={progress.bookCover}
                        alt={progress.bookTitle}
                        style={{ width: "96px", height: "144px", objectFit: "cover", marginRight: "16px", borderRadius: "4px" }}
                      />
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6">{progress.bookTitle}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {progress.bookAuthor}
                        </Typography>
                        <Box sx={{ mt: 2, mb: 1 }}>
                          <LinearProgress variant="determinate" value={progress.progress} sx={{ width: "100%" }} />
                        </Box>
                        <Typography variant="body2" color="text.secondary">
                          {progress.chapterNum} {progress.chapterName}
                        </Typography>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Badge variant="outlined" sx={{ backgroundColor: getProgressColor(progress.progress), color: "white" }}>
                            {progress.progress}%
                          </Badge>
                          {progress.lastReadAt && (
                            <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                              <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                              {formatDate(progress.lastReadAt)}
                            </Box>
                          )}
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
            </Box>
          )}
        </Box>
      )}
      {selectedImage && (
        <Dialog
          open={true}
          onClose={() => setSelectedImage(null)}
          maxWidth={false}
          PaperProps={{
            style: {
              maxWidth: "none",
              width: "auto",
              height: "auto",
              margin: 0,
            },
          }}
        >
          <DialogContent
            className="flex items-center justify-center p-0 bg-gray-700"
            style={{
              padding: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <img
              src={selectedImage}
              alt={selectedImage.name}
              className="object-contain"
              style={{
                maxHeight: "90vh",
                maxWidth: "90vw",
                height: "auto",
                width: "auto",
              }}
            />
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
