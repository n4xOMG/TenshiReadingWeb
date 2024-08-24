import ScheduleIcon from "@mui/icons-material/Schedule";
import {
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  LinearProgress,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ChangePasswordModal from "../../components/ProfilePageComponent/ChangePasswordModal";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import DehazeIcon from "@mui/icons-material/Dehaze";
export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState("books");
  const [openModal, setOpenModal] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  // Mock data for demonstration
  const user = {
    username: "johndoe",
    email: "johndoe@example.com",
    avatar: "/placeholder.svg?height=100&width=100",
  };

  const books = [
    { id: 1, title: "The Great Gatsby", cover: "/placeholder.svg?height=150&width=100" },
    { id: 2, title: "To Kill a Mockingbird", cover: "/placeholder.svg?height=150&width=100" },
    { id: 3, title: "1984", cover: "/placeholder.svg?height=150&width=100" },
  ];

  const favoriteImages = [
    { id: 1, src: "/placeholder.svg?height=150&width=150", alt: "Favorite 1" },
    { id: 2, src: "/placeholder.svg?height=150&width=150", alt: "Favorite 2" },
    { id: 3, src: "/placeholder.svg?height=150&width=150", alt: "Favorite 3" },
  ];

  const readingHistory = [
    {
      id: 1,
      title: "The Catcher in the Rye",
      author: "J.D. Salinger",
      dateRead: "2023-05-15",
      progress: 100,
      cover: "/placeholder.svg?height=150&width=100",
    },
    {
      id: 2,
      title: "Pride and Prejudice",
      author: "Jane Austen",
      dateRead: "2023-04-20",
      progress: 100,
      cover: "/placeholder.svg?height=150&width=100",
    },
    { id: 3, title: "The Hobbit", author: "J.R.R. Tolkien", dateRead: null, progress: 65, cover: "/placeholder.svg?height=150&width=100" },
    { id: 4, title: "Dune", author: "Frank Herbert", dateRead: null, progress: 30, cover: "/placeholder.svg?height=150&width=100" },
  ];

  const getProgressColor = (progress) => {
    if (progress === 100) return "bg-green-500";
    if (progress >= 75) return "bg-blue-500";
    if (progress >= 50) return "bg-yellow-500";
    return "bg-red-500";
  };
  return (
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
              <img src={user.avatar} alt={user.username} />
              <Typography variant="h6">{user.username.slice(0, 2).toUpperCase()}</Typography>
            </Avatar>
          }
          title={
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Typography variant="h5">{user.username}</Typography>
              <Typography variant="body2" color="text.secondary">
                {user.email}
              </Typography>
            </Box>
          }
          action={
            <Button variant="outlined" onClick={() => setOpenModal(true)} sx={{ borderRadius: 3, fontSize: 10, padding: "4px 8px" }}>
              <ChangePasswordModal open={openModal} onClose={() => setOpenModal(false)} />
              Change Password
            </Button>
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
          {books.map((book) => (
            <Grid item xs={12} md={4} lg={3} key={book.id}>
              <Card sx={{ border: 1, borderColor: "grey.100", borderRadius: 3 }}>
                <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", p: 4 }}>
                  <img
                    src={book.cover}
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
          {favoriteImages.map((image) => (
            <Grid item xs={12} md={4} lg={3} key={image.id}>
              <Card sx={{ borderRadius: 3 }}>
                <CardContent sx={{ p: 4 }}>
                  <img src={image.src} alt={image.alt} style={{ width: "100%", height: "160px", objectFit: "cover" }} />
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
      {activeTab === "history" && (
        <Box sx={{ spaceY: 4 }}>
          {readingHistory.map((book) => (
            <Card key={book.id} sx={{ border: 1, borderColor: "grey.100", borderRadius: 3 }}>
              <CardContent sx={{ display: "flex", alignItems: "start", p: 4 }}>
                <img
                  src={book.cover}
                  alt={book.title}
                  style={{ width: "96px", height: "144px", objectFit: "cover", marginRight: "16px", borderRadius: "4px" }}
                />
                <Box sx={{ flexGrow: 1 }}>
                  <Typography variant="h6">{book.title}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.author}
                  </Typography>
                  <Box sx={{ mt: 2, mb: 1 }}>
                    <LinearProgress variant="determinate" value={book.progress} sx={{ width: "100%" }} />
                  </Box>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <Badge variant="outlined" sx={{ backgroundColor: getProgressColor(book.progress), color: "white" }}>
                      {book.progress}%
                    </Badge>
                    {book.dateRead && (
                      <Box sx={{ display: "flex", alignItems: "center", color: "text.secondary" }}>
                        <ScheduleIcon sx={{ mr: 1, fontSize: 16 }} />
                        {book.dateRead}
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
  );
}
