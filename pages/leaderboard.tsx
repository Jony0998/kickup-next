import Head from "next/head";
import { useEffect, useState } from "react";
import React from "react";
import Layout from "@/components/Layout";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Chip,
    CircularProgress,
    Tab,
    Tabs,
    Paper,
} from "@mui/material";
import { getTopPlayers, TopPlayer } from "@/lib/statsApi";
import { getSkillLevelLabel, getSkillLevelBgColor, getSkillLevelColor } from "@/lib/skillLevels";
import { normalizeImageUrl } from "@/lib/imageUrl";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";

export default function LeaderboardPage() {
    const [players, setPlayers] = useState<TopPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState(0);

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const loadLeaderboard = async () => {
        try {
            setLoading(true);
            const data = await getTopPlayers(20);
            setPlayers(data);
        } catch (error) {
            console.error("Failed to load leaderboard:", error);
        } finally {
            setLoading(false);
        }
    };

    const getRankColor = (index: number) => {
        switch (index) {
            case 0: return "#FFD700"; // Gold
            case 1: return "#C0C0C0"; // Silver
            case 2: return "#CD7F32"; // Bronze
            default: return "transparent";
        }
    };

    return (
        <Layout>
            <Head>
                <title>Leaderboard - KickUp</title>
            </Head>

            <Box
                sx={{
                    py: 8,
                    background: "linear-gradient(135deg, #1a2a6c 0%, #b21f1f 50%, #fdbb2d 100%)",
                    color: "white",
                    mb: -4,
                }}
            >
                <Container maxWidth="lg">
                    <Box sx={{ textAlign: "center", mb: 4 }}>
                        <EmojiEventsIcon sx={{ fontSize: 60, mb: 2, color: "#FFD700" }} />
                        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 800 }}>
                            KickUp Leaderboard
                        </Typography>
                        <Typography variant="h6" sx={{ opacity: 0.8 }}>
                            Check out the best players in the community
                        </Typography>
                    </Box>
                </Container>
            </Box>

            <Container maxWidth="lg" sx={{ pb: 8 }}>
                <Paper elevation={4} sx={{ borderRadius: 4, overflow: "hidden", mt: -4 }}>
                    <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                        <Tabs
                            value={tab}
                            onChange={(_, v) => setTab(v)}
                            centered
                            sx={{
                                "& .MuiTab-root": { py: 3, fontWeight: 600, fontSize: "1.1rem" }
                            }}
                        >
                            <Tab label="Global Ranking" icon={<TrendingUpIcon />} iconPosition="start" />
                            <Tab label="Top Scorers" icon={<SportsSoccerIcon />} iconPosition="start" disabled />
                        </Tabs>
                    </Box>

                    <CardContent sx={{ p: 0 }}>
                        {loading ? (
                            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                                <CircularProgress size={60} />
                            </Box>
                        ) : players.length === 0 ? (
                            <Box sx={{ textAlign: "center", py: 10 }}>
                                <Typography variant="h6" color="text.secondary">
                                    No data available yet. Start playing matches!
                                </Typography>
                            </Box>
                        ) : (
                            <TableContainer>
                                <Table sx={{ minWidth: 650 }}>
                                    <TableHead sx={{ bgcolor: "action.hover" }}>
                                        <TableRow>
                                            <TableCell align="center" sx={{ fontWeight: 700 }}>Rank</TableCell>
                                            <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                                            <TableCell align="center" sx={{ fontWeight: 700 }}>Level</TableCell>
                                            <TableCell align="right" sx={{ fontWeight: 700 }}>Points</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {players.map((player, index) => (
                                            <TableRow
                                                key={player._id}
                                                hover
                                                sx={{
                                                    bgcolor: index < 3 ? `${getRankColor(index)}15` : "inherit",
                                                    "& td": { py: 3 }
                                                }}
                                            >
                                                <TableCell align="center">
                                                    <Box
                                                        sx={{
                                                            width: 36,
                                                            height: 36,
                                                            borderRadius: "50%",
                                                            display: "flex",
                                                            alignItems: "center",
                                                            justifyContent: "center",
                                                            margin: "0 auto",
                                                            bgcolor: index < 3 ? getRankColor(index) : "action.selected",
                                                            color: index < 3 ? "black" : "text.primary",
                                                            fontWeight: 700,
                                                            fontSize: index < 3 ? "1.2rem" : "1rem"
                                                        }}
                                                    >
                                                        {index + 1}
                                                    </Box>
                                                </TableCell>
                                                <TableCell>
                                                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                                                        <Avatar
                                                            src={normalizeImageUrl(player.memberImage) || undefined}
                                                            alt={player.memberNick}
                                                            sx={{ width: 48, height: 48, border: "2px solid #ddd" }}
                                                        />
                                                        <Box>
                                                            <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                                                {player.memberNick}
                                                            </Typography>
                                                            <Typography variant="body2" color="text.secondary">
                                                                {player.memberFullName || "N/A"}
                                                            </Typography>
                                                        </Box>
                                                    </Box>
                                                </TableCell>
                                                <TableCell align="center">
                                                    <Chip
                                                        label={getSkillLevelLabel(player.memberSkillLevel)}
                                                        size="small"
                                                        sx={{
                                                            fontWeight: 700,
                                                            bgcolor: getSkillLevelBgColor(player.memberSkillLevel),
                                                            color: getSkillLevelColor(player.memberSkillLevel),
                                                        }}
                                                    />
                                                </TableCell>
                                                <TableCell align="right">
                                                    <Typography variant="h6" sx={{ fontWeight: 800, color: "primary.main" }}>
                                                        {player.memberPoints.toLocaleString()}
                                                    </Typography>
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        )}
                    </CardContent>
                </Paper>
            </Container>
        </Layout>
    );
}
