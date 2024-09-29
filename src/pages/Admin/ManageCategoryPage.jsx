import { Box, Button, Card, CardActions, CardContent, CardHeader, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import DeleteCategoryModal from "../../components/AdminPageComponents/ManageCategoryPageComponent/DeleteCategoryModal";
import EditCategoryModal from "../../components/AdminPageComponents/ManageCategoryPageComponent/EditCategoryModal";
import LoadingSpinner from "../../components/LoadingSpinner";
import { addNewCategory, getAllCategories } from "../../redux/book/book.action";

export default function ManageCategoryPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { categories } = useSelector((store) => store.book);
  const [openModal, setOpenModal] = useState({ type: null, data: null });

  const handleOpenModal = (type, data = null) => setOpenModal({ type, data });
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  const getAllTags = async () => {
    setLoading(true);
    try {
      await dispatch(getAllCategories());
    } catch (e) {
      console.error("Error fetching categories: ", e);
    } finally {
      setLoading(false);
    }
  };
  const handleAddCategory = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    try {
      console.log("Data: ", { data: json });
      await dispatch(addNewCategory({ data: json }));
      getAllTags();
      setLoading(false);
    } catch (error) {
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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
            Manage Category
          </Typography>
        </Box>
      </Box>
      <Box component="form" onSubmit={handleAddCategory} sx={{ mb: 8, p: 6, bgcolor: "gray.100", borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Category Name" variant="outlined" fullWidth id="name" name="name" />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Description" variant="outlined" name="description" id="description" fullWidth multiline rows={4} />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Add Category
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Existing Tags
        </Typography>
        {loading ? (
          <LoadingSpinner />
        ) : (
          <Grid container spacing={2}>
            {categories.map((category) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={category.id}>
                <Card sx={{ bgcolor: "gray.100", borderRadius: 2, boxShadow: 1 }}>
                  <CardHeader title={category.name} />
                  <CardContent>
                    <Typography variant="body2" color="textSecondary">
                      {category.description}
                    </Typography>
                  </CardContent>
                  <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                    <Button variant="outlined" size="small" onClick={() => handleOpenModal("edit", category)}>
                      Edit
                    </Button>
                    <Button variant="outlined" size="small" color="secondary" onClick={() => handleOpenModal("delete", category)}>
                      Delete
                    </Button>
                  </CardActions>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
      {openModal.type === "edit" && <EditCategoryModal open={true} onClose={handleCloseModal} categoryDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteCategoryModal open={true} onClose={handleCloseModal} deleteCategory={openModal.data} />}
    </Box>
  );
}
