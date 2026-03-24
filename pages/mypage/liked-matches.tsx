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
  IconButton,
  Chip,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useAuth } from "@/contexts/AuthContext";
import { getLikedMatches, unlikeMatch, LikedMatch } from "@/lib/likedMatchesApi";
import { useRouter } from "next/router";



export default function LikedMatches() {
  const { user } = useAuth();
  const router = useRouter();
  const [likedMatches, setLikedMatches] = useState<LikedMatch[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadLikedMatches();
  }, []);

  const loadLikedMatches = async () => {
    try {
      setLoading(true);
      const data = await getLikedMatches();
      setLikedMatches(data);
    } catch (error) {
      console.error("Error loading liked matches:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUnlike = async (matchId: string) => {
    try {
      const result = await unlikeMatch(matchId);
      if (result.success) {
        setLikedMatches(likedMatches.filter((m) => m.matchId !== matchId));
      }
    } catch (error) {
      console.error("Error unliking match:", error);
    }
  };

  return (
    <>
      <Head>
        <title>Liked Matches - KickUp</title>
        <meta name="description" content="View your liked matches" />
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
                background: "linear-gradient(135deg, #ec4899 0%, #be185d 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Liked Matches
            </Typography>
          </Box>

          {loading ? (
            <Typography>Loading...</Typography>
          ) : likedMatches.length === 0 ? (
            <Card>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <FavoriteIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No liked matches
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    You haven't liked any matches yet.
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {likedMatches.map((match) => (
                <Grid item xs={12} key={match.id}>
                  <Card
                    sx={{
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
                        }}
                      >
                        <Box sx={{ flex: 1 }}>
                          <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                            {match.title}
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
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mt: 1 }}>
                              {match.details.map((detail, idx) => (
                                <Chip key={idx} label={detail} size="small" />
                              ))}
                            </Box>
                          </Box>
                        </Box>
                        <Box sx={{ display: "flex", gap: 1 }}>
                          <Button
                            variant="outlined"
                            size="small"
                            onClick={() => router.push(`/match/${match.matchId}`)}
                            sx={{ textTransform: "none" }}
                          >
                            View
                          </Button>
                          <IconButton
                            onClick={() => handleUnlike(match.matchId)}
                            sx={{ color: "error.main" }}
                          >
                            <FavoriteIcon />
                          </IconButton>
                        </Box>
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

