import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Paper,
    Divider,
    CircularProgress,
    Grid,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import InfoIcon from "@mui/icons-material/Info";
import { getLeague, League } from "@/lib/leagueApi";
import styles from "@/styles/team.module.scss";

export default function LeagueDetailsPage() {
    const [loading, setLoading] = useState(true);
    const [league, setLeague] = useState<League | null>(null);

    useEffect(() => {
        loadLeague();
    }, []);

    const loadLeague = async () => {
        try {
            const data = await getLeague();
            setLeague(data);
        } catch (error) {
            console.error("Error loading league:", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!league) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" align="center">
                    League not found
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button component={Link} href="/team/league" variant="outlined">
                        Back to League
                    </Button>
                </Box>
            </Container>
        );
    }

    return (
        <>
            <Head>
                <title>{league.title} - Details</title>
            </Head>

            <Box className={styles.teamPage}>
                <Container maxWidth="lg" sx={{ py: 4 }}>
                    {/* Back Button */}
                    <Button
                        component={Link}
                        href="/team/league"
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 2 }}
                    >
                        Back to League
                    </Button>

                    {/* Header */}
                    <Paper elevation={0} sx={{ p: 4, mb: 4, bgcolor: "primary.main", color: "white", borderRadius: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                            <EmojiEventsIcon sx={{ fontSize: 60 }} />
                            <Box>
                                <Typography variant="h3" fontWeight={700}>
                                    {league.title}
                                </Typography>
                                <Typography variant="h6" sx={{ opacity: 0.9 }}>
                                    {league.season}
                                </Typography>
                                <Chip
                                    label={league.status}
                                    color="secondary"
                                    size="small"
                                    sx={{ mt: 1, fontWeight: 600 }}
                                />
                            </Box>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        {/* Info Column */}
                        <Grid item xs={12} md={8}>
                            <Card sx={{ mb: 3 }}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight={600} gutterBottom>
                                        About the League
                                    </Typography>
                                    <Typography variant="body1" paragraph>
                                        {league.description || "No description available."}
                                    </Typography>

                                    <Divider sx={{ my: 3 }} />

                                    <Typography variant="h6" fontWeight={600} gutterBottom>
                                        Dates
                                    </Typography>
                                    <Box sx={{ display: "flex", gap: 4, mb: 2 }}>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">Start Date</Typography>
                                            <Typography variant="body1">
                                                {new Date(league.startDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <Typography variant="subtitle2" color="text.secondary">End Date</Typography>
                                            <Typography variant="body1">
                                                {new Date(league.endDate).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Rules Column */}
                        <Grid item xs={12} md={4}>
                            <Card>
                                <CardContent>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                                        <InfoIcon color="primary" />
                                        <Typography variant="h6" fontWeight={600}>
                                            League Rules
                                        </Typography>
                                    </Box>
                                    <Typography variant="body2" sx={{ whiteSpace: "pre-line" }}>
                                        {league.rules || "Standard Plab rules apply."}
                                    </Typography>
                                </CardContent>
                            </Card>

                            <Card sx={{ mt: 3 }}>
                                <CardContent>
                                    <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                                        Organizer
                                    </Typography>
                                    <Typography variant="body1" fontWeight={600}>
                                        {league.organizer}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
