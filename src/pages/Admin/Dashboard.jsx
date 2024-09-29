import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar, Box, IconButton, Link, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";

import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import GTranslateIcon from "@mui/icons-material/GTranslate";
import CategoryIcon from "@mui/icons-material/Category";
import QuizIcon from "@mui/icons-material/Quiz";
import ManageUser from "./ManageUser";
import ManageBookPage from "./ManageBookPage";
import ManageGallery from "./ManageGallery";
import ManageTagPage from "./ManageTagPage";
import ManageSensitiveWords from "./ManageSensitiveWords";
import ManageLanguagePage from "./ManageLanguagePage";
import ManageCategoryPage from "./ManageCategoryPage";
import ManageFAQ from "./ManageFAQ";
export default function Dashboard() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const [currentPage, setCurrentPage] = useState("users");

  const menuItems = [
    { name: "Users", page: "users", icon: <PeopleIcon /> },
    { name: "Books", page: "books", icon: <LibraryBooksIcon /> },
    { name: "Gallery", page: "gallery", icon: <ImageIcon /> },
    { name: "Image Tags", page: "tags", icon: <LocalOfferIcon /> },
    { name: "Sensitive Words", page: "sensitive-words", icon: <SpeakerNotesOffIcon /> },
    { name: "Book Languages", page: "book-languages", icon: <GTranslateIcon /> },
    { name: "Book Categories", page: "book-categories", icon: <CategoryIcon /> },
    { name: "FAQ", page: "faq", icon: <QuizIcon /> },
  ];
  const renderMainContent = () => {
    switch (currentPage) {
      case "users":
        return <ManageUser />;
      case "books":
        return <ManageBookPage />;
      case "gallery":
        return <ManageGallery />;
      case "tags":
        return <ManageTagPage />;
      case "sensitive-words":
        return <ManageSensitiveWords />;
      case "book-languages":
        return <ManageLanguagePage />;
      case "book-categories":
        return <ManageCategoryPage />;
      case "faq":
        return <ManageFAQ />;
      default:
        return <ManageUser />;
    }
  };

  return (
    <Box sx={{ display: "grid", minHeight: "100vh", width: "100%", gridTemplateColumns: "280px 1fr" }}>
      {/* Sidebar */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
          maxHeight: "100vh",
          borderRight: 1,
          borderColor: "divider",
          bgcolor: "grey.900",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", height: 60, borderBottom: 1, borderColor: "divider", px: 6 }}>
          <Link
            href="/"
            sx={{ display: "flex", alignItems: "center", gap: 2, fontWeight: "bold", textDecoration: "none", color: "grey.400" }}
          >
            <HomeIcon sx={{ height: 24, width: 24 }} />
            <Typography variant="h6">Acme Admin</Typography>
          </Link>
        </Box>
        <Box sx={{ flex: 1, overflow: "auto" }}>
          <nav sx={{ display: "grid", gap: 2, px: 4, fontSize: "0.875rem", fontWeight: "medium" }}>
            {menuItems.map((item) => (
              <Link
                key={item.page}
                href="#"
                onClick={() => setCurrentPage(item.page)}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  borderRadius: 1,
                  px: 3,
                  py: 2,
                  transition: "all 0.3s",
                  textDecoration: "none",
                  color: currentPage === item.page ? "white" : "grey.400",
                  bgcolor: currentPage === item.page ? "grey.700" : "transparent",
                  "&:hover": {
                    bgcolor: "grey.700",
                    color: "white",
                  },
                }}
              >
                {item.icon}
                <Typography variant="body2">{item.name}</Typography>
              </Link>
            ))}
          </nav>
        </Box>
      </Box>

      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", height: 60, borderBottom: 1, borderColor: "divider", bgcolor: "grey.800", px: 6 }}
        >
          <Link
            href="#"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 2,
              fontWeight: "bold",
              textDecoration: "none",
              color: "inherit",
              display: { lg: "none" },
            }}
          >
            <HomeIcon />
            <Typography variant="srOnly">Home</Typography>
          </Link>
          <IconButton onClick={handleMenuOpen} sx={{ borderRadius: "50%", border: 1, borderColor: "divider", size: "small" }}>
            <Avatar alt="User Avatar" src="/placeholder.svg" sx={{ height: 32, width: 32 }} />
          </IconButton>
          <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
            <MenuItem onClick={handleMenuClose}>My Account</MenuItem>
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
        {/* Main Content */}
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 4 }}>{renderMainContent()}</Box>
      </Box>
    </Box>
  );
}
