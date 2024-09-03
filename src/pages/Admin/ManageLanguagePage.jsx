import { Box, Button, Card, CardActions, CardContent, CardHeader, CircularProgress, Grid, TextField, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { addNewLanguage, getAllLanguages } from "../../redux/book/book.action";
import EditLanguageModal from "../../components/ManageLanguagePageComponent/EditLanguageModal";
import DeleteLanguageModal from "../../components/ManageLanguagePageComponent/DeleteLanguageModal";
import CountrySelect from "../../components/ManageLanguagePageComponent/CountrySelect";

export default function ManageLanguagePage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { languages } = useSelector((store) => store.book);
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [selectedCountry, setSelectedCountry] = useState(null);
  const handleOpenModal = (type, data = null) => setOpenModal({ type, data });
  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  const fetchLanguages = async () => {
    setLoading(true);
    try {
      await dispatch(getAllLanguages());
    } catch (e) {
      console.error("Error fetching tags: ", e);
    } finally {
      setLoading(false);
    }
  };
  const handleAddLanguage = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const json = Object.fromEntries(data.entries());
    if (selectedCountry) {
      json.countryCode = selectedCountry.code;
      json.name = selectedCountry.label;
    }
    try {
      console.log("Data: ", { data: json });
      await dispatch(addNewLanguage({ data: json }));
      fetchLanguages();
      setLoading(false);
    } catch (error) {
      console.error("Error adding language:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, [dispatch]);
  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
  };
  return (
    <Box sx={{ maxWidth: "100%", width: "100%", height: "100%", mx: "auto" }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/admin#")}>
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: 24, width: 24 }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Manage Book Languages
          </Typography>
        </Box>
      </Box>
      <Box component="form" onSubmit={handleAddLanguage} sx={{ mb: 8, p: 6, bgcolor: "gray.100", borderRadius: 2, boxShadow: 1 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <CountrySelect onCountrySelect={handleCountrySelect} />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Country Code"
              variant="outlined"
              name="countryCode"
              id="countryCode"
              fullWidth
              value={selectedCountry ? selectedCountry.code : ""}
              onChange={(e) => setSelectedCountry({ ...selectedCountry, code: e.target.value })}
            />
          </Grid>
        </Grid>
        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 4 }}>
          <Button type="submit" variant="contained" color="primary">
            Add Language
          </Button>
        </Box>
      </Box>
      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Existing Languages
        </Typography>
        {loading ? (
          <Box sx={{ display: "flex", justifyContent: "center" }}>
            <CircularProgress />
          </Box>
        ) : (
          <Grid container spacing={2}>
            {languages.length > 0 ? (
              languages?.map((lang) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={lang.id}>
                  <Card sx={{ bgcolor: "gray.100", borderRadius: 2, boxShadow: 1 }}>
                    <CardHeader title={lang.name} />
                    <CardContent>
                      <Typography variant="body2" color="textSecondary">
                        [{lang.countryCode}] - {lang.name}
                      </Typography>
                    </CardContent>
                    <CardActions sx={{ display: "flex", justifyContent: "flex-end" }}>
                      <Button variant="outlined" size="small" onClick={() => handleOpenModal("edit", lang)}>
                        Edit
                      </Button>
                      <Button variant="outlined" size="small" color="secondary" onClick={() => handleOpenModal("delete", lang)}>
                        Delete
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))
            ) : (
              <Grid item xs={12} sm={6} md={4} lg={3}>
                No Languages Available
              </Grid>
            )}
          </Grid>
        )}
      </Box>
      {openModal.type === "edit" && <EditLanguageModal open={true} onClose={handleCloseModal} languageDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteLanguageModal open={true} onClose={handleCloseModal} deleteLanguage={openModal.data} />}
    </Box>
  );
}
