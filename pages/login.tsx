import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Card,
  CardContent,
  IconButton,
  InputAdornment,
  Divider,
  Alert,
  CircularProgress
} from "@mui/material";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import PersonIcon from "@mui/icons-material/Person";
import TelegramIcon from "@mui/icons-material/Telegram";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

const loginSchema = z.object({
  identifier: z.string().min(1, "Enter phone or nickname"),
  password: z.string().min(1, "Password is required"),
});

type LoginSchema = z.infer<typeof loginSchema>;

export default function LoginPage() {
  const router = useRouter();
  const { theme } = useTheme();
  const { login, loginWithTelegram } = useAuth();
  const { showError, getFriendlyMessage } = useErrorNotification();
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const isDark = theme === "dark";

  const { control, handleSubmit, formState: { errors } } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    setError("");
    setIsLoading(true);
    try {
      const result = await login(data.identifier, data.password);
      if (result.success) {
        router.push("/");
      } else {
        const raw = result.message || "Invalid credentials";
        const friendly = getFriendlyMessage(raw);
        setError(friendly);
        showError(raw);
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

  // Telegram Widget Loader
  useEffect(() => {
    if (document.getElementById('telegram-login-script')) return;

    const script = document.createElement('script');
    script.id = 'telegram-login-script';
    script.src = "https://telegram.org/js/telegram-widget.js?22";
    script.setAttribute('data-telegram-login', process.env.NEXT_PUBLIC_TELEGRAM_BOT_USERNAME || 'kickup_bot');
    script.setAttribute('data-size', 'large');
    script.setAttribute('data-radius', '10');
    script.setAttribute('data-userpic', 'false');
    script.setAttribute('data-request-access', 'write');
    script.async = true;

    (window as any).onTelegramAuth = async (user: any) => {
      try {
        await loginWithTelegram(user);
        router.push("/");
      } catch (err: any) {
        const raw = err?.message || "Telegram login error";
        const friendly = getFriendlyMessage(raw);
        setError(friendly);
        showError(raw);
      }
    };
    script.setAttribute('data-onauth', 'onTelegramAuth(user)');

    const container = document.getElementById('telegram-login-container');
    if (container) {
      container.appendChild(script);
    }
  }, [loginWithTelegram, router]);


  return (
    <>
      <Head>
        <title>Login - KickUp</title>
      </Head>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: isDark ? "#111827" : "#F3F4F6",
          padding: 2,
        }}
      >
        <Container maxWidth="sm">
          <Card
            elevation={0}
            sx={{
              borderRadius: 3,
              bgcolor: isDark ? "#1F2937" : "#FFFFFF",
              border: `1px solid ${isDark ? "rgba(255,255,255,0.1)" : "#E5E7EB"}`,
            }}
          >
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ textAlign: "center", mb: 4 }}>
                <Typography variant="h4" fontWeight="800" gutterBottom color={isDark ? "white" : "text.primary"}>
                  Welcome
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Login to manage your games
                </Typography>
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <form onSubmit={handleSubmit(onSubmit)}>
                <Box sx={{ mb: 3 }}>
                  <Controller
                    name="identifier"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        label="Phone or nickname"
                        placeholder="Phone number"
                        error={!!errors.identifier}
                        helperText={errors.identifier?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <PersonIcon color="action" />
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E8EB' },
                            '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    )}
                  />
                </Box>

                <Box sx={{ mb: 4 }}>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <TextField
                        {...field}
                        fullWidth
                        type={showPassword ? "text" : "password"}
                        label="Password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        InputProps={{
                          startAdornment: (
                            <InputAdornment position="start">
                              <LockIcon color="action" />
                            </InputAdornment>
                          ),
                          endAdornment: (
                            <InputAdornment position="end">
                              <IconButton
                                onClick={() => setShowPassword(!showPassword)}
                                edge="end"
                              >
                                {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                              </IconButton>
                            </InputAdornment>
                          ),
                        }}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                            bgcolor: isDark ? 'rgba(255,255,255,0.05)' : '#F9FAFB',
                            '& fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.1)' : '#E5E8EB' },
                            '&:hover fieldset': { borderColor: isDark ? 'rgba(255,255,255,0.2)' : '#D1D5DB' },
                            '&.Mui-focused fieldset': { borderColor: 'primary.main' }
                          }
                        }}
                      />
                    )}
                  />
                </Box>

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
                    boxShadow: "none",
                    bgcolor: "primary.main",
                    color: "primary.contrastText",
                    "&:hover": {
                      bgcolor: "primary.dark",
                      boxShadow: "none",
                    },
                  }}
                >
                  {isLoading ? <CircularProgress size={24} /> : "Login"}
                </Button>
              </form>

              <Divider sx={{ my: 3, color: 'text.secondary', fontSize: '0.875rem' }}>OR</Divider>

              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {/* Telegram Widget Container */}
                <Box
                  id="telegram-login-container"
                  sx={{
                    display: 'flex',
                    justifyContent: 'center',
                    mt: 1
                  }}
                />
              </Box>

              <Box sx={{ mt: 4, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">
                  Don't have an account?{" "}
                  <Link href="/register" style={{ color: "#00E377", fontWeight: 600, textDecoration: "none" }}>
                    Register
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
