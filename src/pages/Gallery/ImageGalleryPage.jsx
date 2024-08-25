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
export default function ImageGalleryPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);
  const [tags, setTags] = useState([]);
  const [selectedTags, setSelectedTags] = useState(["All"]);
  const { auth } = useSelector((store) => store);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchImages = async () => {
      setLoading(true);
      try {
        const results = await dispatch(getAllGalleryImages());
        console.log("Images: ", results.payload);
        setImages(results.payload);
      } catch (error) {
        console.error("Error fetching images: ", error);
      } finally {
        setLoading(false);
      }
    };
    const fetchTags = async () => {
      setLoading(true);
      try {
        const results = await dispatch(getAllImageTags());
        setTags(results.payload);
      } catch (error) {
        console.error("Error fetching tags: ", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTags();
    fetchImages();
  }, [dispatch]);

  const handleFavoriteToggle = async (event, imageId) => {
    event.stopPropagation();
    setLoading(true);

    setImages((prevImages) =>
      prevImages.map((image) =>
        image.id === imageId
          ? {
              ...image,
              favoured: isFavouredByReqUser(auth.user.id, image)
                ? image.favoured.filter((user) => user.id !== auth.user.id)
                : [...image.favoured, { id: auth.user.id }],
            }
          : image
      )
    );

    try {
      await dispatch(addImageToFav(imageId));
    } catch (error) {
      console.error("Error toggling favorite: ", error);

      setImages((prevImages) =>
        prevImages.map((image) =>
          image.id === imageId
            ? {
                ...image,
                favoured: isFavouredByReqUser(auth.user.id, image)
                  ? [...image.favoured, { id: auth.user.id }]
                  : image.favoured.filter((user) => user.id !== auth.user.id),
              }
            : image
        )
      );
    } finally {
      setLoading(false);
    }
  };

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
              {tags.map((tag) => (
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
              {filteredImages?.map((image, index) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={image.id}>
                  <Card
                    onClick={() => setSelectedImage(image.imageUrl)}
                    sx={{
                      cursor: "pointer",
                      "&:hover": {
                        transform: "scale(1.05)",
                        transition: "transform 0.3s ease-in-out",
                      },
                    }}
                  >
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      className="object-contain w-full h-full rounded-t-md"
                      style={{ aspectRatio: "400/400", objectFit: "cover" }}
                    />
                    <CardContent className="p-4">
                      <Typography variant="h6" className="font-semibold mb-2">
                        {image.name}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {image.tags.map((tag) => tag.name).join(", ") || "No tags available"}
                      </Typography>
                      <IconButton onClick={(e) => handleFavoriteToggle(e, image.id)}>
                        {isFavouredByReqUser(auth.user.id, image) ? <FavoriteIcon color="error" /> : <FavoriteBorder />}
                      </IconButton>
                    </CardContent>
                  </Card>
                </Grid>
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
