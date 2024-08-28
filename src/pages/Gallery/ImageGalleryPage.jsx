import DehazeIcon from "@mui/icons-material/Dehaze";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { FavoriteBorder } from "@mui/icons-material";
import {
  Badge,
  Box,
  Card,
  CardContent,
  CircularProgress,
  Dialog,
  DialogContent,
  Grid,
  Grow,
  IconButton,
  InputAdornment,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import { addImageToFav, getAllGalleryImages, getAllImageTags } from "../../redux/gallery/gallery.action";
import { isFavouredByReqUser } from "../../utils/isFavouredByReqUser";
import { useAuthCheck } from "../../utils/useAuthCheck";
import LazyLoad from "react-lazyload";
import { getOptimizedImageUrl, getResponsiveImageUrl } from "../../utils/optimizeImages";

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
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8 min-h-screen">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <Typography variant="h4" className="font-bold">
              Image Gallery
            </Typography>
            <div className="w-full max-w-md">
              <TextField
                variant="outlined"
                placeholder="Search images..."
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  ),
                }}
                className="w-full"
              />
            </div>
          </div>
        </header>
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <>
            <Box sx={{ mb: 4 }}>
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
            <Grid container spacing={3} sx={{ transition: "all 0.3s ease-in-out" }}>
              {filteredImages?.map((image) => (
                <Grow in style={{ transformOrigin: "0 0 0" }} {...(image ? { timeout: 1000 } : {})} key={image.id}>
                  <Grid item xs={12} sm={6} md={4} lg={3}>
                    <Card
                      onClick={() => setSelectedImage(image.imageUrl)}
                      sx={{
                        cursor: "pointer",
                        height: 300,
                        "&:hover": {
                          transform: "scale(1.05)",
                          transition: "transform 0.3s ease-in-out",
                        },
                      }}
                    >
                      <LazyLoad height={200} offset={100}>
                        <img
                          src={getOptimizedImageUrl(getResponsiveImageUrl(image.imageUrl, 300))}
                          alt={image.name}
                          className="object-contain w-full h-full rounded-t-md"
                          style={{ height: 200, width: "100%", objectFit: "cover" }}
                        />
                      </LazyLoad>
                      <CardContent className="p-4">
                        <Typography variant="h6" className="font-semibold mb-2">
                          {image.name}
                        </Typography>
                        <Typography variant="body2" color="textSecondary">
                          {image.tags.map((tag) => tag.name).join(", ") || "No tags available"}
                        </Typography>
                        <IconButton onClick={(e) => handleFavoriteToggle(e, image.id)}>
                          {isFavouredByReqUser(auth?.user?.id, image) ? <FavoriteIcon color="error" /> : <FavoriteBorder />}
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grow>
              ))}
            </Grid>
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
      </div>
    </>
  );
}
