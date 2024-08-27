import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  CircularProgress,
  IconButton,
  InputBase,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import { debounce } from "lodash";
import React, { useCallback, useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import DeleteUserModal from "../../components/AdminPageComponents/ManageUserPageComponents/DeleteUserModal";
import EditUserModal from "../../components/AdminPageComponents/ManageUserPageComponents/EditUserModal";
import HandleSuspendUserModal from "../../components/AdminPageComponents/ManageUserPageComponents/HandleSuspendUserModal";
import { getAllUsers } from "../../redux/user/user.action";
export default function ManageUser() {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(0);
  const [openModal, setOpenModal] = useState({ type: null, data: null });
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);

  const handleOpenModal = (type, data = null) => {
    setLoading(false);
    setOpenModal({ type, data });
  };

  const handleCloseModal = () => setOpenModal({ type: null, data: null });

  const handleMenuOpen = (event, user) => {
    setAnchorEl(event.currentTarget);
    setSelectedUser(user);
  };

  const handleMenuClose = () => setAnchorEl(null);

  const fetchUsers = useCallback(
    debounce(async (searchTerm, page) => {
      setLoading(true);
      try {
        const results = await dispatch(getAllUsers(page, 5, searchTerm));
        setUsers(results.payload);
      } catch (e) {
        console.log("Error fetching users: ", e);
      } finally {
        setLoading(false);
      }
    }, 500),
    [dispatch]
  );

  useEffect(() => {
    fetchUsers(searchTerm, page);
  }, [searchTerm, page, fetchUsers]);

  return (
    <Box sx={{ maxWidth: "100%", width: "100%", height: "100%" }}>
      {loading ? (
        <Box sx={{ display: "flex", justifyContent: "center" }}>
          <CircularProgress />
        </Box>
      ) : (
        <>
          {/* User Table */}
          <Card sx={{ boxShadow: 3, mt: 1 }}>
            <CardHeader
              title="User List"
              subheader="Manage all registered users"
              action={
                <InputBase
                  type="search"
                  placeholder="Search users..."
                  sx={{ ml: "auto", height: "36px", width: "100%", borderRadius: 1, border: 1, px: 2, fontSize: "14px" }}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              }
            />
            <CardContent>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Role</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users?.map((user, index) => (
                    <TableRow key={index} sx={{ "&:hover": { backgroundColor: "grey.100" } }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar sx={{ height: 32, width: 32 }} src="/placeholder-user.jpg" alt={user.username ? user.username : "NA"}>
                            {user.username ? user.username.charAt(0) : "NA"}
                          </Avatar>
                          <Box>
                            <Box sx={{ fontWeight: "medium" }}>{user.username ? user.username : "Anonymous"}</Box>
                            <Box sx={{ fontSize: "0.875rem", color: "text.secondary" }}>{user.email}</Box>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.role.name}</TableCell>
                      <TableCell>
                        <IconButton onClick={(event) => handleMenuOpen(event, user)} size="small">
                          <MoreVertIcon />
                        </IconButton>
                        <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                          <MenuItem onClick={() => handleOpenModal("edit", selectedUser)}>Edit</MenuItem>
                          <MenuItem onClick={() => handleOpenModal(selectedUser.isSuspended ? "unsuspend" : "suspend", selectedUser)}>
                            {selectedUser?.isSuspended ? "Unsuspend" : "Suspend"}
                          </MenuItem>
                          <MenuItem onClick={() => handleOpenModal("delete", selectedUser)}>Delete</MenuItem>
                        </Menu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                <Button
                  onClick={() => setPage(page - 1)}
                  disabled={page === 0}
                  sx={{
                    px: 4,
                    py: 2,
                    backgroundColor: "primary.main",
                    color: "white",
                    borderRadius: 3,
                    "&:disabled": { backgroundColor: "grey.300" },
                  }}
                >
                  Previous
                </Button>
                <Button onClick={() => setPage(page + 1)} sx={{ px: 4, py: 2, backgroundColor: "black", color: "white", borderRadius: 3 }}>
                  Next
                </Button>
              </Box>
            </CardContent>
          </Card>
        </>
      )}
      {openModal.type === "edit" && <EditUserModal page={page} open={true} onClose={handleCloseModal} userDetails={openModal.data} />}
      {openModal.type === "delete" && <DeleteUserModal page={page} open={true} onClose={handleCloseModal} deleteUser={openModal.data} />}
      {openModal.type === "suspend" && (
        <HandleSuspendUserModal page={page} open={true} onClose={handleCloseModal} user={openModal.data} actionType={openModal.type} />
      )}
      {openModal.type === "unsuspend" && (
        <HandleSuspendUserModal page={page} open={true} onClose={handleCloseModal} user={openModal.data} actionType={openModal.type} />
      )}
    </Box>
  );
}
