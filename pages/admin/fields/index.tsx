import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import {
  Box,
  Container,
  Typography,
  Button,
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
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  TextField,
  InputAdornment,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SearchIcon from "@mui/icons-material/Search";
import VisibilityIcon from "@mui/icons-material/Visibility";
import InfoIcon from "@mui/icons-material/Info";
import { useAuth } from "@/contexts/AuthContext";
import { getFields, deleteField, Field } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";

export default function FieldsPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [fields, setFields] = useState<Field[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [fieldToDelete, setFieldToDelete] = useState<string | null>(null);
  const [fieldToView, setFieldToView] = useState<Field | null>(null);
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
      loadFields();
    }
  }, [isAuthenticated, isAdmin]);

  const loadFields = async () => {
    try {
      setLoadingData(true);
      setError("");
      const data = await getFields();
      setFields(data);
    } catch (error: any) {
      console.error("Error loading fields:", error);
      setError(error?.message || "Failed to load fields");
    } finally {
      setLoadingData(false);
    }
  };

  const handleView = (field: Field) => {
    setFieldToView(field);
    setViewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setFieldToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!fieldToDelete) return;

    try {
      await deleteField(fieldToDelete);
      setFields(fields.filter((f) => f.id !== fieldToDelete));
      setDeleteDialogOpen(false);
      setFieldToDelete(null);
    } catch (error: any) {
      console.error("Error deleting field:", error);
      setError(error?.message || "Failed to delete field");
    }
  };

  const filteredFields = fields.filter(
    (field) =>
      field.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      field.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      <AdminLayout title="Manage Fields">
        <Head>
          <title>Manage Fields - Admin - KickUp</title>
          <meta name="description" content="Manage fields on KickUp platform" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}
            >
              <Typography
                variant="h4"
                component="h1"
                sx={{
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Manage Fields
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/admin/fields/create")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Add Field
              </Button>
            </Box>
            <TextField
              fullWidth
              placeholder="Search fields by name or location..."
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
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Fields Table */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              {filteredFields.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No fields found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Field Name</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Location</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Size</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Price</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredFields.map((field) => (
                        <TableRow key={field.id} hover>
                          <TableCell>{field.name}</TableCell>
                          <TableCell>
                            <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                              <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                              {field.location}
                            </Box>
                          </TableCell>
                          <TableCell>{field.size}</TableCell>
                          <TableCell>{field.indoorOutdoor}</TableCell>
                          <TableCell>₩{field.price.toLocaleString()}/hour</TableCell>
                          <TableCell>
                            <Chip
                              label={field.status}
                              size="small"
                              color={field.status === "active" ? "success" : "default"}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleView(field)}
                              title="View Details"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/admin/fields/${field.id}/edit`)}
                              title="Edit"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(field.id)}
                              title="Delete"
                            >
                              <DeleteIcon />
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

          {/* View Field Details Dialog */}
          <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InfoIcon color="primary" />
                Field Details
              </Box>
            </DialogTitle>
            <DialogContent>
              {fieldToView && (
                <Box sx={{ pt: 2 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {fieldToView.name}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Location
                        </Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {fieldToView.location}
                          </Typography>
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Size
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {fieldToView.size}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Type
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {fieldToView.indoorOutdoor}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Price per Hour
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500, color: "primary.main" }}>
                          ₩{fieldToView.price.toLocaleString()}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Status
                        </Typography>
                        <Chip
                          label={fieldToView.status}
                          size="small"
                          color={fieldToView.status === "active" ? "success" : "default"}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                    </Box>
                  </Box>
                </Box>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setViewDialogOpen(false)} sx={{ textTransform: "none" }}>
                Close
              </Button>
              {fieldToView && (
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    router.push(`/admin/fields/${fieldToView.id}/edit`);
                  }}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Edit Field
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Field</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this field? This action cannot be undone.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDeleteDialogOpen(false)} sx={{ textTransform: "none" }}>
                Cancel
              </Button>
              <Button
                onClick={confirmDelete}
                color="error"
                variant="contained"
                sx={{ textTransform: "none" }}
              >
                Delete
              </Button>
            </DialogActions>
          </Dialog>
        </Container>
      </AdminLayout>
    </AdminRoute>
  );
}
