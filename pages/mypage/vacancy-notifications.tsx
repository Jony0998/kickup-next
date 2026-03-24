import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  CircularProgress,
  List,
  ListItem,
  ListItemText,
  ListItemButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import NotificationsIcon from "@mui/icons-material/Notifications";
import { useRouter } from "next/router";
import { getMyNotifications, type Notification } from "@/lib/notificationApi";

export default function VacancyNotifications() {
  const router = useRouter();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      const data = await getMyNotifications(100);
      setNotifications(data || []);
    } catch (error) {
      console.error("Error loading notifications:", error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (s: string) => {
    try {
      const d = new Date(s);
      const now = new Date();
      const diff = now.getTime() - d.getTime();
      if (diff < 60000) return "Just now";
      if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
      if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
      return d.toLocaleDateString();
    } catch {
      return s;
    }
  };

  return (
    <>
      <Head>
        <title>Alerts - KickUp</title>
        <meta name="description" content="Your notifications and alerts" />
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
              Alerts
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Match reminders, vacancy alerts, and updates
            </Typography>
          </Box>

          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : notifications.length === 0 ? (
            <Card sx={{ borderRadius: 3 }}>
              <CardContent>
                <Box sx={{ textAlign: "center", py: 4 }}>
                  <NotificationsIcon sx={{ fontSize: 64, mb: 2, opacity: 0.3 }} />
                  <Typography variant="h6" sx={{ mb: 1 }}>
                    No alerts yet
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                    You’ll see match reminders and vacancy alerts here when you join matches or subscribe to notifications.
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
            <Card sx={{ borderRadius: 3, overflow: "hidden" }}>
              <List disablePadding>
                {notifications.map((n) => (
                  <ListItem key={n.id} disablePadding divider>
                    <ListItemButton
                      onClick={() => n.matchId && router.push("/match/" + n.matchId)}
                      sx={{ py: 2, bgcolor: n.read ? "transparent" : "action.hover" }}
                    >
                      <ListItemText
                        primary={n.title}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.secondary" component="span">
                              {n.message}
                            </Typography>
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ mt: 0.5 }}>
                              {formatDate(n.createdAt)}
                            </Typography>
                          </>
                        }
                        primaryTypographyProps={{ fontWeight: n.read ? 500 : 700 }}
                      />
                    </ListItemButton>
                  </ListItem>
                ))}
              </List>
            </Card>
          )}
        </Container>
      </Box>
    </>
  );
}
