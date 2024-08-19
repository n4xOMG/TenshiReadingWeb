import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTagAction, getAllImageTags } from "../../redux/gallery/gallery.action";
import EditTagModal from "../../components/ManageTagPageComponent/EditTagModal";
import DeleteTagModal from "../../components/ManageTagPageComponent/DeleteTagModal";
import { useNavigate } from "react-router-dom";

export default function ManageTagPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { tags } = useSelector((store) => store.gallery);
  const [openModal, setOpenModal] = useState({ type: null, data: null });

  const handleOpenModal = (type, data = null) => setOpenModal({ type, data });
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  const handleAddTag = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    try {
      console.log("Data: ", { data: json });
      await dispatch(addTagAction({ data: json }));
      await dispatch(getAllImageTags());
      setLoading(false);
    } catch (error) {
      console.error("Error adding tag:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    const getAllTags = async () => {
      setLoading(true);
      try {
        await dispatch(getAllImageTags());
      } catch (e) {
        console.error("Error fetching tags: ", e);
      } finally {
        setLoading(false);
      }
    };
    getAllTags();
  }, [dispatch]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center mb-4">
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate("/")}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <div className="text-xl font-bold">Manage Tags</div>
        </div>
        <input type="text" placeholder="Search images..." className="bg-gray-800 text-white p-2 rounded" />
      </div>
      <div className="mb-6">
        <Typography variant="h3" component="h1" gutterBottom>
          Image Tags
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your image tags here.
        </Typography>
      </div>
      <Box component={"form"} onSubmit={handleAddTag} className="mb-8 p-6 bg-gray-100 rounded-lg shadow-sm">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <TextField label="Tag Name" variant="outlined" fullWidth id="name" name="name" />
          <TextField label="Description" variant="outlined" name="description" id="description" fullWidth multiline rows={4} />
        </div>
        <div className="flex justify-end mt-4">
          <Button type="submit" variant="contained" color="primary">
            Add Tag
          </Button>
        </div>
      </Box>
      <div>
        <Typography variant="h5" component="h2" gutterBottom>
          Existing Tags
        </Typography>
        {loading ? (
          <div className="flex justify-center">
            <CircularProgress />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {tags.map((tag) => (
              <Card key={tag.id} className="bg-gray-100 rounded-lg shadow-sm">
                <CardHeader title={tag.name} />
                <CardContent>
                  <Typography variant="body2" color="textSecondary">
                    {tag.description}
                  </Typography>
                </CardContent>
                <CardActions className="flex justify-end">
                  <Button variant="outlined" size="small" onClick={() => handleOpenModal("edit", tag)}>
                    Edit
                  </Button>
                  <Button variant="outlined" size="small" color="secondary" onClick={() => handleOpenModal("delete", tag)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            ))}
          </div>
        )}
      </div>
      {openModal.type === "edit" && <EditTagModal open={true} onClose={handleCloseModal} tagDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteTagModal open={true} onClose={handleCloseModal} deleteTag={openModal.data} />}
    </div>
  );
}
