import { Add, Delete, Edit, Search } from "@mui/icons-material";
import { Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddFaqDialog from "../../components/AdminPageComponents/ManageFAQComponents/AddFaqDialog";
import EditFaqDialog from "../../components/AdminPageComponents/ManageFAQComponents/EditFaqDialog";
import LoadingSpinner from "../../components/LoadingSpinner";
import { getAllLanguages } from "../../redux/book/book.action";
import { addNewFaq, deleteFaq, getAllFaq } from "../../redux/faq/faq.action";

const ManageFAQ = () => {
  const { faqs } = useSelector((store) => store.faq);
  const { languages } = useSelector((store) => store.book);
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(false);
  const [chosenLanguage, setChosenLanguage] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredFAQs, setFilteredFAQs] = useState([]);
  const [editingFAQ, setEditingFAQ] = useState(null);
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  useEffect(() => {
    const fetchFaqsAndLanguages = async () => {
      setIsLoading(true);
      try {
        await dispatch(getAllLanguages());
        const results = await dispatch(getAllFaq());
        setFilteredFAQs(results.payload);
      } catch (e) {
        console.log("Error fetching faq: ", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFaqsAndLanguages();
  }, [dispatch]);
  const handleSearch = () => {
    const filtered = faqs?.filter(
      (faq) =>
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.language.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredFAQs(filtered);
  };

  const handleAdd = async (event) => {
    event.preventDefault();
    setIsLoading(true);
    try {
      const data = new FormData(event.currentTarget);
      const json = Object.fromEntries(data.entries());
      json.language = chosenLanguage;
      await dispatch(addNewFaq({ data: json }));
      await dispatch(getAllFaq());
    } catch (e) {
      console.log("Error adding faq: ", e);
    } finally {
      setFilteredFAQs(faqs);
      setOpenAddDialog(false);
      setIsLoading(false);
    }
  };

  const handleDelete = async (id) => {
    setIsLoading(true);
    alert("Do you really want to delete this?");
    try {
      await dispatch(deleteFaq(id));
    } catch (e) {
      console.log("Error deleting faq: ", e);
    } finally {
      setFilteredFAQs(faqs);
      setIsLoading(false);
    }
  };

  return (
    <>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
          <h1 style={{ textAlign: "center", marginBottom: "24px" }}>FAQ Management</h1>

          <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
            <TextField
              fullWidth
              variant="outlined"
              label="Search FAQs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              sx={{ flexGrow: 1 }}
            />
            <Button variant="contained" startIcon={<Search />} onClick={handleSearch} sx={{ height: "40px" }}>
              Search
            </Button>
            <Button variant="contained" startIcon={<Add />} onClick={() => setOpenAddDialog(true)} sx={{ height: "40px" }}>
              Add FAQ
            </Button>
          </div>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Question</TableCell>
                  <TableCell>Answer</TableCell>
                  <TableCell>Language</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {filteredFAQs.map((faq) => (
                  <TableRow key={faq.id}>
                    <TableCell>{faq.question}</TableCell>
                    <TableCell>{faq.answer}</TableCell>
                    <TableCell>{faq.language.name}</TableCell>
                    <TableCell>
                      <IconButton
                        onClick={() => {
                          setEditingFAQ(faq);
                          setOpenEditDialog(true);
                        }}
                      >
                        <Edit />
                      </IconButton>
                      <IconButton onClick={() => handleDelete(faq.id)}>
                        <Delete />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          {filteredFAQs.length === 0 && <p style={{ textAlign: "center", marginTop: "24px" }}>No FAQs found matching your search query.</p>}

          <AddFaqDialog
            open={openAddDialog}
            onClose={() => setOpenAddDialog(false)}
            setChosenLanguage={setChosenLanguage}
            languages={languages}
            handleAdd={handleAdd}
          />

          <EditFaqDialog
            open={openEditDialog}
            onClose={() => setOpenEditDialog(false)}
            languages={languages}
            editingFAQ={editingFAQ}
            setFilteredFAQs={setFilteredFAQs}
          />
        </div>
      )}
    </>
  );
};

export default ManageFAQ;
