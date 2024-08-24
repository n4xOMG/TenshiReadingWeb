import MoreVertIcon from "@mui/icons-material/MoreVert";
import {
  Avatar,
  Badge,
  Card,
  CardContent,
  CardHeader,
  IconButton,
  Input,
  Menu,
  MenuItem,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from "@mui/material";
import React, { useMemo, useState } from "react";
export default function ManageUser() {
  const [searchTerm, setSearchTerm] = useState("");
  const [anchorEl, setAnchorEl] = useState(null);
  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);
  const filteredUsers = useMemo(() => {
    return [
      {
        name: "John Doe",
        email: "john@example.com",
        role: "Admin",
        status: "Active",
      },
      {
        name: "Jane Appleseed",
        email: "jane@example.com",
        role: "Editor",
        status: "Active",
      },
      {
        name: "Sarah Miller",
        email: "sarah@example.com",
        role: "Moderator",
        status: "Pending",
      },
      {
        name: "Michael Johnson",
        email: "michael@example.com",
        role: "User",
        status: "Blocked",
      },
    ].filter((user) => {
      return (
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.status.toLowerCase().includes(searchTerm.toLowerCase())
      );
    });
  }, [searchTerm]);
  return (
    <div>
      {/* Statistics Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <Card className="shadow-md">
          <CardHeader title="Total Users" subheader="All registered users" />
          <CardContent>
            <div className="text-4xl font-bold">1,234</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader title="Active Users" subheader="Users who have logged in recently" />
          <CardContent>
            <div className="text-4xl font-bold">987</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader title="Pending Approvals" subheader="Users awaiting approval" />
          <CardContent>
            <div className="text-4xl font-bold">45</div>
          </CardContent>
        </Card>
        <Card className="shadow-md">
          <CardHeader title="Blocked Users" subheader="Users who have been blocked" />
          <CardContent>
            <div className="text-4xl font-bold">12</div>
          </CardContent>
        </Card>
      </div>

      {/* User Table */}
      <Card className="shadow-md">
        <CardHeader title="User List" subheader="Manage all registered users">
          <Input
            type="search"
            placeholder="Search users..."
            className="ml-auto h-9 w-full rounded-md border px-4 text-sm"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </CardHeader>
        <CardContent>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Role</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8" src="/placeholder-user.jpg" alt={user.name}>
                        {user.name.charAt(0)}
                      </Avatar>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground">{user.email}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Badge color={user.status === "Active" ? "success" : user.status === "Pending" ? "warning" : "error"}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={handleMenuOpen} size="small">
                      <MoreVertIcon />
                    </IconButton>
                    <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={handleMenuClose}>
                      <MenuItem>Edit</MenuItem>
                      <MenuItem>Suspend</MenuItem>
                      <MenuItem>Delete</MenuItem>
                    </Menu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
