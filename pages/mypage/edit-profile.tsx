import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Avatar,
  IconButton,
  Alert,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { normalizeImageUrl } from "@/lib/imageUrl";

export default function EditProfile() {
  const router = useRouter();
  const { user, updateProfile } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const [memberNick, setMemberNick] = useState(user?.memberNick || "");
  const [memberFullName, setMemberFullName] = useState(user?.memberFullName || "");
  const [memberPhone, setMemberPhone] = useState(user?.memberPhone || "");
  const [memberAddress, setMemberAddress] = useState(user?.memberAddress || "");
  const [memberDesc, setMemberDesc] = useState(user?.memberDesc || "");
  const [memberImage, setMemberImage] = useState(user?.memberImage || "");
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Sync state if user data loads later
  React.useEffect(() => {
    if (user) {
      if (!memberNick) setMemberNick(user.memberNick || "");
      if (!memberFullName) setMemberFullName(user.memberFullName || "");
      if (!memberPhone) setMemberPhone(user.memberPhone || "");
      if (!memberAddress) setMemberAddress(user.memberAddress || "");
      if (!memberDesc) setMemberDesc(user.memberDesc || "");
      if (!memberImage) setMemberImage(user.memberImage || "");
    }
  }, [user]);

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      setError("Image size must not exceed 5MB");
      return;
    }

    setUploading(true);
    setError("");

    const formData = new FormData();
    formData.append("file", file);

    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    if (!token) {
      setError("Login qiling yoki qayta kirish qiling.");
      setUploading(false);
      return;
    }

    try {
      const response = await fetch("/api/upload-image?type=members", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await response.json().catch(() => ({}));
      if (!response.ok) {
        const msg = (data as any)?.message || (response.status === 401 ? "Login required to upload." : "Error uploading image.");
        throw new Error(msg);
      }
      if (data.success && data.url) {
        setMemberImage(data.url);
        try {
          await updateProfile({ memberImage: data.url });
          setSuccess("Rasm yuklandi va backendga saqlandi.");
        } catch (saveErr: any) {
          setMemberImage(data.url);
          setSuccess("Rasm yuklandi. Profilni saqlashda xato – qayta «Save» bosing.");
          setError(saveErr?.message || "Profil yangilanmadi.");
        }
      } else {
        throw new Error((data as any)?.message || "Error uploading image");
      }
    } catch (err: any) {
      setError(err?.message || "Error uploading image");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const payload: Record<string, string | undefined> = {
        memberNick,
        memberFullName: memberFullName || undefined,
        memberPhone: memberPhone || undefined,
        memberAddress: memberAddress || undefined,
        memberDesc: memberDesc || undefined,
      };
      // Always send memberImage when present so backend persists it (fixes image lost after logout/login)
      if (memberImage != null && memberImage !== '') {
        payload.memberImage = String(memberImage).trim();
      }
      await updateProfile(payload);
      setSuccess("Profile updated successfully!");
      router.push("/mypage");
    } catch (err: any) {
      setError(err.message || "Error updating profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <ProtectedRoute>
      <Head>
        <title>Edit Profile - KickUp</title>
        <meta name="description" content="Edit Profile" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/mypage"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2, textTransform: "none" }}
            >
              Back
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Edit Profile
            </Typography>
          </Box>

          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: isDark ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB"}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Box sx={{ position: "relative", display: "inline-block" }}>
                  <Avatar
                    src={normalizeImageUrl(memberImage) || undefined}
                    sx={{
                      width: 120,
                      height: 120,
                      fontSize: "3rem",
                      bgcolor: "primary.main",
                      border: "4px solid",
                      borderColor: "primary.light",
                    }}
                  >
                    {user?.memberNick?.charAt(0).toUpperCase() || "U"}
                  </Avatar>
                  {uploading && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        bgcolor: "rgba(0,0,0,0.5)",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 1,
                      }}
                    >
                      <CircularProgress size={32} color="inherit" />
                    </Box>
                  )}
                  <IconButton
                    onClick={handleImageClick}
                    disabled={uploading}
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      bgcolor: "primary.main",
                      color: "white",
                      border: "3px solid",
                      borderColor: "background.paper",
                      "&:hover": { bgcolor: "primary.dark" },
                    }}
                  >
                    <PhotoCameraIcon />
                  </IconButton>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                </Box>
              </Box>

              {success && (
                <Alert severity="success" sx={{ mb: 3, borderRadius: 2 }}>
                  {success}
                </Alert>
              )}

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit}>
                <TextField
                  fullWidth
                  label="Nickname"
                  value={memberNick}
                  onChange={(e) => setMemberNick(e.target.value)}
                  sx={{ mb: 3 }}
                  required
                />
                <TextField
                  fullWidth
                  label="Full Name"
                  value={memberFullName}
                  onChange={(e) => setMemberFullName(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Phone Number"
                  value={memberPhone}
                  onChange={(e) => setMemberPhone(e.target.value)}
                  sx={{ mb: 3 }}
                  helperText="Format: 01012345678"
                />
                <TextField
                  fullWidth
                  label="Address"
                  value={memberAddress}
                  onChange={(e) => setMemberAddress(e.target.value)}
                  sx={{ mb: 3 }}
                />
                <TextField
                  fullWidth
                  label="Description"
                  value={memberDesc}
                  onChange={(e) => setMemberDesc(e.target.value)}
                  sx={{ mb: 3 }}
                  multiline
                  rows={3}
                />
                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  disabled={loading}
                  sx={{
                    mt: 2,
                    py: 1.5,
                    textTransform: "none",
                    fontWeight: 600,
                    fontSize: "1rem",
                    borderRadius: 2,
                  }}
                >
                  {loading ? <CircularProgress size={24} /> : "Save"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </ProtectedRoute>
  );
}
