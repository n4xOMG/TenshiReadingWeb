import React from "react";
import { Box, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Divider } from "@mui/material";
import InboxIcon from "@mui/icons-material/Inbox";
import MailIcon from "@mui/icons-material/Mail";
import StarIcon from "@mui/icons-material/Star";
import SendIcon from "@mui/icons-material/Send";
import DraftsIcon from "@mui/icons-material/Drafts";
import DeleteIcon from "@mui/icons-material/Delete";
import ReportIcon from "@mui/icons-material/Report";
import { Collections } from "@mui/icons-material";
import { Link } from "react-router-dom";

const iconMapping = {
  Inbox: <InboxIcon />,
  Starred: <StarIcon />,
  Gallery: <Collections />,
  "Send email": <SendIcon />,
  Drafts: <DraftsIcon />,
  "All mail": <MailIcon />,
  Trash: <DeleteIcon />,
  Spam: <ReportIcon />,
};
const routeMapping = {
  Inbox: "/inbox",
  Starred: "/starred",
  Gallery: "/gallery",
  "Send email": "/send-email",
  Drafts: "/drafts",
  "All mail": "/all-mail",
  Trash: "/trash",
  Spam: "/spam",
};
export default function Sidebar({ onSidebarClose, open }) {
  const list = () => (
    <Box sx={{ width: 250 }} role="presentation" onClick={onSidebarClose}>
      <List>
        {["Inbox", "Starred", "Gallery", "Send email", "Drafts"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton component={Link} to={routeMapping[text]}>
              <ListItemIcon>{iconMapping[text]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        {["All mail", "Trash", "Spam"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton>
              <ListItemIcon>{iconMapping[text]}</ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <div>
      {["left"].map((anchor) => (
        <React.Fragment key={anchor}>
          <Drawer anchor="left" open={open} onClose={onSidebarClose}>
            {list("left")}
          </Drawer>
        </React.Fragment>
      ))}
    </div>
  );
}
