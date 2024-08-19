import { Backdrop, Button, CircularProgress } from "@mui/material";
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
    <div className="bg-gray-900 text-white min-h-screen p-4">
      {/* Navigation Bar */}
      <div className="flex justify-between items-center mb-4" onClick={() => navigate("/")}>
        <div className="text-xl font-bold">Dashboard &gt; Image Gallery</div>
        <input type="text" placeholder="Search images..." className="bg-gray-800 text-white p-2 rounded" />
      </div>

      {/* Buttons */}
      <div className="flex space-x-4 mb-4">
        <Button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={() => navigate("/gallery")}>
          Image Gallery
        </Button>
        <Button className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded" onClick={() => handleOpenModal("add")}>
          Upload Image
        </Button>
        <Button className="bg-yellow-500 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded">Filter</Button>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-6 gap-4">
        {images?.map((image, index) => (
          <div key={index} className="relative bg-gray-800 p-4 rounded">
            {/* Styled Menu with border and background */}
            <div className="absolute top-2 right-2 z-10 bg-white/70 rounded border border-gray-300">
              <Menu image={image} onEdit={() => handleOpenModal("edit", image)} onDelete={() => handleOpenModal("delete", image)} />
            </div>
            <div
              className="bg-gray-700 h-44 w-44 flex items-center justify-center mb-2 mx-auto"
              onClick={() => handleOpenModal("view", image)}
            >
              <img src={image.imageUrl} alt={image.name} className="object-cover h-full w-full" />
            </div>
            <div>{image.name}</div>
          </div>
        ))}
      </div>
      {openModal.type === "add" && <AddImageModal open={true} onClose={handleCloseModal} />}
      {openModal.type === "edit" && <EditImageModal open={true} onClose={handleCloseModal} imageDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteImageModal open={true} onClose={handleCloseModal} deleteImage={openModal.data} />}
      {openModal.type === "view" && <ViewImageModal open={true} onClose={handleCloseModal} image={openModal.data} />}
      <Backdrop sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color="inherit" />
      </Backdrop>
    </div>
  );
}
