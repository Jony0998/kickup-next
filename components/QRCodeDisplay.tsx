import React, { useEffect, useState } from "react";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  CircularProgress,
  Alert,
  IconButton,
} from "@mui/material";
import QrCodeIcon from "@mui/icons-material/QrCode";
import CloseIcon from "@mui/icons-material/Close";
import DownloadIcon from "@mui/icons-material/Download";
import { generateQRCode, QRCode } from "@/lib/qrCodeApi";

interface QRCodeDisplayProps {
  matchId: string;
  fieldName: string;
  onCheckIn?: () => void;
}

export default function QRCodeDisplay({ matchId, fieldName, onCheckIn }: QRCodeDisplayProps) {
  const [open, setOpen] = useState(false);
  const [qrCode, setQrCode] = useState<QRCode | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadQRCode = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await generateQRCode(matchId);
      setQrCode(data);
    } catch (err: any) {
      console.error("Error generating QR code:", err);
      setError(err?.message || "Failed to generate QR code");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (open && !qrCode) {
      loadQRCode();
    }
  }, [open, matchId]);

  const handleDownload = () => {
    if (!qrCode) return;
    const link = document.createElement("a");
    link.href = qrCode.url;
    link.download = `qr-code-${matchId}.png`;
    link.click();
  };

  return (
    <>
      <Button
        variant="outlined"
        startIcon={<QrCodeIcon />}
        onClick={() => setOpen(true)}
        sx={{ textTransform: "none" }}
      >
        Show QR Code
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              QR Code for Check-in
            </Typography>
            <IconButton onClick={() => setOpen(false)} size="small">
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ textAlign: "center", py: 2 }}>
            {loading ? (
              <Box sx={{ py: 4 }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                  Generating QR code...
                </Typography>
              </Box>
            ) : error ? (
              <Alert severity="error">{error}</Alert>
            ) : qrCode ? (
              <>
                <Typography variant="body1" sx={{ mb: 2, fontWeight: 600 }}>
                  {fieldName}
                </Typography>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    mb: 2,
                    p: 2,
                    bgcolor: "background.paper",
                    borderRadius: 2,
                    border: "2px solid",
                    borderColor: "divider",
                  }}
                >
                  <img
                    src={qrCode.url}
                    alt="QR Code"
                    style={{ width: "100%", maxWidth: 300, height: "auto" }}
                  />
                </Box>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  Show this QR code at the field for check-in
                </Typography>
                {qrCode.expiresAt && (
                  <Typography variant="caption" color="text.secondary">
                    Expires: {new Date(qrCode.expiresAt).toLocaleString()}
                  </Typography>
                )}
              </>
            ) : null}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)} sx={{ textTransform: "none" }}>
            Close
          </Button>
          {qrCode && (
            <Button
              startIcon={<DownloadIcon />}
              onClick={handleDownload}
              variant="outlined"
              sx={{ textTransform: "none" }}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </>
  );
}

