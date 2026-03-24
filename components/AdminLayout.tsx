import { ReactNode } from "react";
import React from "react";
import { useRouter } from "next/router";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  Divider,
  Avatar,
  Chip,
  useMediaQuery,
  useTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StadiumIcon from "@mui/icons-material/Stadium";
import PeopleIcon from "@mui/icons-material/People";
import LogoutIcon from "@mui/icons-material/Logout";
import HomeIcon from "@mui/icons-material/Home";
import AssessmentIcon from "@mui/icons-material/Assessment";
import DescriptionIcon from "@mui/icons-material/Description";
import EventAvailableIcon from "@mui/icons-material/EventAvailable";
import PaymentsIcon from "@mui/icons-material/Payments";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import Link from "next/link";

const drawerWidth = 280;

interface AdminLayoutProps {
  children: ReactNode;
  title?: string;
}

interface NavItem {
  text: string;
  icon: React.ElementType;
  path: string;
}

const navItems: NavItem[] = [
  { text: "Dashboard", icon: DashboardIcon, path: "/admin/dashboard" },
  { text: "Matches", icon: SportsSoccerIcon, path: "/admin/matches" },
  { text: "Fields", icon: StadiumIcon, path: "/admin/fields" },
  { text: "Users", icon: PeopleIcon, path: "/admin/users" },
  { text: "Analytics", icon: AssessmentIcon, path: "/admin/analytics" },
  { text: "Bookings", icon: EventAvailableIcon, path: "/admin/bookings" },
  { text: "Payments", icon: PaymentsIcon, path: "/admin/payments" },
  { text: "Reports", icon: DescriptionIcon, path: "/admin/reports" },
];

export default function AdminLayout({ children, title }: AdminLayoutProps) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const { user, logout, isAdmin, loading } = useAuth();
  const { showSuccess } = useErrorNotification();
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = React.useState(false);

  // Redirect if not admin (admin panel is for super-admin only)
  React.useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/");
    }
  }, [isAdmin, loading, router]);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogoutClick = () => {
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    showSuccess('You have been logged out.');
    logout();
  };

  const drawer = (
    <Box>
      <Toolbar
        sx={{
          background: "linear-gradient(135deg, #00E377 0%, #00C466 100%)",
          color: "#191F28",
          minHeight: "80px !important",
        }}
      >
        <Box sx={{ width: "100%" }}>
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 0.5 }}>
            Admin Panel
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.85 }}>
            {user?.memberNick || "Admin"}
          </Typography>
        </Box>
      </Toolbar>
      <Divider />
      <List sx={{ pt: 2 }}>
        {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = router.pathname === item.path || router.pathname.startsWith(item.path + "/");
            return (
              <ListItem key={item.path} disablePadding sx={{ mb: 0.5, px: 1 }}>
                <ListItemButton
                  component={Link}
                  href={item.path}
                  selected={isActive}
                  sx={{
                    borderRadius: 2,
                    "&.Mui-selected": {
                      background: "rgba(0, 227, 119, 0.12)",
                      color: "#00E377",
                      "&:hover": {
                        background: "rgba(0, 227, 119, 0.18)",
                      },
                    },
                    "&:hover": {
                      background: "action.hover",
                    },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      color: isActive ? "#00E377" : "text.secondary",
                      minWidth: 40,
                    }}
                  >
                    <Icon />
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    primaryTypographyProps={{
                      fontWeight: isActive ? 600 : 400,
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
      </List>
      <Divider sx={{ my: 2 }} />
      <List>
        <ListItem disablePadding sx={{ px: 1 }}>
          <ListItemButton
            component={Link}
            href="/"
            sx={{
              borderRadius: 2,
              "&:hover": {
                background: "action.hover",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Back to Home" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding sx={{ px: 1, mt: 0.5 }}>
          <ListItemButton
            onClick={handleLogoutClick}
            sx={{
              borderRadius: 2,
              color: "error.main",
              "&:hover": {
                background: "error.light",
                color: "error.dark",
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40, color: "inherit" }}>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="Logout" />
          </ListItemButton>
        </ListItem>
      </List>
      <Box sx={{ p: 2, mt: "auto" }}>
        <Box
          sx={{
            p: 2,
            borderRadius: 2,
            background: "rgba(0, 227, 119, 0.1)",
            textAlign: "center",
          }}
        >
          <Avatar
            sx={{
              bgcolor: "#00E377",
              color: "#191F28",
              width: 56,
              height: 56,
              mx: "auto",
              mb: 1,
            }}
          >
            {user?.memberNick?.charAt(0).toUpperCase() || "A"}
          </Avatar>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, mb: 0.5 }}>
            {user?.memberNick || "Admin"}
          </Typography>
          <Typography variant="caption" color="text.secondary" sx={{ mb: 1, display: "block" }}>
            {user?.memberPhone || ""}
          </Typography>
          <Chip
            label={user?.memberType?.toUpperCase() || "ADMIN"}
            size="small"
            sx={{ fontWeight: 600, bgcolor: "#00E377", color: "#191F28" }}
          />
        </Box>
      </Box>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Sidebar */}
      <Box
        component="nav"
        sx={{
          width: { md: drawerWidth },
          flexShrink: { md: 0 },
        }}
      >
        {/* Mobile drawer */}
        {isMobile && (
          <Drawer
            variant="temporary"
            open={mobileOpen}
            onClose={handleDrawerToggle}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
            sx={{
              display: { xs: "block", md: "none" },
              "& .MuiDrawer-paper": {
                boxSizing: "border-box",
                width: drawerWidth,
              },
            }}
          >
            {drawer}
          </Drawer>
        )}
        {/* Desktop drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: "none", md: "block" },
            "& .MuiDrawer-paper": {
              boxSizing: "border-box",
              width: drawerWidth,
              borderRight: "1px solid",
              borderColor: "divider",
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          width: { md: `calc(100% - ${drawerWidth}px)` },
          minHeight: "100vh",
        }}
      >
        {title && (
          <Toolbar
            sx={{
              background: "linear-gradient(135deg, #00E377 0%, #00C466 100%)",
              color: "#191F28",
              minHeight: "64px !important",
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              {title}
            </Typography>
          </Toolbar>
        )}
        <Box sx={{ p: 3 }}>{children}</Box>
      </Box>

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Log out</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} color="inherit" sx={{ textTransform: "none" }}>
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error" sx={{ textTransform: "none" }}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

