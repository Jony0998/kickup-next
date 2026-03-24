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
  TextField,
  Grid,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "@/contexts/AuthContext";
import { createField } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";

export default function CreateFieldPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    size: "",
    indoorOutdoor: "Outdoor",
    price: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.name || !formData.location || !formData.size || !formData.price) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createField({
        name: formData.name,
        location: formData.location,
        size: formData.size,
        indoorOutdoor: formData.indoorOutdoor,
        price: parseFloat(formData.price),
        status: "active",
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/fields");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating field:", error);
      setError(error?.message || "Failed to create field. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  if (loading) {
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
      <AdminLayout title="Create Field">
      <Head>
        <title>Create Field - Admin - KickUp</title>
        <meta name="description" content="Create a new field" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Container maxWidth="md">
          {/* Header */}
          <Box sx={{ mb: 4 }}>
            <Button
              startIcon={<ArrowBackIcon />}
              onClick={() => router.back()}
              sx={{ mb: 2, textTransform: "none" }}
            >
              Back
            </Button>
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
              Create New Field
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Field created successfully! Redirecting...
            </Alert>
          )}

          {/* Form */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Field Name"
                      value={formData.name}
                      onChange={handleChange("name")}
                      required
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Location"
                      value={formData.location}
                      onChange={handleChange("location")}
                      required
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Size (e.g., 40x20m)"
                      value={formData.size}
                      onChange={handleChange("size")}
                      required
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth required>
                      <InputLabel>Type</InputLabel>
                      <Select
                        value={formData.indoorOutdoor}
                        onChange={handleChange("indoorOutdoor")}
                        label="Type"
                        disabled={isSubmitting}
                      >
                        <MenuItem value="Indoor">Indoor</MenuItem>
                        <MenuItem value="Outdoor">Outdoor</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Price per Hour (₩)"
                      type="number"
                      value={formData.price}
                      onChange={handleChange("price")}
                      required
                      disabled={isSubmitting}
                      inputProps={{ min: 0 }}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <TextField
                      fullWidth
                      label="Description"
                      multiline
                      rows={4}
                      value={formData.description}
                      onChange={handleChange("description")}
                      disabled={isSubmitting}
                    />
                  </Grid>

                  <Grid item xs={12}>
                    <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
                      <Button
                        variant="outlined"
                        onClick={() => router.back()}
                        disabled={isSubmitting}
                        sx={{ textTransform: "none" }}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        variant="contained"
                        disabled={isSubmitting}
                        sx={{
                          textTransform: "none",
                          fontWeight: 600,
                          background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                          },
                        }}
                      >
                        {isSubmitting ? (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <CircularProgress size={20} sx={{ color: "white" }} />
                            <span>Creating...</span>
                          </Box>
                        ) : (
                          "Create Field"
                        )}
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </form>
            </CardContent>
          </Card>
        </Container>
      </AdminLayout>
    </AdminRoute>
  );
}

