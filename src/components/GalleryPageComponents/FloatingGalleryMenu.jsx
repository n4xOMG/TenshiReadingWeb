import { Home as HomeIcon, Person as UserIcon } from "@mui/icons-material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HelpIcon from "@mui/icons-material/Help";
import PlagiarismIcon from "@mui/icons-material/Plagiarism";
import { Box, IconButton, Tooltip, useTheme } from "@mui/material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
const navItems = [
  { name: "Home", icon: <HomeIcon sx={{ fontSize: 20, color: "text.secondary" }} />, path: "/", description: "Return to the main page" },
  {
    name: "Wiki",
    icon: <PlagiarismIcon sx={{ fontSize: 20, color: "text.secondary" }} />,
    path: "https://otonari-no-tenshi.fandom.com/wiki/Otonari_no_Tenshi-sama_Wiki",
    description: "Fandom wiki",
    external: true,
  },
  {
    name: "FAQ",
    icon: <HelpIcon sx={{ fontSize: 20, color: "text.secondary" }} />,
    path: "/faq",
    description: "Frequently Asked Questions",
  },
];

const FloatingGalleryMenu = ({ onToggleSideDrawer }) => {
  const { user } = useSelector((store) => store.auth);
  const navItemsCopy = [...navItems];
  const navigate = useNavigate();
  const theme = useTheme();

  if (user && !navItemsCopy.some((item) => item.name === "Profile")) {
    navItemsCopy.push({
      name: "Profile",
      icon: <UserIcon sx={{ fontSize: 20, color: "text.secondary" }} />,
      path: "/profile",
      description: "Your account information",
    });
  }

  return (
    <Box
      sx={{
        position: "fixed",
        bottom: 16,
        left: "50%",
        transform: "translateX(-50%)",
        bgcolor: "background.paper",
        borderRadius: 2,
        boxShadow: 3,
        p: { xs: 1, sm: 2 },
        display: "flex",
        alignItems: "center",
        gap: 1,
        zIndex: theme.zIndex.drawer + 2,
        height: "auto",
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
        {navItemsCopy.map((navItem) => (
          <Tooltip
            key={navItem.name}
            title={
              <div>
                <p>{navItem.name}</p>
                <p style={{ fontSize: "0.875rem", color: "text.secondary" }}>{navItem.description}</p>
              </div>
            }
          >
            {navItem.external ? (
              <Box
                component={navItem.external ? "a" : "div"}
                href={navItem.path}
                target="_blank"
                rel="noopener noreferrer"
                sx={{ textDecoration: "none" }}
              >
                <IconButton>{navItem.icon}</IconButton>
                <span className="sr-only">{navItem.name}</span>
              </Box>
            ) : (
              <IconButton onClick={() => navigate(navItem.path)}>{navItem.icon}</IconButton>
            )}
          </Tooltip>
        ))}
        <Tooltip
          title={
            <div>
              <p>Filters</p>
              <p style={{ fontSize: "0.875rem", color: "text.secondary" }}>Apply filters to the gallery</p>
            </div>
          }
        >
          <IconButton variant="text" size="small" sx={{ borderRadius: "50%" }} onClick={onToggleSideDrawer}>
            <FilterAltIcon sx={{ fontSize: 24 }} />
            <span className="sr-only">Filters</span>
          </IconButton>
        </Tooltip>
      </Box>
    </Box>
  );
};

export default FloatingGalleryMenu;
