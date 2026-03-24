import Head from "next/head";
import { useRouter } from "next/router";
import React, { useState, useEffect, useRef } from "react";
import {
    Box,
    Container,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    Chip,
    CircularProgress,
    Divider,
    Alert,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import { getProperty, updateProperty, Property } from "@/lib/propertyApi";
import { createBooking, checkFieldAvailability } from "@/lib/bookingApi";
import { useAuth } from "@/contexts/AuthContext";
import { useErrorNotification } from "@/contexts/ErrorNotificationContext";
import Image from "next/image";
import styles from "@/styles/rental.module.scss";
import { getApiBaseUrl } from "@/lib/apiBaseUrl";

const MAX_IMAGES = 5;

function getUploadUrl(type: "members" | "matches" | "teams" | "properties" = "properties"): string {
    return `${getApiBaseUrl()}/uploader/image?type=${type}`;
}

export default function RentalDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const { user, isAuthenticated } = useAuth();
    const { showError, showSuccess } = useErrorNotification();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [property, setProperty] = useState<Property | null>(null);
    const [loading, setLoading] = useState(true);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState<string | null>(null);
    const [processing, setProcessing] = useState(false);
    const [message, setMessage] = useState("");
    const [uploading, setUploading] = useState(false);

    useEffect(() => {
        if (id && typeof id === "string") {
            loadProperty(id);
        }
    }, [id]);

    // Prefill date and time from URL query (e.g. from /rental list time-slot link)
    useEffect(() => {
        const q = router.query;
        const dateStr = typeof q.date === "string" ? q.date : null;
        const timeStr = typeof q.time === "string" ? q.time : null;
        if (dateStr) {
            const d = new Date(dateStr);
            if (!isNaN(d.getTime())) setSelectedDate(d);
        }
        if (timeStr) setSelectedTime(timeStr);
    }, [router.query.date, router.query.time]);

    const loadProperty = async (propId: string) => {
        try {
            const data = await getProperty(propId);
            setProperty(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files?.length || !property || !id || typeof id !== "string") return;
        const current = property.images?.length ?? 0;
        const remaining = MAX_IMAGES - current;
        if (remaining <= 0) {
            showError("Maximum 5 images allowed.");
            return;
        }
        const toUpload = Array.from(files).slice(0, remaining).filter((f) => f.type.startsWith("image/"));
        if (!toUpload.length) {
            showError("Please select image files (jpg, png, gif).");
            return;
        }
        setUploading(true);
        try {
            const newUrls: string[] = [];
            for (const file of toUpload) {
                const form = new FormData();
                form.append("file", file);
                const token = typeof localStorage !== "undefined" ? localStorage.getItem("token") : null;
                const res = await fetch(getUploadUrl("properties"), {
                    method: "POST",
                    body: form,
                    headers: token ? { Authorization: `Bearer ${token}` } : {},
                });
                const data = await res.json();
                if (data?.url) newUrls.push(data.url);
            }
            const updatedImages = [...(property.images || []), ...newUrls].slice(0, MAX_IMAGES);
            const updated = await updateProperty(id, { images: updatedImages });
            if (updated) {
                setProperty({ ...property, images: updated.images ?? updatedImages });
                showSuccess(`Added ${newUrls.length} photo(s). Up to ${MAX_IMAGES} total.`);
            } else {
                showError("Failed to update photos.");
            }
        } catch (err: unknown) {
            showError(err instanceof Error ? err.message : "Upload failed.");
        } finally {
            setUploading(false);
            e.target.value = "";
        }
    };

    const handleBooking = async () => {
        if (!isAuthenticated) {
            router.push(`/login?redirect=${router.asPath}`);
            return;
        }
        if (!selectedTime || !property) return;

        try {
            setProcessing(true);
            // Calculate endTime (assume 1 or 2 hours for simplicity, mocking 2 hours)
            const startHour = parseInt(selectedTime.split(':')[0]);
            const endHour = startHour + 2;
            const endTime = `${endHour < 10 ? '0' : ''}${endHour}:00`;

            // Mock availability check
            const isAvailable = await checkFieldAvailability(property.id, selectedDate.toISOString().slice(0, 10), selectedTime, endTime);
            if (!isAvailable) {
                setMessage("Selected time slot is not available.");
                setProcessing(false);
                return;
            }

            // Create booking
            await createBooking({
                fieldId: property.id,
                bookingDate: selectedDate.toISOString(),
                startTime: selectedTime,
                endTime: endTime,
                duration: 2,
                totalAmount: (property.hourlyRate || 0) * 2,
            });

            setMessage("Booking request sent! Redirecting to confirmation...");
            setTimeout(() => {
                router.push(`/mypage/usage-history`); // Should redirect to a booking confirmation page ideally
            }, 1500);

        } catch (e: any) {
            setMessage(e.message || "Booking failed.");
        } finally {
            setProcessing(false);
        }
    };

    if (loading) return <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}><CircularProgress /></Box>;
    if (!property) return <Container><Typography>Property not found</Typography></Container>;

    const timeSlots = ["06:00", "08:00", "10:00", "12:00", "14:00", "16:00", "18:00", "20:00", "22:00"];

    return (
        <>
            <Head>
                <title>{property.propertyName} - Rental</title>
            </Head>

            <Box sx={{ bgcolor: "background.default", minHeight: "100vh", py: 4 }}>
                <Container maxWidth="lg">
                    <Button
                        onClick={() => router.back()}
                        startIcon={<ArrowBackIcon />}
                        sx={{ mb: 2 }}
                    >
                        Back
                    </Button>

                    <Grid container spacing={4}>
                        <Grid item xs={12} md={8}>
                            <Typography variant="h6" fontWeight={600} gutterBottom>Venue photos (up to {MAX_IMAGES})</Typography>
                            <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", alignItems: "flex-start", mb: 2 }}>
                                <Box sx={{ display: "flex", gap: 1, overflowX: "auto", flexWrap: "wrap", minHeight: 120 }}>
                                    {property.images?.map((src, i) => (
                                        <Box key={i} sx={{ width: 120, height: 90, borderRadius: 1, overflow: "hidden", flexShrink: 0, border: 1, borderColor: "divider" }}>
                                            <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                                        </Box>
                                    ))}
                                </Box>
                                {(property.images?.length ?? 0) < MAX_IMAGES && (
                                    <>
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            style={{ display: "none" }}
                                            onChange={handleImageUpload}
                                        />
                                        <Button
                                            variant="outlined"
                                            startIcon={<AddPhotoAlternateIcon />}
                                            onClick={() => fileInputRef.current?.click()}
                                            disabled={uploading}
                                            sx={{ alignSelf: "flex-start" }}
                                        >
                                            {uploading ? "Uploading…" : "Add photos"}
                                        </Button>
                                    </>
                                )}
                            </Box>
                            <Box sx={{ position: "relative", height: 300, bgcolor: "grey.300", borderRadius: 2, mb: 3, overflow: "hidden" }}>
                                {property.images && property.images.length > 0 ? (
                                    <Image
                                        src={property.images[0]}
                                        alt={property.propertyName}
                                        fill
                                        style={{ objectFit: "cover" }}
                                        sizes="(max-width: 768px) 100vw, 800px"
                                    />
                                ) : (
                                    <Typography sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>No Image</Typography>
                                )}
                            </Box>

                            <Typography variant="h4" fontWeight={700} gutterBottom>
                                {property.propertyName}
                            </Typography>

                            <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
                                <LocationOnIcon color="action" />
                                <Typography variant="body1">{property.location.address}</Typography>
                            </Box>

                            <Box sx={{ mb: 3 }}>
                                {property.amenities?.map((amenity, idx) => (
                                    <Chip key={idx} label={amenity} size="small" sx={{ mr: 1 }} />
                                ))}
                            </Box>

                            <Divider sx={{ my: 3 }} />

                            <Typography variant="h6" fontWeight={600} gutterBottom>
                                About this venue
                            </Typography>
                            <Typography variant="body1" paragraph>
                                {property.propertyDescription || "No description available."}
                            </Typography>
                        </Grid>

                        <Grid item xs={12} md={4}>
                            <Card sx={{ position: "sticky", top: 20 }}>
                                <CardContent>
                                    <Typography variant="h5" fontWeight={700} gutterBottom>
                                        {property.hourlyRate ? `₩${property.hourlyRate.toLocaleString()} / hour` : "Price on request"}
                                    </Typography>

                                    <Divider sx={{ my: 2 }} />

                                    <Typography variant="subtitle2" gutterBottom>
                                        Select Time {selectedDate && selectedDate.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}
                                    </Typography>
                                    <Grid container spacing={1} sx={{ mb: 3 }}>
                                        {timeSlots.map(time => (
                                            <Grid item xs={3} key={time}>
                                                <Button
                                                    variant={selectedTime === time ? "contained" : "outlined"}
                                                    onClick={() => setSelectedTime(time)}
                                                    fullWidth
                                                    size="small"
                                                >
                                                    {time}
                                                </Button>
                                            </Grid>
                                        ))}
                                    </Grid>

                                    {message && <Alert severity="info" sx={{ mb: 2 }}>{message}</Alert>}

                                    <Button
                                        variant="contained"
                                        fullWidth
                                        size="large"
                                        disabled={!selectedTime || processing}
                                        onClick={handleBooking}
                                    >
                                        {processing ? "Processing..." : "Reserve Now"}
                                    </Button>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
        </>
    );
}
