import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    Grid,
    Divider,
    Alert,
    CircularProgress,
    Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { createMatch, MatchType } from "@/lib/matchApi";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import { SKILL_LEVELS } from "@/lib/skillLevels";
import Layout from "@/components/Layout";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const MAX_MATCH_IMAGES = 5;

function getUploadUrl(type: "members" | "matches" | "teams" | "properties" = "members"): string {
    return `${getApiBaseUrl()}/uploader/image?type=${type}`;
}

export default function CreateMatchPage() {
    const router = useRouter();
    const { user, isAuthenticated } = useAuth();
    const { showError, showSuccess } = useErrorNotification();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);
    const [matchImages, setMatchImages] = useState<string[]>([]);
    const [uploadingImage, setUploadingImage] = useState(false);

    // Form State
    const [formData, setFormData] = useState({
        matchTitle: "",
        matchDescription: "",
        matchType: "FRIENDLY" as MatchType,
        address: "",
        matchDate: "",
        matchTime: "",
        maxPlayers: 22,
        duration: 90,
        matchFee: 0,
        skillLevel: "AMATEUR",
    });

    useEffect(() => {
        if (!loading) {
            if (!isAuthenticated) {
                router.push("/login");
            } else if (user?.memberType === "USER") {
                // Players are not allowed to create matches
                router.push("/");
            }
        }
    }, [isAuthenticated, loading, user, router]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length) return;
        if (matchImages.length >= MAX_MATCH_IMAGES) {
            showError(`Maximum ${MAX_MATCH_IMAGES} images allowed.`);
            e.target.value = "";
            return;
        }
        const toUpload = Array.from(files)
            .filter((f) => f.type.startsWith("image/"))
            .slice(0, MAX_MATCH_IMAGES - matchImages.length);
        if (!toUpload.length) {
            showError("Please select image files (jpg, png, gif).");
            e.target.value = "";
            return;
        }
        setUploadingImage(true);
        try {
            const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
            const newUrls: string[] = [];
            for (const file of toUpload) {
                const form = new FormData();
                form.append("file", file);
                const res = await fetch(getUploadUrl("matches"), {
                    method: "POST",
                    body: form,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();
                if (data?.url) newUrls.push(data.url);
            }
            setMatchImages((prev) => [...prev, ...newUrls].slice(0, MAX_MATCH_IMAGES));
            if (newUrls.length) showSuccess(`Added ${newUrls.length} photo(s).`);
            if (newUrls.length < toUpload.length) showError("Some uploads failed.");
        } catch (err: unknown) {
            showError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setUploadingImage(false);
            e.target.value = "";
        }
    };

    const removeMatchImage = (index: number) => {
        setMatchImages((prev) => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.address || !formData.matchDate || !formData.matchTime) {
            setError("Please fill in all required fields.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await createMatch({
                ...formData,
                maxPlayers: Number(formData.maxPlayers),
                duration: Number(formData.duration),
                matchFee: Number(formData.matchFee),
                images: matchImages.length ? matchImages : undefined,
            });

            setSuccess(true);
            setTimeout(() => {
                router.push(`/match/${result._id}`);
            }, 1500);
        } catch (err: any) {
            console.error("Create Match Error:", err);
            setError(err?.message || "Failed to create match. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    if (!isAuthenticated) return null;

    return (
        <>
            <Head>
                <title>Create New Match - KickUp</title>
            </Head>

            <Container maxWidth="md" sx={{ py: 6 }}>
                <Button
                    startIcon={<ArrowBackIcon />}
                    onClick={() => router.back()}
                    sx={{ mb: 4, color: "text.secondary" }}
                >
                    Back
                </Button>

                <Paper elevation={0} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, border: '1px solid #E5E7EB' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 4 }}>
                        <Box sx={{
                            p: 1.5,
                            borderRadius: 3,
                            bgcolor: 'var(--plab-green-soft)',
                            color: 'var(--plab-green)'
                        }}>
                            <SportsSoccerIcon fontSize="large" />
                        </Box>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 800 }}>Create New Match</Typography>
                            <Typography variant="body1" color="text.secondary">Organize a game and invite players</Typography>
                        </Box>
                    </Box>

                    {error && <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 4, borderRadius: 2 }}>Match created successfully! Redirecting...</Alert>}

                    <form onSubmit={handleSubmit}>
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Match Title"
                                    name="matchTitle"
                                    value={formData.matchTitle}
                                    onChange={handleChange}
                                    placeholder="e.g. Sunday Morning Friendly"
                                    variant="outlined"
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={3}
                                    label="Match Description (Optional)"
                                    name="matchDescription"
                                    value={formData.matchDescription}
                                    onChange={handleChange}
                                    placeholder="Tell players about the match, rules, or requirements..."
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <Typography variant="subtitle2" color="text.secondary" sx={{ mb: 1 }}>Match photos (optional, up to {MAX_MATCH_IMAGES})</Typography>
                                <Box sx={{ display: "flex", alignItems: "center", gap: 1, flexWrap: "wrap" }}>
                                    <input
                                        ref={fileInputRef}
                                        type="file"
                                        accept="image/*"
                                        multiple
                                        style={{ display: "none" }}
                                        onChange={handleImageUpload}
                                    />
                                    {matchImages.length < MAX_MATCH_IMAGES && (
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddPhotoAlternateIcon />}
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploadingImage}
                                        >
                                            {uploadingImage ? "Uploading…" : "Add photos"}
                                        </Button>
                                    )}
                                    {matchImages.map((url, i) => (
                                        <Box key={i} sx={{ position: "relative", width: 100, height: 72, borderRadius: 1, overflow: "hidden", border: 1, borderColor: "divider" }}>
                                            <img src={url} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                            <Button
                                                size="small"
                                                onClick={() => removeMatchImage(i)}
                                                sx={{ position: "absolute", top: 2, right: 2, minWidth: 28, height: 28, bgcolor: "rgba(0,0,0,0.6)", color: "white", "&:hover": { bgcolor: "rgba(0,0,0,0.8)" } }}
                                            >
                                                ×
                                            </Button>
                                        </Box>
                                    ))}
                                </Box>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    label="Stadium Address"
                                    name="address"
                                    value={formData.address}
                                    onChange={handleChange}
                                    placeholder="e.g. Bunyodkor Stadium, Tashkent"
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <FormControl fullWidth>
                                    <InputLabel>Match Type</InputLabel>
                                    <Select
                                        name="matchType"
                                        value={formData.matchType}
                                        onChange={handleChange}
                                        label="Match Type"
                                    >
                                        <MenuItem value="FRIENDLY">Friendly Match</MenuItem>
                                        <MenuItem value="TOURNAMENT">Tournament</MenuItem>
                                        <MenuItem value="LEAGUE">League Game</MenuItem>
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="date"
                                    label="Date"
                                    name="matchDate"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.matchDate}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    required
                                    type="time"
                                    label="Start Time"
                                    name="matchTime"
                                    InputLabelProps={{ shrink: true }}
                                    value={formData.matchTime}
                                    onChange={handleChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Max Players"
                                    name="maxPlayers"
                                    value={formData.maxPlayers}
                                    onChange={handleChange}
                                    inputProps={{ min: 2 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Duration (Min)"
                                    name="duration"
                                    value={formData.duration}
                                    onChange={handleChange}
                                    inputProps={{ min: 30, step: 15 }}
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    required
                                    type="number"
                                    label="Match Fee (UZS)"
                                    name="matchFee"
                                    value={formData.matchFee}
                                    onChange={handleChange}
                                    placeholder="0 for free"
                                />
                            </Grid>

                            <Grid item xs={12} sm={4}>
                                <FormControl fullWidth>
                                    <InputLabel>Skill Level</InputLabel>
                                    <Select
                                        name="skillLevel"
                                        value={formData.skillLevel}
                                        onChange={handleChange}
                                        label="Skill Level"
                                    >
                                        {SKILL_LEVELS.map((opt) => (
                                            <MenuItem key={opt.value} value={opt.value}>
                                                {opt.label}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Grid>

                            <Grid item xs={12}>
                                <Divider sx={{ my: 2 }} />
                                <Button
                                    fullWidth
                                    type="submit"
                                    variant="contained"
                                    disabled={loading || success}
                                    sx={{
                                        py: 1.8,
                                        fontSize: '1.1rem',
                                        fontWeight: 700,
                                        textTransform: 'none',
                                        borderRadius: 3,
                                        background: 'linear-gradient(135deg, #00E377 0%, #00B85C 100%)',
                                        boxShadow: '0 8px 16px rgba(0, 227, 119, 0.25)',
                                        '&:hover': {
                                            background: 'linear-gradient(135deg, #00C466 0%, #009E4F 100%)',
                                            boxShadow: '0 10px 20px rgba(0, 227, 119, 0.35)',
                                        }
                                    }}
                                >
                                    {loading ? <CircularProgress size={26} color="inherit" /> : "Create Match"}
                                </Button>
                            </Grid>
                        </Grid>
                    </form>
                </Paper>
            </Container>
        </>
    );
}
