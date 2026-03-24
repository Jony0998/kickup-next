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
import { getFields, createMatch, Field } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";
import { SKILL_LEVELS } from "@/lib/skillLevels";

interface FieldOption {
  id: string;
  name: string;
}

export default function CreateMatchPage() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, isAgent, loading } = useAuth();
  const [formData, setFormData] = useState({
    fieldId: "",
    date: "",
    time: "",
    maxParticipants: "",
    gender: "",
    level: "",
    description: "",
  });
  const [fields, setFields] = useState<FieldOption[]>([]);
  const [loadingFields, setLoadingFields] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    } else if (!loading && !isAdmin && !isAgent) {
      router.push("/");
    }
  }, [isAuthenticated, isAdmin, isAgent, loading, router]);

  useEffect(() => {
    if (isAuthenticated && (isAdmin || isAgent)) {
      loadFields();
    }
  }, [isAuthenticated, isAdmin, isAgent]);

  const loadFields = async () => {
    try {
      setLoadingFields(true);
      const filter = isAgent ? { ownerId: user?.id } : {};
      const data = await getFields(filter);
      setFields(
        data.map((f) => ({
          id: f.id,
          name: f.name,
        }))
      );
    } catch (error) {
      console.error("Error loading fields:", error);
      // Fallback to mock data
      setFields([
        { id: "1", name: "KickUp Stadium Gasan Digital Empire Field 2" },
        { id: "2", name: "Seoul Eunpyeong Lotte Mall Field A" },
      ]);
    } finally {
      setLoadingFields(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    // Validation
    if (!formData.fieldId || !formData.date || !formData.time || !formData.maxParticipants) {
      setError("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);

    try {
      await createMatch({
        fieldId: formData.fieldId,
        field: fields.find((f) => f.id === formData.fieldId)?.name,
        date: formData.date,
        time: formData.time,
        maxParticipants: parseInt(formData.maxParticipants),
        gender: formData.gender || "all",
        level: formData.level || "all",
        description: formData.description || "",
      });
      setSuccess(true);
      setTimeout(() => {
        router.push("/admin/matches");
      }, 1500);
    } catch (error: any) {
      console.error("Error creating match:", error);
      setError(error?.message || "Failed to create match. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string) => (e: any) => {
    setFormData({ ...formData, [field]: e.target.value });
  };

  if (loading || loadingFields) {
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
      <AdminLayout title="Create Match">
        <Head>
          <title>Create Match - Admin - KickUp</title>
          <meta name="description" content="Create a new match" />
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
              Create New Match
            </Typography>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }}>
              Match created successfully! Redirecting...
            </Alert>
          )}

          {/* Form */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <form onSubmit={handleSubmit}>
                <Grid container spacing={3}>
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel>Field</InputLabel>
                      <Select
                        value={formData.fieldId}
                        onChange={handleChange("fieldId")}
                        label="Field"
                        disabled={isSubmitting}
                      >
                        {fields.map((field) => (
                          <MenuItem key={field.id} value={field.id}>
                            {field.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Date"
                      type="date"
                      value={formData.date}
                      onChange={handleChange("date")}
                      required
                      disabled={isSubmitting}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Time"
                      type="time"
                      value={formData.time}
                      onChange={handleChange("time")}
                      required
                      disabled={isSubmitting}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <TextField
                      fullWidth
                      label="Max Participants"
                      type="number"
                      value={formData.maxParticipants}
                      onChange={handleChange("maxParticipants")}
                      required
                      disabled={isSubmitting}
                      inputProps={{ min: 1, max: 20 }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={6}>
                    <FormControl fullWidth>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={handleChange("gender")}
                        label="Gender"
                        disabled={isSubmitting}
                      >
                        <MenuItem value="all">All Genders</MenuItem>
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="mixed">Mixed</MenuItem>
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={formData.level}
                        onChange={handleChange("level")}
                        label="Level"
                        disabled={isSubmitting}
                      >
                        <MenuItem value="all">All Levels</MenuItem>
                        {SKILL_LEVELS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.value}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
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
                          "Create Match"
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
