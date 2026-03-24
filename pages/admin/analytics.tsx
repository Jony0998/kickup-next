import Head from "next/head";
import { useState, useEffect } from "react";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Tabs,
  Tab,
  CircularProgress,
  Alert,
  useTheme,
  alpha,
} from "@mui/material";
import AssessmentIcon from "@mui/icons-material/Assessment";
import PeopleIcon from "@mui/icons-material/People";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StadiumIcon from "@mui/icons-material/Stadium";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import RateReviewIcon from "@mui/icons-material/RateReview";
import BlockIcon from "@mui/icons-material/Block";
import AdminLayout from "@/components/AdminLayout";
import AdminRoute from "@/components/AdminRoute";
import { getAdminStatistics, AdminStatistics } from "@/lib/adminApi";

const accent = "#00E377";
const accentDark = "#00C466";

function StatCard({
  label,
  value,
  sub,
  icon: Icon,
  color,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ElementType;
  color: string;
}) {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  return (
    <Card
      elevation={0}
      sx={{
        borderRadius: 3,
        border: "1px solid " + (isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)"),
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 12px 24px " + alpha(color, 0.12),
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Box>
            <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 600, textTransform: "uppercase", letterSpacing: 0.5, mb: 0.5 }}>
              {label}
            </Typography>
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                letterSpacing: "-0.02em",
                color: isDark ? "#fff" : "text.primary",
                fontFeatureSettings: '"tnum"',
              }}
            >
              {typeof value === "number" ? value.toLocaleString() : value}
            </Typography>
            {sub != null && (
              <Typography variant="caption" sx={{ color: "text.secondary", mt: 0.5, display: "block" }}>
                {sub}
              </Typography>
            )}
          </Box>
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2.5,
              bgcolor: alpha(color, 0.12),
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Icon sx={{ fontSize: 26, color }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function AnalyticsPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const [tabValue, setTabValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [stats, setStats] = useState<AdminStatistics | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError("");
        const data = await getAdminStatistics();
        if (!cancelled) setStats(data);
      } catch (e: any) {
        if (!cancelled) setError(e?.message || "Failed to load analytics");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  if (loading) {
    return (
      <AdminRoute>
        <AdminLayout title="Analytics">
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: 320 }}>
            <CircularProgress sx={{ color: accent }} />
          </Box>
        </AdminLayout>
      </AdminRoute>
    );
  }

  return (
    <AdminRoute>
      <AdminLayout title="Analytics">
        <Head>
          <title>Analytics - Admin - KickUp</title>
          <meta name="description" content="Platform analytics and statistics" />
          <meta name="viewport" content="width=device-width, initial-scale=1" />
        </Head>

        <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 3 }}>
          <Container maxWidth="xl">
            <Typography
              variant="h4"
              sx={{
                fontWeight: 800,
                mb: 3,
                letterSpacing: "-0.03em",
                color: "text.primary",
              }}
            >
              Analytics
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}

            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{
                mb: 3,
                "& .MuiTab-root": { textTransform: "none", fontWeight: 600 },
                "& .Mui-selected": { color: accent },
                "& .MuiTabs-indicator": { bgcolor: accent, height: 3, borderRadius: "3px 3px 0 0" },
              }}
            >
              <Tab icon={<SportsSoccerIcon />} iconPosition="start" label="Match Analytics" />
              <Tab icon={<PeopleIcon />} iconPosition="start" label="User Analytics" />
              <Tab icon={<AttachMoneyIcon />} iconPosition="start" label="Financial & Bookings" />
              <Tab icon={<StadiumIcon />} iconPosition="start" label="Field Analytics" />
            </Tabs>

            {stats && (
              <>
                {tabValue === 0 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard
                        label="Total Matches"
                        value={stats.totalMatches}
                        sub="All time"
                        icon={SportsSoccerIcon}
                        color={accent}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard
                        label="Total Bookings"
                        value={stats.totalBookings}
                        sub="Reservations"
                        icon={EventAvailableIcon}
                        color="#3B82F6"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard
                        label="Total Fields"
                        value={stats.totalProperties}
                        sub="Properties"
                        icon={StadiumIcon}
                        color="#8B5CF6"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} lg={3}>
                      <StatCard
                        label="Total Reviews"
                        value={stats.totalReviews}
                        sub="Ratings"
                        icon={RateReviewIcon}
                        color="#F59E0B"
                      />
                    </Grid>
                  </Grid>
                )}

                {tabValue === 1 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Total Members"
                        value={stats.totalMembers}
                        sub="Registered users"
                        icon={PeopleIcon}
                        color={accent}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Active Members"
                        value={stats.activeMembers}
                        sub="Not blocked"
                        icon={PeopleIcon}
                        color="#10B981"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Blocked"
                        value={stats.blockedMembers}
                        sub="Blocked accounts"
                        icon={BlockIcon}
                        color="#EF4444"
                      />
                    </Grid>
                  </Grid>
                )}

                {tabValue === 2 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Total Bookings"
                        value={stats.totalBookings}
                        sub="Reservations"
                        icon={EventAvailableIcon}
                        color={accent}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Revenue"
                        value="—"
                        sub="Payment data not connected"
                        icon={AttachMoneyIcon}
                        color="#6B7280"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Reviews"
                        value={stats.totalReviews}
                        sub="Total reviews"
                        icon={RateReviewIcon}
                        color="#F59E0B"
                      />
                    </Grid>
                  </Grid>
                )}

                {tabValue === 3 && (
                  <Grid container spacing={3}>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Total Properties"
                        value={stats.totalProperties}
                        sub="Fields / venues"
                        icon={StadiumIcon}
                        color={accent}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Matches"
                        value={stats.totalMatches}
                        sub="Using these fields"
                        icon={SportsSoccerIcon}
                        color="#3B82F6"
                      />
                    </Grid>
                    <Grid item xs={12} sm={6} md={4}>
                      <StatCard
                        label="Bookings"
                        value={stats.totalBookings}
                        sub="Field bookings"
                        icon={EventAvailableIcon}
                        color="#8B5CF6"
                      />
                    </Grid>
                  </Grid>
                )}
              </>
            )}

            {!loading && !stats && !error && (
              <Typography color="text.secondary">No data available.</Typography>
            )}
          </Container>
        </Box>
      </AdminLayout>
    </AdminRoute>
  );
}
