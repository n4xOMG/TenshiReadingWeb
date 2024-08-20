import HelpOutlineIcon from "@mui/icons-material/HelpOutline";
import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";
import LibraryBooksIcon from "@mui/icons-material/LibraryBooks";
import PeopleIcon from "@mui/icons-material/People";
import { Avatar, Box, IconButton, Menu, MenuItem, Typography } from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import ManageTagPage from "../../components/AdminPageComponents/ManageTagPage";
import ImageGalleryPage from "../Gallery/ImageGalleryPage";
import LandingPage from "./LandingPage";
export default function UserPages() {
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const [currentPage, setCurrentPage] = useState("users");

  const menuItems = [
    { name: "Home", page: "home", icon: <HomeIcon /> },
    { name: "Books", page: "books", icon: <LibraryBooksIcon /> },
    { name: "Gallery", page: "gallery", icon: <ImageIcon /> },
    { name: "Characters", page: "characters", icon: <PeopleIcon /> },
    { name: "FAQ", page: "faq", icon: <HelpOutlineIcon /> },
  ];
  const renderMainContent = () => {
    switch (currentPage) {
      case "home":
        return <LandingPage />;
      case "gallery":
        return <ImageGalleryPage />;
      case "tags":
        return <ManageTagPage />;
      default:
        return <LandingPage />;
    }
  };

  return (
    <Box
      sx={{ display: "grid", minHeight: "100vh", maxHeight: "100%", objectFit: "contain", width: "100%", gridTemplateColumns: "280px 1fr" }}
    >
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
          bgcolor: "grey.100",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", height: 60, borderBottom: 1, borderColor: "divider", px: 6 }}>
          <Link
            href="/"
            sx={{ display: "flex", alignItems: "center", gap: 2, fontWeight: "bold", textDecoration: "none", color: "grey.100" }}
          >
            <HomeIcon sx={{ height: 24, width: 24 }} />
            <Typography variant="h6">Acme Admin</Typography>
          </Link>
        </Box>
        <Box sx={{ flex: 1, overflow: "auto", py: 2 }}>
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
                  bgcolor: currentPage === item.page ? "grey.400" : "transparent",
                  "&:hover": {
                    bgcolor: "grey.400",
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

      <Box sx={{ display: "flex", flexDirection: "column", height: "100vh" }}>
        <Box
          sx={{ display: "flex", alignItems: "center", height: 60, borderBottom: 1, borderColor: "divider", bgcolor: "grey.100", px: 6 }}
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
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 4, p: 4, overflow: "auto" }}>{renderMainContent()}</Box>
      </Box>
    </Box>
  );
}
