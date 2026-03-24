import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { createGuestPost } from "@/lib/guestRecruitmentApi";
import { useAuth } from "@/contexts/AuthContext";
import { SKILL_LEVELS } from "@/lib/skillLevels";

export default function CreateGuestPostPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    matchDate: "",
    matchTime: "",
    location: "",
    field: "",
    gender: "",
    format: "",
    level: "",
    needed: 1,
    description: "",
  });

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!formData.matchDate || !formData.matchTime || !formData.location || !formData.field || !formData.gender || !formData.format) {
      setError("Please fill in all required fields");
      return;
    }

    try {
      setLoading(true);
      await createGuestPost(formData);
      router.push("/team/guests");
    } catch (err: any) {
      console.error("Error creating guest post:", err);
      setError(err?.message || "Failed to create guest post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Create Guest Post - KickUp</title>
        <meta name="description" content="Create a guest recruitment post" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Button
            component={Link}
            href="/team/guests"
            startIcon={<ArrowBackIcon />}
            sx={{ mb: 3, textTransform: "none" }}
          >
            Back to Recruit Guests
          </Button>

          <Card sx={{ boxShadow: 3 }}>
            <CardContent sx={{ p: 4 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
                Create Guest Recruitment Post
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <TextField
                      fullWidth
                      label="Match Date"
                      type="date"
                      value={formData.matchDate}
                      onChange={(e) => setFormData({ ...formData, matchDate: e.target.value })}
                      required
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                    />
                    <TextField
                      fullWidth
                      label="Match Time"
                      type="time"
                      value={formData.matchTime}
                      onChange={(e) => setFormData({ ...formData, matchTime: e.target.value })}
                      required
                      disabled={loading}
                      InputLabelProps={{ shrink: true }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    label="Location"
                    value={formData.location}
                    onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="e.g., Seoul, Yongsan"
                  />

                  <TextField
                    fullWidth
                    label="Field Name"
                    value={formData.field}
                    onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                    required
                    disabled={loading}
                    placeholder="e.g., Adidas The Base Field 2 / Man Utd"
                  />

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth required>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={formData.gender}
                        onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                        disabled={loading}
                        label="Gender"
                      >
                        <MenuItem value="Male">Male</MenuItem>
                        <MenuItem value="Female">Female</MenuItem>
                        <MenuItem value="Mixed">Mixed</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth required>
                      <InputLabel>Format</InputLabel>
                      <Select
                        value={formData.format}
                        onChange={(e) => setFormData({ ...formData, format: e.target.value })}
                        disabled={loading}
                        label="Format"
                      >
                        <MenuItem value="5vs5">5vs5</MenuItem>
                        <MenuItem value="6vs6">6vs6</MenuItem>
                        <MenuItem value="7vs7">7vs7</MenuItem>
                        <MenuItem value="11vs11">11vs11</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <Box sx={{ display: "flex", gap: 2 }}>
                    <FormControl fullWidth>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={formData.level}
                        onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                        disabled={loading}
                        label="Level"
                      >
                        <MenuItem value="All Levels">All Levels</MenuItem>
                        {SKILL_LEVELS.map((opt) => (
                          <MenuItem key={opt.value} value={opt.label}>
                            {opt.label}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      fullWidth
                      label="Players Needed"
                      type="number"
                      value={formData.needed}
                      onChange={(e) => setFormData({ ...formData, needed: parseInt(e.target.value) || 1 })}
                      disabled={loading}
                      inputProps={{ min: 1, max: 10 }}
                    />
                  </Box>

                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    label="Description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                    placeholder="Describe what you're looking for in guest players..."
                  />

                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled={loading}
                    sx={{
                      py: 1.5,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      },
                    }}
                  >
                    {loading ? (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <CircularProgress size={20} sx={{ color: "white" }} />
                        <span>Creating...</span>
                      </Box>
                    ) : (
                      "Create Post"
                    )}
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

