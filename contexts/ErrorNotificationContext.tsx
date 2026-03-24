"use client";

import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { Snackbar, Alert, AlertColor } from "@mui/material";

type Notification = {
  message: string;
  severity?: AlertColor;
};

type ErrorNotificationContextType = {
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
  showWarning: (message: string) => void;
  showInfo: (message: string) => void;
  getFriendlyMessage: (message: string) => string;
};

/** Map backend/API messages to short, user-friendly English text */
function normalizeMessage(raw: string): string {
  const lower = raw.toLowerCase();
  const map: Record<string, string> = {
    "already joined this match": "You have already joined this match.",
    "already joined": "You have already joined.",
    "match is full": "This match is full. Try another match.",
    "you are not part of this match": "You are not part of this match.",
    "you do not have access to this match chat": "Only participants can access this match chat.",
    "team name already exists": "This team name already exists.",
    "not authenticated": "Please log in.",
    "invalid or expired token": "Session expired. Please log in again.",
    "validation failed": "Please check your input.",
    "failed to connect": "Could not connect. Please try again later.",
    "network": "Please check your internet connection.",
    "something went wrong": "Something went wrong. Please try again later.",
    "bad request exception": "Invalid request. Please check your message and try again.",
    "already used member nick or phone": "This name or phone number is already registered. Try logging in or use a different one.",
    "used_member_nick_or_phone": "This name or phone number is already registered. Try logging in or use a different one.",
    "phone and nick are required": "Please enter your name and phone number.",
    "password is required": "Please enter a password.",
    "invalid credentials": "Wrong phone/nickname or password. Please try again.",
    "invalid phone or password": "Wrong phone/nickname or password. Please try again.",
    "user not found": "No account found with this phone or nickname.",
    "member not found": "No account found with this phone or nickname.",
    "unauthorized": "Wrong phone/nickname or password. Please try again.",
    "wrong password": "Wrong password. Please try again.",
    "telegram login error": "Telegram sign-in failed. Please try again.",
  };
  for (const [key, friendly] of Object.entries(map)) {
    if (lower.includes(key)) return friendly;
  }
  return raw.length > 120 ? raw.slice(0, 117) + "…" : raw;
}

const ErrorNotificationContext = createContext<ErrorNotificationContextType | undefined>(undefined);

export function ErrorNotificationProvider({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState<Notification>({ message: "", severity: "error" });

  const show = useCallback((message: string, severity: AlertColor = "error") => {
    const text = severity === "error" || severity === "warning" ? normalizeMessage(message) : message;
    setNotification({ message: text, severity });
    setOpen(true);
  }, []);

  const showError = useCallback((message: string) => show(message, "error"), [show]);
  const showSuccess = useCallback((message: string) => show(message, "success"), [show]);
  const showWarning = useCallback((message: string) => show(message, "warning"), [show]);
  const showInfo = useCallback((message: string) => show(message, "info"), [show]);
  const getFriendlyMessage = useCallback((message: string) => normalizeMessage(message || ""), []);

  const handleClose = useCallback((_?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") return;
    setOpen(false);
  }, []);

  useEffect(() => {
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      event.preventDefault();
      const raw =
        event.reason?.message ||
        event.reason?.error?.message ||
        (typeof event.reason === "string" ? event.reason : "An unexpected error occurred.");
      showError(raw);
    };

    window.addEventListener("unhandledrejection", handleUnhandledRejection);
    return () => window.removeEventListener("unhandledrejection", handleUnhandledRejection);
  }, [showError]);

  return (
    <ErrorNotificationContext.Provider value={{ showError, showSuccess, showWarning, showInfo, getFriendlyMessage }}>
      {children}
      <Snackbar
        open={open}
        autoHideDuration={notification.severity === "error" ? 5000 : 4000}
        onClose={handleClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        sx={{
          bottom: { xs: 80, sm: 24 },
          left: { xs: 16, sm: "50%" },
          right: { xs: 16, sm: "auto" },
          transform: { sm: "translateX(-50%)" },
          maxWidth: { xs: "100%", sm: 380 },
        }}
      >
        <Alert
          onClose={handleClose}
          severity={notification.severity}
          variant="filled"
          sx={{
            width: "100%",
            borderRadius: 2,
            boxShadow: 2,
            "& .MuiAlert-message": { fontWeight: 500 },
          }}
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </ErrorNotificationContext.Provider>
  );
}

export function useErrorNotification() {
  const ctx = useContext(ErrorNotificationContext);
  if (ctx === undefined) {
    throw new Error("useErrorNotification must be used within ErrorNotificationProvider");
  }
  return ctx;
}
