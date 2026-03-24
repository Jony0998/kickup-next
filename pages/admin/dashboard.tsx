import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import {
  Box,
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Avatar,
  Chip,
  CircularProgress,
  Alert,
  LinearProgress,
  Paper,
  Divider,
} from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StadiumIcon from "@mui/icons-material/Stadium";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import TrendingDownIcon from "@mui/icons-material/TrendingDown";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import EventIcon from "@mui/icons-material/Event";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useAuth } from "@/contexts/AuthContext";
import { getDashboardStats, DashboardStats, RecentMatch } from "@/lib/adminApi";
import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";

export default function AdminDashboard() {
  const router = useRouter();
  const { user, isAuthenticated, isAdmin, loading } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [recentMatches, setRecentMatches] = useState<RecentMatch[]>([]);
  const [loadingData, setLoadingData] = useState(true);
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
      loadDashboardData();
    }
  }, [isAuthenticated, isAdmin]);

  const loadDashboardData = async () => {
    try {
      setLoadingData(true);
      setError("");
      const data = await getDashboardStats();
      setStats(data.stats);
      setRecentMatches(data.recentMatches);
    } catch (error: any) {
      console.error("Error loading dashboard data:", error);
      setError(error?.message || "Failed to load dashboard data");
    } finally {
      setLoadingData(false);
    }
  };

  // Calculate percentages for progress bars
  const getMatchFillPercentage = (participants: number, max: number) => {
    if (!max || max <= 0) return 0;
    return (participants / max) * 100;
  };

  const getChangeIcon = (change: string) => {
    const isPositive = change.startsWith("+");
    return isPositive ? (
      <TrendingUpIcon sx={{ fontSize: 16, ml: 0.5 }} />
    ) : (
      <TrendingDownIcon sx={{ fontSize: 16, ml: 0.5 }} />
    );
  };

  const statsCards = stats
    ? [
      {
        title: "Total Matches",
        value: stats.totalMatches.toLocaleString(),
        change: stats.matchesChange,
        icon: SportsSoccerIcon,
        color: "#0ea5e9",
      },
      {
        title: "Active Fields",
        value: stats.activeFields.toLocaleString(),
        change: stats.fieldsChange,
        icon: StadiumIcon,
        color: "#10b981",
      },
      {
        title: "Total Users",
        value: stats.totalUsers.toLocaleString(),
        change: stats.usersChange,
        icon: PeopleIcon,
        color: "#f59e0b",
      },
      {
        title: "Revenue",
        value: `₩${stats.revenue.toLocaleString()}`,
        change: stats.revenueChange,
        icon: AttachMoneyIcon,
        color: "#8b5cf6",
      },
    ]
    : [];

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
      <AdminLayout title="Dashboard">
        <Head>
          <title>Admin Dashboard - KickUp</title>
          <meta name="description" content="Admin dashboard for KickUp platform" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Container maxWidth="xl">
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
              <Box>
                <Typography
                  variant="h4"
                  component="h1"
                  sx={{
                    fontWeight: 800,
                    mb: 1,
                    letterSpacing: "-0.02em",
                    color: "text.primary",
                  }}
                >
                  Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Welcome back, {user?.memberNick}!
                </Typography>
              </Box>
              <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                <Chip
                  label={user?.memberType?.toUpperCase()}
                  sx={{ fontWeight: 600, bgcolor: "#00E377", color: "#191F28" }}
                />
                <Avatar sx={{ bgcolor: "#00E377", color: "#191F28", width: 40, height: 40 }}>
                  {user?.memberNick?.charAt(0).toUpperCase()}
                </Avatar>
              </Box>
            </Box>
          </Box>

          {error && (
            <Alert severity="warning" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          {/* Stats Cards */}
          <Grid container spacing={3} sx={{ mb: 4 }}>
            {statsCards.map((stat, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Card
                  sx={{
                    height: "100%",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: 6,
                    },
                    border: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <CardContent>
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "flex-start",
                        mb: 2,
                      }}
                    >
                      <Box>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1, fontWeight: 500 }}
                        >
                          {stat.title}
                        </Typography>
                        <Typography variant="h4" sx={{ fontWeight: 700 }}>
                          {stat.value}
                        </Typography>
                      </Box>
                      <Box
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 2,
                          bgcolor: `${stat.color}15`,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <stat.icon sx={{ color: stat.color, fontSize: 32 }} />
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Chip
                        label={stat.change}
                        size="small"
                        icon={getChangeIcon(stat.change)}
                        sx={{
                          bgcolor: `${stat.color}15`,
                          color: stat.color,
                          fontWeight: 600,
                        }}
                      />
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          {/* Recent Matches */}
          <Card sx={{ mb: 4, boxShadow: 2 }}>
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 3,
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                  Recent Matches
                </Typography>
                <Button
                  variant="outlined"
                  onClick={() => router.push("/admin/matches")}
                  sx={{ textTransform: "none" }}
                >
                  View All
                </Button>
              </Box>

              {recentMatches.length === 0 ? (
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <Typography variant="body2" color="text.secondary">
                    No recent matches
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {recentMatches.map((match) => (
                    <Paper
                      key={match.id}
                      elevation={0}
                      sx={{
                        p: 2,
                        borderRadius: 2,
                        border: "1px solid",
                        borderColor: "divider",
                        transition: "all 0.2s",
                        cursor: "pointer",
                        "&:hover": {
                          borderColor: "primary.main",
                          transform: "translateX(4px)",
                          boxShadow: 2,
                        },
                      }}
                      onClick={() => router.push(`/admin/matches`)}
                    >
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1.5 }}>
                        <Box sx={{ flex: 1 }}>
                          <Typography
                            variant="subtitle1"
                            sx={{ fontWeight: 600, mb: 1 }}
                          >
                            {match.field}
                          </Typography>
                          <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 1 }}>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                              <EventIcon sx={{ fontSize: 14, mr: 0.5 }} />
                              {new Date(match.date).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                              <AccessTimeIcon sx={{ fontSize: 14, mr: 0.5 }} />
                              {match.time}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center" }}>
                              <PeopleIcon sx={{ fontSize: 14, mr: 0.5 }} />
                              {match.participants}/{match.maxParticipants}
                            </Typography>
                          </Box>
                          <Box sx={{ mt: 1 }}>
                            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                              <Typography variant="caption" color="text.secondary">
                                Participants
                              </Typography>
                              <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 600 }}>
                                {Math.round(getMatchFillPercentage(match.participants, match.maxParticipants))}%
                              </Typography>
                            </Box>
                            <LinearProgress
                              variant="determinate"
                              value={getMatchFillPercentage(match.participants, match.maxParticipants)}
                              sx={{
                                height: 6,
                                borderRadius: 3,
                                bgcolor: "action.hover",
                                "& .MuiLinearProgress-bar": {
                                  borderRadius: 3,
                                  bgcolor: match.status === "active" ? "success.main" : "warning.main",
                                },
                              }}
                            />
                          </Box>
                        </Box>
                        <Box sx={{ ml: 2, display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1 }}>
                          <Chip
                            label={match.status}
                            size="small"
                            color={
                              match.status === "active"
                                ? "success"
                                : match.status === "pending"
                                  ? "warning"
                                  : "default"
                            }
                            sx={{ fontWeight: 600 }}
                          />
                          <ArrowForwardIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                        </Box>
                      </Box>
                    </Paper>
                  ))}
                </Box>
              )}
            </CardContent>
          </Card>

          {/* Quick Actions & Analytics */}
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Actions
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
                    <Button
                      variant="contained"
                      fullWidth
                      startIcon={<SportsSoccerIcon />}
                      onClick={() => router.push("/admin/matches/create")}
                      sx={{
                        justifyContent: "flex-start",
                        textTransform: "none",
                        py: 1.5,
                        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                        },
                      }}
                    >
                      Create New Match
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<StadiumIcon />}
                      onClick={() => router.push("/admin/fields/create")}
                      sx={{ justifyContent: "flex-start", textTransform: "none", py: 1.5 }}
                    >
                      Add New Field
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<StadiumIcon />}
                      onClick={() => router.push("/admin/fields")}
                      sx={{ justifyContent: "flex-start", textTransform: "none", py: 1.5 }}
                    >
                      Manage Fields
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<PeopleIcon />}
                      onClick={() => router.push("/admin/users")}
                      sx={{ justifyContent: "flex-start", textTransform: "none", py: 1.5 }}
                    >
                      Manage Users
                    </Button>
                    <Button
                      variant="outlined"
                      fullWidth
                      startIcon={<SportsSoccerIcon />}
                      onClick={() => router.push("/admin/matches")}
                      sx={{ justifyContent: "flex-start", textTransform: "none", py: 1.5 }}
                    >
                      View All Matches
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
              <Card sx={{ boxShadow: 2, height: "100%" }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Analytics Overview
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          This Month Growth
                        </Typography>
                        <Chip
                          label="+24%"
                          size="small"
                          icon={<TrendingUpIcon />}
                          color="success"
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={75}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "action.hover",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: "success.main",
                          },
                        }}
                      />
                    </Box>
                    <Divider />
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Active Bookings
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                          {stats?.totalMatches || 0}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {stats?.totalMatches || 0} matches currently active
                      </Typography>
                    </Box>
                    <Divider />
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                        <Typography variant="body2" color="text.secondary">
                          Field Utilization
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>
                          {stats?.activeFields ? Math.round((stats.totalMatches / stats.activeFields) * 10) : 0}%
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={stats?.activeFields ? (stats.totalMatches / stats.activeFields) * 10 : 0}
                        sx={{
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "action.hover",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: "success.main",
                          },
                        }}
                      />
                    </Box>
                    <Divider />
                    <Box>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="body2" color="text.secondary">
                          Total Revenue
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                          ₩{stats?.revenue.toLocaleString() || "0"}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary">
                        {stats?.revenueChange || "+0%"} from last month
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </AdminLayout>
    </AdminRoute>
  );
}
