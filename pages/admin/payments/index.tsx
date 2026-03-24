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
import { getPayments, Payment } from "@/lib/adminApi";
import AdminRoute from "@/components/AdminRoute";

export default function PaymentsPage() {
    const router = useRouter();
    const { user, isAuthenticated, isAdmin, isAgent, loading } = useAuth();
    const [payments, setPayments] = useState<Payment[]>([]);
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
            loadPayments();
        }
    }, [isAuthenticated, isAdmin, isAgent]);

    const loadPayments = async () => {
        try {
            setLoadingData(true);
            setError("");
            const filter = isAgent ? { ownerId: user?.id } : {};
            const data = await getPayments(filter);
            setPayments(data);
        } catch (error: any) {
            console.error("Error loading payments:", error);
            setError(error?.message || "Failed to load payments");
        } finally {
            setLoadingData(false);
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case "COMPLETED":
                return "success";
            case "PENDING":
                return "warning";
            case "FAILED":
            case "CANCELLED":
                return "error";
            case "REFUNDED":
                return "info";
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
            <AdminLayout title="Payment History">
                <Head>
                    <title>Payment History - Admin - KickUp</title>
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
                            Payment History
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
                            {error}
                        </Alert>
                    )}

                    <Card sx={{ boxShadow: 2 }}>
                        <CardContent>
                            {payments.length === 0 ? (
                                <Box sx={{ textAlign: "center", py: 4 }}>
                                    <Typography variant="body2" color="text.secondary">
                                        No payments found
                                    </Typography>
                                </Box>
                            ) : (
                                <TableContainer>
                                    <Table>
                                        <TableHead>
                                            <TableRow>
                                                <TableCell sx={{ fontWeight: 600 }}>User</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Amount</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Type</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Method</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Date</TableCell>
                                                <TableCell sx={{ fontWeight: 600 }}>Status</TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {payments.map((payment) => (
                                                <TableRow key={payment.id} hover>
                                                    <TableCell>{payment.userName}</TableCell>
                                                    <TableCell>₩{payment.amount.toLocaleString()}</TableCell>
                                                    <TableCell>
                                                        <Chip label={payment.relatedType} size="small" variant="outlined" />
                                                    </TableCell>
                                                    <TableCell>{payment.method}</TableCell>
                                                    <TableCell>
                                                        {new Date(payment.date).toLocaleDateString()}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Chip
                                                            label={payment.status}
                                                            size="small"
                                                            color={getStatusColor(payment.status) as any}
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
