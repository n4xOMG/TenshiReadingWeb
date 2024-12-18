import { Person as UserIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import DehazeIcon from "@mui/icons-material/Dehaze";
import HomeIcon from "@mui/icons-material/Home";
import ImageIcon from "@mui/icons-material/Image";
import PeopleIcon from "@mui/icons-material/People";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import { Box, Button, Drawer, IconButton, List, ListItem, ListItemIcon, ListItemText, useMediaQuery, useTheme } from "@mui/material";
import React, { useState } from "react";
import { shallowEqual, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useAuthCheck } from "../../utils/useAuthCheck";
import HomeLandingPage from "./HomeLandingPage";
import mahiru from "./mahiru.png";
export default function UserPages() {
  const navigate = useNavigate();
  const { user } = useSelector((store) => store.auth, shallowEqual);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [isSidebarOpen, setIsSidebarOpen] = useState(!isSmallScreen);
  const { checkAuth, AuthDialog } = useAuthCheck();
  const menuItems = [
    { text: "Home", icon: <HomeIcon sx={{ fontSize: 20, color: "text.secondary" }} />, path: "/" },
    { text: "Gallery", icon: <ImageIcon sx={{ fontSize: 20, color: "text.secondary" }} />, path: "/gallery" },

    {
      text: "Characters Wiki",
      icon: <PeopleIcon sx={{ fontSize: 20, color: "text.secondary" }} />,
      path: "https://otonari-no-tenshi.fandom.com/wiki/Otonari_no_Tenshi-sama_Wiki",
      external: true,
    },
    { text: "FAQ", icon: <QuestionAnswerIcon sx={{ fontSize: 20, color: "text.secondary" }} />, path: "/faq" },
  ];
  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    navigate("/sign-in");
  };
  if (user) {
    menuItems.push({ text: "Profile", icon: <UserIcon sx={{ fontSize: 20, color: "text.secondary" }} />, path: "/profile" });
  }
  const handleProfile = checkAuth(() => {
    navigate("/profile");
  });
  return (
    <Box
      sx={{
        display: "grid",
        minHeight: "100vh",
        maxHeight: "100%",
        objectFit: "contain",
        width: "100%",
        gridTemplateColumns: isSmallScreen ? "1fr" : isSidebarOpen ? "280px 1fr" : "1fr",
        transition: "grid-template-columns 0.3s ease-in-out",
      }}
    >
      {/* Sidebar */}
      <Drawer
        variant={isSmallScreen ? "temporary" : "persistent"}
        anchor="left"
        open={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        sx={{
          width: 256,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: 256,
            boxSizing: "border-box",
            transition: "width 0.3s ease-in-out",
          },
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <Box
            sx={{
              p: 2,
              borderBottom: 1,
              borderColor: "divider",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
              <Box component="img" src={mahiru} sx={{ width: 32, height: 32 }} alt="Logo" />
              <Box sx={{ ml: 2, fontSize: "h6.fontSize", fontWeight: "bold", color: "text.primary" }}>Tenshi</Box>
            </Box>
            <IconButton
              onClick={() => setIsSidebarOpen(false)}
              sx={{
                marginLeft: "auto",
                zIndex: 2,
                backgroundColor: "white",
                border: "1px solid",
                borderColor: "grey.300",
                "&:hover": {
                  backgroundColor: "grey.100",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>
          <Box sx={{ flexGrow: 1, p: 2 }}>
            <List>
              {menuItems.map((item, index) => (
                <ListItem
                  button
                  key={index}
                  component={item.external ? "a" : "div"}
                  href={item.external ? item.path : undefined}
                  target={item.external ? "_blank" : undefined}
                  rel={item.external ? "noopener noreferrer" : undefined}
                  onClick={() => {
                    if (!item.external) {
                      if (item.text === "Profile") {
                        handleProfile();
                      } else {
                        navigate(item.path);
                      }
                    }
                  }}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
          <Box sx={{ p: 2, borderTop: 1, borderColor: "divider" }}>
            {user?.role?.name === "ADMIN" && (
              <Button variant="outlined" onClick={() => navigate("/admin")} fullWidth>
                Admin
              </Button>
            )}
            {user ? (
              <Button variant="outlined" onClick={handleSignOut} fullWidth>
                Sign Out
              </Button>
            ) : (
              <Button variant="outlined" onClick={handleSignOut} fullWidth>
                Sign In
              </Button>
            )}
          </Box>
        </Box>
      </Drawer>

      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          transition: "width 0.3s ease-in-out",
        }}
      >
        {/* Main Content */}
        <Box sx={{ display: "flex", flex: 1, flexDirection: "column", gap: 4, pt: 1, px: isSmallScreen ? 2 : 5, overflow: "auto" }}>
          <HomeLandingPage />
        </Box>
      </Box>

      {!isSidebarOpen && (
        <IconButton
          onClick={() => setIsSidebarOpen(true)}
          sx={{
            position: "fixed",
            top: 16,
            left: 16,
            zIndex: 3,
            backgroundColor: "white",
            border: "1px solid",
            borderColor: "grey.300",
            "&:hover": {
              backgroundColor: "grey.100",
            },
          }}
        >
          <DehazeIcon />
        </IconButton>
      )}
      <AuthDialog />
    </Box>
  );
}
