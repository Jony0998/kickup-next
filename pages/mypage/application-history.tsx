import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  Button,
  Tabs,
  Tab,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import { useAuth } from "@/contexts/AuthContext";
import { getMyJoinedMatches } from "@/lib/matchApi";
import type { Match } from "@/lib/matchApi";
import { useRouter } from "next/router";

export default function ApplicationHistory() {
  const { user } = useAuth();
  const router = useRouter();
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const data = await getMyJoinedMatches();
      setMatches(data || []);
    } catch (error) {
      console.error("Failed to load joined matches:", error);
      setMatches([]);
    } finally {
      setLoading(false);
    }
  };

  const now = new Date();
  const upcoming = matches.filter((m) => {
    const d = new Date(m.matchDate + "T" + (m.matchTime || "00:00"));
    return d >= now && m.matchStatus !== "CANCELLED";
  });
  const past = matches.filter((m) => {
    const d = new Date(m.matchDate + "T" + (m.matchTime || "00:00"));
    return d < now || m.matchStatus === "COMPLETED";
  });
  const cancelled = matches.filter((m) => m.matchStatus === "CANCELLED");

  const list = tabValue === 0 ? upcoming : tabValue === 1 ? past : cancelled;
  const fieldName = (m: Match) =>
    typeof m.fieldId === "object" && m.fieldId && "propertyName" in m.fieldId
      ? (m.fieldId as any).propertyName
      : "—";
  const locationStr = (m: Match) =>
    (typeof m.fieldId === "object" && m.fieldId && "location" in m.fieldId
      ? (m.fieldId as any).location?.city || (m.fieldId as any).location?.address
      : null) || m.location?.city || m.location?.address || "—";

  return (
    <>
      <Head>
        <title>History - KickUp</title>
        <meta name="description" content="Your match history" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4, pb: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 3 }}>
            <Button
              component={Link}
              href="/mypage"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2, textTransform: "none" }}
            >
              Back to My Page
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
              History
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Matches you’ve joined
            </Typography>
          </Box>

          <Card sx={{ mb: 3, boxShadow: 2, borderRadius: 3 }}>
            <Tabs
              value={tabValue}
              onChange={(_, v) => setTabValue(v)}
              sx={{ "& .MuiTab-root": { textTransform: "none", fontWeight: 600 } }}
            >
              <Tab label={`Upcoming (${upcoming.length})`} />
              <Tab label={`Completed (${past.length})`} />
              <Tab label={`Cancelled (${cancelled.length})`} />
            </Tabs>
          </Card>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : list.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <SportsSoccerIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No matches yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    {tabValue === 0
                      ? "Join matches from the home or Stadium page to see them here."
                      : tabValue === 1
                        ? "Completed matches will appear here."
                        : "Cancelled matches will appear here."}
                  </Typography>
                  <Button
                    component={Link}
                    href="/"
                    variant="contained"
                    sx={{
                      textTransform: "none",
                      bgcolor: "var(--plab-green)",
                      color: "var(--plab-black)",
                      "&:hover": { bgcolor: "#00C466" },
                    }}
                  >
                    Find matches
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {list.map((m) => (
                <Grid item xs={12} key={m._id}>
                  <Card
                    sx={{
                      borderRadius: 3,
                      transition: "all 0.2s",
                      "&:hover": { boxShadow: 4 },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                        <Typography
                          variant="h6"
                          sx={{ fontWeight: 600, cursor: "pointer" }}
                          onClick={() => router.push("/match/" + m._id)}
                        >
                          {m.matchTitle}
                        </Typography>
                        <Chip
                          label={m.matchStatus}
                          size="small"
                          color={m.matchStatus === "CANCELLED" ? "error" : m.matchStatus === "COMPLETED" ? "default" : "primary"}
                          sx={{ fontWeight: 600 }}
                        />
                      </Box>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">
                            {m.matchDate} {m.matchTime || ""}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">{fieldName(m)} · {locationStr(m)}</Typography>
                        </Box>
                      </Box>
                      <Button
                        size="small"
                        onClick={() => router.push("/match/" + m._id)}
                        sx={{ mt: 1.5, textTransform: "none" }}
                      >
                        View match
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}
        </Container>
      </Box>
    </>
  );
}
