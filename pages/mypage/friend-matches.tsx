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
  Button,
  Avatar,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "@/contexts/AuthContext";
import { getFriendMatches, FriendMatch } from "@/lib/friendMatchesApi";
import { useRouter } from "next/router";



export default function FriendMatches() {
  const { user } = useAuth();
  const router = useRouter();
  const [friendMatches, setFriendMatches] = useState<FriendMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFriendMatches();
  }, []);

  const loadFriendMatches = async () => {
    try {
      setLoading(true);
      const data = await getFriendMatches();
      setFriendMatches(data);
    } catch (error) {
      console.error("Error loading friend matches:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Friend Matches - KickUp</title>
        <meta name="description" content="View matches your friends applied to" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
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
                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Friend Matches
            </Typography>
          </Box>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : friendMatches.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <SentimentSatisfiedIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No friend matches found
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Your friends haven't applied to any matches yet.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {friendMatches.map((match) => (
                <Grid item xs={12} key={match.id}>
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: "primary.main",
                            width: 48,
                            height: 48,
                            fontSize: "1.25rem",
                            fontWeight: 700,
                          }}
                        >
                          {match.friendName.charAt(0)}
                        </Avatar>
                        <Box>
                          <Typography variant="body2" sx={{ color: "text.secondary" }}>
                            Applied by
                          </Typography>
                          <Typography variant="body1" sx={{ fontWeight: 600 }}>
                            {match.friendName}
                          </Typography>
                        </Box>
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                        {match.matchTitle}
                      </Typography>
                      <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">
                            {match.date} {match.time}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                          <Typography variant="body2">{match.field}</Typography>
                        </Box>
                      </Box>
                      <Box sx={{ mt: 2, display: "flex", gap: 1 }}>
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => router.push(`/match/${match.matchId}`)}
                          sx={{
                            textTransform: "none",
                            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                            "&:hover": {
                              background: "linear-gradient(135deg, #5568d3 0%, #6a3f8f 100%)",
                            },
                          }}
                        >
                          View Match
                        </Button>
                      </Box>
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

