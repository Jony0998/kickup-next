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
  Tabs,
  Tab,
  LinearProgress,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import VisibilityIcon from "@mui/icons-material/Visibility";
import SearchIcon from "@mui/icons-material/Search";
import InfoIcon from "@mui/icons-material/Info";
import EventIcon from "@mui/icons-material/Event";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import PersonIcon from "@mui/icons-material/Person";
import SchoolIcon from "@mui/icons-material/School";
import { useAuth } from "@/contexts/AuthContext";
import { getMatches, deleteMatch, Match } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";

export default function MatchesPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState(0);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [matchToDelete, setMatchToDelete] = useState<string | null>(null);
  const [matchToView, setMatchToView] = useState<Match | null>(null);
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
      loadMatches();
    }
  }, [isAuthenticated, isAdmin]);

  const loadMatches = async () => {
    try {
      setLoadingData(true);
      setError("");
      const data = await getMatches();
      setMatches(data);
    } catch (error: any) {
      console.error("Error loading matches:", error);
      setError(error?.message || "Failed to load matches");
    } finally {
      setLoadingData(false);
    }
  };

  const handleView = (match: Match) => {
    setMatchToView(match);
    setViewDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    setMatchToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!matchToDelete) return;

    try {
      await deleteMatch(matchToDelete);
      setMatches(matches.filter((m) => m.id !== matchToDelete));
      setDeleteDialogOpen(false);
      setMatchToDelete(null);
    } catch (error: any) {
      console.error("Error deleting match:", error);
      setError(error?.message || "Failed to delete match");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "success";
      case "pending":
        return "warning";
      case "completed":
        return "default";
      case "cancelled":
        return "error";
      default:
        return "default";
    }
  };

  const filteredMatches = matches.filter((match) => {
    const matchesSearch =
      match.field.toLowerCase().includes(searchQuery.toLowerCase()) ||
      match.date.includes(searchQuery);
    const matchesStatus =
      statusFilter === 0 ||
      (statusFilter === 1 && match.status === "active") ||
      (statusFilter === 2 && match.status === "pending") ||
      (statusFilter === 3 && match.status === "completed") ||
      (statusFilter === 4 && match.status === "cancelled");
    return matchesSearch && matchesStatus;
  });

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
      <AdminLayout title="Manage Matches">
        <Head>
          <title>Manage Matches - Admin - KickUp</title>
          <meta name="description" content="Manage matches on KickUp platform" />
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
                Manage Matches
              </Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => router.push("/admin/matches/create")}
                sx={{ textTransform: "none", fontWeight: 600 }}
              >
                Create Match
              </Button>
            </Box>
            <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                placeholder="Search matches..."
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
            <Card sx={{ mb: 2 }}>
              <Tabs
                value={statusFilter}
                onChange={(e, v) => setStatusFilter(v)}
                sx={{
                  "& .MuiTab-root": {
                    textTransform: "none",
                    fontWeight: 600,
                  },
                }}
              >
                <Tab label="All" />
                <Tab label="Active" />
                <Tab label="Pending" />
                <Tab label="Completed" />
                <Tab label="Cancelled" />
              </Tabs>
            </Card>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Matches Table */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent>
              {filteredMatches.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No matches found
                  </Typography>
                </Box>
              ) : (
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Participants</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Gender</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Level</TableCell>
                        <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                        <TableCell sx={{ fontWeight: 600 }} align="right">
                          Actions
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {filteredMatches.map((match) => (
                        <TableRow key={match.id} hover>
                          <TableCell>{match.field}</TableCell>
                          <TableCell>
                            {match.date} at {match.time}
                          </TableCell>
                          <TableCell>
                            {match.participants}/{match.maxParticipants}
                          </TableCell>
                          <TableCell>{match.gender}</TableCell>
                          <TableCell>{match.level}</TableCell>
                          <TableCell>
                            <Chip
                              label={match.status}
                              size="small"
                              color={getStatusColor(match.status) as any}
                              sx={{ fontWeight: 600 }}
                            />
                          </TableCell>
                          <TableCell align="right">
                            <IconButton
                              size="small"
                              onClick={() => handleView(match)}
                              title="View Details"
                            >
                              <VisibilityIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              onClick={() => router.push(`/admin/matches/${match.id}/edit`)}
                              title="Edit"
                            >
                              <EditIcon />
                            </IconButton>
                            <IconButton
                              size="small"
                              color="error"
                              onClick={() => handleDelete(match.id)}
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

          {/* View Match Details Dialog */}
          <Dialog open={viewDialogOpen} onClose={() => setViewDialogOpen(false)} maxWidth="sm" fullWidth>
            <DialogTitle>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <InfoIcon color="primary" />
                Match Details
              </Box>
            </DialogTitle>
            <DialogContent>
              {matchToView && (
                <Box sx={{ pt: 2 }}>
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      {matchToView.field}
                    </Typography>
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <EventIcon sx={{ fontSize: 16 }} />
                          Date & Time
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {new Date(matchToView.date).toLocaleDateString("en-US", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric"
                          })} at {matchToView.time}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PeopleIcon sx={{ fontSize: 16 }} />
                          Participants
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {matchToView.participants} / {matchToView.maxParticipants} participants
                        </Typography>
                        <Box sx={{ mt: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                            <Typography variant="caption" color="text.secondary">
                              Fill Rate
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                              {Math.round((matchToView.participants / matchToView.maxParticipants) * 100)}%
                            </Typography>
                          </Box>
                          <LinearProgress
                            variant="determinate"
                            value={(matchToView.participants / matchToView.maxParticipants) * 100}
                            sx={{
                              height: 6,
                              borderRadius: 3,
                              bgcolor: "action.hover",
                              "& .MuiLinearProgress-bar": {
                                borderRadius: 3,
                                bgcolor: matchToView.status === "active" ? "success.main" : "warning.main",
                              },
                            }}
                          />
                        </Box>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <PersonIcon sx={{ fontSize: 16 }} />
                          Gender
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {matchToView.gender}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                          <SchoolIcon sx={{ fontSize: 16 }} />
                          Level
                        </Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {matchToView.level}
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 0.5 }}>
                          Status
                        </Typography>
                        <Chip
                          label={matchToView.status}
                          size="small"
                          color={getStatusColor(matchToView.status) as any}
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
              {matchToView && (
                <Button
                  onClick={() => {
                    setViewDialogOpen(false);
                    router.push(`/admin/matches/${matchToView.id}/edit`);
                  }}
                  variant="contained"
                  sx={{ textTransform: "none" }}
                >
                  Edit Match
                </Button>
              )}
            </DialogActions>
          </Dialog>

          {/* Delete Confirmation Dialog */}
          <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
            <DialogTitle>Delete Match</DialogTitle>
            <DialogContent>
              <Typography>
                Are you sure you want to delete this match? This action cannot be undone.
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
