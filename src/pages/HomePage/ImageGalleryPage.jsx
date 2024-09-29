import { FavoriteBorder } from "@mui/icons-material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Box, Button, Card, CardContent, Chip, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewImageModal from "../../components/AdminPageComponents/ManageGalleryPageComponents/ViewImageModal";
import FloatingGalleryMenu from "../../components/GalleryPageComponents/FloatingGalleryMenu";
import SideDrawerFilter from "../../components/GalleryPageComponents/SideDrawerFilter";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addImageToFav, getAllGalleryImages, getAllImageTags } from "../../redux/gallery/gallery.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { useAuthCheck } from "../../utils/useAuthCheck";

export default function ImageGalleryPage() {
  const dispatch = useDispatch();
  const { images, tags, totalPages } = useSelector((store) => store.gallery);
  const theme = useTheme();
  const { user } = useSelector((store) => store.auth);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [filter, setFilter] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const { checkAuth, AuthDialog } = useAuthCheck();
  const [isSideDrawerOpen, setIsSideDrawerOpen] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  useEffect(() => {
    const fetchImages = async () => {
      try {
        await dispatch(getAllGalleryImages(page - 1, 6));
      } catch (error) {
        console.error("Error fetching images: ", error);
      }
    };
    const fetchTags = async () => {
      try {
        await dispatch(getAllImageTags());
      } catch (error) {
        console.error("Error fetching tags: ", error);
      }
    };

    fetchTags();
    fetchImages();
  }, [dispatch]);
  const handlePageChange = async (event, value) => {
    event.preventDefault();
    setPage(value);
    dispatch(getAllGalleryImages(value - 1, 6));
  };
  const handleFavoriteToggle = checkAuth(async (imageId) => {
    setLoading(true);
    try {
      setTimeout(() => {
        dispatch(addImageToFav(imageId));
      }, 300);
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    } finally {
      setLoading(false);
    }
  });

  const filteredImages = images?.filter(
    (img) =>
      (filter === "" ||
        (img.name && img.name.toLowerCase().includes(filter.toLowerCase())) ||
        (img.tags && img.tags.some((tag) => tag.name.toLowerCase().includes(filter.toLowerCase())))) &&
      (selectedTags.length === 0 || selectedTags.every((tag) => img.tags && img.tags.some((t) => t.name === tag)))
  );
  const clearFilters = () => {
    setFilter("");
    setSelectedTags([]);
  };
  const toggleTag = (tagName) => {
    setSelectedTags((prev) => (prev.includes(tagName) ? prev.filter((t) => t !== tagName) : [...prev, tagName]));
  };
  const toggleSideDrawer = useCallback(() => {
    setIsSideDrawerOpen((prev) => !prev);
  }, []);

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <Box sx={{ display: "flex", px: isSmallScreen ? 4 : 10, py: isSmallScreen ? 4 : 6, textAlign: "left", fontWeight: "bold" }}>
            <Box sx={{ flex: 1 }}>
              <Typography variant="h4" sx={{ mb: 6, textAlign: "left", fontWeight: "bold" }}>
                Image Gallery
              </Typography>
              <Grid container spacing={3}>
                {filteredImages.map((img) => (
                  <Grid item xs={12} md={6} lg={4} key={img.id}>
                    <Card sx={{ maxWidth: 345, overflow: "hidden" }}>
                      <CardContent sx={{ p: 0 }}>
                        <Box sx={{ position: "relative" }}>
                          <Box
                            component="img"
                            onClick={() => setSelectedImage(img)}
                            src={img.imageUrl}
                            alt={img.name}
                            sx={{ width: "100%", height: 192, objectFit: "cover", cursor: "pointer" }}
                          />
                          <Button
                            variant="contained"
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 8,
                              right: 8,
                              color: "white",
                              bgcolor: "rgba(0, 0, 0, 0.2)",
                              "&:hover": {
                                bgcolor: "rgba(0, 0, 0, 0.4)",
                              },
                              borderRadius: "50%",
                              width: 40,
                              height: 40,
                              minWidth: 0,
                            }}
                            onClick={() => handleFavoriteToggle(img.id)}
                          >
                            {isFavouredByReqUser(user.id, img) ? (
                              <FavoriteIcon sx={{ fontSize: 20, color: "red" }} />
                            ) : (
                              <FavoriteBorder sx={{ fontSize: 20 }} />
                            )}
                          </Button>
                          <Box sx={{ position: "absolute", bottom: 8, left: 8, display: "flex", flexWrap: "wrap", gap: 1 }}>
                            {img.tags.map((tag, index) => (
                              <Chip
                                key={index}
                                label={tag.name}
                                variant="outlined"
                                sx={{
                                  bgcolor: "rgba(0, 0, 0, 0.5)",
                                  color: "white",
                                  "&:hover": {
                                    bgcolor: "rgba(0, 0, 0, 0.7)",
                                  },
                                }}
                              />
                            ))}
                          </Box>
                        </Box>
                        <Typography variant="body2" sx={{ p: 2, textAlign: "center" }}>
                          {img.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
              <Stack spacing={2}>
                <Pagination count={totalPages ? totalPages : 0} page={page} showFirstButton showLastButton onChange={handlePageChange} />
              </Stack>
            </Box>
            <FloatingGalleryMenu onToggleSideDrawer={toggleSideDrawer} />
            {selectedImage && <ViewImageModal open={true} onClose={() => setSelectedImage(null)} image={selectedImage} />}
            <AuthDialog />
            {isSideDrawerOpen && (
              <>
                <SideDrawerFilter
                  tags={tags}
                  filter={filter}
                  selectedTags={selectedTags}
                  open={isSideDrawerOpen}
                  onToggleSideDrawer={toggleSideDrawer}
                  setFilter={setFilter}
                  onToggleTag={toggleTag}
                  clearFilters={clearFilters}
                />
              </>
            )}
          </Box>
        </>
      )}
    </>
  );
}
