import React, { useState } from "react";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    Avatar,
    IconButton,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    Chip,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { MatchMember } from "@/lib/matchApi";
import { createMatchResult } from "@/lib/matchResultApi";

interface PostMatchFormProps {
    open: boolean;
    onClose: () => void;
    matchId: string;
    players: MatchMember[];
    onSuccess: () => void;
}

export default function PostMatchForm({ open, onClose, matchId, players, onSuccess }: PostMatchFormProps) {
    const [homeScore, setHomeScore] = useState(0);
    const [awayScore, setAwayScore] = useState(0);
    const [homePlayers, setHomePlayers] = useState<string[]>([]);
    const [awayPlayers, setAwayPlayers] = useState<string[]>([]);
    const [goals, setGoals] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    const handleAddGoal = () => {
        setGoals([...goals, { playerId: "", minute: 0, assistPlayerId: "" }]);
    };

    const handleRemoveGoal = (index: number) => {
        setGoals(goals.filter((_, i) => i !== index));
    };

    const handleGoalChange = (index: number, field: string, value: any) => {
        const newGoals = [...goals];
        newGoals[index][field] = value;
        setGoals(newGoals);
    };

    const handleSubmit = async () => {
        try {
            setLoading(true);

            // Auto-assign players to teams if not done (for simplicity in MVP)
            // In a real app, the organizer would drag players to Team A or Team B
            const midway = Math.ceil(players.length / 2);
            const hPlayers = homePlayers.length > 0 ? homePlayers : players.slice(0, midway).map(p => p._id);
            const aPlayers = awayPlayers.length > 0 ? awayPlayers : players.slice(midway).map(p => p._id);

            await createMatchResult({
                matchId,
                homeScore,
                awayScore,
                homePlayers: hPlayers,
                awayPlayers: aPlayers,
                goals: goals.filter(g => g.playerId).map(g => ({
                    ...g,
                    minute: Number(g.minute)
                }))
            });

            onSuccess();
            onClose();
        } catch (error) {
            console.error("Submission failed:", error);
            alert("Failed to submit result");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 800 }}>SUBMIT MATCH RESULT</DialogTitle>
            <DialogContent dividers>
                <Grid container spacing={3} sx={{ mb: 4 }}>
                    <Grid item xs={5}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom color="primary">TEAM HOME</Typography>
                            <TextField
                                type="number"
                                value={homeScore}
                                onChange={(e) => setHomeScore(parseInt(e.target.value) || 0)}
                                fullWidth
                                inputProps={{ style: { textAlign: 'center', fontSize: '2rem', fontWeight: 800 } }}
                            />
                        </Box>
                    </Grid>
                    <Grid item xs={2} sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Typography variant="h4">VS</Typography>
                    </Grid>
                    <Grid item xs={5}>
                        <Box sx={{ textAlign: "center" }}>
                            <Typography variant="h6" gutterBottom color="secondary">TEAM AWAY</Typography>
                            <TextField
                                type="number"
                                value={awayScore}
                                onChange={(e) => setAwayScore(parseInt(e.target.value) || 0)}
                                fullWidth
                                inputProps={{ style: { textAlign: 'center', fontSize: '2rem', fontWeight: 800 } }}
                            />
                        </Box>
                    </Grid>
                </Grid>

                <Divider sx={{ mb: 3 }}>
                    <Chip label="GOAL SCORERS" size="small" />
                </Divider>

                <List>
                    {goals.map((goal, index) => (
                        <ListItem key={index} secondaryAction={
                            <IconButton edge="end" onClick={() => handleRemoveGoal(index)} color="error">
                                <DeleteIcon />
                            </IconButton>
                        }>
                            <Grid container spacing={1} alignItems="center">
                                <Grid item xs={5}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Scorer</InputLabel>
                                        <Select
                                            value={goal.playerId}
                                            label="Scorer"
                                            onChange={(e) => handleGoalChange(index, "playerId", e.target.value)}
                                        >
                                            {players.map(p => (
                                                <MenuItem key={p._id} value={p._id}>{p.memberNick}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={4}>
                                    <FormControl fullWidth size="small">
                                        <InputLabel>Assist</InputLabel>
                                        <Select
                                            value={goal.assistPlayerId}
                                            label="Assist"
                                            onChange={(e) => handleGoalChange(index, "assistPlayerId", e.target.value)}
                                        >
                                            <MenuItem value=""><em>None</em></MenuItem>
                                            {players.map(p => (
                                                <MenuItem key={p._id} value={p._id}>{p.memberNick}</MenuItem>
                                            ))}
                                        </Select>
                                    </FormControl>
                                </Grid>
                                <Grid item xs={3}>
                                    <TextField
                                        size="small"
                                        type="number"
                                        label="Min"
                                        value={goal.minute}
                                        onChange={(e) => handleGoalChange(index, "minute", e.target.value)}
                                    />
                                </Grid>
                            </Grid>
                        </ListItem>
                    ))}
                </List>
                <Button startIcon={<AddIcon />} onClick={handleAddGoal} fullWidth sx={{ mt: 1 }}>
                    Add Goal
                </Button>
            </DialogContent>
            <DialogActions sx={{ p: 3 }}>
                <Button onClick={onClose} color="inherit">Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                    sx={{ px: 4, fontWeight: 700 }}
                >
                    {loading ? "Submitting..." : "SUBMIT RESULT"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}
