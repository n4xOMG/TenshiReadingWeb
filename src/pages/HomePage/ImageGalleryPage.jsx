import { Box, Grid, Typography, useMediaQuery, useTheme } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import ViewImageModal from "../../components/AdminPageComponents/ManageGalleryPageComponents/ViewImageModal";
import FloatingGalleryMenu from "../../components/GalleryPageComponents/FloatingGalleryMenu";
import { ImageCard } from "../../components/GalleryPageComponents/ImageCard";
import SideDrawerFilter from "../../components/GalleryPageComponents/SideDrawerFilter";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addImageToFav, getAllGalleryImages, getAllImageTags } from "../../redux/gallery/gallery.action";
import { useAuthCheck } from "../../utils/useAuthCheck";
export default function ImageGalleryPage() {
  const dispatch = useDispatch();
  const { images, tags, totalPages } = useSelector((store) => store.gallery);
  const theme = useTheme();
  const { user } = useSelector((store) => store.auth);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [userFavImages, setUserFavImages] = useState(user ? user.img : []);
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
  }, [dispatch, user]);

  const isFavouredByUser = (imageId) => {
    return userFavImages.some((favImg) => favImg.id === imageId);
  };

  const handleFavoriteToggle = checkAuth(async (imageId) => {
    setLoading(true);
    try {
      const isCurrentlyFav = isFavouredByUser(imageId);
      const updatedFavImages = isCurrentlyFav ? userFavImages.filter((img) => img.id !== imageId) : [...userFavImages, { id: imageId }]; // Add image to fav

      setUserFavImages(updatedFavImages);

      await dispatch(addImageToFav(imageId));
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    } finally {
      setLoading(false);
    }
  });

  const handlePageChange = async (event, value) => {
    event.preventDefault();
    setPage(value);
    dispatch(getAllGalleryImages(value - 1, 6));
  };

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

  const handleNextImage = () => {
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const nextIndex = (currentIndex + 1) % images.length;
    setSelectedImage(images[nextIndex]);
  };

  const handlePrevImage = () => {
    const currentIndex = images.findIndex((img) => img.id === selectedImage.id);
    const prevIndex = (currentIndex - 1 + images.length) % images.length;
    setSelectedImage(images[prevIndex]);
  };

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
                  <ImageCard
                    key={img.id}
                    img={img}
                    userFavImages={userFavImages}
                    handleFavoriteToggle={handleFavoriteToggle}
                    setSelectedImage={setSelectedImage}
                    onTagToggle={toggleTag}
                  />
                ))}
              </Grid>
              <Stack spacing={2}>
                <Pagination count={totalPages ? totalPages : 0} page={page} showFirstButton showLastButton onChange={handlePageChange} />
              </Stack>
            </Box>
            <FloatingGalleryMenu onToggleSideDrawer={toggleSideDrawer} />
            {selectedImage && (
              <ViewImageModal
                open={true}
                onClose={() => setSelectedImage(null)}
                image={selectedImage}
                user={user}
                onNext={handleNextImage}
                onPrev={handlePrevImage}
                onToggleFavorite={handleFavoriteToggle}
              />
            )}
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
