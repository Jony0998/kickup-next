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
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  InputAdornment,
  IconButton,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import { updatePassword, deleteAccount } from "@/lib/accountApi";

const STORAGE_KEY_PUSH = "kickup_settings_push_notifications";
const STORAGE_KEY_EMAIL = "kickup_settings_email_notifications";

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

export default function Settings() {
  const { user, logout } = useAuth();
  const { showSuccess, showError } = useErrorNotification();

  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [deleteAccountOpen, setDeleteAccountOpen] = useState(false);

  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordLoading, setPasswordLoading] = useState(false);

  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    setPushNotifications(getStoredBool(STORAGE_KEY_PUSH, true));
    setEmailNotifications(getStoredBool(STORAGE_KEY_EMAIL, true));
  }, []);

  const handlePushChange = (checked: boolean) => {
    setPushNotifications(checked);
    setStoredBool(STORAGE_KEY_PUSH, checked);
    showSuccess(checked ? "Push notifications enabled." : "Push notifications disabled.");
  };

  const handleEmailChange = (checked: boolean) => {
    setEmailNotifications(checked);
    setStoredBool(STORAGE_KEY_EMAIL, checked);
    showSuccess(checked ? "Email notifications enabled." : "Email notifications disabled.");
  };

  const handleOpenChangePassword = () => {
    setOldPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setChangePasswordOpen(true);
  };

  const handleSubmitChangePassword = async () => {
    if (!newPassword || newPassword.length < 6) {
      showError("New password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      showError("New password and confirmation do not match.");
      return;
    }
    setPasswordLoading(true);
    try {
      await updatePassword(oldPassword, newPassword);
      showSuccess("Password updated successfully.");
      setChangePasswordOpen(false);
    } catch (e: any) {
      showError(e?.message || "Failed to update password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleOpenDeleteAccount = () => {
    setDeleteConfirmText("");
    setDeleteAccountOpen(true);
  };

  const handleConfirmDeleteAccount = async () => {
    if (deleteConfirmText !== "DELETE") {
      showError('Type "DELETE" to confirm.');
      return;
    }
    setDeleteLoading(true);
    try {
      await deleteAccount();
      showSuccess("Account has been deactivated.");
      setDeleteAccountOpen(false);
      logout();
    } catch (e: any) {
      showError(e?.message || "Failed to delete account.");
    } finally {
      setDeleteLoading(false);
    }
  };

  const hasPassword = user?.memberAuthType !== "TELEGRAM";

  return (
    <>
      <Head>
        <title>Settings - KickUp</title>
        <meta name="description" content="Account settings" />
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
            <Typography
              variant="h4"
              sx={{
                fontWeight: 700,
                color: "text.primary",
              }}
            >
              Settings
            </Typography>
          </Box>

          <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Notifications
              </Typography>
              <FormControlLabel
                control={
                  <Switch
                    checked={pushNotifications}
                    onChange={(e) => handlePushChange(e.target.checked)}
                    color="primary"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--plab-green, #00E377)" } }}
                  />
                }
                label="Push Notifications"
              />
              <Divider sx={{ my: 2 }} />
              <FormControlLabel
                control={
                  <Switch
                    checked={emailNotifications}
                    onChange={(e) => handleEmailChange(e.target.checked)}
                    color="primary"
                    sx={{ "& .MuiSwitch-switchBase.Mui-checked": { color: "var(--plab-green, #00E377)" } }}
                  />
                }
                label="Email Notifications"
              />
            </CardContent>
          </Card>

          <Card sx={{ mb: 2, boxShadow: 2, borderRadius: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Account
              </Typography>
              <List disablePadding>
                {hasPassword && (
                  <>
                    <ListItem disablePadding>
                      <ListItemButton onClick={handleOpenChangePassword}>
                        <ListItemText primary="Change Password" />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </>
                )}
                <ListItem disablePadding>
                  <ListItemButton component={Link} href="/mypage/privacy-settings">
                    <ListItemText primary="Privacy Settings" />
                  </ListItemButton>
                </ListItem>
                <Divider />
                <ListItem disablePadding>
                  <ListItemButton onClick={handleOpenDeleteAccount} sx={{ color: "error.main" }}>
                    <ListItemText
                      primary="Delete Account"
                      secondary="This action cannot be undone"
                      primaryTypographyProps={{ fontWeight: 600 }}
                    />
                  </ListItemButton>
                </ListItem>
              </List>
            </CardContent>
          </Card>

          <Card sx={{ boxShadow: 2, borderRadius: 3 }}>
            <CardContent sx={{ py: 2 }}>
              <Button
                variant="outlined"
                color="error"
                fullWidth
                onClick={() => setLogoutDialogOpen(true)}
                sx={{ py: 1.5, textTransform: "none", fontWeight: 600, fontSize: "1rem" }}
              >
                Logout
              </Button>
            </CardContent>
          </Card>
        </Container>
      </Box>

      {/* Logout dialog */}
      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Log out</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} color="inherit" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              setLogoutDialogOpen(false);
              showSuccess("You have been logged out.");
              logout();
            }}
            variant="contained"
            color="error"
            sx={{ textTransform: "none" }}
          >
            Log out
          </Button>
        </DialogActions>
      </Dialog>

      {/* Change Password dialog */}
      <Dialog open={changePasswordOpen} onClose={() => !passwordLoading && setChangePasswordOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Change Password</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Current password"
            type={showOldPassword ? "text" : "password"}
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            margin="normal"
            size="small"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowOldPassword(!showOldPassword)} edge="end" size="small">
                    {showOldPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="New password"
            type={showNewPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            margin="normal"
            size="small"
            helperText="At least 6 characters"
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={() => setShowNewPassword(!showNewPassword)} edge="end" size="small">
                    {showNewPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <TextField
            fullWidth
            label="Confirm new password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            margin="normal"
            size="small"
            error={!!confirmPassword && newPassword !== confirmPassword}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setChangePasswordOpen(false)} disabled={passwordLoading} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmitChangePassword}
            variant="contained"
            disabled={passwordLoading || !oldPassword || !newPassword || newPassword !== confirmPassword}
            sx={{ textTransform: "none", bgcolor: "var(--plab-green)", color: "var(--plab-black)", "&:hover": { bgcolor: "#00C466" } }}
          >
            {passwordLoading ? <CircularProgress size={24} /> : "Update password"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Account dialog */}
      <Dialog open={deleteAccountOpen} onClose={() => !deleteLoading && setDeleteAccountOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle sx={{ color: "error.main" }}>Delete Account</DialogTitle>
        <DialogContent>
          <Typography sx={{ mb: 2 }}>
            This will permanently deactivate your account. All your data will be removed. This action cannot be undone.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
            Type <strong>DELETE</strong> to confirm:
          </Typography>
          <TextField
            fullWidth
            label="Type DELETE"
            value={deleteConfirmText}
            onChange={(e) => setDeleteConfirmText(e.target.value)}
            margin="normal"
            size="small"
            error={deleteConfirmText.length > 0 && deleteConfirmText !== "DELETE"}
            placeholder="DELETE"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDeleteAccountOpen(false)} disabled={deleteLoading} sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button
            onClick={handleConfirmDeleteAccount}
            variant="contained"
            color="error"
            disabled={deleteLoading || deleteConfirmText !== "DELETE"}
            sx={{ textTransform: "none" }}
          >
            {deleteLoading ? <CircularProgress size={24} color="inherit" /> : "Delete my account"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
