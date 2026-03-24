"use client";

import {
  Drawer,
  Typography,
  Box,
  IconButton,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Button,
  useTheme,
  useMediaQuery,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";

const SUPPORT_EMAIL = "contact@kickup.com";

const FAQ_ITEMS = [
  {
    question: "How do I join a match?",
    answer:
      "Open a match from the home or Stadium page, then tap 'Join'. You must be logged in. Once joined, you can use the match chat and see details.",
  },
  {
    question: "How do I create or manage a team?",
    answer:
      "Go to Team from the menu, then 'Create Team' to add a new team. You can edit your team profile, invite members, and use the team chat from the team page.",
  },
  {
    question: "How do I reserve a field (stadium)?",
    answer:
      "Go to Stadium, pick a venue and field, choose a date and time slot, then complete the reservation. You can also join agent-created matches listed there.",
  },
  {
    question: "How do I create a match as an agent?",
    answer:
      "Log in, go to Match, then 'Create Match'. Fill in venue, date, time, level, and optional photos. The match will appear on the home and Stadium pages.",
  },
  {
    question: "Who can I contact for help?",
    answer:
      "Use the form below to send us an email, or write directly to " + SUPPORT_EMAIL + ". We usually reply within 1–2 business days.",
  },
];

interface SupportPanelProps {
  open: boolean;
  onClose: () => void;
}

export default function SupportPanel({ open, onClose }: SupportPanelProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const { user } = useAuth();
  const { showSuccess, showError } = useErrorNotification();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");

  const handleContactSubmit = () => {
    const contact = user?.memberPhone || user?.memberNick || "";
    const msg = (message || "").trim() || "(No message)";
    const fullBody = contact ? `Reply-to (account): ${contact}\n\n${msg}` : msg;
    const subj = encodeURIComponent((subject || "KickUp support request").trim());
    const body = encodeURIComponent(fullBody);
    const mailto = `mailto:${SUPPORT_EMAIL}?subject=${subj}&body=${body}`;
    try {
      window.location.href = mailto;
      showSuccess("Your email client will open. Send the email to contact us.");
      setSubject("");
      setMessage("");
      onClose();
    } catch {
      showError("Could not open email. Please write to " + SUPPORT_EMAIL);
    }
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: isMobile ? "100%" : 400,
          maxWidth: "100%",
          borderTopLeftRadius: 16,
          borderBottomLeftRadius: 16,
          boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
        },
      }}
    >
      <Box sx={{ p: 2, pb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Help & Support
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close">
            <CloseIcon />
          </IconButton>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          Find answers below or send us a message.
        </Typography>

        {/* FAQ */}
        <Typography variant="subtitle2" fontWeight={700} sx={{ mb: 1 }}>
          Frequently asked questions
        </Typography>
        {FAQ_ITEMS.map((item, idx) => (
          <Accordion
            key={idx}
            disableGutters
            elevation={0}
            sx={{
              "&:before": { display: "none" },
              borderBottom: "1px solid",
              borderColor: "divider",
              "&:last-of-type": { borderBottom: "none" },
            }}
          >
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography variant="body2" fontWeight={600}>
                {item.question}
              </Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography variant="body2" color="text.secondary">
                {item.answer}
              </Typography>
            </AccordionDetails>
          </Accordion>
        ))}

        {/* Contact form */}
        <Typography variant="subtitle2" fontWeight={700} sx={{ mt: 3, mb: 1 }}>
          Contact us
        </Typography>
        <TextField
          fullWidth
          size="small"
          label="Subject"
          placeholder="e.g. Booking issue"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          sx={{ mb: 1.5 }}
        />
        <TextField
          fullWidth
          multiline
          rows={4}
          size="small"
          label="Message"
          placeholder="Describe your question or issue..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          sx={{ mb: 2 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={handleContactSubmit}
          sx={{
            bgcolor: "var(--plab-green)",
            color: "var(--plab-black)",
            fontWeight: 700,
            "&:hover": { bgcolor: "#00C466" },
          }}
        >
          Send email
        </Button>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>
          Or write to:{" "}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: "var(--plab-green)" }}>
            {SUPPORT_EMAIL}
          </a>
        </Typography>
      </Box>
    </Drawer>
  );
}
