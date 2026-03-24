import { useEffect } from "react";
import { useRouter } from "next/router";
import { Box, CircularProgress, Typography } from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";

interface AdminRouteProps {
  children: React.ReactNode;
}

/**
 * AdminRoute - Protects pages for admin users only
 * Agar user admin bo'lmasa, avtomatik ravishda home page'ga redirect qiladi
 */
export default function AdminRoute({ children }: AdminRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (!isAuthenticated) {
        // Agar login qilmagan bo'lsa, login page'ga redirect
        router.push("/login");
      } else if (!isAdmin) {
        // Agar admin bo'lmasa, home page'ga redirect
        router.push("/");
      }
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          gap: 2,
        }}
      >
        <CircularProgress />
        <Typography variant="body2" color="text.secondary">
          Checking admin access...
        </Typography>
      </Box>
    );
  }

  // Agar admin bo'lmasa yoki login qilmagan bo'lsa, hech narsa ko'rsatma
  if (!isAuthenticated || !isAdmin) {
    return null;
  }

  // Faqat admin bo'lsa, children'ni ko'rsat
  return <>{children}</>;
}

