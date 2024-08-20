import { AppBar, Avatar, Box, IconButton, InputBase, Link, Menu, MenuItem, Toolbar, Typography } from "@mui/material";
import React, { useState } from "react";
import MenuBookIcon from "@mui/icons-material/MenuBook";
import SearchIcon from "@mui/icons-material/Search";
export default function Headbar() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };
  return (
    <AppBar position="static" sx={{ borderBottom: 1, borderColor: "divider" }}>
      <Toolbar sx={{ justifyContent: "space-between", px: { xs: 4, md: 6 }, height: 56 }}>
        <Link href="#" sx={{ display: "flex", alignItems: "center", textDecoration: "none" }}>
          <MenuBookIcon sx={{ height: 24, width: 24 }} />
          <Typography variant="h6" component="span" sx={{ ml: 1, fontWeight: "bold" }}>
            The Angle Next Door
          </Typography>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Box sx={{ position: "relative", flex: 1, maxWidth: "md" }}>
            <SearchIcon sx={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", color: "text.secondary" }} />
            <InputBase
              type="search"
              placeholder="Search books..."
              sx={{ width: "100%", borderRadius: 1, bgcolor: "background.paper", pl: 5, pr: 2, py: 1, fontSize: "0.875rem" }}
            />
          </Box>
          <IconButton onClick={handleMenuOpen}>
            <Avatar src="/placeholder-user.jpg" alt="@enchantedreader" sx={{ height: 36, width: 36 }} />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem disabled>
              <Typography variant="subtitle1">Enchanted Reader</Typography>
            </MenuItem>
            <MenuItem divider />
            <MenuItem onClick={handleMenuClose}>My Library</MenuItem>
            <MenuItem onClick={handleMenuClose}>Settings</MenuItem>
            <MenuItem divider />
            <MenuItem onClick={handleMenuClose}>Logout</MenuItem>
          </Menu>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
