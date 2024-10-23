import { Close, Search } from "@mui/icons-material";
import { Box, Button, Chip, Drawer, IconButton, TextField, Typography } from "@mui/material";
import React from "react";

export default function SideDrawerFilter({ open, tags, filter, setFilter, clearFilters, selectedTags, onToggleSideDrawer, onToggleTag }) {
  return (
    <Drawer anchor="right" open={open} onClose={onToggleSideDrawer}>
      <Box sx={{ width: "auto", p: 2 }}>
        <Box sx={{ mb: 2 }}>
          <Typography variant="h6">Filter Gallery</Typography>
          <Typography variant="body2" color="text.secondary">
            Refine your image search with these filters
          </Typography>
        </Box>
        <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Search sx={{ fontSize: 20, color: "text.secondary" }} />
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search images..."
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              InputProps={{
                endAdornment: filter && (
                  <IconButton size="small" onClick={() => setFilter("")}>
                    <Close sx={{ fontSize: 20 }} />
                  </IconButton>
                ),
              }}
            />
          </Box>
          <Box>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              Quick filters:
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {tags?.map((tag) => (
                <Chip
                  key={tag.id}
                  label={tag.name}
                  variant={selectedTags.includes(tag.name) ? "filled" : "outlined"}
                  onClick={() => onToggleTag(tag.name)}
                  sx={{
                    cursor: "pointer",
                    bgcolor: selectedTags.includes(tag.name) ? "#050505" : "transparent",
                    color: selectedTags.includes(tag.name) ? "white" : "inherit",
                    borderColor: selectedTags.includes(tag.name) ? "#050505" : "inherit",
                    "& .MuiChip-label": {
                      color: selectedTags.includes(tag.name) ? "white" : "inherit",
                    },
                  }}
                />
              ))}
            </Box>
          </Box>
        </Box>
        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
          <Button variant="outlined" onClick={clearFilters} sx={{ borderColor: "black", color: "black" }}>
            Clear All
          </Button>
          <Button
            variant="contained"
            onClick={onToggleSideDrawer}
            sx={{
              backgroundColor: "black",
              color: "white",
              borderRadius: 2,
              alignSelf: "flex-start",
              "&:hover": {
                backgroundColor: "#fdf6e3",
                color: "black",
              },
            }}
          >
            Apply Filters
          </Button>
        </Box>
      </Box>
    </Drawer>
  );
}
