import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  TextField,
  Alert,
  CircularProgress,
  Avatar,
  Chip,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { useAuth } from "@/contexts/AuthContext";
import { checkInToMatch, getAttendance, AttendanceRecord } from "@/lib/qrCodeApi";
import { getMatchDetails, Match } from "@/lib/matchApi";
import Layout from "@/components/Layout";

export default function CheckInPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const [match, setMatch] = useState<Match | null>(null);
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkingIn, setCheckingIn] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [qrCodeInput, setQrCodeInput] = useState("");

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    if (id && typeof id === "string") {
      loadData();
    }
  }, [id, isAuthenticated]);

  const loadData = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);
      setError("");
      const [matchData, attendanceData] = await Promise.all([
        getMatchDetails(id),
        getAttendance(id),
      ]);
      setMatch(matchData);
      setAttendance(attendanceData);
    } catch (err: any) {
      console.error("Error loading data:", err);
      setError(err?.message || "Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleCheckIn = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setCheckingIn(true);
      setError("");
      setSuccess("");
      const result = await checkInToMatch(id, qrCodeInput || undefined);
      if (result.success) {
        setSuccess(result.message || "Checked in successfully!");
        setQrCodeInput("");
        await loadData(); // Reload attendance
      } else {
        setError(result.message || "Failed to check in");
      }
    } catch (err: any) {
      console.error("Error checking in:", err);
      setError(err?.message || "Failed to check in");
    } finally {
      setCheckingIn(false);
    }
  };

  const isUserCheckedIn = attendance.some((a) => a.userId === user?.id);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!match) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">Match not found</Alert>
      </Container>
    );
  }

  return (
    <>
      stories
      <Head>
        <title>Check-in - {match.matchTitle} - KickUp</title>
        <meta name="description" content="Check-in to the match" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="md">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push(`/match/${id}`)}
            sx={{ mb: 3, textTransform: "none" }}
          >
            Back to Match
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {success && (
            <Alert severity="success" sx={{ mb: 3 }} onClose={() => setSuccess("")}>
              {success}
            </Alert>
          )}

          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h5" sx={{ fontWeight: 700, mb: 2 }}>
                Check-in to Match
              </Typography>
              <Typography variant="body1" sx={{ mb: 1, fontWeight: 600 }}>
                {match.matchTitle}
              </Typography>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center", mb: 3, flexWrap: "wrap" }}>
                <Typography variant="body2" color="text.secondary">
                  <AccessTimeIcon sx={{ fontSize: 16, mr: 0.5, verticalAlign: "middle" }} />
                  {new Date(match.matchDate).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                  })} at {match.matchTime}
                </Typography>
              </Box>

              {isUserCheckedIn ? (
                <Alert severity="success" sx={{ mb: 2 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <CheckCircleIcon />
                    <Typography>You have already checked in!</Typography>
                  </Box>
                </Alert>
              ) : (
                <>
                  <TextField
                    fullWidth
                    label="QR Code (Optional)"
                    placeholder="Scan or enter QR code"
                    value={qrCodeInput}
                    onChange={(e) => setQrCodeInput(e.target.value)}
                    sx={{ mb: 2 }}
                    InputProps={{
                      startAdornment: <QrCodeScannerIcon sx={{ mr: 1, color: "text.secondary" }} />,
                    }}
                  />
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    onClick={handleCheckIn}
                    disabled={checkingIn}
                    startIcon={checkingIn ? <CircularProgress size={20} /> : <CheckCircleIcon />}
                    sx={{
                      py: 1.5,
                      background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                      "&:hover": {
                        background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                      },
                    }}
                  >
                    {checkingIn ? "Checking in..." : "Check In"}
                  </Button>
                </>
              )}
            </CardContent>
          </Card>

          {/* Attendance List */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Attendance ({attendance.length})
              </Typography>
              {attendance.length === 0 ? (
                <Typography variant="body2" color="text.secondary">
                  No one has checked in yet
                </Typography>
              ) : (
                <List>
                  {attendance.map((record, index) => (
                    <React.Fragment key={record.id}>
                      <ListItem>
                        <ListItemAvatar>
                          <Avatar sx={{ bgcolor: "primary.main" }}>
                            {record.userName.charAt(0).toUpperCase()}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={record.userName}
                          secondary={
                            <Box sx={{ display: "flex", gap: 1, alignItems: "center", flexWrap: "wrap", mt: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                {new Date(record.checkedInAt).toLocaleString()}
                              </Typography>
                              {record.isLate && (
                                <Chip
                                  label="Late"
                                  size="small"
                                  color="warning"
                                  sx={{ height: 20 }}
                                />
                              )}
                              {record.status === "no_show" && (
                                <Chip
                                  label="No Show"
                                  size="small"
                                  color="error"
                                  sx={{ height: 20 }}
                                />
                              )}
                            </Box>
                          }
                        />
                        {record.status === "checked_in" && (
                          <CheckCircleIcon sx={{ color: "success.main" }} />
                        )}
                      </ListItem>
                      {index < attendance.length - 1 && <Divider />}
                    </React.Fragment>
                  ))}
                </List>
              )}
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

