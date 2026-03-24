import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Grid,
  Chip,
  CircularProgress,
  Button,
  LinearProgress,
  Tabs,
  Tab,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import WorkspacePremiumIcon from "@mui/icons-material/WorkspacePremium";
import { useAuth } from "@/contexts/AuthContext";
import { getAchievements, getBadges, Achievement, Badge } from "@/lib/socialApi";
import Layout from "@/components/Layout";

export default function AchievementsPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [badges, setBadges] = useState<Badge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [achievementsData, badgesData] = await Promise.all([
        getAchievements(),
        getBadges(),
      ]);
      setAchievements(achievementsData);
      setBadges(badgesData);
    } catch (error) {
      console.error("Error loading data:", error);
    } finally {
      setLoading(false);
    }
  };

  const unlockedAchievements = achievements.filter((a) => a.unlockedAt);
  const lockedAchievements = achievements.filter((a) => !a.unlockedAt);
  const unlockedBadges = badges.filter((b) => b.unlockedAt);
  const lockedBadges = badges.filter((b) => !b.unlockedAt);

  return (
    <>
      <Head>
        <title>Achievements & Badges - My Page - KickUp</title>
        <meta name="description" content="View your achievements and badges" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => router.push("/mypage")}
            sx={{ mb: 3, textTransform: "none" }}
          >
            Back to My Page
          </Button>

          <Typography
            variant="h4"
            sx={{
              fontWeight: 700,
              mb: 3,
              background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Achievements & Badges
          </Typography>

          <Card sx={{ mb: 3, boxShadow: 2 }}>
            <Tabs value={tabValue} onChange={(_, v) => setTabValue(v)}>
              <Tab
                icon={<EmojiEventsIcon />}
                label={`Achievements (${unlockedAchievements.length}/${achievements.length})`}
                iconPosition="start"
              />
              <Tab
                icon={<WorkspacePremiumIcon />}
                label={`Badges (${unlockedBadges.length}/${badges.length})`}
                iconPosition="start"
              />
            </Tabs>
          </Card>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : (
            <>
              {/* Achievements Tab */}
              {tabValue === 0 && (
                <Box>
                  {unlockedAchievements.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Unlocked ({unlockedAchievements.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {unlockedAchievements.map((achievement) => (
                          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                            <Card
                              sx={{
                                boxShadow: 2,
                                border: "2px solid",
                                borderColor: "success.main",
                                height: "100%",
                              }}
                            >
                              <CardContent>
                                <Box sx={{ textAlign: "center" }}>
                                  <Typography variant="h3" sx={{ mb: 1 }}>
                                    {achievement.icon}
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {achievement.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {achievement.description}
                                  </Typography>
                                  {achievement.unlockedAt && (
                                    <Chip
                                      label={`Unlocked ${new Date(achievement.unlockedAt).toLocaleDateString()}`}
                                      size="small"
                                      color="success"
                                    />
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {lockedAchievements.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Locked ({lockedAchievements.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {lockedAchievements.map((achievement) => (
                          <Grid item xs={12} sm={6} md={4} key={achievement.id}>
                            <Card
                              sx={{
                                boxShadow: 2,
                                opacity: 0.6,
                                height: "100%",
                              }}
                            >
                              <CardContent>
                                <Box sx={{ textAlign: "center" }}>
                                  <Typography variant="h3" sx={{ mb: 1, filter: "grayscale(100%)" }}>
                                    {achievement.icon}
                                  </Typography>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {achievement.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {achievement.description}
                                  </Typography>
                                  {achievement.progress !== undefined && achievement.target && (
                                    <Box sx={{ mt: 2 }}>
                                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                                        <Typography variant="caption">
                                          Progress: {achievement.progress}/{achievement.target}
                                        </Typography>
                                        <Typography variant="caption">
                                          {Math.round((achievement.progress / achievement.target) * 100)}%
                                        </Typography>
                                      </Box>
                                      <LinearProgress
                                        variant="determinate"
                                        value={(achievement.progress / achievement.target) * 100}
                                        sx={{ height: 8, borderRadius: 4 }}
                                      />
                                    </Box>
                                  )}
                                  <Chip label="Locked" size="small" sx={{ mt: 2 }} />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}

              {/* Badges Tab */}
              {tabValue === 1 && (
                <Box>
                  {unlockedBadges.length > 0 && (
                    <Box sx={{ mb: 4 }}>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Unlocked ({unlockedBadges.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {unlockedBadges.map((badge) => (
                          <Grid item xs={12} sm={6} md={4} key={badge.id}>
                            <Card
                              sx={{
                                boxShadow: 2,
                                border: "2px solid",
                                borderColor: badge.color,
                                height: "100%",
                              }}
                            >
                              <CardContent>
                                <Box sx={{ textAlign: "center" }}>
                                  <Box
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      borderRadius: "50%",
                                      bgcolor: `${badge.color}20`,
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      mx: "auto",
                                      mb: 2,
                                      border: `2px solid ${badge.color}`,
                                    }}
                                  >
                                    <Typography variant="h3">{badge.icon}</Typography>
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {badge.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {badge.description}
                                  </Typography>
                                  <Chip
                                    label={badge.rarity.toUpperCase()}
                                    size="small"
                                    sx={{
                                      bgcolor: badge.color,
                                      color: "white",
                                      fontWeight: 600,
                                    }}
                                  />
                                  {badge.unlockedAt && (
                                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
                                      Unlocked {new Date(badge.unlockedAt).toLocaleDateString()}
                                    </Typography>
                                  )}
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}

                  {lockedBadges.length > 0 && (
                    <Box>
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Locked ({lockedBadges.length})
                      </Typography>
                      <Grid container spacing={2}>
                        {lockedBadges.map((badge) => (
                          <Grid item xs={12} sm={6} md={4} key={badge.id}>
                            <Card
                              sx={{
                                boxShadow: 2,
                                opacity: 0.6,
                                height: "100%",
                              }}
                            >
                              <CardContent>
                                <Box sx={{ textAlign: "center" }}>
                                  <Box
                                    sx={{
                                      width: 80,
                                      height: 80,
                                      borderRadius: "50%",
                                      bgcolor: "action.hover",
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      mx: "auto",
                                      mb: 2,
                                      filter: "grayscale(100%)",
                                    }}
                                  >
                                    <Typography variant="h3">{badge.icon}</Typography>
                                  </Box>
                                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    {badge.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    {badge.description}
                                  </Typography>
                                  <Chip label="Locked" size="small" />
                                </Box>
                              </CardContent>
                            </Card>
                          </Grid>
                        ))}
                      </Grid>
                    </Box>
                  )}
                </Box>
              )}
            </>
          )}
        </Container>
      </Box>
    </>
  );
}

