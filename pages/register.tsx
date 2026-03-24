import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  CircularProgress,
  Divider,
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import LockIcon from "@mui/icons-material/Lock";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import StadiumIcon from "@mui/icons-material/Stadium";

import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import { graphqlRequest } from "@/lib/graphqlClient";

import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().regex(/^\+?[0-9]{9,15}$/, "Enter a valid phone number (9–15 digits)"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    memberType: z.enum(["USER", "AGENT"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterSchema = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const { register: doRegister, loginWithTelegram } = useAuth();
  const { theme } = useTheme();
  const { showError, getFriendlyMessage } = useErrorNotification();
  const isDark = theme === "dark";

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showAdminSignup, setShowAdminSignup] = useState(false);
  const [adminSecretKey, setAdminSecretKey] = useState("");
  const [adminExists, setAdminExists] = useState<boolean | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await graphqlRequest<{ adminExists: boolean }>(
          "query { adminExists }",
          {}
        );
        if (!cancelled) setAdminExists(!!data?.adminExists);
      } catch {
        if (!cancelled) setAdminExists(true);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      phone: "",
      password: "",
      confirmPassword: "",
      memberType: "USER",
    },
  });

  const memberType = watch("memberType");

  const onSubmit = async (data: RegisterSchema) => {
    setError("");
    setIsLoading(true);
    try {
      const nameTrim = data.name.trim();
      const secret = showAdminSignup ? adminSecretKey.trim() : undefined;
      const success = await doRegister(
        data.phone,
        data.password,
        nameTrim,
        data.memberType,
        nameTrim,
        secret || undefined
      );
      if (success) {
        router.push("/");
      } else {
        const msg = "Registration failed. Please try again.";
        setError(msg);
        showError(msg);
      }
    } catch (err: any) {
      const raw = err?.message || "Something went wrong. Please try again.";
      const friendly = getFriendlyMessage(raw);
      setError(friendly);
      showError(raw);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (document.getElementById("telegram-register-script")) return;
    const script = document.createElement("script");
    script.id = "telegram-register-script";
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute("data-telegram-login", process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || "kickup_bot");
    script.setAttribute("data-size", "large");
    script.setAttribute("data-radius", "10");
    script.setAttribute("data-userpic", "false");
    script.setAttribute("data-request-access", "write");
    script.async = true;
    (window as any).onTelegramAuthRegister = async (user: any) => {
      try {
        await loginWithTelegram(user);
        router.push("/");
      } catch (err: any) {
        setError(err.message || "Telegram login error");
      }
    };
    script.setAttribute("data-onauth", "onTelegramAuthRegister(user)");
    const container = document.getElementById("telegram-register-container");
    if (container) container.appendChild(script);
  }, [loginWithTelegram, router]);

  const bgGradient = isDark
    ? "linear-gradient(165deg, #1a1612 0%, #2d2620 50%, #1f1b17 100%)"
    : "linear-gradient(165deg, #F8F5F0 0%, #EDE8E0 40%, #F5F0E8 100%)";
  const cardBg = isDark ? "rgba(45, 38, 32, 0.85)" : "rgba(255, 252, 248, 0.95)";
  const accent = "#2E7D5E";
  const accentLight = isDark ? "rgba(46, 125, 94, 0.25)" : "rgba(46, 125, 94, 0.12)";

  return (
    <>
      <Head>
        <title>Sign up - KickUp</title>
        <meta name="description" content="Create your KickUp account as a player or stadium owner." />
      </Head>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: bgGradient,
          padding: 2,
          py: 4,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={0}
            sx={{
              borderRadius: 4,
              background: cardBg,
              border: isDark ? "1px solid rgba(255,255,255,0.06)" : "1px solid rgba(139, 119, 101, 0.15)",
              boxShadow: isDark
                ? "0 24px 48px rgba(0,0,0,0.4)"
                : "0 24px 48px rgba(139, 119, 101, 0.12)",
            }}
          >
            <CardContent sx={{ p: { xs: 3, sm: 4 } }}>
              <Box sx={{ textAlign: "center", mb: 3 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    letterSpacing: "-0.02em",
                    color: isDark ? "#EDE8E0" : "#2d2620",
                    mb: 0.5,
                  }}
                >
                  Sign up
                </Typography>
                <Typography variant="body2" sx={{ color: isDark ? "rgba(237,232,224,0.7)" : "#6B5B4F" }}>
                  Name, phone, password — then choose your role.
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2.5, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="subtitle2"
                    sx={{
                      mb: 1.5,
                      fontWeight: 600,
                      color: isDark ? "rgba(237,232,224,0.9)" : "#4A4038",
                    }}
                  >
                    I am a
                  </Typography>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    <Box
                      onClick={() => setValue("memberType", "USER")}
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 3,
                        border: "2px solid",
                        borderColor: memberType === "USER" ? accent : isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)",
                        bgcolor: memberType === "USER" ? accentLight : "transparent",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: accent,
                          bgcolor: accentLight,
                        },
                      }}
                    >
                      <SportsSoccerIcon sx={{ fontSize: 28, color: memberType === "USER" ? accent : "inherit", mb: 0.5 }} />
                      <Typography variant="subtitle1" fontWeight={600} color={memberType === "USER" ? accent : "text.secondary"}>
                        Player
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? "rgba(237,232,224,0.6)" : "#6B5B4F" }}>
                        Find and join games
                      </Typography>
                    </Box>
                    <Box
                      onClick={() => setValue("memberType", "AGENT")}
                      sx={{
                        flex: 1,
                        p: 2,
                        borderRadius: 3,
                        border: "2px solid",
                        borderColor: memberType === "AGENT" ? accent : isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)",
                        bgcolor: memberType === "AGENT" ? accentLight : "transparent",
                        cursor: "pointer",
                        textAlign: "center",
                        transition: "all 0.2s ease",
                        "&:hover": {
                          borderColor: accent,
                          bgcolor: accentLight,
                        },
                      }}
                    >
                      <StadiumIcon sx={{ fontSize: 28, color: memberType === "AGENT" ? accent : "inherit", mb: 0.5 }} />
                      <Typography variant="subtitle1" fontWeight={600} color={memberType === "AGENT" ? accent : "text.secondary"}>
                        Stadium owner
                      </Typography>
                      <Typography variant="caption" sx={{ color: isDark ? "rgba(237,232,224,0.6)" : "#6B5B4F" }}>
                        Manage your fields
                      </Typography>
                    </Box>
                  </Box>
                </Box>

                {/* Admin signup — only shown when no admin exists yet; requires secret from .env */}
                {adminExists === false && (
                  <Box sx={{ mb: 2 }}>
                    <Button
                      size="small"
                      onClick={() => setShowAdminSignup(!showAdminSignup)}
                      sx={{
                        textTransform: "none",
                        color: isDark ? "rgba(237,232,224,0.7)" : "#6B5B4F",
                        fontSize: "0.85rem",
                      }}
                    >
                      {showAdminSignup ? "− Hide admin signup" : "+ Register as administrator"}
                    </Button>
                    {showAdminSignup && (
                      <TextField
                        fullWidth
                        size="small"
                        label="Admin secret key"
                        placeholder="Enter the admin secret from server .env"
                        type="password"
                        value={adminSecretKey}
                        onChange={(e) => setAdminSecretKey(e.target.value)}
                        sx={{
                          mt: 1,
                          "& .MuiOutlinedInput-root": {
                            borderRadius: 2,
                            bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(248,245,240,0.8)",
                          },
                        }}
                      />
                    )}
                  </Box>
                )}

                <Controller
                  name="name"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Name"
                      placeholder="Name"
                      error={!!errors.name}
                      helperText={errors.name?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PersonIcon sx={{ color: isDark ? "rgba(237,232,224,0.5)" : "#8B7765" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(248,245,240,0.8)",
                          "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)" },
                          "&:hover fieldset": { borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(139,119,101,0.35)" },
                          "&.Mui-focused fieldset": { borderColor: accent, borderWidth: 1.5 },
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="phone"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      label="Phone number"
                      placeholder="Phone number"
                      error={!!errors.phone}
                      helperText={errors.phone?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <PhoneIcon sx={{ color: isDark ? "rgba(237,232,224,0.5)" : "#8B7765" }} />
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(248,245,240,0.8)",
                          "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)" },
                          "&:hover fieldset": { borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(139,119,101,0.35)" },
                          "&.Mui-focused fieldset": { borderColor: accent, borderWidth: 1.5 },
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="password"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showPassword ? "text" : "password"}
                      label="Password"
                      placeholder="At least 6 characters"
                      error={!!errors.password}
                      helperText={errors.password?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: isDark ? "rgba(237,232,224,0.5)" : "#8B7765" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                              {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 2,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(248,245,240,0.8)",
                          "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)" },
                          "&:hover fieldset": { borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(139,119,101,0.35)" },
                          "&.Mui-focused fieldset": { borderColor: accent, borderWidth: 1.5 },
                        },
                      }}
                    />
                  )}
                />

                <Controller
                  name="confirmPassword"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      {...field}
                      fullWidth
                      type={showConfirmPassword ? "text" : "password"}
                      label="Confirm password"
                      placeholder="Repeat your password"
                      error={!!errors.confirmPassword}
                      helperText={errors.confirmPassword?.message}
                      InputProps={{
                        startAdornment: (
                          <InputAdornment position="start">
                            <LockIcon sx={{ color: isDark ? "rgba(237,232,224,0.5)" : "#8B7765" }} />
                          </InputAdornment>
                        ),
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end" size="small">
                              {showConfirmPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        mb: 3,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          bgcolor: isDark ? "rgba(255,255,255,0.04)" : "rgba(248,245,240,0.8)",
                          "& fieldset": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)" },
                          "&:hover fieldset": { borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(139,119,101,0.35)" },
                          "&.Mui-focused fieldset": { borderColor: accent, borderWidth: 1.5 },
                        },
                      }}
                    />
                  )}
                />

                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  size="large"
                  disabled={isLoading}
                  sx={{
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: "1rem",
                    fontWeight: 600,
                    bgcolor: accent,
                    color: "#fff",
                    boxShadow: "none",
                    "&:hover": {
                      bgcolor: "#246B4E",
                      boxShadow: "0 4px 14px rgba(46, 125, 94, 0.35)",
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Create account"}
                </Button>
              </form>

              <Divider sx={{ my: 3, "&::before, &::after": { borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(139,119,101,0.2)" } }}>
                <Typography component="span" variant="caption" sx={{ color: isDark ? "rgba(237,232,224,0.5)" : "#6B5B4F" }}>
                  Or
                </Typography>
              </Divider>

              <Box id="telegram-register-container" sx={{ display: "flex", justifyContent: "center", mt: 1 }} />

              <Box sx={{ mt: 3, textAlign: "center" }}>
                <Typography variant="body2" sx={{ color: isDark ? "rgba(237,232,224,0.7)" : "#6B5B4F" }}>
                  Already have an account?{" "}
                  <Link href="/login" style={{ color: accent, fontWeight: 600, textDecoration: "none" }}>
                    Log in
                  </Link>
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}
