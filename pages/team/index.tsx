import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  IconButton,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import AddIcon from "@mui/icons-material/Add";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import GroupIcon from "@mui/icons-material/Group";
import FeedbackIcon from "@mui/icons-material/Feedback";
import styles from "@/styles/team.module.scss";
import { getTeams, getMyTeams, Team } from "@/lib/teamApi";
import { useAuth } from "@/contexts/AuthContext";
import { normalizeImageUrl } from "@/lib/imageUrl";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TeamPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [filterValue, setFilterValue] = useState<"all" | "my">("all");
  const [allTeams, setAllTeams] = useState<Team[]>([]);
  const [myTeams, setMyTeams] = useState<Team[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMy, setLoadingMy] = useState(false);
  const [teamsError, setTeamsError] = useState<string | null>(null);

  useEffect(() => {
    const { tab } = router.query;
    if (tab === "recruit") setTabValue(1);
  }, [router.query]);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const loadAllTeams = React.useCallback(() => {
    setTeamsError(null);
    setLoading(true);
    getTeams({ limit: 100 })
      .then((data) => {
        setAllTeams(data || []);
      })
      .catch((err) => {
        console.error("getTeams error:", err);
        setAllTeams([]);
        setTeamsError(err?.message || "Ro'yxatni yuklab bo'lmadi. Backend ishlayotganini tekshiring.");
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    loadAllTeams();
  }, [loadAllTeams]);

  // Fetch my teams when authenticated
  useEffect(() => {
    if (!isAuthenticated) {
      setMyTeams([]);
      return;
    }
    let cancelled = false;
    setLoadingMy(true);
    getMyTeams()
      .then((data) => {
        if (!cancelled) setMyTeams(data || []);
      })
      .catch(() => {
        if (!cancelled) setMyTeams([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingMy(false);
      });
    return () => { cancelled = true; };
  }, [isAuthenticated]);

  const teamsToShow =
    tabValue === 0
      ? filterValue === "my"
        ? myTeams
        : allTeams
      : myTeams;
  const isLoadingList = tabValue === 0 ? (filterValue === "my" ? loadingMy : loading) : loadingMy;

  return (
    <>
      <Head>
        <title>Team - KickUp</title>
        <meta
          name="description"
          content="Join team leagues, recruit teammates, and create your own team on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box className={styles.teamPage}>
        {/* Quick Menu Buttons — press feedback + modern icon style */}
        <Container maxWidth="lg">
          <Box className={styles.quickMenu}>
            <Card className={styles.quickMenuItem} component={Link} href="/team/league">
              <CardContent className={styles.quickMenuContent}>
                <Box
                  className={styles.quickMenuIconWrapper}
                  sx={{
                    background: "linear-gradient(135deg, rgba(245, 158, 11, 0.18) 0%, rgba(217, 119, 6, 0.28) 100%)",
                    border: "1px solid rgba(245, 158, 11, 0.35)",
                    "& .MuiSvgIcon-root": { color: "#b45309" },
                  }}
                >
                  <EmojiEventsIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="body2" className={styles.quickMenuText}>
                  Team League
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team/recruit">
              <CardContent className={styles.quickMenuContent}>
                <Box
                  className={styles.quickMenuIconWrapper}
                  sx={{
                    background: "linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(37, 99, 235, 0.28) 100%)",
                    border: "1px solid rgba(59, 130, 246, 0.35)",
                    "& .MuiSvgIcon-root": { color: "#2563eb" },
                  }}
                >
                  <GroupAddIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="body2" className={styles.quickMenuText}>
                  Member Recruit
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team/guests">
              <CardContent className={styles.quickMenuContent}>
                <Box
                  className={styles.quickMenuIconWrapper}
                  sx={{
                    background: "linear-gradient(135deg, rgba(139, 92, 246, 0.18) 0%, rgba(124, 58, 237, 0.28) 100%)",
                    border: "1px solid rgba(139, 92, 246, 0.35)",
                    "& .MuiSvgIcon-root": { color: "#6d28d9" },
                  }}
                >
                  <PersonAddIcon sx={{ fontSize: 30 }} />
                </Box>
                <Typography variant="body2" className={styles.quickMenuText}>
                  Guest Recruit
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team/create">
              <CardContent className={styles.quickMenuContent}>
                <Box
                  className={styles.quickMenuIconWrapper}
                  sx={{
                    background: "linear-gradient(135deg, rgba(0, 227, 119, 0.2) 0%, rgba(0, 163, 86, 0.3) 100%)",
                    border: "1px solid rgba(0, 227, 119, 0.4)",
                    "& .MuiSvgIcon-root": { color: "#00a85d" },
                  }}
                >
                  <AddCircleIcon sx={{ fontSize: 32 }} />
                </Box>
                <Typography variant="body2" className={styles.quickMenuText}>
                  Create Team
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>

        {/* Banner Section */}
        <Container maxWidth="lg">
          <Box className={styles.bannerSection}>
            <Box className={styles.bannerContent}>
              <Box className={styles.bannerLeft}>
                <Typography variant="h4" className={styles.bannerTitle}>
                  Join Kickup Team League with your team members!
                </Typography>
                <Box className={styles.bannerButtons}>
                  <Button
                    variant="outlined"
                    className={`${styles.bannerButton} ${styles.bannerButtonViewDetails}`}
                    component={Link}
                    href="/team/league"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    className={styles.bannerButton}
                    component={Link}
                    href="/team/create"
                  >
                    Create New Team
                  </Button>
                </Box>
              </Box>
              <Box className={styles.bannerRight}>
                <Box className={styles.bannerImage} />
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Action Buttons */}
        <Container maxWidth="lg" sx={{ mb: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="h5" sx={{ fontWeight: 800 }}>
              Team Activity
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button
                variant="outlined"
                startIcon={<CalendarTodayIcon />}
                size="small"
                sx={{ borderRadius: 20, textTransform: "none" }}
              >
                Schedule
              </Button>
              <Button
                variant="outlined"
                startIcon={<AssessmentIcon />}
                size="small"
                sx={{ borderRadius: 20, textTransform: "none" }}
              >
                Stats
              </Button>
            </Box>
          </Box>

          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            variant="fullWidth"
            className={styles.teamTabs}
            TabIndicatorProps={{
              style: { backgroundColor: "var(--plab-black)", height: 3 },
            }}
          >
            <Tab label="Teams" className={styles.teamTab} />
            <Tab label="My Team" className={styles.teamTab} />
            <Tab label="Rankings" className={styles.teamTab} />
          </Tabs>

          <TabPanel value={tabValue} index={0}>
            <Box sx={{ mb: 2, display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
              <FormControl size="small" sx={{ minWidth: 140 }}>
                <Select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value as "all" | "my")}
                  sx={{ borderRadius: 2 }}
                  displayEmpty
                >
                  <MenuItem value="all">All Teams</MenuItem>
                  {isAuthenticated && <MenuItem value="my">My Teams</MenuItem>}
                </Select>
              </FormControl>
              <Typography variant="body2" color="text.secondary">
                {filterValue === "my" ? `${myTeams.length} team(s)` : `${allTeams.length} team(s)`}
              </Typography>
            </Box>

            {isLoadingList ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography color="text.secondary">Loading teams…</Typography>
              </Box>
            ) : teamsError ? (
              <Box sx={{ p: 4, textAlign: "center", bgcolor: "background.paper", borderRadius: 4 }}>
                <GroupIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="error.main" sx={{ mb: 1 }}>
                  Ro'yxat yuklanmadi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {teamsError}
                </Typography>
                <Button variant="contained" onClick={loadAllTeams} sx={{ borderRadius: 2 }}>
                  Qayta urinish
                </Button>
              </Box>
            ) : teamsToShow.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", bgcolor: "background.paper", borderRadius: 4 }}>
                <GroupIcon sx={{ fontSize: 60, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6">
                  {filterValue === "my" ? "No teams yet" : "Jamoalar hali yo'q"}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  {filterValue === "my"
                    ? "Sizda jamoalar yo'q. All Teams dan qo'shiling yoki yangi yarating."
                    : "Hali hech qanday jamoa yaratilmagan. Birinchi bo'lib jamoa yarating."}
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/team/create"
                  sx={{ borderRadius: 2 }}
                >
                  Create Team
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {teamsToShow.map((team) => (
                  <Card
                    key={team.id}
                    className={styles.matchCard}
                    component={Link}
                    href={`/team/${team.id}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      transition: "box-shadow 0.2s, transform 0.2s",
                      "&:hover": { boxShadow: 3, transform: "translateY(-2px)" },
                    }}
                  >
                    <CardContent className={styles.matchCardContent}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 2, flexWrap: "wrap" }}>
                        <Avatar
                          src={normalizeImageUrl(team.logo) || undefined}
                          sx={{
                            width: 56,
                            height: 56,
                            border: "1px solid",
                            borderColor: "divider",
                            bgcolor: "grey.200",
                            fontSize: "1.25rem",
                          }}
                        >
                          {team.name?.[0]?.toUpperCase() || "?"}
                        </Avatar>
                        <Box sx={{ flex: 1, minWidth: 0 }}>
                          <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                            {team.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary" noWrap>
                            {team.description || "No description"}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {team.members?.length ?? 0} members
                            {team.stats?.totalMatches != null && ` · ${team.stats.totalMatches} matches`}
                          </Typography>
                        </Box>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 600 }}>
                          View →
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {loadingMy ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography color="text.secondary">Loading your teams…</Typography>
              </Box>
            ) : myTeams.length === 0 ? (
              <Box sx={{ p: 4, textAlign: "center", bgcolor: "background.paper", borderRadius: 4 }}>
                <GroupAddIcon sx={{ fontSize: 60, color: "var(--plab-gray)", mb: 2 }} />
                <Typography variant="h6">No team found</Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                  You haven't joined or created any teams yet.
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  component={Link}
                  href="/team/create"
                  sx={{
                    bgcolor: "var(--plab-black)",
                    borderRadius: 20,
                    "&:hover": { bgcolor: "#333" },
                  }}
                >
                  Find/Create Team
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                {myTeams.map((team) => (
                  <Card
                    key={team.id}
                    component={Link}
                    href={`/team/${team.id}`}
                    sx={{
                      textDecoration: "none",
                      color: "inherit",
                      borderRadius: 2,
                      "&:hover": { boxShadow: 3 },
                    }}
                  >
                    <CardContent sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar
                        src={normalizeImageUrl(team.logo) || undefined}
                        sx={{ width: 48, height: 48, bgcolor: "grey.300" }}
                      >
                        {team.name?.[0]?.toUpperCase() || "?"}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="subtitle1" fontWeight={700}>{team.name}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          {team.members?.length ?? 0} members
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="primary" fontWeight={600}>View →</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box
              sx={{
                p: 4,
                textAlign: "center",
                bgcolor: "background.paper",
                borderRadius: 4,
              }}
            >
              <LeaderboardIcon
                sx={{ fontSize: 60, color: "var(--plab-gray)", mb: 2 }}
              />
              <Typography variant="h6">Team Rankings</Typography>
              <Typography variant="body2" color="text.secondary">
                Coming soon! View the top performing teams on Plab.
              </Typography>
            </Box>
          </TabPanel>
        </Container>
      </Box>

      {/* Floating Buttons */}
      <Box
        sx={{
          position: "fixed",
          bottom: 90,
          right: 20,
          display: "flex",
          flexDirection: "column",
          gap: 2,
          zIndex: 1000,
        }}
      >
        <IconButton
          sx={{
            bgcolor: "white",
            boxShadow: 2,
            "&:hover": { bgcolor: "#f5f5f5" },
          }}
        >
          <FeedbackIcon sx={{ color: "var(--plab-black)" }} />
        </IconButton>
      </Box>
    </>
  );
}
