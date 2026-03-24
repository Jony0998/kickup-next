import Head from "next/head";
import { useRouter } from "next/router";
import { useState, useEffect, useRef } from "react";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Alert,
  CircularProgress,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useAuth } from "@/contexts/AuthContext";
import { createTeam, inviteTeamMember } from "@/lib/teamApi";
import Layout from "@/components/Layout";

const MAX_LOGO_SIZE_MB = 5;

export default function CreateTeamPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [logoUrl, setLogoUrl] = useState<string | null>(null);
  const [uploadingLogo, setUploadingLogo] = useState(false);
  const [memberEmails, setMemberEmails] = useState<string[]>([]);
  const [currentEmail, setCurrentEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

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

    if (!name.trim()) {
      setError("Team name is required");
      return;
    }

    try {
      setLoading(true);
      console.log("CreateTeamPage: Calling createTeam API...");
      const team = await createTeam(name.trim(), description.trim() || undefined, {
        logo: logoUrl || undefined,
      });
      console.log("CreateTeamPage: Team created successfully!", team);

      // Invite members if any (Note: Backend should support email-based invitations)
      if (memberEmails.length > 0) {
        for (const email of memberEmails) {
          try {
            // Try to invite by email - backend should handle this
            // If backend only supports userId, we'll need to look up users by email first
            await inviteTeamMember(team.id, email);
          } catch (err) {
            console.error(`Failed to invite ${email}:`, err);
            // Continue with other invitations even if one fails
          }
        }
      }

      router.push(`/team/${team.id}`);
    } catch (err: any) {
      console.error("Error creating team:", err);
      const msg = err?.message || "Failed to create team";
      setError(msg);
      window.alert("Error: " + msg);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEmail = () => {
    if (currentEmail.trim() && !memberEmails.includes(currentEmail.trim())) {
      setMemberEmails([...memberEmails, currentEmail.trim()]);
      setCurrentEmail("");
    }
  };

  const handleRemoveEmail = (email: string) => {
    setMemberEmails(memberEmails.filter((e) => e !== email));
  };

  const handleLogoClick = () => {
    fileInputRef.current?.click();
  };

  const handleLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
      setError(`Image size must not exceed ${MAX_LOGO_SIZE_MB}MB`);
      return;
    }
    if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
      setError("Only images (jpg, png, gif) are allowed");
      return;
    }

    setUploadingLogo(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Login qiling yoki qayta kirish qiling.");
      setUploadingLogo(false);
      return;
    }

    try {
      const response = await fetch("/api/upload-image?type=teams", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}));
        throw new Error((errData as any).message || "Failed to upload image");
      }

      const data = await response.json();
      if (data.success && data.url) {
        setLogoUrl(data.url);
      } else {
        throw new Error("Could not get image URL");
      }
    } catch (err: any) {
      setError(err?.message || "Error uploading image");
    } finally {
      setUploadingLogo(false);
      e.target.value = "";
    }
  };

  const handleRemoveLogo = () => {
    setLogoUrl(null);
  };

  return (
    <>
      <Head>
        <title>Create Team - KickUp</title>
        <meta name="description" content="Create a new team" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="sm">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.back()}
            sx={{ mb: 3, textTransform: "none" }}
          >
            Back
          </Button>

          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 3, textAlign: "center" }}>
                Create New Team
              </Typography>

              {error && (
                <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                {/* Team logo upload */}
                <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", mb: 3 }}>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/gif"
                    onChange={handleLogoFileChange}
                    style={{ display: "none" }}
                  />
                  <Box
                    onClick={uploadingLogo ? undefined : handleLogoClick}
                    sx={{
                      position: "relative",
                      cursor: uploadingLogo ? "wait" : "pointer",
                      "&:hover .logo-overlay": { opacity: 1 },
                    }}
                  >
                    <Avatar
                      src={logoUrl || undefined}
                      sx={{
                        width: 120,
                        height: 120,
                        bgcolor: "grey.200",
                        fontSize: 48,
                        border: "3px dashed",
                        borderColor: logoUrl ? "transparent" : "grey.400",
                      }}
                    >
                      {name ? name[0].toUpperCase() : "?"}
                    </Avatar>
                    <Box
                      className="logo-overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        borderRadius: "50%",
                        bgcolor: "rgba(0,0,0,0.5)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.2s",
                      }}
                    >
                      <PhotoCameraIcon sx={{ color: "white", fontSize: 36 }} />
                    </Box>
                    {uploadingLogo && (
                      <CircularProgress
                        size={40}
                        sx={{ position: "absolute", top: "50%", left: "50%", mt: -2.5, ml: -2.5 }}
                      />
                    )}
                  </Box>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 1, textAlign: "center" }}>
                    {logoUrl ? "Image uploaded. Click to change." : "Team logo (optional). Click to upload."}
                  </Typography>
                  {logoUrl && (
                    <Button
                      size="small"
                      color="error"
                      onClick={(e) => {
                        e.preventDefault();
                        handleRemoveLogo();
                      }}
                      sx={{ mt: 1 }}
                    >
                      Remove image
                    </Button>
                  )}
                </Box>

                <TextField
                  fullWidth
                  label="Team Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  disabled={loading}
                  sx={{ mb: 2 }}
                  placeholder="Enter team name"
                />

                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  label="Description (Optional)"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  disabled={loading}
                  sx={{ mb: 3 }}
                  placeholder="Tell us about your team..."
                />

                {/* Invite Members Section */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle1" sx={{ fontWeight: 600, mb: 1 }}>
                    Invite Team Members (Optional)
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Add email addresses of players you want to invite to your team
                  </Typography>

                  <Box sx={{ display: "flex", gap: 1, mb: 2 }}>
                    <TextField
                      fullWidth
                      type="email"
                      placeholder="Enter email address"
                      value={currentEmail}
                      onChange={(e) => setCurrentEmail(e.target.value)}
                      onKeyPress={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAddEmail();
                        }
                      }}
                      disabled={loading}
                      size="small"
                    />
                    <Button
                      variant="outlined"
                      onClick={handleAddEmail}
                      disabled={loading || !currentEmail.trim()}
                      startIcon={<AddIcon />}
                    >
                      Add
                    </Button>
                  </Box>

                  {memberEmails.length > 0 && (
                    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                      {memberEmails.map((email) => (
                        <Chip
                          key={email}
                          label={email}
                          onDelete={() => handleRemoveEmail(email)}
                          deleteIcon={<CloseIcon />}
                          color="primary"
                          variant="outlined"
                        />
                      ))}
                    </Box>
                  )}
                </Box>

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={loading || !name.trim()}
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
                    "Create Team"
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
