import DehazeIcon from "@mui/icons-material/Dehaze";
import { TabContext, TabList, TabPanel } from "@mui/lab";
import { Box, IconButton, Tab, Typography } from "@mui/material";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewImageModal from "../../components/AdminPageComponents/ManageGalleryPageComponents/ViewImageModal";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import LoadingSpinner from "../../components/LoadingSpinner";
import EditInformationTab from "../../components/ProfilePageComponent/EditInformationTab";
import FavouriteBooksTab from "../../components/ProfilePageComponent/FavouriteBooksTab";
import FavouriteImagesTab from "../../components/ProfilePageComponent/FavouriteImagesTab";
import ReadingProgressTab from "../../components/ProfilePageComponent/ReadingProgressTab";
import { getAllUserFollowingBookAction, getReadingProgressByUser, getUserFavImages } from "../../redux/user/user.action";
import { useAuthCheck } from "../../utils/useAuthCheck";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("1");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const { readingProgresses = [], favouriteBooks = [], favouriteImages = [] } = useSelector((store) => store.user);
  const [selectedImage, setSelectedImage] = useState(null);
  const dispatch = useDispatch();
  const { checkAuth, AuthDialog } = useAuthCheck();
  const handleSetSelectedImage = useCallback(
    (img) => {
      setSelectedImage(img);
    },
    [setSelectedImage]
  );
  const fetchUserDetails = useCallback(
    checkAuth(async () => {
      setLoading(true);
      try {
        await dispatch(getReadingProgressByUser());
        await dispatch(getAllUserFollowingBookAction());
        await dispatch(getUserFavImages());
      } catch (e) {
        console.log("Error fetching user details: ", e);
      }
      setLoading(false);
    }),
    [dispatch, checkAuth]
  );

  useEffect(() => {
    if (user) {
      fetchUserDetails();
    }
  }, []);
  const handleChange = (event, newValue) => {
    setActiveTab(newValue);
  };
  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <Box sx={{ maxWidth: "1200px", mx: "auto", p: 4 }}>
          <Box sx={{ mb: 6 }}>
            <Typography variant="h3" component="h1" sx={{ fontWeight: "bold" }}>
              {user?.username}&apos;s Profile
            </Typography>
          </Box>
          <Sidebar isSidebarOpen={isSidebarOpen} isBackdropOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
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
          <TabContext variant="scrollable" scrollButtons="auto" allowScrollButtonsMobile value={activeTab}>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <TabList onChange={handleChange} aria-label="Profile Tabs">
                <Tab label="Favourite Books" value="1" />
                <Tab label="Reading Progress" value="2" />
                <Tab label="Favourite Images" value="3" />
                <Tab label="Edit Information" value="4" />
              </TabList>
            </Box>
            <TabPanel value="1">
              <FavouriteBooksTab favouriteBooks={favouriteBooks} />
            </TabPanel>
            <TabPanel value="2">
              <ReadingProgressTab readingProgresses={readingProgresses} />
            </TabPanel>
            <TabPanel value="3">
              <FavouriteImagesTab favouriteImages={favouriteImages} setSelectedImage={handleSetSelectedImage} />
            </TabPanel>
            <TabPanel value="4">
              <EditInformationTab user={user} />
            </TabPanel>
          </TabContext>
        </Box>
      )}

      {selectedImage && <ViewImageModal open={true} onClose={() => setSelectedImage(null)} image={selectedImage} />}
      <AuthDialog />
    </>
  );
}
