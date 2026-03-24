import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useAuth } from "@/contexts/AuthContext";
import { getMatchDetails, Match, getJoinedMembers, checkIn } from "@/lib/matchApi";
import { normalizeImageUrl } from "@/lib/imageUrl";
import Layout from "@/components/Layout";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Button,
    Chip,
    CircularProgress,
    Alert,
    Divider,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

export default function CheckInPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAdmin } = useAuth();
    const [match, setMatch] = useState<Match | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [checkedInMembers, setCheckedInMembers] = useState<string[]>([]);

    useEffect(() => {
        if (id && typeof id === "string") {
            loadMatch();
        }
    }, [id]);

    const loadMatch = async () => {
        try {
            setLoading(true);
            const data = await getMatchDetails(id as string);
            setMatch(data);

            // Populate initial checked-in players from match data if available
            if (data.checkedInPlayers) {
                const ids = data.checkedInPlayers.map(p => typeof p === 'string' ? p : p._id);
                setCheckedInMembers(ids);
            }
        } catch (err: any) {
            setError("Failed to load match");
        } finally {
            setLoading(false);
        }
    };

    const handleCheckIn = async (memberId: string) => {
        try {
            await checkIn(id as string, memberId);
            setCheckedInMembers((prev) => [...prev, memberId]);
        } catch (err) {
            console.error("Check-in failed", err);
        }
    };

    if (loading) return <Box sx={{ p: 4, textAlign: "center" }}><CircularProgress /></Box>;
    if (!match) return <Box sx={{ p: 4, textAlign: "center" }}><Typography>Match not found</Typography></Box>;

    const joinedMembers = getJoinedMembers(match);
    const isOrganizer = user?.id === (typeof match.organizerId === 'object' ? match.organizerId._id : match.organizerId);

    if (!isOrganizer && !isAdmin) {
        return (
            <>
                <Container maxWidth="sm" sx={{ py: 4 }}>
                    <Alert severity="error">You are not the organizer of this match</Alert>
                    <Button onClick={() => router.back()} sx={{ mt: 2 }}>Back</Button>
                </Container>
            </>
        );
    }

    return (
        <>
            <Container maxWidth="sm" sx={{ py: 4 }}>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.back()} sx={{ mb: 2 }}>
                    Back
                </Button>

                <Card sx={{ mb: 3 }}>
                    <CardContent>
                        <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                            {match.matchTitle} - Check-in
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {new Date(match.matchDate).toLocaleDateString()} | {match.matchTime}
                        </Typography>
                        <Box sx={{ mt: 2, display: 'flex', gap: 1 }}>
                            <Chip label={`${checkedInMembers.length} / ${joinedMembers.length} joined`} color="primary" />
                            <Button variant="outlined" startIcon={<QrCodeScannerIcon />} size="small">
                                QR Scan
                            </Button>
                        </Box>
                    </CardContent>
                </Card>

                <List sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
                    {joinedMembers.map((member) => {
                        const isCheckedIn = checkedInMembers.includes(member._id);
                        return (
                            <div key={member._id}>
                                <ListItem
                                    secondaryAction={
                                        <Button
                                            variant={isCheckedIn ? "outlined" : "contained"}
                                            color={isCheckedIn ? "success" : "primary"}
                                            onClick={() => handleCheckIn(member._id)}
                                            startIcon={isCheckedIn ? <CheckCircleIcon /> : undefined}
                                            disabled={isCheckedIn}
                                        >
                                            {isCheckedIn ? "Joined" : "Confirm"}
                                        </Button>
                                    }
                                >
                                    <ListItemAvatar>
                                        <Avatar src={normalizeImageUrl(member.memberImage) || undefined} alt={member.memberNick}>
                                            {member.memberNick.charAt(0)}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText
                                        primary={member.memberFullName || member.memberNick}
                                        secondary={`@${member.memberNick} • ${member.memberSkillLevel || 'N/A'}`}
                                    />
                                </ListItem>
                                <Divider component="li" />
                            </div>
                        );
                    })}
                    {joinedMembers.length === 0 && (
                        <Box sx={{ p: 4, textAlign: 'center' }}>
                            <Typography color="text.secondary">No participants yet</Typography>
                        </Box>
                    )}
                </List>
            </Container>
        </>
    );
}
