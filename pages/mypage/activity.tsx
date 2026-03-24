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
  Avatar,
  Chip,
  CircularProgress,
  Button,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import GroupIcon from "@mui/icons-material/Group";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import StarIcon from "@mui/icons-material/Star";
import { useAuth } from "@/contexts/AuthContext";
import { getActivityFeed, Activity } from "@/lib/socialApi";
import Layout from "@/components/Layout";

export default function ActivityPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadActivities();
  }, []);

  const loadActivities = async () => {
    try {
      setLoading(true);
      const data = await getActivityFeed(50);
      setActivities(data);
    } catch (error) {
      console.error("Error loading activities:", error);
    } finally {
      setLoading(false);
    }
  };

  const getActivityIcon = (type: Activity["type"]) => {
    switch (type) {
      case "match_joined":
      case "match_created":
        return <SportsSoccerIcon />;
      case "team_joined":
        return <GroupIcon />;
      case "achievement":
        return <EmojiEventsIcon />;
      case "rating":
        return <StarIcon />;
      default:
        return <SportsSoccerIcon />;
    }
  };

  const getActivityColor = (type: Activity["type"]) => {
    switch (type) {
      case "match_joined":
        return "success";
      case "match_created":
        return "primary";
      case "team_joined":
        return "info";
      case "achievement":
        return "warning";
      case "rating":
        return "secondary";
      default:
        return "default";
    }
  };

  return (
    <>
      <Head>
        <title>Activity Feed - My Page - KickUp</title>
        <meta name="description" content="View your activity feed" />
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
            Activity Feed
          </Typography>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress />
            </Box>
          ) : activities.length === 0 ? (
            <Card sx={{ boxShadow: 2 }}>
              <CardContent sx={{ textAlign: "center", py: 4 }}>
                <Typography variant="body1" color="text.secondary">
                  No activities yet
                </Typography>
              </CardContent>
            </Card>
          ) : (
            <Grid container spacing={2}>
              {activities.map((activity) => (
                <Grid item xs={12} key={activity.id}>
                  <Card
                    sx={{
                      boxShadow: 2,
                      transition: "all 0.2s",
                      "&:hover": {
                        transform: "translateY(-2px)",
                        boxShadow: 4,
                      },
                      ...(activity.matchId && {
                        cursor: "pointer",
                      }),
                    }}
                    onClick={() => activity.matchId && router.push(`/match/${activity.matchId}`)}
                  >
                    <CardContent>
                      <Box sx={{ display: "flex", gap: 2 }}>
                        <Avatar
                          sx={{
                            bgcolor: `${getActivityColor(activity.type)}.main`,
                            width: 48,
                            height: 48,
                          }}
                        >
                          {getActivityIcon(activity.type)}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                            <Box>
                              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                {activity.title}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {activity.description}
                              </Typography>
                            </Box>
                            <Chip
                              label={activity.type.replace("_", " ")}
                              size="small"
                              color={getActivityColor(activity.type) as any}
                              sx={{ ml: 2 }}
                            />
                          </Box>
                          <Box sx={{ display: "flex", gap: 1, alignItems: "center", mt: 1 }}>
                            <Avatar sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>
                              {activity.userName.charAt(0).toUpperCase()}
                            </Avatar>
                            <Typography variant="caption" color="text.secondary">
                              {activity.userName} • {new Date(activity.createdAt).toLocaleDateString("en-US", {
                                month: "short",
                                day: "numeric",
                                hour: "2-digit",
                                minute: "2-digit",
                              })}
                            </Typography>
                          </Box>
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

