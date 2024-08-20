import { Backdrop, Box, Button, Card, CircularProgress, Grid, InputBase, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Menu from "../../components/ManageGalleryPageComponents/Menu";
import { getAllGalleryImages } from "../../redux/gallery/gallery.action";
import ViewImageModal from "../../components/ManageGalleryPageComponents/ViewImageModal";
import { useNavigate } from "react-router-dom";
import AddImageModal from "../../components/ManageGalleryPageComponents/AddImageModal";
import EditImageModal from "../../components/ManageGalleryPageComponents/EditImageModal";
import DeleteImageModal from "../../components/ManageGalleryPageComponents/DeleteImageModal";

export default function ManageGallery() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [loading, setLoading] = useState(false);
  const { images } = useSelector((store) => store.gallery);

  const handleOpenModal = (type, data = null) => setOpenModal({ type, data });
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  useEffect(() => {
    setLoading(true);
    dispatch(getAllGalleryImages());
    setLoading(false);
  }, [dispatch]);

  return (
    <Box sx={{ bgcolor: "gray.900", color: "white", minHeight: "100vh", p: 4 }}>
      {/* Navigation Bar */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 4 }} onClick={() => navigate("/")}>
        <Typography variant="h5" sx={{ fontWeight: "bold" }}>
          Dashboard &gt; Image Gallery
        </Typography>
        <InputBase placeholder="Search images..." sx={{ bgcolor: "gray.800", color: "white", p: 2, borderRadius: 1 }} />
      </Box>

      {/* Buttons */}
      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <Button
          variant="contained"
          sx={{ bgcolor: "blue.500", "&:hover": { bgcolor: "blue.700" }, fontWeight: "bold", py: 2, px: 4, borderRadius: 1 }}
          onClick={() => navigate("/gallery")}
        >
          Image Gallery
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "green.500", "&:hover": { bgcolor: "green.700" }, fontWeight: "bold", py: 2, px: 4, borderRadius: 1 }}
          onClick={() => handleOpenModal("add")}
        >
          Upload Image
        </Button>
        <Button
          variant="contained"
          sx={{ bgcolor: "yellow.500", "&:hover": { bgcolor: "yellow.700" }, fontWeight: "bold", py: 2, px: 4, borderRadius: 1 }}
        >
          Filter
        </Button>
      </Box>

      {/* Image Grid */}
      <Grid container spacing={2}>
        {images?.map((image, index) => (
          <Grid item xs={12} sm={6} md={4} lg={2} key={index}>
            <Card sx={{ position: "relative", bgcolor: "gray.800", p: 2, borderRadius: 1 }}>
              {/* Styled Menu with border and background */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  right: 0,
                  zIndex: 10,
                  bgcolor: "rgba(255, 255, 255, 0.7)",
                  borderRadius: 1,
                  border: 1,
                  borderColor: "gray.300",
                }}
              >
                <Menu image={image} onEdit={() => handleOpenModal("edit", image)} onDelete={() => handleOpenModal("delete", image)} />
              </Box>
              <Box
                sx={{
                  bgcolor: "gray.700",
                  height: 176,
                  width: 176,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                  mx: "auto",
                  cursor: "pointer",
                }}
                onClick={() => handleOpenModal("view", image)}
              >
                <img src={image.imageUrl} alt={image.name} style={{ objectFit: "cover", height: "100%", width: "100%" }} />
              </Box>
              <Typography>{image.name}</Typography>
            </Card>
          </Grid>
        ))}
      </Grid>
      {openModal.type === "add" && <AddImageModal open={true} onClose={handleCloseModal} />}
      {openModal.type === "edit" && <EditImageModal open={true} onClose={handleCloseModal} imageDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteImageModal open={true} onClose={handleCloseModal} deleteImage={openModal.data} />}
      {openModal.type === "view" && <ViewImageModal open={true} onClose={handleCloseModal} image={openModal.data} />}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </Box>
  );
}
