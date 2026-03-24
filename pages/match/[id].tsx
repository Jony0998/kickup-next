import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Button,
  Chip,
  Avatar,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Alert,
  CircularProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import ShareIcon from "@mui/icons-material/Share";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import PeopleIcon from "@mui/icons-material/People";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import StarIcon from "@mui/icons-material/Star";
import SchoolIcon from "@mui/icons-material/School";
import LocalParkingIcon from "@mui/icons-material/LocalParking";
import ShowerIcon from "@mui/icons-material/Shower";
import LockIcon from "@mui/icons-material/Lock";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import NotificationsIcon from "@mui/icons-material/Notifications";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import RateReviewIcon from "@mui/icons-material/RateReview";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import {
  getMatchDetails,
  joinMatch,
  leaveMatch,
  likeMatch as likeMatchApi,
  Match,
  getFieldData,
  getOrganizer,
  getJoinedMembers,
  isUserJoined,
  MatchMember,
  MatchField,
} from "@/lib/matchApi";
import Layout from "@/components/Layout";
import { subscribeToVacancy, unsubscribeFromVacancy } from "@/lib/notificationApi";
import Chat from "@/components/Chat";
import RatingDialog from "@/components/RatingDialog";
import RatingDisplay from "@/components/RatingDisplay";
import { Rating } from "@/lib/ratingApi";
import PostMatchForm from "@/components/match/PostMatchForm";
import { getMatchResult } from "@/lib/matchResultApi";
import { getSkillLevelLabel, getSkillLevelBgColor, getSkillLevelColor } from "@/lib/skillLevels";

