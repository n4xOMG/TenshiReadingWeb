import { Home as HomeIcon, Person as UserIcon } from "@mui/icons-material";
import CloseIcon from "@mui/icons-material/Close";
import ImageIcon from "@mui/icons-material/Image";
import PeopleIcon from "@mui/icons-material/People";
import QuestionAnswerIcon from "@mui/icons-material/QuestionAnswer";
import {
  Backdrop,
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import React from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import logo from "../../pages/HomePage/mahiru.png";
import { useAuthCheck } from "../../utils/useAuthCheck";
export default function Sidebar({ isSidebarOpen, isBackdropOpen, setIsSidebarOpen }) {
  const { user } = useSelector((store) => store.auth);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
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
  if (user) {
    menuItems.push({ text: "Profile", icon: <UserIcon sx={{ fontSize: 20, color: "text.secondary" }} />, path: "/profile" });
  }
  const handleSignOut = () => {
    localStorage.removeItem("jwt");
    navigate("/sign-in");
  };
  const handleProfile = checkAuth(() => {
    navigate("/profile");
  });
  return (
    <>
      <Backdrop open={isSidebarOpen && isBackdropOpen} onClick={() => setIsSidebarOpen(false)} sx={{ zIndex: 1 }} />
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
            <Box sx={{ display: "flex", alignItems: "center" }}>
              <Box component="img" src={logo} sx={{ width: 32, height: 32 }} alt="Logo" />
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
      <AuthDialog />
    </>
  );
}
