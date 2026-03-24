import SeoHead from "@/components/SeoHead";
import Link from "next/link";
import { useRouter } from "next/router";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import WcIcon from "@mui/icons-material/Wc";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupIcon from "@mui/icons-material/Group";
import PersonIcon from "@mui/icons-material/Person";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import BoltIcon from "@mui/icons-material/Bolt";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import HomeIcon from "@mui/icons-material/Home";
import PsychologyIcon from "@mui/icons-material/Psychology";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import CheckroomIcon from "@mui/icons-material/Checkroom";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  color: string;
}

export default function MenuPage() {
  const router = useRouter();

  const socialMatchItems: MenuItem[] = [
    {
      id: "liked-matches",
      label: "Liked Matches",
      icon: <FavoriteIcon sx={{ fontSize: 32 }} />,
      href: "/mypage/liked-matches",
      color: "#e91e63",
    },
    {
      id: "friend-matches",
      label: "Friend Matches",
      icon: <SentimentSatisfiedIcon sx={{ fontSize: 32 }} />,
      href: "/mypage/friend-matches",
      color: "#ffc107",
    },
    {
      id: "women",
      label: "Women",
      icon: <WcIcon sx={{ fontSize: 32 }} />,
      href: "/?gender=women",
      color: "#9c27b0",
    },
    {
      id: "starter",
      label: "Starter",
      icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
      href: "/?level=starter",
      color: "#eab308",
    },
    {
      id: "both-genders",
      label: "Both Genders",
      icon: <GroupIcon sx={{ fontSize: 32 }} />,
      href: "/?gender=mixed",
      color: "#2196f3",
    },
    {
      id: "beginner",
      label: "Beginner",
      icon: <LocalFloristIcon sx={{ fontSize: 32 }} />,
      href: "/?level=rookie",
      color: "#4caf50",
    },
    {
      id: "intermediate",
      label: "Intermediate",
      icon: <BoltIcon sx={{ fontSize: 32 }} />,
      href: "/?level=amateur",
      color: "#f44336",
    },
    {
      id: "ai-report",
      label: "AI Report",
      icon: <PsychologyIcon sx={{ fontSize: 32 }} />,
      href: "/mypage/ai-reports",
      color: "#000000",
    },
    {
      id: "football",
      label: "Football",
      icon: <SportsSoccerIcon sx={{ fontSize: 32 }} />,
      href: "/?sport=football",
      color: "#000000",
    },
    {
      id: "4vs4",
      label: "4vs4",
      icon: <Typography variant="h5" sx={{ fontWeight: 700, color: "#f44336" }}>4</Typography>,
      href: "/?format=4vs4",
      color: "#f44336",
    },
    {
      id: "indoor",
      label: "Indoor",
      icon: <HomeIcon sx={{ fontSize: 32 }} />,
      href: "/?fieldType=indoor",
      color: "#4caf50",
    },
    {
      id: "outdoor",
      label: "Outdoor",
      icon: <HomeIcon sx={{ fontSize: 32 }} />,
      href: "/?fieldType=outdoor",
      color: "#2196f3",
    },
    {
      id: "early-bird",
      label: "Early Bird",
      icon: <AccessTimeIcon sx={{ fontSize: 32 }} />,
      href: "/?earlyBird=true",
      color: "#2196f3",
    },
    {
      id: "t-shirt",
      label: "T-shirt",
      icon: <CheckroomIcon sx={{ fontSize: 32 }} />,
      href: "/?tShirt=true",
      color: "#000000",
    },
    {
      id: "morning",
      label: "Morning",
      icon: <WbSunnyIcon sx={{ fontSize: 32 }} />,
      href: "/?time=morning",
      color: "#ffc107",
    },
  ];

  const teamItems: MenuItem[] = [
    {
      id: "league",
      label: "League",
      icon: <EmojiEventsIcon sx={{ fontSize: 32 }} />,
      href: "/team/league",
      color: "#4caf50",
    },
    {
      id: "recruit-guests",
      label: "Recruit Guests",
      icon: <PersonIcon sx={{ fontSize: 32 }} />,
      href: "/team?tab=recruit",
      color: "#4caf50",
    },
    {
      id: "recruit-teammates",
      label: "Recruit Teammates",
      icon: <GroupIcon sx={{ fontSize: 32 }} />,
      href: "/team?tab=recruit",
      color: "#2196f3",
    },
  ];

  return (
    <>
      <SeoHead title="All Menu" description="Filter matches by gender, level, format, time and more." />

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 2 }}>
        <Container maxWidth="md">
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              mb: 3,
              px: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <IconButton
                onClick={() => router.back()}
                sx={{
                  bgcolor: "action.hover",
                  "&:hover": { bgcolor: "action.selected" },
                }}
              >
                <ArrowBackIcon />
              </IconButton>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  textAlign: "center",
                  flex: 1,
                }}
              >
                All Menu
              </Typography>
            </Box>
          </Box>

          {/* Social Match Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                px: 2,
                color: "text.primary",
              }}
            >
              Social Match
            </Typography>
            <Grid container spacing={1.5} sx={{ px: 1 }}>
              {socialMatchItems.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Card
                    component={Link}
                    href={item.href}
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                      "&:active": { transform: "scale(0.98)" },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 120,
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardContent
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 1,
                        py: 2,
                        "&:last-child": { pb: 2 },
                      }}
                    >
                      <Box sx={{ color: item.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>
                        {item.icon}
                      </Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: "center", color: "text.primary", fontSize: "0.75rem" }}>
                        {item.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Team Section */}
          <Box sx={{ mb: 4 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 600,
                mb: 2,
                px: 2,
                color: "text.primary",
              }}
            >
              Team
            </Typography>
            <Grid container spacing={1.5} sx={{ px: 1 }}>
              {teamItems.map((item) => (
                <Grid item xs={6} sm={4} md={3} key={item.id}>
                  <Card
                    component={Link}
                    href={item.href}
                    sx={{
                      textDecoration: "none",
                      cursor: "pointer",
                      transition: "transform 0.2s, box-shadow 0.2s",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: 4 },
                      "&:active": { transform: "scale(0.98)" },
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      minHeight: 120,
                      bgcolor: "background.paper",
                    }}
                  >
                    <CardContent sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 1, py: 2, "&:last-child": { pb: 2 } }}>
                      <Box sx={{ color: item.color, display: "flex", alignItems: "center", justifyContent: "center", mb: 0.5 }}>{item.icon}</Box>
                      <Typography variant="body2" sx={{ fontWeight: 500, textAlign: "center", color: "text.primary", fontSize: "0.75rem" }}>{item.label}</Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Container>
      </Box>
    </>
  );
}

