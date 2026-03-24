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
  Avatar,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WcIcon from "@mui/icons-material/Wc";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import { getGuestPosts, applyAsGuest, GuestPost } from "@/lib/guestRecruitmentApi";
import { useAuth } from "@/contexts/AuthContext";
import styles from "@/styles/team.module.scss";

export default function RecruitGuestsPage() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const [filterValue, setFilterValue] = useState("all");
  const [guestPosts, setGuestPosts] = useState<GuestPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [applyDialogOpen, setApplyDialogOpen] = useState(false);
  const [selectedPost, setSelectedPost] = useState<GuestPost | null>(null);
  const [applying, setApplying] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (router.query.action === "create") {
      setCreateDialogOpen(true);
    }
    loadGuestPosts();
  }, [filterValue, router.query]);

  const loadGuestPosts = async () => {
    try {
      setLoading(true);
      const filter = filterValue !== "all" ? { gender: filterValue } : undefined;
      const posts = await getGuestPosts(filter);
      setGuestPosts(posts);
    } catch (error) {
      console.error("Error loading guest posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (post: GuestPost) => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setSelectedPost(post);
    setApplyDialogOpen(true);
  };

  const confirmApply = async () => {
    if (!selectedPost) return;
    try {
      setApplying(true);
      setError("");
      await applyAsGuest(selectedPost.id);
      setApplyDialogOpen(false);
      setSelectedPost(null);
      // Reload posts
      loadGuestPosts();
    } catch (err: any) {
      setError(err?.message || "Failed to apply as guest");
    } finally {
      setApplying(false);
    }
  };

  // Fallback mock data
  const mockGuestPosts = [
    {
      id: 1,
      teamName: "FC Warriors",
      teamLogo: "/team1.jpg",
      matchDate: "January 30, Friday",
      matchTime: "20:00",
      location: "Seoul, Yongsan",
      field: "Adidas The Base Field 2 / Man Utd",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "Parking Full",
      needed: 2,
      description: "Need 2 guest players for our league match this Friday.",
      postedDate: "1 day ago",
    },
    {
      id: 2,
      teamName: "Thunder FC",
      teamLogo: "/team2.jpg",
      matchDate: "February 1, Sunday",
      matchTime: "18:00",
      location: "Seoul, Gangnam",
      field: "SKY Futsal Park A",
      gender: "Mixed",
      format: "5vs5",
      level: "All Levels",
      needed: 1,
      description: "Looking for 1 guest player. Fun and friendly match!",
      postedDate: "3 days ago",
    },
    {
      id: 3,
      teamName: "Eagles United",
      teamLogo: "/team3.jpg",
      matchDate: "February 2, Monday",
      matchTime: "21:00",
      location: "Seoul, Mapo",
      field: "Mapo Futsal Center",
      gender: "Female",
      format: "6vs6",
      level: "Beginner",
      needed: 3,
      description: "Need 3 guest players for our friendly match.",
      postedDate: "5 days ago",
    },
  ];

  return (
    <>
      <Head>
        <title>Recruit Guests - KickUp</title>
        <meta
          name="description"
          content="Find guest players for your matches or join as a guest player on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box className={styles.teamPage}>
        {/* Header */}
        <Container maxWidth="lg">
          <Box className={styles.pageHeader}>
            <Button
              component={Link}
              href="/team"
              startIcon={<ArrowBackIcon />}
              className={styles.backButton}
            >
              Back to Team
            </Button>
            <Box className={styles.pageTitleSection}>
              <PersonAddIcon className={styles.pageTitleIcon} />
              <Typography variant="h4" className={styles.pageTitle}>
                Recruit Guests
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.pageSubtitle}>
              Find guest players for your matches or join as a guest player
            </Typography>
          </Box>
        </Container>

        {/* Filter */}
        <Container maxWidth="lg">
          <Box className={styles.filterSection}>
            <FormControl className={styles.filterControl}>
              <Select
                value={filterValue}
                onChange={(e) => setFilterValue(e.target.value)}
                className={styles.filterSelect}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>

        {/* Guest Posts List */}
        <Container maxWidth="lg">
          <Box className={styles.matchList}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : guestPosts.length === 0 ? (
              <Box className={styles.emptyState}>
                <Typography variant="h6">No guest posts available</Typography>
                <Typography variant="body2">Be the first to post a guest recruitment request</Typography>
              </Box>
            ) : (
              guestPosts.map((post) => (
              <Card key={post.id} className={styles.matchCard} component={Link} href={`/team/guests/${post.id}`}>
                <CardContent className={styles.matchCardContent}>
                  <Box className={styles.matchHeader}>
                    <Box className={styles.matchDateTime}>
                      <Typography variant="body1" className={styles.matchDate}>
                        {post.matchDate}
                      </Typography>
                      <Typography variant="h6" className={styles.matchTime}>
                        {post.matchTime}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Need ${post.needed} player${post.needed > 1 ? 's' : ''}`}
                      size="small"
                      className={styles.neededChip}
                    />
                  </Box>

                  <Box className={styles.guestTeamInfo}>
                    <Avatar
                      src={post.teamLogo}
                      className={styles.teamLogo}
                      sx={{ width: 40, height: 40 }}
                    >
                      {post.teamName[0]}
                    </Avatar>
                    <Typography variant="h6" className={styles.matchField}>
                      {post.teamName} - {post.field}
                    </Typography>
                  </Box>

                  <Box className={styles.matchDetails}>
                    <Chip
                      icon={<WcIcon />}
                      label={post.gender}
                      size="small"
                      className={styles.detailChip}
                    />
                    <Typography variant="body2" className={styles.detailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.detailText}>
                      {post.format}
                    </Typography>
                    <Typography variant="body2" className={styles.detailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.detailText}>
                      {post.level}
                    </Typography>
                    {post.parking && (
                      <>
                        <Typography variant="body2" className={styles.detailSeparator}>
                          ·
                        </Typography>
                        <Typography variant="body2" className={styles.detailText}>
                          {post.parking}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Typography variant="body2" className={styles.guestDescription}>
                    {post.description}
                  </Typography>

                  <Box className={styles.recruitmentActions}>
                    <Button
                      variant="outlined"
                      className={styles.recruitmentActionButton}
                      component={Link}
                      href={`/team/guests/${post.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.recruitmentActionButton}
                      onClick={() => handleApply(post)}
                    >
                      Apply as Guest
                    </Button>
                  </Box>
                </CardContent>
              </Card>
              ))
            )}
          </Box>
        </Container>

        {/* Floating Action Button */}
        <IconButton
          className={styles.floatingActionButton}
          onClick={() => setCreateDialogOpen(true)}
        >
          <AddIcon />
        </IconButton>

        {/* Apply Dialog */}
        <Dialog open={applyDialogOpen} onClose={() => setApplyDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Apply as Guest Player</DialogTitle>
          <DialogContent>
            {error && (
              <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
                {error}
              </Alert>
            )}
            {selectedPost && (
              <Box>
                <Typography variant="body1" sx={{ mb: 2 }}>
                  You are applying to join <strong>{selectedPost.teamName}</strong> as a guest player for their match on{" "}
                  <strong>{selectedPost.matchDate}</strong> at <strong>{selectedPost.matchTime}</strong>.
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  The team needs {selectedPost.needed} guest player{selectedPost.needed > 1 ? "s" : ""}.
                </Typography>
              </Box>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setApplyDialogOpen(false)} disabled={applying}>
              Cancel
            </Button>
            <Button onClick={confirmApply} variant="contained" disabled={applying}>
              {applying ? <CircularProgress size={20} /> : "Confirm Application"}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Create Post Dialog - Link to create page */}
        {createDialogOpen && (
          <Box>
            {router.push("/team/guests/create")}
          </Box>
        )}
      </Box>
    </>
  );
}
