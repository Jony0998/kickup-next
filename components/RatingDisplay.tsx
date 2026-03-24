import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Rating,
  Card,
  CardContent,
  Avatar,
  Divider,
  LinearProgress,
  Chip,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { getRatings, Rating as RatingType, RatingStats } from "@/lib/ratingApi";

interface RatingDisplayProps {
  matchId?: string;
  fieldId?: string;
  showStats?: boolean;
}

export default function RatingDisplay({ matchId, fieldId, showStats = true }: RatingDisplayProps) {
  const [ratings, setRatings] = useState<RatingType[]>([]);
  const [stats, setStats] = useState<RatingStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadRatings();
  }, [matchId, fieldId]);

  const loadRatings = async () => {
    try {
      setLoading(true);
      const data = await getRatings(matchId, fieldId);
      setRatings(data.ratings);
      setStats(data.stats);
    } catch (error) {
      console.error("Error loading ratings:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Typography variant="body2">Loading ratings...</Typography>;
  }

  if (!stats || stats.total === 0) {
    return (
      <Box>
        <Typography variant="body2" color="text.secondary">
          No ratings yet
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      {showStats && stats && (
        <Card sx={{ mb: 2, boxShadow: 2 }}>
          <CardContent>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box>
                <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                  {stats.average.toFixed(1)}
                </Typography>
                <Rating value={stats.average} readOnly precision={0.1} size="small" />
                <Typography variant="body2" color="text.secondary">
                  {stats.total} {stats.total === 1 ? "review" : "reviews"}
                </Typography>
              </Box>
              <Box sx={{ flex: 1 }}>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = stats.distribution[star as keyof typeof stats.distribution];
                  const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;
                  return (
                    <Box key={star} sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="caption" sx={{ minWidth: 30 }}>
                        {star} <StarIcon sx={{ fontSize: 12, verticalAlign: "middle" }} />
                      </Typography>
                      <LinearProgress
                        variant="determinate"
                        value={percentage}
                        sx={{
                          flex: 1,
                          height: 8,
                          borderRadius: 4,
                          bgcolor: "action.hover",
                          "& .MuiLinearProgress-bar": {
                            borderRadius: 4,
                            bgcolor: star >= 4 ? "success.main" : star >= 3 ? "warning.main" : "error.main",
                          },
                        }}
                      />
                      <Typography variant="caption" color="text.secondary" sx={{ minWidth: 30, textAlign: "right" }}>
                        {count}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            </Box>
          </CardContent>
        </Card>
      )}

      {ratings.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Reviews ({ratings.length})
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {ratings.map((rating, index) => (
              <React.Fragment key={rating.id}>
                <Card sx={{ boxShadow: 1 }}>
                  <CardContent>
                    <Box sx={{ display: "flex", gap: 2 }}>
                      <Avatar sx={{ bgcolor: "primary.main" }}>
                        {rating.userName.charAt(0).toUpperCase()}
                      </Avatar>
                      <Box sx={{ flex: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", mb: 1 }}>
                          <Box>
                            <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                              {rating.userName}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {new Date(rating.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </Typography>
                          </Box>
                          <Rating value={rating.rating} readOnly size="small" />
                        </Box>
                        {rating.review && (
                          <Typography variant="body2" sx={{ mt: 1 }}>
                            {rating.review}
                          </Typography>
                        )}
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
                {index < ratings.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </Box>
        </Box>
      )}
    </Box>
  );
}

