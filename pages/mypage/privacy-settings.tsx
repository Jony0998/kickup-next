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
  Switch,
  FormControlLabel,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";

const STORAGE_PROFILE_VISIBLE = "kickup_privacy_profile_visible";
const STORAGE_SHOW_PHONE = "kickup_privacy_show_phone";
const STORAGE_SHOW_ACTIVITY = "kickup_privacy_show_activity";

function getStoredBool(key: string, fallback: boolean): boolean {
  if (typeof window === "undefined") return fallback;
  try {
    const v = localStorage.getItem(key);
    if (v === "false") return false;
    if (v === "true") return true;
  } catch {}
  return fallback;
}

function setStoredBool(key: string, value: boolean) {
  try {
    localStorage.setItem(key, String(value));
  } catch {}
}

export default function PrivacySettings() {
  const { showSuccess } = useErrorNotification();
  const [profileVisible, setProfileVisible] = useState(true);
  const [showPhone, setShowPhone] = useState(false);
  const [showActivity, setShowActivity] = useState(true);

  useEffect(() => {
    setProfileVisible(getStoredBool(STORAGE_PROFILE_VISIBLE, true));
    setShowPhone(getStoredBool(STORAGE_SHOW_PHONE, false));
    setShowActivity(getStoredBool(STORAGE_SHOW_ACTIVITY, true));
  }, []);

  const handleProfileVisible = (checked: boolean) => {
    setProfileVisible(checked);
    setStoredBool(STORAGE_PROFILE_VISIBLE, checked);
    showSuccess(checked ? "Profile visible to others." : "Profile hidden from others.");
  };

  const handleShowPhone = (checked: boolean) => {
    setShowPhone(checked);
    setStoredBool(STORAGE_SHOW_PHONE, checked);
    showSuccess(checked ? "Phone number visible to match/team members." : "Phone number hidden.");
  };

  const handleShowActivity = (checked: boolean) => {
    setShowActivity(checked);
    setStoredBool(STORAGE_SHOW_ACTIVITY, checked);
    showSuccess(checked ? "Activity visible." : "Activity hidden.");
  };

  return (
    <>
      <Head>
        <title>Privacy Settings - KickUp</title>
        <meta name="description" content="Privacy and visibility settings" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box sx={{ minHeight: "100vh", bgcolor: "background.default", py: 4, pb: 12 }}>
        <Container maxWidth="md">
          <Box sx={{ mb: 4 }}>
            <Button
              component={Link}
              href="/mypage/settings"
              startIcon={<ArrowBackIcon />}
              sx={{ mb: 2, textTransform: "none" }}
            >
              Back to Settings
            </Button>
            <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary" }}>
              Privacy Settings
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Control who can see your profile and contact info.
            </Typography>
          </Box>

          <Card sx={{ boxShadow: 2, borderRadius: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <FormControlLabel
                control={
                  <Switch
                    checked={profileVisible}
                    onChange={(e) => handleProfileVisible(e.target.checked)}
                    color="primary"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--plab-green, #00E377)" } }}
                  />
                }
                label="Profile visible to others"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 7, mt: 0.5 }}>
                When off, your profile will not appear in search or suggestions.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={showPhone}
                    onChange={(e) => handleShowPhone(e.target.checked)}
                    color="primary"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--plab-green, #00E377)" } }}
                  />
                }
                label="Show phone number to match & team members"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 7, mt: 0.5 }}>
                When on, organizers and teammates can see your phone number.
              </Typography>
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={showActivity}
                    onChange={(e) => handleShowActivity(e.target.checked)}
                    color="primary"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--plab-green, #00E377)" } }}
                  />
                }
                label="Show my activity (matches joined, teams)"
              />
              <Typography variant="body2" color="text.secondary" sx={{ ml: 7, mt: 0.5 }}>
                When off, others cannot see your match and team activity.
              </Typography>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
