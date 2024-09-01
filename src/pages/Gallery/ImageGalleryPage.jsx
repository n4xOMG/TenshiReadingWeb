import { FavoriteBorder } from "@mui/icons-material";
import DehazeIcon from "@mui/icons-material/Dehaze";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ImageIcon from "@mui/icons-material/Image";
import SearchIcon from "@mui/icons-material/Search";
import { Badge, Box, CircularProgress, Dialog, DialogContent, Grid, Grow, IconButton, InputBase, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import LazyLoad from "react-lazyload";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import { addImageToFav, getAllGalleryImages, getAllImageTags } from "../../redux/gallery/gallery.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { getOptimizedImageUrl } from "../../utils/optimizeImages";
import { useAuthCheck } from "../../utils/useAuthCheck";

export default function ImageGalleryPage() {
  const dispatch = useDispatch();
  const { images, tags, loading } = useSelector((store) => store.gallery);
  const { auth } = useSelector((store) => store);
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedTags, setSelectedTags] = useState(["All"]);
  const { checkAuth } = useAuthCheck();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        await dispatch(getAllGalleryImages());
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

  const handleFavoriteToggle = checkAuth(async (event, imageId) => {
    event.stopPropagation();

    try {
      await dispatch(addImageToFav(imageId));
    } catch (error) {
      console.error("Error toggling favorite: ", error);
    }
  });

  const toggleTag = (tagName) => {
    if (tagName === "All") {
      setSelectedTags(["All"]);
    } else {
      setSelectedTags((prevSelectedTags) =>
        prevSelectedTags.includes(tagName)
          ? prevSelectedTags.filter((tag) => tag !== tagName)
          : [...prevSelectedTags.filter((tag) => tag !== "All"), tagName]
      );
    }
  };

  const filteredImages = selectedTags.includes("All")
    ? images
    : images.filter((image) => selectedTags.every((selectedTag) => image.tags.some((tag) => tag.name === selectedTag)));

  return (
    <>
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
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 4, py: 8 }}>
        <Typography variant="h3" component="h1" sx={{ mb: 8, textAlign: "center", fontWeight: "bold" }}>
          Image Gallery
        </Typography>

        <Box sx={{ mb: 6, display: "flex", flexWrap: "wrap", gap: 2, justifyContent: "center" }}>
          <Badge
            variant={selectedTags.includes("All") ? "default" : "outlined"}
            sx={{
              mr: 2,
              mb: 2,
              cursor: "pointer",
              borderRadius: "16px",
              padding: "4px 8px",
              margin: "0 8px 8px 0",
              backgroundColor: selectedTags.includes("All") ? "grey.300" : "transparent",
              "&:hover": {
                backgroundColor: "grey.200",
              },
            }}
            onClick={() => toggleTag("All")}
          >
            All
          </Badge>
          {tags?.map((tag) => (
            <Badge
              key={tag.id}
              variant={selectedTags.includes(tag.name) ? "default" : "outlined"}
              sx={{
                mr: 2,
                mb: 2,
                cursor: "pointer",
                borderRadius: "16px",
                padding: "4px 8px",
                margin: "0 8px 8px 0",
                backgroundColor: selectedTags.includes(tag.name) ? "grey.300" : "transparent",
                "&:hover": {
                  backgroundColor: "grey.200",
                },
              }}
              onClick={() => toggleTag(tag.name)}
            >
              {tag.name}
            </Badge>
          ))}
        </Box>

        <Box sx={{ mb: 6, position: "relative" }}>
          <IconButton sx={{ position: "absolute", left: 2, top: "50%", transform: "translateY(-50%)", color: "gray" }}>
            <SearchIcon />
          </IconButton>
          <InputBase type="text" placeholder="Search by caption or tag..." sx={{ pl: 5, width: "100%" }} />
        </Box>

        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            <Grid container spacing={3}>
              {filteredImages?.map((img) => (
                <Grow in style={{ transformOrigin: "0 0 0" }} {...(img ? { timeout: 1000 } : {})} key={img.id}>
                  <Grid item xs={12} sm={6} md={4} key={img.id}>
                    <Box
                      sx={{ position: "relative", overflow: "hidden", borderRadius: 2, boxShadow: 3 }}
                      onClick={() => setSelectedImage(img.imageUrl)}
                    >
                      <LazyLoad height={200} offset={100}>
                        <img
                          src={getOptimizedImageUrl(img.imageUrl)}
                          alt={img.name}
                          style={{ width: "100%", height: "200px", objectFit: "cover", transition: "transform 0.3s" }}
                          className="group-hover:scale-110"
                        />
                      </LazyLoad>

                      <Box
                        sx={{
                          position: "absolute",
                          inset: 0,
                          backgroundColor: "rgba(0, 0, 0, 0.5)",
                          opacity: 0,
                          transition: "opacity 0.3s",
                          display: "flex",
                          flexDirection: "column",
                          justifyContent: "flex-end",
                          p: 2,
                          "&:hover": { opacity: 1 },
                        }}
                      >
                        <Typography variant="subtitle1" sx={{ color: "white", mb: 1 }}>
                          {img.name}
                        </Typography>
                        <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                          {img.tags?.map((tag) => (
                            <Badge key={tag.id} badgeContent={tag.name} color="secondary" sx={{ fontSize: "0.75rem" }} />
                          ))}
                        </Box>
                      </Box>
                    </Box>
                    <IconButton onClick={(e) => handleFavoriteToggle(e, img.id)}>
                      {isFavouredByReqUser(auth?.user?.id, img) ? <FavoriteIcon color="error" /> : <FavoriteBorder />}
                    </IconButton>
                  </Grid>
                </Grow>
              ))}
            </Grid>

            {filteredImages.length === 0 && (
              <Box sx={{ textAlign: "center", py: 12 }}>
                <ImageIcon sx={{ fontSize: 48, color: "gray" }} />
                <Typography variant="h6" sx={{ mt: 2, fontWeight: "bold" }}>
                  No images found
                </Typography>
                <Typography variant="body2" sx={{ mt: 1, color: "gray" }}>
                  Try changing your search or filter.
                </Typography>
              </Box>
            )}
          </>
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
                alt="Seleted Image"
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
      </Box>
    </>
  );
}
