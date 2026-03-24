import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import React from "react";
import AdminLayout from "@/components/AdminLayout";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Alert,
} from "@mui/material";
import { useAuth } from "@/contexts/AuthContext";
import { getBookings, Booking } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";

export default function BookingsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, isAgent, loading } = useAuth();
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loadingData, setLoadingData] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            router.push("/login");
        } else if (!loading && !isAdmin && !isAgent) {
            router.push("/");
        }
    }, [isAuthenticated, isAdmin, isAgent, loading, router]);

    useEffect(() => {
        if (isAuthenticated && (isAdmin || isAgent)) {
            loadBookings();
        }
    }, [isAuthenticated, isAdmin, isAgent]);

    const loadBookings = async () => {
        try {
            setLoadingData(true);
            setError("");
            const filter = isAgent ? { ownerId: user?.id } : {};
            const data = await getBookings(filter);
            setBookings(data);
        } catch (error: any) {
            console.error("Error loading bookings:", error);
            setError(error?.message || "Failed to load bookings");
        } finally {
            setLoadingData(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "CONFIRMED":
                return "success";
            case "PENDING":
                return "warning";
            case "CANCELLED":
                return "error";
            case "COMPLETED":
                return "default";
            default:
                return "default";
        }
    };

    if (loading || loadingData) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <AdminRoute>
            <AdminLayout title="Manage Bookings">
                <Head>
                    <title>Manage Bookings - Admin - KickUp</title>
                </Head>

                <Container maxWidth="lg">
                    <Box sx={{ mb: 4 }}>
                        <Typography
                            variant="h4"
                            component="h1"
                            sx={{
                                fontWeight: 700,
                                background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
                                WebkitBackgroundClip: "text",
                                WebkitTextFillColor: "transparent",
                            }}
                        >
                            Manage Bookings
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                            {error}
                        </Alert>
                    )}

                    <Card sx={{ boxShadow: 2 }}>
                        <CardContent>
                            {bookings.length === 0 ? (
                                <Box sx={{ textAlign: "center", py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No bookings found
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>Field</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Booker</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Date & Time</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {bookings.map((booking) => (
                                                <TableRow key={booking.id} hover>
                                                    <TableCell>{booking.field}</TableCell>
                                                    <TableCell>{booking.booker}</TableCell>
                                                    <TableCell>
                                                        {booking.date} at {booking.time}
                                                    </TableCell>
                                                    <TableCell>₩{booking.amount.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={booking.status}
                                                            size="small"
                                                            color={getStatusColor(booking.status) as any}
                                                            sx={{ fontWeight: 600 }}
                                                        />
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            )}
                        </CardContent>
                    </Card>
                </Container>
            </AdminLayout>
        </AdminRoute>
    );
}
