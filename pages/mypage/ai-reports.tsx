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
  Chip,
  CircularProgress,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";
import { useAuth } from "@/contexts/AuthContext";
import { graphqlRequest } from "@/lib/graphqlClient";
import { useRouter } from "next/router";

interface AIReport {
  id: string;
  matchId: string;
  matchTitle: string;
  date: string;
  score: number;
  performance: string;
  recommendations: string[];
}

export default function AIReports() {
  const { user } = useAuth();
  const router = useRouter();
  const [reports, setReports] = useState<AIReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, []);

  const loadReports = async () => {
    try {
      setLoading(true);
      const hasGraphql = !!process.env.NEXT_PUBLIC_GRAPHQL_URL;
      if (hasGraphql) {
        try {
          type AIReportsQuery = {
            myAIReports: Array<{
              _id: string;
              matchId: string;
              matchTitle: string;
              date: string;
              score: number;
              performance: string;
              recommendations: string[];
            }>;
          };
          const data = await graphqlRequest<AIReportsQuery>(
            `
              query MyAIReports {
                myAIReports {
                  _id
                  matchId
                  matchTitle
                  date
                  score
                  performance
                  recommendations
                }
              }
            `,
            { auth: true }
          );
          setReports(data.myAIReports.map(report => ({
            id: report._id,
            matchId: report.matchId,
            matchTitle: report.matchTitle,
            date: report.date,
            score: report.score,
            performance: report.performance,
            recommendations: report.recommendations,
          })));
        } catch (error) {
          console.error("Failed to load AI reports:", error);
          setReports([]);
        }
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error("Error loading AI reports:", error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "#10b981"; // Green
    if (score >= 70) return "#3b82f6"; // Blue
    if (score >= 60) return "#f59e0b"; // Orange
    return "#ef4444"; // Red
  };

  const getScoreLabel = (score: number) => {
    if (score >= 85) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Average";
    return "Needs Improvement";
  };

  return (
    <>
      <Head>
        <title>AI Reports - KickUp</title>
        <meta name="description" content="View your AI reports" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4, pb: 12 }}>
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Box
                sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  color: "primary.main",
                }}
              >
                <PsychologyIcon sx={{ fontSize: 40 }} />
              </Box>
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    mb: 0.5,
                  }}
                >
                  AI Performance Reports
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Get detailed insights about your match performance powered by AI
                </Typography>
              </Box>
            </Box>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : reports.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <PsychologyIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No AI reports yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    Complete matches to get AI performance reports and recommendations.
                  </Typography>
                  <Button component={Link} href="/" variant="contained" sx={{ textTransform: "none", bgcolor: "var(--plab-green)", color: "var(--plab-black)", "&:hover": { bgcolor: "#00C466" } }}>
                    Find matches
                  </Button>
                </Box>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={3}>
              {reports.map((report) => (
                <Grid item xs={12} md={6} key={report.id}>
                  <Card
                    sx={{
                      transition: "all 0.3s ease",
                      cursor: "pointer",
                      "&:hover": {
                        transform: "translateY(-8px)",
                        boxShadow: 8,
                      },
                      background: `linear-gradient(135deg, ${getScoreColor(report.score)}15 0%, ${getScoreColor(report.score)}05 100%)`,
                      border: `2px solid ${getScoreColor(report.score)}30`,
                      height: "100%",
                    }}
                    onClick={() => router.push(`/match/${report.matchId}`)}
                  >
                    <CardContent sx={{ p: 3 }}>
                      {/* Header */}
                      <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 2 }}>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <PsychologyIcon sx={{ color: getScoreColor(report.score), fontSize: 24 }} />
                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                              {report.matchTitle}
                            </Typography>
                          </Box>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1 }}>
                            <AccessTimeIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {new Date(report.date).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>
                        </Box>
                        <Box
                          sx={{
                            textAlign: "center",
                            p: 1.5,
                            borderRadius: 2,
                            bgcolor: `${getScoreColor(report.score)}20`,
                            border: `2px solid ${getScoreColor(report.score)}`,
                            minWidth: 80,
                          }}
                        >
                          <Typography
                            variant="h4"
                            sx={{
                              fontWeight: 700,
                              color: getScoreColor(report.score),
                              lineHeight: 1,
                            }}
                          >
                            {report.score}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{
                              color: getScoreColor(report.score),
                              fontWeight: 600,
                              fontSize: "0.7rem",
                            }}
                          >
                            {getScoreLabel(report.score)}
                          </Typography>
                        </Box>
                      </Box>

                      {/* Performance Rating */}
                      <Box sx={{ mb: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <StarIcon
                              key={star}
                              sx={{
                                fontSize: 20,
                                color: star <= Math.round(report.score / 20) ? "#fbbf24" : "#e5e7eb",
                              }}
                            />
                          ))}
                          <Typography variant="body2" sx={{ ml: 1, color: "text.secondary" }}>
                            {Math.round(report.score / 20)}/5
                          </Typography>
                        </Box>
                      </Box>

                      {/* Performance Text */}
                      <Box
                        sx={{
                          p: 2,
                          borderRadius: 2,
                          bgcolor: "background.paper",
                          mb: 2,
                        }}
                      >
                        <Typography variant="body1" sx={{ lineHeight: 1.7 }}>
                          {report.performance}
                        </Typography>
                      </Box>

                      {/* Recommendations */}
                      <Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
                          <TrendingUpIcon sx={{ fontSize: 20, color: "primary.main" }} />
                          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                            AI Recommendations
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
                          {report.recommendations.map((rec, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 1,
                                p: 1.5,
                                borderRadius: 1,
                                bgcolor: "action.hover",
                              }}
                            >
                              <Box
                                sx={{
                                  width: 24,
                                  height: 24,
                                  borderRadius: "50%",
                                  bgcolor: "primary.main",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: "0.75rem",
                                  fontWeight: 700,
                                  flexShrink: 0,
                                }}
                              >
                                {idx + 1}
                              </Box>
                              <Typography variant="body2" sx={{ flex: 1 }}>
                                {rec}
                              </Typography>
                            </Box>
                          ))}
                        </Box>
                      </Box>

                      {/* View Match Button */}
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          mt: 2,
                          textTransform: "none",
                          bgcolor: getScoreColor(report.score),
                          "&:hover": {
                            bgcolor: getScoreColor(report.score),
                            opacity: 0.9,
                          },
                        }}
                        onClick={(e) => {
                          e.stopPropagation();
                          router.push(`/match/${report.matchId}`);
                        }}
                      >
                        View Match Details
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

