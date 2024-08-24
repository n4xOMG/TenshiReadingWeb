import DehazeIcon from "@mui/icons-material/Dehaze";
import SearchIcon from "@mui/icons-material/Search";
import {
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
import { useDispatch } from "react-redux";
import Sidebar from "../../components/BookPageComponents/Sidebar";
import { getAllGalleryImages } from "../../redux/gallery/gallery.action";
export default function ImageGalleryPage() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
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

    fetchImages();
  }, [dispatch]);

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
          <Grid container spacing={3}>
            {images?.map((image, index) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
                <Card onClick={() => setSelectedImage(image.imageUrl)}>
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
                      This is a description of Image {index + 1}.
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        {selectedImage && (
          <Dialog open onClose={() => setSelectedImage(null)} maxWidth="l" fullWidth>
            <DialogContent className="flex items-center justify-center p-0 bg-gray-700">
              <img
                src={selectedImage}
                alt={selectedImage.name}
                className="object-contain"
                style={{ height: "100vh", width: "auto", maxWidth: "70%" }}
              />
            </DialogContent>
          </Dialog>
        )}
      </div>
    </>
  );
}
