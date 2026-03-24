import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Grid,
  Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import MailIcon from "@mui/icons-material/Mail";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useAuth } from "@/contexts/AuthContext";

export default function InviteFriends() {
  const { user } = useAuth();
  const [inviteCode, setInviteCode] = useState("KICKUP2026");
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(inviteCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join me on KickUp!",
          text: `Join me on KickUp using my invite code: ${inviteCode}`,
          url: window.location.origin,
        });
      } catch (error) {
        console.error("Error sharing:", error);
      }
    }
  };

  return (
    <>
      <Head>
        <title>Invite Friends - KickUp</title>
        <meta name="description" content="Invite your friends to join KickUp" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
              Back to My Page
            </Button>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                background: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Invite Friends
            </Typography>
          </Box>

          <Card
            sx={{
              mb: 3,
              background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)",
              boxShadow: 4,
            }}
          >
            <CardContent>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Box
                  sx={{
                    display: "inline-flex",
                    p: 2,
                    borderRadius: "50%",
                    bgcolor: "primary.light",
                    mb: 2,
                  }}
                >
                  <MailIcon sx={{ fontSize: 48, color: "primary.main" }} />
                </Box>
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Invite Your Friends
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", mb: 3 }}>
                  Invite a friend and get ₩3,000, your friend gets ₩2,000
                </Typography>
              </Box>

              <Alert severity="info" sx={{ mb: 3 }}>
                When your friend signs up using your invite code, you'll both receive rewards!
              </Alert>

              <Box sx={{ mb: 3 }}>
                <Typography variant="body1" sx={{ fontWeight: 600, mb: 1 }}>
                  Your Invite Code
                </Typography>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    fullWidth
                    value={inviteCode}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                  <Button
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleCopy}
                  >
                    {copied ? "Copied!" : "Copy"}
                  </Button>
                </Box>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      color: "white",
                      textAlign: "center",
                      p: 3,
                      boxShadow: 3,
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      ₩3,000
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      You Get
                    </Typography>
                  </Card>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Card
                    sx={{
                      background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                      color: "white",
                      textAlign: "center",
                      p: 3,
                      boxShadow: 3,
                    }}
                  >
                    <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                      ₩2,000
                    </Typography>
                    <Typography variant="body2" sx={{ opacity: 0.9 }}>
                      Friend Gets
                    </Typography>
                  </Card>
                </Grid>
              </Grid>

              <Box sx={{ mt: 3, display: "flex", gap: 2 }}>
                <Button
                  variant="contained"
                  fullWidth
                  startIcon={<MailIcon />}
                  onClick={handleShare}
                >
                  Share Invite
                </Button>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

