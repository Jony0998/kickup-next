import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  Rating,
  Alert,
  CircularProgress,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { submitRating, Rating as RatingType } from "@/lib/ratingApi";

interface RatingDialogProps {
  open: boolean;
  onClose: () => void;
  matchId: string;
  fieldId: string;
  fieldName: string;
  onSuccess?: (rating: RatingType) => void;
}

export default function RatingDialog({
  open,
  onClose,
  matchId,
  fieldId,
  fieldName,
  onSuccess,
}: RatingDialogProps) {
  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);
      setError("");
      const result = await submitRating(matchId, fieldId, rating, review || undefined);
      if (onSuccess) {
        onSuccess(result);
      }
      handleClose();
    } catch (err: any) {
      console.error("Error submitting rating:", err);
      setError(err?.message || "Failed to submit rating");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setRating(0);
    setReview("");
    setError("");
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Rate Your Experience</DialogTitle>
      <DialogContent>
        <Box sx={{ pt: 2 }}>
          <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
            {fieldName}
          </Typography>

          <Box sx={{ mb: 3 }}>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
              Overall Rating
            </Typography>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Rating
                value={rating}
                onChange={(_, newValue) => {
                  setRating(newValue || 0);
                  setError("");
                }}
                size="large"
                icon={<StarIcon sx={{ fontSize: 40 }} />}
                emptyIcon={<StarIcon sx={{ fontSize: 40, color: "action.disabled" }} />}
              />
              {rating > 0 && (
                <Typography variant="h6" sx={{ fontWeight: 600, color: "primary.main" }}>
                  {rating}/5
                </Typography>
              )}
            </Box>
          </Box>

          <TextField
            fullWidth
            multiline
            rows={4}
            label="Write a Review (Optional)"
            placeholder="Share your experience..."
            value={review}
            onChange={(e) => setReview(e.target.value)}
            sx={{ mb: 2 }}
          />

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
              {error}
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting} sx={{ textTransform: "none" }}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting || rating === 0}
          sx={{
            textTransform: "none",
            background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          }}
        >
          {submitting ? <CircularProgress size={20} /> : "Submit Rating"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