export default function MatchDetailsPage() {
  const router = useRouter();
  const { id } = router.query;
  const { user, isAuthenticated } = useAuth();
  const { showError, showSuccess } = useErrorNotification();
  const [match, setMatch] = useState<Match | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [liked, setLiked] = useState(false);
  const [joining, setJoining] = useState(false);
  const [userJoined, setUserJoined] = useState(false);
  const [vacancySubscribed, setVacancySubscribed] = useState(false);
  const [subscriptionId, setSubscriptionId] = useState<string | null>(null);
  const [ratingOpen, setRatingOpen] = useState(false);
  const [resultOpen, setResultOpen] = useState(false);
  const [matchResult, setMatchResult] = useState<any>(null);

  useEffect(() => {
    if (id && typeof id === "string") {
      loadMatchDetails();
    }
  }, [id]);

  // When user becomes available and we already have match data, recompute join state (e.g. after auth load)
  useEffect(() => {
    if (match && user?.id) {
      setUserJoined(isUserJoined(match, user.id));
    }
  }, [match?._id, user?.id]);

  const loadMatchDetails = async () => {
    if (!id || typeof id !== "string") return;

    try {
      setLoading(true);
      setError("");
      const data = await getMatchDetails(id);
      setMatch(data);

      // Check if user already joined (handles both populated members and raw IDs)
      if (user?.id) {
        setUserJoined(isUserJoined(data, user.id));

        // Check if liked
        setLiked(data.likedBy?.includes(user.id) || false);

        // Load match result if completed
        if (data.matchStatus === "COMPLETED") {
          const result = await getMatchResult(id);
          setMatchResult(result);
        }
      }
    } catch (err: any) {
      const msg = err?.message || "Failed to load match";
      setError(msg);
      showError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async () => {
    if (!id || typeof id !== "string" || !isAuthenticated) return;

    try {
      const result = await likeMatchApi(id);
      setLiked(user ? result.likedBy?.includes(user.id) || false : false);
      setMatch((prev) => prev ? { ...prev, likes: result.likes, likedBy: result.likedBy } : prev);
    } catch (err: any) {
      console.error("Error toggling like:", err);
    }
  };

  const handleJoin = async () => {
    if (!id || typeof id !== "string" || !isAuthenticated) {
      router.push("/login");
      return;
    }

    if (!match || match.matchStatus !== "UPCOMING") {
      setError("This match cannot be joined");
      return;
    }

    if (match.currentPlayers >= match.maxPlayers) {
      setError("Match is full");
      return;
    }

    try {
      setJoining(true);
      await joinMatch(id);
      setUserJoined(true);
      await loadMatchDetails();
      showSuccess("You have successfully joined the match.");
    } catch (err: any) {
      const msg = err?.message || "Error joining match";
      setError(msg);
      showError(msg);
    } finally {
      setJoining(false);
    }
  };

  const handleLeave = async () => {
    if (!id || typeof id !== "string") return;

    if (!confirm("Are you sure you want to leave the match?")) {
      return;
    }

    try {
      await leaveMatch(id);
      setUserJoined(false);
      await loadMatchDetails();
      showSuccess("You have left the match.");
    } catch (err: any) {
      const msg = err?.message || "Error leaving match";
      setError(msg);
      showError(msg);
    }
  };

  const handleSubscribeVacancy = async () => {
    if (!id || typeof id !== "string") return;

    try {
      if (vacancySubscribed && subscriptionId) {
        await unsubscribeFromVacancy(subscriptionId);
        setVacancySubscribed(false);
        setSubscriptionId(null);
      } else {
        const result = await subscribeToVacancy(id);
        setVacancySubscribed(true);
        setSubscriptionId(result.id);
      }
    } catch (err: any) {
      console.error("Error toggling vacancy subscription:", err);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "UPCOMING": return "success";
      case "ONGOING": return "info";
      case "COMPLETED": return "default";
      case "CANCELLED": return "error";
      default: return "default";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "UPCOMING": return "Upcoming";
      case "ONGOING": return "Ongoing";
      case "COMPLETED": return "Completed";
      case "CANCELLED": return "Cancelled";
      default: return status;
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error && !match) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  if (!match) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Alert severity="info">Match not found</Alert>
      </Container>
    );
  }

  if (!match) return null;
  const field = getFieldData(match);
  const organizer = getOrganizer(match);
  const joinedMembers = getJoinedMembers(match);
  const spotsLeft = Math.max(0, match.maxPlayers - match.currentPlayers);
  const fillPercentage = match.maxPlayers > 0 ? (match.currentPlayers / match.maxPlayers) * 100 : 0;
  const isOrganizer = isAuthenticated && user && (
    (organizer && organizer._id === user.id) ||
    (typeof match.organizerId === 'string' && match.organizerId === user.id)
  );
  const effectivelyJoined = userJoined || !!isOrganizer;
  const canJoin = isAuthenticated && match.matchStatus === "UPCOMING" && !effectivelyJoined && spotsLeft > 0;

  return (
    <>
      <Head>
        <title>{match.matchTitle} - KickUp</title>
        <meta name="description" content={`${match.matchTitle} — ${new Date(match.matchDate).toLocaleDateString()} ${match.matchTime}`} />
      </Head>

      <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
        <Container maxWidth="lg">
          {/* Back Button */}
          <Button startIcon={<ArrowBackIcon />} onClick={() => router.push('/')} sx={{ mb: 2, textTransform: "none" }}>
            Home
          </Button>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}

          <Grid container spacing={3}>
            {/* Left Column */}
            <Grid item xs={12} md={8}>
              {/* Match Header */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: "flex", gap: 1, alignItems: "center", mb: 1, flexWrap: "wrap" }}>
                        <Chip
                          label={getStatusLabel(match.matchStatus)}
                          size="small"
                          color={getStatusColor(match.matchStatus) as any}
                          sx={{ fontWeight: 600 }}
                        />
                        <Chip
                          label={match.matchType}
                          size="small"
                          variant="outlined"
                          sx={{ fontWeight: 600 }}
                        />
                        {match.skillLevel && (
                          <Chip
                            icon={<SchoolIcon />}
                            label={getSkillLevelLabel(match.skillLevel)}
                            size="small"
                            sx={{
                              fontWeight: 600,
                              bgcolor: getSkillLevelBgColor(match.skillLevel),
                              color: getSkillLevelColor(match.skillLevel),
                              border: "none",
                              "& .MuiChip-icon": { color: "inherit" },
                            }}
                          />
                        )}
                      </Box>
                      <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                        {match.matchTitle}
                      </Typography>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap", mb: 2 }}>
                        {match.location && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <LocationOnIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {[match.location.address, match.location.city, match.location.district].filter(Boolean).join(", ")}
                            </Typography>
                          </Box>
                        )}
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                          <Typography variant="body2" color="text.secondary">
                            {match.matchDate ? new Date(match.matchDate).toLocaleDateString("en-US", {
                              weekday: "long",
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            }) : "Date not specified"} — {match.matchTime}
                          </Typography>
                        </Box>
                        {match.duration && (
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <AccessTimeIcon sx={{ fontSize: 18, color: "text.secondary" }} />
                            <Typography variant="body2" color="text.secondary">
                              {match.duration} minutes
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                    <Box sx={{ display: "flex", gap: 1 }}>
                      <IconButton onClick={handleLike} color={liked ? "error" : "default"}>
                        {liked ? <FavoriteIcon /> : <FavoriteBorderIcon />}
                      </IconButton>
                      <Typography variant="caption" sx={{ alignSelf: "center" }}>{match.likes}</Typography>
                      <IconButton onClick={() => navigator.share?.({ title: match.matchTitle, url: window.location.href })}>
                        <ShareIcon />
                      </IconButton>
                    </Box>
                  </Box>

                  {/* Participants Progress */}
                  <Box sx={{ mb: 2 }}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 1 }}>
                      <Typography variant="body2" color="text.secondary">
                        Participants: {match.currentPlayers} / {match.maxPlayers}
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600 }}>
                        {spotsLeft} spots left
                      </Typography>
                    </Box>
                    <LinearProgress
                      variant="determinate"
                      value={fillPercentage}
                      sx={{
                        height: 8,
                        borderRadius: 4,
                        bgcolor: "action.hover",
                        "& .MuiLinearProgress-bar": {
                          borderRadius: 4,
                          bgcolor: match.matchStatus === "UPCOMING" ? "success.main" : "warning.main",
                        },
                      }}
                    />
                  </Box>

                  {/* Match Info */}
                  <Grid container spacing={2} sx={{ mb: 2 }}>
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <AttachMoneyIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">
                          {match.matchFee ? `${match.matchFee.toLocaleString()} UZS` : "Free"}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <PeopleIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">{match.maxPlayers} players</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6} sm={4}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <StarIcon sx={{ color: "text.secondary" }} />
                        <Typography variant="body2">{match.views} views</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Action Buttons */}
                  <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                    {isOrganizer && (
                      <Chip
                        label="You organized this match"
                        color="primary"
                        variant="outlined"
                        sx={{ fontWeight: 600, fontSize: 14, px: 1 }}
                      />
                    )}
                    {canJoin && (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={handleJoin}
                        disabled={joining}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #00E377 0%, #00B85C 100%)",
                          boxShadow: "0 4px 15px rgba(0, 227, 119, 0.3)",
                          "&:hover": {
                            background: "linear-gradient(135deg, #00C466 0%, #009E4F 100%)",
                            boxShadow: "0 6px 20px rgba(0, 227, 119, 0.4)",
                          },
                        }}
                      >
                        {joining ? <CircularProgress size={20} color="inherit" /> : "Join Now"}
                      </Button>
                    )}
                    {isAuthenticated && match.matchStatus === "UPCOMING" && !effectivelyJoined && spotsLeft <= 0 && (
                      <Button
                        variant="contained"
                        size="large"
                        disabled
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          borderRadius: "12px",
                          bgcolor: "action.disabledBackground",
                        }}
                      >
                        Match Full
                      </Button>
                    )}
                    {effectivelyJoined && !isOrganizer && (
                      <Button
                        variant="outlined"
                        color="error"
                        size="large"
                        onClick={handleLeave}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          borderRadius: "12px",
                          borderWidth: 2,
                          "&:hover": { borderWidth: 2 }
                        }}
                      >
                        Leave Match
                      </Button>
                    )}
                    {!isAuthenticated && (
                      <Button
                        variant="contained"
                        size="large"
                        onClick={() => router.push("/login")}
                        sx={{
                          flex: 1,
                          minWidth: 200,
                          py: 1.5,
                          fontSize: "1.1rem",
                          fontWeight: 700,
                          borderRadius: "12px",
                          background: "linear-gradient(135deg, #00E377 0%, #00B85C 100%)",
                          boxShadow: "0 4px 15px rgba(0, 227, 119, 0.3)",
                        }}
                      >
                        Login and Join
                      </Button>
                    )}
                  </Box>
                </CardContent>
              </Card>

              {/* Organizer */}
              {organizer && (
                <Card sx={{ mb: 3, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Organizer
                    </Typography>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                        {organizer.memberNick?.charAt(0)?.toUpperCase() || "T"}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {organizer.memberFullName || organizer.memberNick}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          @{organizer.memberNick}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              )}

              {/* Organizer Actions: Check-in Button */}
              {/* Organizer Actions: Check-in Button */}
              {isAuthenticated && user && (
                (organizer && organizer._id === user.id) ||
                (typeof match.organizerId === 'string' && match.organizerId === user.id)
              ) && (
                  <Card sx={{ mb: 3, boxShadow: 2, bgcolor: 'action.hover' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Management
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Check participants
                        </Typography>
                      </Box>
                      <Box sx={{ display: 'flex', gap: 1 }}>
                        <Button
                          variant="outlined"
                          color="primary"
                          onClick={() => router.push(`/match/check-in?id=${match._id}`)}
                        >
                          Check-in
                        </Button>
                        {match.matchStatus !== "COMPLETED" && (
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => setResultOpen(true)}
                          >
                            Submit Results
                          </Button>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                )}

              {/* Field Details */}
              {field && (
                <Card sx={{ mb: 3, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Field Details
                    </Typography>
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="body1" sx={{ fontWeight: 600, mb: 0.5 }}>
                        {field.propertyName}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {field.location.address}, {field.location.city}
                      </Typography>
                    </Box>
                    {field.hourlyRate && (
                      <Box sx={{ mb: 2 }}>
                        <Typography variant="body2" color="text.secondary">Hourly Rate</Typography>
                        <Typography variant="body1" sx={{ fontWeight: 500 }}>
                          {field.hourlyRate.toLocaleString()} UZS/hr
                        </Typography>
                      </Box>
                    )}
                    {field.rating && (
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                        <StarIcon sx={{ color: "warning.main", fontSize: 20 }} />
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {field.rating.average.toFixed(1)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          ({field.rating.count} ratings)
                        </Typography>
                      </Box>
                    )}
                    {field.amenities && field.amenities.length > 0 && (
                      <Box>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          Amenities
                        </Typography>
                        <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap" }}>
                          {field.amenities.map((amenity, index) => (
                            <Chip
                              key={index}
                              label={amenity}
                              size="small"
                              icon={
                                amenity === "Parking" ? <LocalParkingIcon /> :
                                  amenity === "Shower" ? <ShowerIcon /> :
                                    amenity === "Locker" ? <LockIcon /> :
                                      amenity === "Café" ? <RestaurantIcon /> :
                                        undefined
                              }
                            />
                          ))}
                        </Box>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Participants List */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Participants ({match.currentPlayers})
                  </Typography>
                  {joinedMembers.length === 0 ? (
                    <Typography variant="body2" color="text.secondary">
                      No participants yet
                    </Typography>
                  ) : (
                    <List>
                      {joinedMembers.map((member, index) => (
                        <React.Fragment key={member._id}>
                          <ListItem>
                            <ListItemAvatar>
                              <Avatar sx={{ bgcolor: "primary.main" }}>
                                {member.memberNick?.charAt(0)?.toUpperCase() || "U"}
                              </Avatar>
                            </ListItemAvatar>
                            <ListItemText
                              primary={member.memberFullName || member.memberNick}
                              secondary={`@${member.memberNick}`}
                            />
                          </ListItem>
                          {index < joinedMembers.length - 1 && <Divider />}
                        </React.Fragment>
                      ))}
                    </List>
                  )}
                </CardContent>
              </Card>

              {/* Description */}
              {match.matchDescription && (
                <Card sx={{ mb: 3, boxShadow: 2 }}>
                  <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Description
                    </Typography>
                    <Typography variant="body1">{match.matchDescription}</Typography>
                  </CardContent>
                </Card>
              )}

              {/* Reviews */}
              <Card sx={{ mb: 3, boxShadow: 2 }}>
                <CardContent>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      Reviews
                    </Typography>
                    {userJoined && match.matchStatus === "COMPLETED" && (
                      <Button
                        variant="outlined"
                        startIcon={<RateReviewIcon />}
                        onClick={() => setRatingOpen(true)}
                      >
                        Rate Match
                      </Button>
                    )}
                  </Box>
                  <RatingDisplay matchId={match._id} />
                </CardContent>
              </Card>
            </Grid>

            {/* Right Column - Sidebar */}
            <Grid item xs={12} md={4}>
              {/* Price Card */}
              <Card sx={{ mb: 3, boxShadow: 2, position: "sticky", top: 20 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Price
                  </Typography>
                  <Box sx={{ mb: 2 }}>
                    <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                      {match.matchFee ? `${match.matchFee.toLocaleString()} UZS` : "Free"}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      per participant
                    </Typography>
                  </Box>
                  <Divider sx={{ my: 2 }} />
                  {spotsLeft > 0 && spotsLeft <= 3 && (
                    <Alert severity="info" sx={{ mt: 2 }}>
                      Only {spotsLeft} spots left!
                    </Alert>
                  )}
                  {isAuthenticated && (
                    <Button
                      fullWidth
                      variant={vacancySubscribed ? "outlined" : "contained"}
                      startIcon={vacancySubscribed ? <NotificationsActiveIcon /> : <NotificationsIcon />}
                      onClick={handleSubscribeVacancy}
                      sx={{
                        mt: 2,
                        textTransform: "none",
                        ...(vacancySubscribed ? {} : {
                          background: "linear-gradient(135deg, #00E377 0%, #00B85C 100%)",
                          "&:hover": { background: "linear-gradient(135deg, #00C466 0%, #009E4F 100%)" },
                        }),
                      }}
                    >
                      {vacancySubscribed ? "Disable Notification" : "Notify me when spot available"}
                    </Button>
                  )}
                </CardContent>
              </Card>

              {/* Quick Info */}
              <Card sx={{ boxShadow: 2 }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Info
                  </Typography>
                  <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Match Date</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {new Date(match.matchDate).toLocaleDateString("en-US", {
                          weekday: "long",
                          month: "long",
                          day: "numeric",
                        })}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Time</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500 }}>
                        {match.matchTime} {match.duration ? `(${match.duration} min)` : ""}
                      </Typography>
                    </Box>
                    <Box>
                      <Typography variant="body2" color="text.secondary">Available Spots</Typography>
                      <Typography variant="body1" sx={{ fontWeight: 500, color: spotsLeft > 0 ? "success.main" : "error.main" }}>
                        {spotsLeft} spots left
                      </Typography>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box >
      {match && (
        <RatingDialog
          open={ratingOpen}
          onClose={() => setRatingOpen(false)}
          matchId={match._id}
          fieldId={(typeof match.fieldId === 'object' && match.fieldId !== null) ? match.fieldId._id : (match.fieldId || "")}
          fieldName={match.matchTitle}
          onSuccess={() => {
            // Optional: Reload ratings inside RatingDisplay (it fetches on mount/update)
            // But since RatingDisplay has its own state, we might need to trigger a reload.
            // For now, simple close is fine, user can refresh.
          }}
        />
      )}
      {match && isAuthenticated && effectivelyJoined && (
        <Chat chatId={id as string} chatType="MATCH" title={match.matchTitle} />
      )}
      {match && (
        <PostMatchForm
          open={resultOpen}
          onClose={() => setResultOpen(false)}
          matchId={match._id}
          players={getJoinedMembers(match)}
          onSuccess={() => {
            loadMatchDetails();
            setResultOpen(false);
          }}
        />
      )}
    </>
  );
}
