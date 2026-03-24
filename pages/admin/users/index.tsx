import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Avatar,
  TextField,
  InputAdornment,
  CircularProgress,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import EmailIcon from "@mui/icons-material/Email";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { useAuth, UserRole } from "@/contexts/AuthContext";
import { getUsers, updateUserRole, toggleUserBlock, User } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";

export default function UsersPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [users, setUsers] = useState<User[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [roleFilter, setRoleFilter] = useState<string>("all");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [blockDialogOpen, setBlockDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [userToView, setUserToView] = useState<User | null>(null);
  const [editRole, setEditRole] = useState<UserRole>("user");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      loadUsers();
    }
  }, [isAuthenticated, isAdmin]);

  const loadUsers = async () => {
    try {
      setLoadingData(true);
      setError("");
      const data = await getUsers();
      setUsers(data);
    } catch (error: any) {
      console.error("Error loading users:", error);
      setError(error?.message || "Failed to load users");
    } finally {
      setLoadingData(false);
    }
  };

  const handleView = (user: User) => {
    setUserToView(user);
    setViewDialogOpen(true);
  };

  const handleEdit = (user: User) => {
    setSelectedUser(user);
    setEditRole(user.role);
    setEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!selectedUser) return;

    try {
      const updatedUser = await updateUserRole(selectedUser.id, editRole);
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setEditDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error updating user:", error);
      setError(error?.message || "Failed to update user");
      // Update UI anyway for better UX
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? { ...u, role: editRole } : u))
      );
      setEditDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const handleBlock = (user: User) => {
    setSelectedUser(user);
    setBlockDialogOpen(true);
  };

  const confirmBlock = async () => {
    if (!selectedUser) return;

    try {
      const updatedUser = await toggleUserBlock(selectedUser.id);
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? updatedUser : u))
      );
      setBlockDialogOpen(false);
      setSelectedUser(null);
    } catch (error: any) {
      console.error("Error blocking user:", error);
      setError(error?.message || "Failed to block/unblock user");
      // Update UI anyway for better UX
      const newStatus = selectedUser.status === "active" ? "blocked" : "active";
      setUsers(
        users.map((u) => (u.id === selectedUser.id ? { ...u, status: newStatus } : u))
      );
      setBlockDialogOpen(false);
      setSelectedUser(null);
    }
  };

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === "all" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getRoleColor = (role: UserRole) => {
    switch (role) {
      case "admin":
        return "error";
      case "field_admin":
        return "warning";
      case "match_admin":
        return "info";
      case "agent":
        return "secondary";
      default:
        return "default";
    }
  };

  if (loading || loadingData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout title="Manage Users">
        <Head>
          <title>Manage Users - Admin - KickUp</title>
          <meta name="description" content="Manage users on KickUp platform" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h4"
              component="h1"
              sx={{
                fontWeight: 700,
                mb: 2,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Manage Users
            </Typography>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search users by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ maxWidth: 400 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "primary.main" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <FormControl sx={{ minWidth: 200 }}>
                <InputLabel>Filter by Role</InputLabel>
                <Select
                  value={roleFilter}
                  onChange={(e) => setRoleFilter(e.target.value)}
                  label="Filter by Role"
                >
                  <MenuItem value="all">All Roles</MenuItem>
                  <MenuItem value="user">User</MenuItem>
                  <MenuItem value="agent">Agent (Stadium owner)</MenuItem>
                  <MenuItem value="admin">Admin</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Users Table */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              {filteredUsers.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No users found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Email</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Role</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Join Date</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredUsers.map((user) => (
                        <TableRow key={user.id} hover>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                              <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                                {user.name.charAt(0).toUpperCase()}
                              </Avatar>
                              {user.name}
                            </Box>
                          </TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>
                            <Chip
                              label={user.role.replace("_", " ").toUpperCase()}
                              size="small"
                              color={getRoleColor(user.role) as any}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>
                            <Chip
                              label={user.status}
                              size="small"
                              color={user.status === "active" ? "success" : "default"}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell>{user.joinDate}</TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleView(user)}
                              title="View Details"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => handleEdit(user)}
                              title="Edit Role"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color={user.status === "active" ? "error" : "success"}
                              onClick={() => handleBlock(user)}
                              title={user.status === "active" ? "Block User" : "Unblock User"}
                            >
                              {user.status === "active" ? <BlockIcon /> : <CheckCircleIcon />}
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              )}
            </CardContent>
          </Card>

          {/* View User Details Dialog */}
          <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InfoIcon color="primary" />
                User Details
              </Box>
            </DialogTitle>
            <DialogContent>
              {userToView && (
                <Box sx={{ pt: 2 }}>
                  <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 80, height: 80, mb: 2, fontSize: 32 }}>
                      {userToView.name.charAt(0).toUpperCase()}
                    </Avatar>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                      {userToView.name}
                    </Typography>
                    <Chip
                      label={userToView.role.replace("_", " ").toUpperCase()}
                      size="small"
                      color={getRoleColor(userToView.role) as any}
                      sx={{ fontWeight: 600, mb: 1 }}
                    />
                  </Box>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <EmailIcon sx={{ fontSize: 16 }} />
                        Email
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {userToView.email}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                        <CalendarTodayIcon sx={{ fontSize: 16 }} />
                        Join Date
                      </Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(userToView.joinDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric"
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Status
                      </Typography>
                      <Chip
                        label={userToView.status}
                        size="small"
                        color={userToView.status === "active" ? "success" : "default"}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                        Role
                      </Typography>
                      <Chip
                        label={userToView.role.replace("_", " ").toUpperCase()}
                        size="small"
                        color={getRoleColor(userToView.role) as any}
                        sx={{ fontWeight: 600 }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: "none" }}>
                Close
              </Button>
              {userToView && (
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    handleEdit(userToView);
                  }}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Edit User
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Edit User Dialog */}
          <Dialog open={editDialogOpen} onClose={() => setEditDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>Edit User Role</DialogTitle>
            <DialogContent>
              {selectedUser && (
                <Box sx={{ pt: 2 }}>
                  <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                    Editing: {selectedUser.name} ({selectedUser.email})
                  </Typography>
                  <FormControl fullWidth>
                    <InputLabel>Role</InputLabel>
                    <Select
                      value={editRole}
                      onChange={(e) => setEditRole(e.target.value as UserRole)}
                      label="Role"
                    >
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="user">User</MenuItem>
                      <MenuItem value="agent">Agent (Stadium owner)</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setEditDialogOpen(false)} sx={{ textTransform: "none" }}>
                Cancel
              </Button>
              <Button
                onClick={handleSaveEdit}
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Save
              </Button>
            </DialogActions>
          </Dialog>

          {/* Block/Unblock User Dialog */}
          <Dialog open={blockDialogOpen} onClose={() => setBlockDialogOpen(false)}>
            <DialogTitle>
              {selectedUser?.status === "active" ? "Block User" : "Unblock User"}
            </DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to {selectedUser?.status === "active" ? "block" : "unblock"}{" "}
                {selectedUser?.name}?{" "}
                {selectedUser?.status === "active"
                  ? "They will not be able to access the platform."
                  : "They will regain access to the platform."}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setBlockDialogOpen(false)} sx={{ textTransform: "none" }}>
                Cancel
              </Button>
              <Button
                onClick={confirmBlock}
                color={selectedUser?.status === "active" ? "error" : "success"}
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                {selectedUser?.status === "active" ? "Block" : "Unblock"}
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </AdminLayout>
    </AdminRoute>
  );
}
