import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    Chip,
    Avatar,
    CircularProgress,
    Grid,
    Paper,
    Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import { getLeagueMatch, LeagueMatch } from "@/lib/leagueApi";
import styles from "@/styles/team.module.scss";

export default function LeagueMatchPage() {
    const router = useRouter();
    const { id } = router.query;

    const [loading, setLoading] = useState(true);
    const [match, setMatch] = useState<LeagueMatch | null>(null);

    useEffect(() => {
        if (id) {
            loadMatch(id as string);
        }
    }, [id]);

    const loadMatch = async (matchId: string) => {
        try {
            const data = await getLeagueMatch(matchId);
            setMatch(data);
        } catch (error) {
            console.error("Error loading match:", error);
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

    if (!match) {
        return (
            <Container maxWidth="lg" sx={{ py: 4 }}>
                <Typography variant="h5" align="center">
                    Match not found
                </Typography>
                <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
                    <Button component={Link} href="/team/league" variant="outlined">
                        Back to League
                    </Button>
                </Box>
            </Container>
        );
    }

    const homeTeam = match.teams.find(t => t.id === 'home') || match.teams[0];
    const awayTeam = match.teams.find(t => t.id === 'away') || match.teams[1];

    return (
        <>
            <Head>
                <title>Match Details - {match.teams.map(t => t.name).join(" vs ")}</title>
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

                    {/* Match Header / Scoreboard */}
                    <Paper
                        elevation={0}
                        sx={{
                            p: 4,
                            mb: 4,
                            borderRadius: 3,
                            background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
                            textAlign: "center"
                        }}
                    >
                        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 1, mb: 2 }}>
                            <Chip label={match.status.toUpperCase()} color={match.status === 'live' ? 'error' : 'default'} />
                            <Typography variant="body2" color="text.secondary">
                                {match.date} • {match.time}
                            </Typography>
                        </Box>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", gap: { xs: 2, md: 8 } }}>
                            {/* Home Team */}
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
                                <Avatar
                                    src={homeTeam?.logo}
                                    sx={{ width: 80, height: 80, mb: 1, border: "2px solid white", boxShadow: 2 }}
                                >
                                    {homeTeam?.name?.[0]}
                                </Avatar>
                                <Typography variant="h6" fontWeight={700} align="center">
                                    {homeTeam?.name || "TBD"}
                                </Typography>
                            </Box>

                            {/* Score */}
                            <Box sx={{ mx: 2 }}>
                                <Typography variant="h2" fontWeight={800} color="primary.main">
                                    {homeTeam?.score ?? "-"} : {awayTeam?.score ?? "-"}
                                </Typography>
                            </Box>

                            {/* Away Team */}
                            <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", width: 120 }}>
                                <Avatar
                                    src={awayTeam?.logo}
                                    sx={{ width: 80, height: 80, mb: 1, border: "2px solid white", boxShadow: 2 }}
                                >
                                    {awayTeam?.name?.[0]}
                                </Avatar>
                                <Typography variant="h6" fontWeight={700} align="center">
                                    {awayTeam?.name || "TBD"}
                                </Typography>
                            </Box>
                        </Box>
                    </Paper>

                    <Grid container spacing={3}>
                        <Grid item xs={12} md={8}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        Match Info
                                    </Typography>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                        <CalendarTodayIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Date & Time</Typography>
                                            <Typography variant="body1">{match.date} at {match.time}</Typography>
                                        </Box>
                                    </Box>
                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                        <LocationOnIcon color="action" />
                                        <Box>
                                            <Typography variant="body2" color="text.secondary">Location</Typography>
                                            <Typography variant="body1">{match.field}</Typography>
                                        </Box>
                                    </Box>
                                    <Divider sx={{ my: 2 }} />
                                    <Typography variant="body2" color="text.secondary">
                                        Format: {match.format} • Level: {match.level} • Gender: {match.gender}
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%' }}>
                                <CardContent>
                                    <Typography variant="h6" gutterBottom fontWeight={600}>
                                        Teams
                                    </Typography>
                                    {match.teams.length > 0 ? (
                                        match.teams.map((team, idx) => (
                                            <Box key={idx} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
                                                <Avatar src={team.logo} />
                                                <Typography variant="body1" fontWeight={500}>
                                                    {team.name}
                                                </Typography>
                                            </Box>
                                        ))
                                    ) : (
                                        <Typography variant="body2" color="text.secondary">
                                            Teams not yet finalized.
                                        </Typography>
                                    )}
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
