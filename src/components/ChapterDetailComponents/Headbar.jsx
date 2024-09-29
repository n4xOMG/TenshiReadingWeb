import { ArrowBack } from "@mui/icons-material";
import { AppBar, Box, Button, IconButton, Toolbar, Typography } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

export default function Headbar({ chapter, onNavigate }) {
  const navigate = useNavigate();
  const menuItems = [
    { name: "Books", href: "/books" },
    { name: "Gallery", href: "/gallery" },
  ];

  return (
    <AppBar
      position="static"
      sx={{ position: "fixed", bgcolor: "#050505", opacity: "90%", borderBottom: 1, borderColor: "divider", top: 0 }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton sx={{ color: "white" }} edge="start" aria-label="go back" onClick={onNavigate}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ display: { xs: "none", sm: "block" }, color: "white" }}>
            Tenshi
          </Typography>
        </Box>
        <Typography variant="h6" sx={{ position: "absolute", left: "50%", transform: "translateX(-50%)", color: "white" }}>
          Ch.{chapter.chapterNum}: {chapter.title}
        </Typography>
        <Box sx={{ display: { xs: "none", md: "flex" }, gap: 2 }}>
          {menuItems.map((item) => (
            <Button key={item.name} onClick={() => navigate(item.href)} sx={{ color: "white" }}>
              {item.name}
            </Button>
          ))}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
