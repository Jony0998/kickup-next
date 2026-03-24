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
  LinearProgress,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import { useAuth } from "@/contexts/AuthContext";
import { graphqlRequest } from "@/lib/graphqlClient";

interface Challenge {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  status: "active" | "completed" | "locked";
}

export default function Challenges() {
  const { user } = useAuth();
  const [challenges, setChallenges] = useState<Challenge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadChallenges();
  }, []);

  const loadChallenges = async () => {
    try {
      setLoading(true);
      const hasGraphql = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;
      if (hasGraphql) {
        try {
          type ChallengesQuery = {
            myChallenges: Array<{
              _id: string;
              title: string;
              description: string;
              progress: number;
              target: number;
              reward: string;
              status: string;
            }>;
          };
          const data = await graphqlRequest<ChallengesQuery>(
            `
              query MyChallenges {
                myChallenges {
                  _id
                  title
                  description
                  progress
                  target
                  reward
                  status
                }
              }
            `,
            { auth: true }
          );
          setChallenges(
            data.myChallenges.map((c) => ({
              id: c._id,
              title: c.title,
              description: c.description,
              progress: c.progress,
              target: c.target,
              reward: c.reward,
              status: c.status as Challenge["status"],
            }))
          );
        } catch (error) {
          console.error("Failed to load challenges:", error);
          setChallenges([]);
        }
      } else {
        setChallenges([]);
      }
    } catch (error) {
      console.error("Error loading challenges:", error);
      setChallenges([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Head>
        <title>Challenges - KickUp</title>
        <meta name="description" content="View your challenges" />
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
              Challenges
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Complete challenges to earn rewards
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : challenges.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <WhatshotIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No challenges yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    New challenges will appear here. Play matches to unlock them.
                  </Typography>
                  <Button component={Link} href="/" variant="contained" sx={{ textTransform: "none", bgcolor: "var(--plab-green)", color: "var(--plab-black)", "&:hover": { bgcolor: "#00C466" } }}>
                    Find matches
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {challenges.map((challenge) => (
                <Grid item xs={12} md={6} key={challenge.id}>
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      "&:hover": {
                        transform: "translateY(-4px)",
                        boxShadow: 6,
                      },
                      background: "linear-gradient(135deg, rgba(245, 158, 11, 0.05) 0%, rgba(217, 119, 6, 0.05) 100%)",
                    }}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <Box
                          sx={{
                            p: 1,
                            borderRadius: 1,
                            bgcolor: "error.light",
                            color: "error.main",
                          }}
                        >
                          <WhatshotIcon />
                        </Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {challenge.title}
                        </Typography>
                        <Chip
                          label={challenge.status}
                          size="small"
                          color={
                            challenge.status === "completed"
                              ? "success"
                              : challenge.status === "active"
                                ? "primary"
                                : "default"
                          }
                          sx={{ ml: "auto", fontWeight: 600 }}
                        />
                      </Box>
                      <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
                        {challenge.description}
                      </Typography>
                      <Box sx={{ mb: 2 }}>
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            mb: 1,
                          }}
                        >
                          <Typography variant="body2">
                            Progress: {challenge.progress} / {challenge.target}
                          </Typography>
                          <Typography variant="body2" sx={{ fontWeight: 600 }}>
                            {Math.round((challenge.progress / challenge.target) * 100)}%
                          </Typography>
                        </Box>
                        <LinearProgress
                          variant="determinate"
                          value={(challenge.progress / challenge.target) * 100}
                          sx={{ height: 8, borderRadius: 4 }}
                        />
                      </Box>
                      <Box
                        sx={{
                          bgcolor: "primary.light",
                          p: 1.5,
                          borderRadius: 2,
                          border: "1px solid",
                          borderColor: "primary.main",
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 600, color: "primary.main" }}>
                          Reward: {challenge.reward}
                        </Typography>
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

