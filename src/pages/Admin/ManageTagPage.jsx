import {
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  Grid,
  InputBase,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addTagAction, getAllImageTags } from "../../redux/gallery/gallery.action";
import { useNavigate } from "react-router-dom";
import DeleteTagModal from "../../components/AdminPageComponents/ManageTagPageComponent/DeleteTagModal";
import EditTagModal from "../../components/AdminPageComponents/ManageTagPageComponent/EditTagModal";

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
    <Box sx={{ maxWidth: "100%", width: "100%", height: "100%", mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/admin#")}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: 24, width: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Manage Tags
          </Typography>
        </Box>
        <InputBase placeholder="Search images..." sx={{ bgcolor: "gray.800", color: "white", p: 2, borderRadius: 1 }} />
      </Box>
      <Box component="form" onSubmit={handleAddTag} sx={{ mb: 8, p: 6, bgcolor: "gray.100", borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Tag Name" variant="outlined" fullWidth id="name" name="name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Description" variant="outlined" name="description" id="description" fullWidth multiline rows={4} />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Add Tag
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Existing Tags
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {tags.map((tag) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={tag.id}>
                <Card sx={{ bgcolor: "gray.100", borderRadius: 2, boxShadow: 1 }}>
                  <CardHeader title={tag.name} />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {tag.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="outlined" size="small" onClick={() => handleOpenModal("edit", tag)}>
                      Edit
                    </Button>
                    <Button variant="outlined" size="small" color="secondary" onClick={() => handleOpenModal("delete", tag)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      {openModal.type === "edit" && <EditTagModal open={true} onClose={handleCloseModal} tagDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteTagModal open={true} onClose={handleCloseModal} deleteTag={openModal.data} />}
    </Box>
  );
}
