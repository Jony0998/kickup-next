import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  IconButton,
  Grid,
  TextField,
  InputAdornment,
  Avatar,
  Chip,
  Divider,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import PeopleIcon from "@mui/icons-material/People";
import PsychologyIcon from "@mui/icons-material/Psychology";
import SentimentSatisfiedIcon from "@mui/icons-material/SentimentSatisfied";
import FavoriteIcon from "@mui/icons-material/Favorite";
import NotificationsIcon from "@mui/icons-material/Notifications";
import MailIcon from "@mui/icons-material/Mail";
import EditIcon from "@mui/icons-material/Edit";
import SettingsIcon from "@mui/icons-material/Settings";
import QrCodeIcon from "@mui/icons-material/QrCode";
import EmojiEmotionsIcon from "@mui/icons-material/EmojiEmotions";
import ShieldIcon from "@mui/icons-material/Shield";
import VisibilityIcon from "@mui/icons-material/Visibility";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import PersonIcon from "@mui/icons-material/Person";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import { getSkillLevelLabel, getSkillLevelBgColor, getSkillLevelColor } from "@/lib/skillLevels";
import { normalizeImageUrl } from "@/lib/imageUrl";

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  badge?: string | number;
  color?: string;
}

export default function MyPage() {
  const router = useRouter();
  const { user } = useAuth();
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const menuItems: MenuItem[] = [
    {
      id: "application-history",
      label: "History",
      icon: <CalendarTodayIcon />,
      href: "/mypage/application-history",
      color: "#00E377",
    },
    {
      id: "ai-reports",
      label: "AI Report",
      icon: <PsychologyIcon />,
      href: "/mypage/ai-reports",
      badge: "NEW",
      color: "#7C3AED",
    },
    {
      id: "coupons",
      label: "Coupons",
      icon: <LocalOfferIcon />,
      href: "/mypage/coupons",
      color: "#F59E0B",
    },
    {
      id: "friends",
      label: "Friends",
      icon: <PeopleIcon />,
      href: "/mypage/friends",
      color: "#3B82F6",
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: <WhatshotIcon />,
      href: "/mypage/challenges",
      color: "#EF4444",
    },
    {
      id: "liked-matches",
      label: "Liked",
      icon: <FavoriteIcon />,
      href: "/mypage/liked-matches",
      color: "#EC4899",
    },
    {
      id: "vacancy-notifications",
      label: "Alerts",
      icon: <NotificationsIcon />,
      href: "/mypage/vacancy-notifications",
      color: "#6366F1",
    },
    {
      id: "settings",
      label: "Settings",
      icon: <SettingsIcon />,
      href: "/mypage/settings",
      color: "#6B7280",
    },
  ];

  const userCash = user?.memberPoints || 0;

  return (
    <ProtectedRoute>
      <Head>
        <title>My Page - KickUp</title>
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", pb: 14 }}>
        <Container maxWidth="sm" sx={{ px: 0 }}>

          {/* Header Area */}
          <Box sx={{ pt: 4, pb: 2, px: 3 }}>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "text.primary" }}>
              My KickUp
            </Typography>
          </Box>

          {/* Profile Section */}
          <Box sx={{ px: 3, mb: 3 }}>
            <Card
              elevation={0}
              sx={{
                bgcolor: "background.paper",
                borderRadius: 4,
                border: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid #E5E8EB',
                boxShadow: isDark ? 'none' : '0 4px 20px rgba(0,0,0,0.02)'
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Avatar
                    src={normalizeImageUrl(user?.memberImage) || undefined}
                    sx={{
                      width: 64,
                      height: 64,
                      bgcolor: isDark ? "#374151" : "#F3F4F6",
                      color: isDark ? "#fff" : "#191F28",
                      fontSize: "1.5rem",
                      fontWeight: 700,
                    }}
                  >
                    {user?.memberImage ? (user?.memberNick?.charAt(0).toUpperCase() || "U") : <PersonIcon sx={{ fontSize: 32 }} />}
                  </Avatar>
                  <Box sx={{ flex: 1 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: "text.primary" }}>
                      {user?.memberFullName || user?.memberNick || "Guest"}
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {user?.memberSkillLevel && (
                        <Chip
                          label={getSkillLevelLabel(user.memberSkillLevel)}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.7rem",
                            fontWeight: 700,
                            bgcolor: getSkillLevelBgColor(user.memberSkillLevel),
                            color: getSkillLevelColor(user.memberSkillLevel),
                          }}
                        />
                      )}
                      <Typography variant="caption" sx={{ color: "text.secondary" }}>
                        {user?.memberPhone || "Please register to log in"}
                      </Typography>
                    </Box>
                  </Box>
                  <IconButton
                    size="small"
                    component={Link}
                    href="/mypage/edit-profile"
                    sx={{ color: "text.secondary" }}
                  >
                    <ArrowForwardIosIcon fontSize="small" />
                  </IconButton>
                </Box>

                <Divider sx={{ my: 2, borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#F3F4F6' }} />

                <Box sx={{ display: "flex", justifyContent: 'space-between', alignItems: 'center' }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "text.secondary", display: 'block', mb: 0.5 }}>
                      KickUp Cash
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
                      ₩ {userCash.toLocaleString()}
                    </Typography>
                  </Box>
                  <Button
                    variant="contained"
                    disableElevation
                    size="small"
                    sx={{
                      bgcolor: isDark ? "rgba(255,255,255,0.1)" : "#F3F4F6",
                      color: "text.primary",
                      fontWeight: 600,
                      borderRadius: 2,
                      textTransform: 'none',
                      "&:hover": { bgcolor: isDark ? "rgba(255,255,255,0.2)" : "#E5E7EB" },
                    }}
                  >
                    Recharge
                  </Button>
                </Box>
              </CardContent>
            </Card>
          </Box>

          {/* Menu — PLAB-style grid */}
          <Box sx={{ px: 3 }}>
            <Typography variant="subtitle1" sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}>
              Menu
            </Typography>
            <Grid container spacing={2}>
              {menuItems.map((item) => (
                <Grid item xs={3} key={item.id} sx={{ display: "flex", justifyContent: "center" }}>
                  <Link href={item.href} style={{ textDecoration: "none", width: "100%" }}>
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 1,
                        "&:active .menuIconBox": { transform: "scale(0.92)" },
                      }}
                    >
                      <Box
                        className="menuIconBox"
                        sx={{
                          width: 56,
                          height: 56,
                          borderRadius: 3,
                          bgcolor: isDark ? "rgba(255,255,255,0.06)" : "#fff",
                          border: isDark ? "1px solid rgba(255,255,255,0.12)" : "1px solid #E5E7EB",
                          boxShadow: isDark ? "none" : "0 1px 3px rgba(0,0,0,0.06)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          color: item.color || "text.primary",
                          position: "relative",
                          transition: "transform 0.15s ease, box-shadow 0.15s ease",
                          "&:hover": {
                            boxShadow: isDark ? "0 4px 12px rgba(0,0,0,0.2)" : "0 4px 12px rgba(0,0,0,0.08)",
                          },
                        }}
                      >
                        {item.icon}
                        {item.badge && (
                          <Box
                            sx={{
                              position: "absolute",
                              top: -2,
                              right: -2,
                              bgcolor: "#EF4444",
                              color: "white",
                              fontSize: "0.6rem",
                              fontWeight: 700,
                              px: 0.6,
                              py: 0.2,
                              borderRadius: 10,
                              boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                            }}
                          >
                            {item.badge}
                          </Box>
                        )}
                      </Box>
                      <Typography
                        variant="caption"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          textAlign: "center",
                          lineHeight: 1.2,
                          fontSize: "0.75rem",
                        }}
                      >
                        {item.label}
                      </Typography>
                    </Box>
                  </Link>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* Banner / Invite Friends */}
          <Box sx={{ px: 3, mt: 4 }}>
            <Card
              component={Link}
              href="/mypage/invite-friends"
              elevation={0}
              sx={{
                background: "linear-gradient(135deg, #191F28 0%, #2D3748 100%)",
                borderRadius: 4,
                color: "white",
                textDecoration: 'none',
                overflow: 'visible'
              }}
            >
              <CardContent sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2 }}>
                <Box
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: "rgba(255,255,255,0.1)",
                    borderRadius: "50%",
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <MailIcon color="inherit" />
                </Box>
                <Box>
                  <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                    Invite Friends
                  </Typography>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>
                    Get ₩3,000 for every invite
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Box>

        </Container>
      </Box>
    </ProtectedRoute>
  );
}
