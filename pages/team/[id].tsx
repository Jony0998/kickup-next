import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    Card,
    CardContent,
    Avatar,
    Grid,
    Chip,
    Button,
    Tabs,
    Tab,
    Divider,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    CircularProgress,
    IconButton,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import ShareIcon from "@mui/icons-material/Share";
import EditIcon from "@mui/icons-material/Edit";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import { getTeam, joinTeam, updateTeam, Team } from "@/lib/teamApi";
import { normalizeImageUrl } from "@/lib/imageUrl";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import Chat from "@/components/Chat";

const MAX_LOGO_SIZE_MB = 5;

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            id={`team-tabpanel-${index}`}
            aria-labelledby={`team-tab-${index}`}
            {...other}
        >
            {value === index && (
                <Box sx={{ pt: 3, px: { xs: 2, sm: 3 }, pb: 3 }}>{children}</Box>
            )}
        </div>
    );
}

export default function TeamDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useAuth();
    const { showError, showSuccess } = useErrorNotification();

    const [team, setTeam] = useState<Team | null>(null);
    const [loading, setLoading] = useState(true);
    const [joining, setJoining] = useState(false);
    const [tabValue, setTabValue] = useState(0);
    const [editOpen, setEditOpen] = useState(false);
    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");
    const [editLogoUrl, setEditLogoUrl] = useState<string | null>(null);
    const [uploadingLogo, setUploadingLogo] = useState(false);
    const [savingEdit, setSavingEdit] = useState(false);
    const editLogoInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if (id && typeof id === "string") {
            loadTeam(id);
        }
    }, [id]);

    const loadTeam = async (teamId: string) => {
        try {
            setLoading(true);
            const data = await getTeam(teamId);
            setTeam(data);
        } catch (error) {
            console.error("Error loading team:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleJoinTeam = async () => {
        if (!team) return;
        setJoining(true);
        try {
            const result = await joinTeam(team.id);
            if (result.success) {
                await loadTeam(team.id);
                showSuccess("You have joined the team.");
            } else {
                showError(result.message || "Could not join team.");
            }
        } catch (e: any) {
            showError(e?.message || "Could not join team.");
        } finally {
            setJoining(false);
        }
    };

    const handleShareTeam = () => {
        const url = typeof window !== "undefined" ? `${window.location.origin}/team/${team?.id}` : "";
        if (url && navigator.clipboard?.writeText) {
            navigator.clipboard.writeText(url);
            showSuccess("Team link copied. Share it so others can join!");
        } else {
            showError("Could not copy link.");
        }
    };

    const isOwner = Boolean(
        user && team && (
            (team.ownerId && user.id === team.ownerId) ||
            team.members?.some((m) => m.id === user.id && m.role === "owner")
        )
    );

    const handleOpenEdit = () => {
        if (!team) return;
        setEditName(team.name);
        setEditDescription(team.description || "");
        setEditLogoUrl(team.logo || null);
        setEditOpen(true);
    };

    const handleCloseEdit = () => {
        setEditOpen(false);
    };

    const handleEditLogoClick = () => {
        editLogoInputRef.current?.click();
    };

    const handleEditLogoFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        if (file.size > MAX_LOGO_SIZE_MB * 1024 * 1024) {
            showError(`Image size must not exceed ${MAX_LOGO_SIZE_MB}MB`);
            return;
        }
        if (!file.type.match(/^image\/(jpeg|jpg|png|gif)$/)) {
            showError("Only images (jpg, png, gif) are allowed");
            return;
        }
        setUploadingLogo(true);
        const formData = new FormData();
        formData.append("file", file);
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        if (!token) {
            showError("Login qiling yoki qayta kirish qiling.");
            setUploadingLogo(false);
            e.target.value = "";
            return;
        }
        try {
            const response = await fetch("/api/upload-image?type=teams", {
                method: "POST",
                headers: { Authorization: `Bearer ${token}` },
                body: formData,
            });
            if (!response.ok) {
                const errData = await response.json().catch(() => ({}));
                throw new Error((errData as any).message || "Failed to upload image");
            }
            const data = await response.json();
            if (data.success && data.url) {
                setEditLogoUrl(data.url);
                if (team) {
                    try {
                        await updateTeam(team.id, { teamLogo: data.url });
                        setTeam((prev) => (prev ? { ...prev, logo: data.url, ownerId: prev.ownerId } : null));
                        showSuccess("Rasm yuklandi va backendga saqlandi.");
                    } catch (saveErr: any) {
                        setEditLogoUrl(data.url);
                        showSuccess("Rasm yuklandi. «Save» bosib profilni saqlang.");
                    }
                } else {
                    showSuccess("Rasm yuklandi. «Save» bosib saqlang.");
                }
            } else {
                throw new Error("Could not get image URL");
            }
        } catch (err: any) {
            showError(err?.message || "Error uploading image");
        } finally {
            setUploadingLogo(false);
            e.target.value = "";
        }
    };

    const handleRemoveEditLogo = () => {
        setEditLogoUrl(null);
    };

    const handleSaveEdit = async () => {
        if (!team || !editName.trim()) {
            showError("Team name is required.");
            return;
        }
        setSavingEdit(true);
        try {
            const updated = await updateTeam(team.id, {
                teamName: editName.trim(),
                teamDescription: editDescription.trim() || undefined,
                teamLogo: editLogoUrl || undefined,
            });
            setTeam({ ...updated, ownerId: team.ownerId });
            showSuccess("Team profile updated.");
            handleCloseEdit();
        } catch (err: any) {
            showError(err?.message || "Failed to update team.");
        } finally {
            setSavingEdit(false);
        }
    };

    if (loading) {
        return (
            <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!team) {
        return (
            <Box sx={{ textAlign: "center", py: 8 }}>
                <Typography variant="h5">Team not found</Typography>
                <Button startIcon={<ArrowBackIcon />} onClick={() => router.push("/team")} sx={{ mt: 2 }}>
                    Back to Teams
                </Button>
            </Box>
        );
    }

    const isMember = user && team.members?.some(m => m.id === user.id);

    return (
        <>
            <Head>
                <title>{team.name} - KickUp</title>
            </Head>

            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", pb: 8 }}>
                {/* Banner */}
                <Box
                    sx={{
                        height: 200,
                        bgcolor: "primary.main",
                        backgroundImage: "linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)",
                        position: "relative",
                    }}
                >
                    <Container maxWidth="lg" sx={{ height: "100%", position: "relative", px: { xs: 2, sm: 3 } }}>
                        <IconButton
                            onClick={() => router.push('/team')}
                            sx={{ position: 'absolute', top: 16, left: 16, color: 'white' }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ mt: -6, px: { xs: 2, sm: 3 } }}>
                    <Card sx={{ mb: 4, overflow: "visible", borderRadius: 2 }}>
                        <CardContent sx={{ position: "relative", pt: 0, pb: 4, px: { xs: 2, sm: 3 } }}>
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: { xs: "column", md: "row" },
                                    alignItems: { xs: "center", md: "flex-end" },
                                    gap: 2,
                                    mb: 3,
                                    flexWrap: "wrap",
                                }}
                            >
                                <Box sx={{ position: "relative", flexShrink: 0, mt: -6, mb: { xs: 2, md: 0 }, mr: { md: 0 } }}>
                                    <Avatar
                                        src={normalizeImageUrl(team.logo) || undefined}
                                        sx={{
                                            width: 120,
                                            height: 120,
                                            border: "4px solid white",
                                            boxShadow: 2,
                                            bgcolor: "grey.300",
                                            fontSize: 48,
                                        }}
                                    >
                                        {team.name[0]}
                                    </Avatar>
                                    {isOwner && (
                                        <IconButton
                                            onClick={handleOpenEdit}
                                            size="small"
                                            sx={{
                                                position: "absolute",
                                                bottom: 0,
                                                right: 0,
                                                bgcolor: "primary.main",
                                                color: "white",
                                                "&:hover": { bgcolor: "primary.dark" },
                                            }}
                                        >
                                            <PhotoCameraIcon fontSize="small" />
                                        </IconButton>
                                    )}
                                </Box>

                                <Box sx={{ flex: 1, minWidth: 0, textAlign: { xs: "center", md: "left" } }}>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {team.name}
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        sx={{
                                            mt: 0.5,
                                            color: "text.secondary",
                                            fontSize: "0.9375rem",
                                            lineHeight: 1.5,
                                        }}
                                    >
                                        {team.description || "No description provided."}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                        {team.members?.length ?? 0} Members
                                    </Typography>
                                </Box>

                                <Box sx={{ flexShrink: 0, mt: { xs: 2, md: 0 }, display: "flex", flexWrap: "wrap", gap: 1, justifyContent: { xs: "center", md: "flex-end" } }}>
                                    {isMember && (
                                        <Chip label="Member" color="success" variant="outlined" sx={{ fontWeight: 600 }} />
                                    )}
                                    {!isMember && isAuthenticated && (
                                        <Button
                                            variant="contained"
                                            onClick={handleJoinTeam}
                                            disabled={joining}
                                            startIcon={joining ? <CircularProgress size={18} color="inherit" /> : null}
                                            sx={{ minWidth: 120 }}
                                        >
                                            {joining ? "Joining…" : "Join Team"}
                                        </Button>
                                    )}
                                    {!isMember && !isAuthenticated && (
                                        <Button variant="outlined" component={Link} href="/login" sx={{ minWidth: 120 }}>
                                            Login to join
                                        </Button>
                                    )}
                                    {isOwner && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<EditIcon />}
                                            onClick={handleOpenEdit}
                                            sx={{ minWidth: 100 }}
                                        >
                                            Edit
                                        </Button>
                                    )}
                                    <Button
                                        variant="outlined"
                                        startIcon={<ShareIcon />}
                                        onClick={handleShareTeam}
                                        sx={{ minWidth: 100 }}
                                    >
                                        Share
                                    </Button>
                                </Box>
                            </Box>

                            <Divider sx={{ my: 2 }} />
                        </CardContent>
                    </Card>

                    {/* Stats & Members Tabs */}
                    <Card sx={{ borderRadius: 2 }}>
                        <Box sx={{ borderBottom: 1, borderColor: "divider", px: { xs: 1, sm: 0 } }}>
                            <Tabs
                                value={tabValue}
                                onChange={handleTabChange}
                                aria-label="team details tabs"
                                sx={{
                                    "& .MuiTab-root": { fontWeight: 600, textTransform: "none" },
                                    "& .Mui-selected": { color: "success.main" },
                                    "& .MuiTabs-indicator": { backgroundColor: "success.main" },
                                }}
                            >
                                <Tab label="Overview" />
                                <Tab label="Members" />
                                <Tab label="Matches" />
                            </Tabs>
                        </Box>

                        <TabPanel value={tabValue} index={0}>
                            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                                Team Statistics
                            </Typography>
                            {((team.stats?.totalMatches ?? 0) === 0 &&
                                (team.stats?.wins ?? 0) === 0 &&
                                (team.stats?.losses ?? 0) === 0 &&
                                (team.stats?.draws ?? 0) === 0) ? (
                                <Box
                                    sx={{
                                        textAlign: "center",
                                        py: 4,
                                        px: 2,
                                        bgcolor: "grey.50",
                                        borderRadius: 2,
                                        border: "1px dashed",
                                        borderColor: "divider",
                                    }}
                                >
                                    <EmojiEventsIcon sx={{ fontSize: 48, color: "grey.400", mb: 1 }} />
                                    <Typography color="text.secondary" sx={{ mb: 0.5 }}>
                                        No matches played yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Schedule your first game to see stats here.
                                    </Typography>
                                </Box>
                            ) : (
                                <Grid container spacing={3}>
                                    <Grid item xs={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                                <Typography variant="h4">{team.stats?.totalMatches || 0}</Typography>
                                                <Typography variant="body2" color="text.secondary">Matches</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                                <Typography variant="h4" color="success.main">{team.stats?.wins || 0}</Typography>
                                                <Typography variant="body2" color="text.secondary">Wins</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                                <Typography variant="h4" color="error.main">{team.stats?.losses || 0}</Typography>
                                                <Typography variant="body2" color="text.secondary">Losses</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                    <Grid item xs={6} md={3}>
                                        <Card variant="outlined" sx={{ borderRadius: 2 }}>
                                            <CardContent sx={{ textAlign: 'center', py: 2.5 }}>
                                                <Typography variant="h4" color="success.main">{team.stats?.draws || 0}</Typography>
                                                <Typography variant="body2" color="text.secondary">Draws</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                </Grid>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <List>
                                {team.members?.map((member) => (
                                    <ListItem key={member.id} divider>
                                        <ListItemAvatar>
                                            <Avatar src={member.avatar}>{member.name?.[0] || '?'}</Avatar>
                                        </ListItemAvatar>
                                        <ListItemText
                                            primary={member.name}
                                            secondary={`Joined ${member.joinedAt ? new Date(member.joinedAt).toLocaleDateString() : 'N/A'}`}
                                        />
                                        {member.role === 'owner' || member.role === 'captain' ? <Chip label={member.role} size="small" color="primary" /> : null}
                                    </ListItem>
                                ))}
                            </List>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Typography align="center" color="text.secondary">No match history available yet.</Typography>
                        </TabPanel>
                    </Card>
                </Container>
            </Box>

            {isMember && (
                <Chat
                    chatId={team.id}
                    chatType="TEAM"
                    title={team.name ? `${team.name} – Chat` : "Team Chat"}
                />
            )}

            {/* Edit team dialog */}
            <Dialog open={editOpen} onClose={handleCloseEdit} maxWidth="sm" fullWidth>
                <DialogTitle>Edit team</DialogTitle>
                <DialogContent>
                    <input
                        type="file"
                        accept="image/jpeg,image/jpg,image/png,image/gif"
                        ref={editLogoInputRef}
                        onChange={handleEditLogoFileChange}
                        style={{ display: "none" }}
                    />
                    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 1 }}>
                        <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
                            <IconButton
                                onClick={handleEditLogoClick}
                                disabled={uploadingLogo}
                                sx={{ p: 0 }}
                            >
                                <Avatar
                                    src={editLogoUrl ? normalizeImageUrl(editLogoUrl) : undefined}
                                    sx={{
                                        width: 80,
                                        height: 80,
                                        bgcolor: "grey.300",
                                        fontSize: 32,
                                    }}
                                >
                                    {uploadingLogo ? (
                                        <CircularProgress size={28} />
                                    ) : (
                                        <PhotoCameraIcon fontSize="large" />
                                    )}
                                </Avatar>
                            </IconButton>
                        </Box>
                        {editLogoUrl && (
                            <Button size="small" color="secondary" onClick={handleRemoveEditLogo}>
                                Remove photo
                            </Button>
                        )}
                        <TextField
                            label="Team name"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            fullWidth
                            required
                        />
                        <TextField
                            label="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseEdit}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSaveEdit}
                        disabled={savingEdit || !editName.trim()}
                    >
                        {savingEdit ? "Saving…" : "Save"}
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
}
