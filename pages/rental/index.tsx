import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect, useMemo } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  Select,
  MenuItem,
  FormControl,
  IconButton,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Popover,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import { getProperties, Property } from "@/lib/propertyApi";
import { getMatches, Match, getFieldData } from "@/lib/matchApi";
import styles from "@/styles/rental.module.scss";

const TIME_SLOTS = ["06:00", "12:00", "18:00", "00:00"];
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function getDateIso(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function formatDateLabel(d: Date): string {
  const month = d.toLocaleString("en-US", { month: "long" });
  const day = d.getDate();
  const dayName = d.toLocaleString("en-US", { weekday: "long" });
  return `${month} ${day}, ${dayName}`;
}

function getDaysInMonth(year: number, month: number): Date[] {
  const first = new Date(year, month, 1);
  const last = new Date(year, month + 1, 0);
  const days: Date[] = [];
  for (let d = 1; d <= last.getDate(); d++) days.push(new Date(year, month, d));
  const startPad = first.getDay();
  for (let i = 0; i < startPad; i++) days.unshift(new Date(0));
  while (days.length % 7 !== 0) days.push(new Date(0));
  return days;
}

function sameCalendarDay(d1: Date, d2: Date): boolean {
  return d1.getFullYear() === d2.getFullYear() && d1.getMonth() === d2.getMonth() && d1.getDate() === d2.getDate();
}

function matchesFloorType(floorType: string, field: Property): boolean {
  if (!floorType) return true;
  const lower = floorType.toLowerCase();
  const desc = (field.propertyDescription || "").toLowerCase();
  const amenityMatch = field.amenities?.some((a) => a.toLowerCase().includes(lower));
  if (amenityMatch) return true;
  if (lower === "artificial" && (desc.includes("artificial") || desc.includes("turf"))) return true;
  if (lower === "natural" && (desc.includes("natural") || desc.includes("grass"))) return true;
  if (lower === "hard" && (desc.includes("hard") || desc.includes("court"))) return true;
  return desc.includes(lower);
}

function getFieldSizeLabel(field: Property): string {
  const w = field.fieldSize?.width;
  const l = field.fieldSize?.length;
  if (w != null && l != null) return `${w}×${l}m`;
  return "—";
}

export default function FieldReservationPage() {
  const [region, setRegion] = useState("all");
  const [selectedDate, setSelectedDate] = useState(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [time, setTime] = useState("");
  const [fieldSize, setFieldSize] = useState("");
  const [indoorOutdoor, setIndoorOutdoor] = useState("");
  const [floorType, setFloorType] = useState("");

  const [properties, setProperties] = useState<Property[]>([]);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(true);

  const [galleryOpen, setGalleryOpen] = useState(false);
  const [galleryImages, setGalleryImages] = useState<string[]>([]);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const galleryScrollRef = React.useRef<HTMLDivElement | null>(null);

  const [calendarAnchor, setCalendarAnchor] = useState<HTMLElement | null>(null);
  const [calendarMonth, setCalendarMonth] = useState(() => new Date());

  useEffect(() => {
    fetchData();
  }, [region, indoorOutdoor, selectedDate]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const dateStr = getDateIso(selectedDate);
      const [propsData, matchesData] = await Promise.all([
        getProperties({
          status: "ACTIVE",
          limit: 100,
          ...(region !== "all" && { city: region.toUpperCase() }),
          ...(indoorOutdoor && { type: indoorOutdoor.toUpperCase() }),
        } as any),
        getMatches({
          status: "UPCOMING",
          limit: 100,
          ...(region !== "all" && { city: region.toUpperCase() }),
          date: dateStr,
        }),
      ]);
      setProperties(propsData);
      setMatches(matchesData);
    } catch (error) {
      console.error("Failed to fetch rental data:", error);
    } finally {
      setLoading(false);
    }
  };

  const propertyIds = useMemo(() => new Set(properties.map((p) => p.id)), [properties]);

  const groupedVenues = useMemo(() => {
    const byName: Record<
      string,
      { venueName: string; location: string; amenities: string[]; fields: Property[]; matches: Match[] }
    > = {};
    properties.forEach((prop) => {
      if (!byName[prop.propertyName]) {
        byName[prop.propertyName] = {
          venueName: prop.propertyName,
          location: prop.location?.city || "",
          amenities: [],
          fields: [],
          matches: [],
        };
      }
      byName[prop.propertyName].fields.push(prop);
      byName[prop.propertyName].amenities = [...new Set([...(byName[prop.propertyName].amenities || []), ...(prop.amenities || [])])];
    });
    matches.forEach((m) => {
      const fieldId = typeof m.fieldId === "string" ? m.fieldId : (m.fieldId as any)?._id;
      if (!fieldId || !propertyIds.has(fieldId)) return;
      const prop = properties.find((p) => p.id === fieldId);
      if (!prop || !byName[prop.propertyName]) return;
      byName[prop.propertyName].matches.push(m);
    });
    return byName;
  }, [properties, matches, propertyIds]);

  // Standalone matches: no fieldId or field not in our list — show at top as "Agent-created matches"
  const standaloneMatches = useMemo(() => {
    return matches.filter((m) => {
      const fieldId = typeof m.fieldId === "string" ? m.fieldId : (m.fieldId as any)?._id;
      if (fieldId && propertyIds.has(fieldId)) return false; // already under a venue
      const d = new Date(m.matchDate);
      if (!sameCalendarDay(d, selectedDate)) return false;
      if (time && m.matchTime !== time) return false;
      return true;
    });
  }, [matches, propertyIds, selectedDate, time]);

  const filteredVenues = useMemo(() => {
    return Object.values(groupedVenues)
      .map((venue) => {
        const fieldsFiltered = venue.fields.filter((field: Property) => {
          if (floorType && !matchesFloorType(floorType, field)) return false;
          const width = field.fieldSize?.width ?? 0;
          const length = field.fieldSize?.length ?? 0;
          const sizeMatch = width || length;
          if (fieldSize === "small" && sizeMatch >= 30) return false;
          if (fieldSize === "medium" && (sizeMatch < 30 || sizeMatch >= 45)) return false;
          if (fieldSize === "large" && sizeMatch < 45) return false;
          return true;
        });
        const matchesFiltered = venue.matches.filter((m) => {
          const d = new Date(m.matchDate);
          if (!sameCalendarDay(d, selectedDate)) return false;
          if (time && m.matchTime !== time) return false;
          return true;
        });
        return { ...venue, fields: fieldsFiltered, matches: matchesFiltered };
      })
      .filter((v) => v.fields.length > 0 || v.matches.length > 0);
  }, [groupedVenues, selectedDate, time, fieldSize, floorType]);

  const openGallery = (images: string[], index = 0) => {
    const max = 5;
    const list = (images.length ? images : ["/images/placeholder-field.jpg"]).slice(0, max);
    setGalleryImages(list);
    setGalleryIndex(Math.min(index, list.length - 1));
    setGalleryOpen(true);
  };

  useEffect(() => {
    if (!galleryOpen || !galleryScrollRef.current) return;
    const el = galleryScrollRef.current;
    el.scrollTo({ left: galleryIndex * el.clientWidth, behavior: "smooth" });
  }, [galleryOpen, galleryIndex]);

  return (
    <>
      <Head>
        <title>Field Reservation - KickUp</title>
        <meta
          name="description"
          content="Reserve football and futsal fields on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box className={styles.rentalPage}>
        {/* Filters — no icons, calendar for date (PLAB-like) */}
        <Container maxWidth="lg">
          <Box className={styles.filtersSection}>
            <FormControl className={styles.filterControl}>
              <Select
                value={region}
                onChange={(e) => setRegion(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">My Region</MenuItem>
                <MenuItem value="seoul">Seoul</MenuItem>
                <MenuItem value="goyang">Goyang</MenuItem>
                <MenuItem value="guri">Guri</MenuItem>
                <MenuItem value="gimpo">Gimpo</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={`${styles.filterControl} ${styles.filterControlDate}`}>
              <Button
                variant="outlined"
                className={styles.filterSelect}
                onClick={(e) => {
                  setCalendarMonth(new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1));
                  setCalendarAnchor(e.currentTarget);
                }}
                sx={{
                  minHeight: 44,
                  justifyContent: "space-between",
                  textTransform: "none",
                  borderColor: "var(--rental-border)",
                  color: "var(--rental-text)",
                  "&:hover": { borderColor: "#9ca3af", bgcolor: "rgba(0,0,0,0.02)" },
                }}
              >
                {formatDateLabel(selectedDate)}
              </Button>
            </FormControl>

            <Popover
              open={!!calendarAnchor}
              anchorEl={calendarAnchor}
              onClose={() => setCalendarAnchor(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "left" }}
              transformOrigin={{ vertical: "top", horizontal: "left" }}
              PaperProps={{ sx: { borderRadius: 2, mt: 1.5, overflow: "hidden" } }}
            >
              <Box sx={{ p: 2, minWidth: 280 }}>
                <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600}>
                    {calendarMonth.toLocaleString("en-US", { month: "long", year: "numeric" })}
                  </Typography>
                  <Box>
                    <Button size="small" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1))}>Prev</Button>
                    <Button size="small" onClick={() => setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1))}>Next</Button>
                  </Box>
                </Box>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 0.5, textAlign: "center" }}>
                  {WEEKDAYS.map((w) => (
                    <Typography key={w} variant="caption" color="text.secondary" sx={{ py: 0.5 }}>
                      {w}
                    </Typography>
                  ))}
                  {getDaysInMonth(calendarMonth.getFullYear(), calendarMonth.getMonth()).map((day, i) => {
                    const isEmpty = !day.getTime();
                    const isSelected = !isEmpty && sameCalendarDay(day, selectedDate);
                    const isToday = !isEmpty && sameCalendarDay(day, new Date());
                    return (
                      <Button
                        key={i}
                        size="small"
                        disabled={isEmpty}
                        onClick={() => {
                          if (!isEmpty) {
                            setSelectedDate(day);
                            setCalendarAnchor(null);
                          }
                        }}
                        sx={{
                          minWidth: 36,
                          minHeight: 36,
                          p: 0,
                          borderRadius: 1,
                          color: isEmpty ? "transparent" : isSelected ? "white" : "text.primary",
                          bgcolor: isSelected ? "var(--rental-primary)" : isToday ? "action.hover" : "transparent",
                          "&:hover": { bgcolor: isEmpty ? "transparent" : isSelected ? "var(--rental-primary-hover)" : "action.selected" },
                        }}
                      >
                        {isEmpty ? "" : day.getDate()}
                      </Button>
                    );
                  })}
                </Box>
              </Box>
            </Popover>

            <FormControl className={styles.filterControl}>
              <Select
                value={time}
                onChange={(e) => setTime(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Time</MenuItem>
                {TIME_SLOTS.map((t) => (
                  <MenuItem key={t} value={t}>{t}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={fieldSize}
                onChange={(e) => setFieldSize(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Field Size</MenuItem>
                <MenuItem value="small">Small (18×8m)</MenuItem>
                <MenuItem value="medium">Medium (30–40×17–20m)</MenuItem>
                <MenuItem value="large">Large (45×60m)</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={indoorOutdoor}
                onChange={(e) => setIndoorOutdoor(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Indoor/Outdoor</MenuItem>
                <MenuItem value="indoor">Indoor</MenuItem>
                <MenuItem value="outdoor">Outdoor</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterControl}>
              <Select
                value={floorType}
                onChange={(e) => setFloorType(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="">Floor Type</MenuItem>
                <MenuItem value="artificial">Artificial Turf</MenuItem>
                <MenuItem value="natural">Natural Grass</MenuItem>
                <MenuItem value="hard">Hard Court</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>

        {/* Fields List */}
        <Container maxWidth="lg">
          <Box className={styles.fieldsList}>
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress />
              </Box>
            ) : standaloneMatches.length === 0 && filteredVenues.length === 0 ? (
              <Card className={styles.noResultsCard}>
                <CardContent className={styles.noResultsContent}>
                  <Typography variant="h6" className={styles.noResultsTitle}>
                    No matches or fields found
                  </Typography>
                  <Typography variant="body2" className={styles.noResultsText}>
                    Try adjusting your filters or date to see more results.
                  </Typography>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setRegion("all");
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      setSelectedDate(today);
                      setTime("");
                      setFieldSize("");
                      setIndoorOutdoor("");
                      setFloorType("");
                    }}
                    className={styles.resetFiltersButton}
                  >
                    Reset Filters
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                {/* Agent-created matches (all upcoming matches for selected date, including without stadium) */}
                {standaloneMatches.length > 0 && (
                  <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                      Agent-created matches
                    </Typography>
                    <Box className={styles.fieldsContainer} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                      {standaloneMatches.map((m) => {
                        const field = getFieldData(m);
                        const images = (m as any).images?.length ? (m as any).images : (m.matchImage ? [m.matchImage] : field?.images || []);
                        const isFull = (m.currentPlayers ?? 0) >= (m.maxPlayers ?? 0);
                        return (
                          <Card key={`standalone-${m._id}`} className={styles.fieldCard}>
                            <CardContent className={styles.fieldCardContent}>
                              <Box className={styles.rowContent}>
                                <Link href={`/match/${m._id}`} className={styles.fieldCardLink} style={{ flex: 1 }}>
                                  <Box className={styles.fieldHeader}>
                                    <Box className={styles.fieldInfo}>
                                      <Typography variant="subtitle1" className={styles.fieldName}>
                                        {m.matchTitle}
                                      </Typography>
                                      <Typography variant="body2" className={styles.fieldDetails}>
                                        {m.maxPlayers ? `${m.maxPlayers}vs${m.maxPlayers}` : "—"} · {m.location?.city || field?.location?.city || m.location?.address || "—"} · {m.matchTime}
                                      </Typography>
                                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                        <Chip
                                          size="small"
                                          label={isFull ? "Reservation closed" : "Open"}
                                          sx={{
                                            bgcolor: isFull ? "#fee2e2" : "#d1fae5",
                                            color: isFull ? "#991b1b" : "#065f46",
                                            fontWeight: 600,
                                          }}
                                        />
                                      </Box>
                                    </Box>
                                  </Box>
                                </Link>
                                {images[0] && (
                                  <Box className={styles.thumbnailWrap} onClick={() => openGallery(images)} role="button" tabIndex={0} onKeyDown={(e) => e.key === "Enter" && openGallery(images)}>
                                    <Box className={styles.fieldImagePlaceholder} sx={{ backgroundImage: `url(${images[0]})`, backgroundSize: "cover", cursor: "pointer" }} />
                                    <Typography variant="caption" className={styles.viewAllHint}>View All</Typography>
                                  </Box>
                                )}
                              </Box>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </Box>
                  </Box>
                )}

                {/* Stadiums & fields */}
                {filteredVenues.length > 0 && (
                  <Typography variant="h6" fontWeight={700} sx={{ mb: 2 }}>
                    Stadiums & fields
                  </Typography>
                )}
                {filteredVenues.map((venue) => (
                  <Card key={venue.venueName} className={styles.venueCard}>
                    <CardContent className={styles.venueCardContent}>
                      <Box className={styles.venueHeader}>
                        <Typography variant="h6" className={styles.venueName}>
                          {venue.venueName}
                        </Typography>
                        <Box className={styles.amenities}>
                          {venue.amenities.map((amenity: string, idx: number) => (
                            <Typography key={idx} variant="body2" className={styles.amenity}>
                              {amenity}
                              {idx < venue.amenities.length - 1 && " · "}
                            </Typography>
                          ))}
                        </Box>
                      </Box>

                      <Box className={styles.fieldsContainer}>
                        {/* Agent-created matches at this venue */}
                        {venue.matches.map((m) => {
                          const field = getFieldData(m);
                          const images = (m as any).images?.length ? (m as any).images : (m.matchImage ? [m.matchImage] : field?.images || []);
                          const isFull = (m.currentPlayers ?? 0) >= (m.maxPlayers ?? 0);
                          return (
                            <Card key={`match-${m._id}`} className={styles.fieldCard}>
                              <CardContent className={styles.fieldCardContent}>
                                <Box className={styles.rowContent}>
                                  <Link href={`/match/${m._id}`} className={styles.fieldCardLink} style={{ flex: 1 }}>
                                    <Box className={styles.fieldHeader}>
                                      <Box className={styles.fieldInfo}>
                                        <Typography variant="subtitle1" className={styles.fieldName}>
                                          {m.matchTitle}
                                        </Typography>
                                        <Typography variant="body2" className={styles.fieldDetails}>
                                          {m.maxPlayers ? `${m.maxPlayers}vs${m.maxPlayers}` : "—"} · {field?.location?.city || m.location?.city || ""} · Artificial Turf
                                        </Typography>
                                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                                          <Chip
                                            size="small"
                                            label={isFull ? "Reservation closed" : "Open"}
                                            sx={{
                                              bgcolor: isFull ? "#fee2e2" : "#d1fae5",
                                              color: isFull ? "#991b1b" : "#065f46",
                                              fontWeight: 600,
                                            }}
                                          />
                                          <Typography variant="body2" color="text.secondary">
                                            {m.matchTime}
                                          </Typography>
                                        </Box>
                                      </Box>
                                    </Box>
                                  </Link>
                                  <Box
                                    className={styles.thumbnailWrap}
                                    onClick={() => openGallery(images)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && openGallery(images)}
                                  >
                                    {images[0] ? (
                                      <Box
                                        className={styles.fieldImagePlaceholder}
                                        sx={{ backgroundImage: `url(${images[0]})`, backgroundSize: "cover", cursor: "pointer" }}
                                      />
                                    ) : (
                                      <Box className={styles.fieldImagePlaceholder} />
                                    )}
                                    <Typography variant="caption" className={styles.viewAllHint}>View All</Typography>
                                  </Box>
                                </Box>
                                <Box className={styles.timeSlots}>
                                  {TIME_SLOTS.map((t) => (
                                    <Box key={t} className={`${styles.timeSlot} ${t === m.matchTime ? styles.timeSlotAvailable : styles.timeSlotUnavailable}`}>
                                      {t}
                                    </Box>
                                  ))}
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })}
                        {/* Bookable fields at this venue */}
                        {venue.fields.map((field: Property) => {
                          const images = field.images || [];
                          return (
                            <Card key={field.id} className={styles.fieldCard}>
                              <CardContent className={styles.fieldCardContent}>
                                <Box className={styles.rowContent}>
                                  <Link href={`/rental/${field.id}`} className={styles.fieldCardLink} style={{ flex: 1 }}>
                                    <Box className={styles.fieldHeader}>
                                      <Box className={styles.fieldInfo}>
                                        <Typography variant="subtitle1" className={styles.fieldName}>
                                          {field.propertyType} Field
                                        </Typography>
                                        <Typography variant="body2" className={styles.fieldDetails}>
                                          {getFieldSizeLabel(field)} · {field.propertyType} · {field.propertyDescription?.split(" ").slice(0, 2).join(" ") || "Artificial Turf"}
                                        </Typography>
                                        <Typography variant="body1" className={styles.fieldPrice}>
                                          ₩{(field.hourlyRate ?? 0).toLocaleString()}/hour
                                        </Typography>
                                      </Box>
                                    </Box>
                                  </Link>
                                  <Box
                                    className={styles.thumbnailWrap}
                                    onClick={() => openGallery(images)}
                                    role="button"
                                    tabIndex={0}
                                    onKeyDown={(e) => e.key === "Enter" && openGallery(images)}
                                  >
                                    {images[0] ? (
                                      <Box
                                        className={styles.fieldImagePlaceholder}
                                        sx={{ backgroundImage: `url(${images[0]})`, backgroundSize: "cover", cursor: "pointer" }}
                                      />
                                    ) : (
                                      <Box className={styles.fieldImagePlaceholder} />
                                    )}
                                    <Typography variant="caption" className={styles.viewAllHint}>View All</Typography>
                                  </Box>
                                </Box>
                                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 1 }}>
                                  Select time to reserve
                                </Typography>
                                <Box className={styles.timeSlots}>
                                  {TIME_SLOTS.map((slotTime) => (
                                    <Link key={slotTime} href={`/rental/${field.id}?date=${getDateIso(selectedDate)}&time=${slotTime}`} className={styles.timeSlotLink}>
                                      <Box className={`${styles.timeSlot} ${styles.timeSlotAvailable}`}>{slotTime}</Box>
                                    </Link>
                                  ))}
                                </Box>
                                <Box className={styles.availabilityStatus}>
                                  <Box className={styles.statusItem}>
                                    <CheckCircleIcon className={styles.statusIconAvailable} />
                                    <Typography variant="body2" className={styles.statusText}>Available</Typography>
                                  </Box>
                                  <Box className={styles.statusItem}>
                                    <CancelIcon className={styles.statusIconUnavailable} />
                                    <Typography variant="body2" className={styles.statusText}>Unavailable</Typography>
                                  </Box>
                                </Box>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </Box>
                    </CardContent>
                  </Card>
                ))}

                <Card className={styles.nonPartneredCard} component={Link} href="/rental/non-partnered">
                  <CardContent className={styles.nonPartneredContent}>
                    <Typography variant="h6" className={styles.nonPartneredTitle}>
                      Non-Partnered Fields
                    </Typography>
                    <Typography variant="body2" className={styles.nonPartneredSubtitle}>
                      Check availability directly with the venue.
                    </Typography>
                  </CardContent>
                </Card>
              </>
            )}
          </Box>
        </Container>
      </Box>

      {/* View All — up to 5 images, scroll / carousel */}
      <Dialog
        open={galleryOpen}
        onClose={() => setGalleryOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{ sx: { borderRadius: 2, overflow: "hidden" } }}
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: 1, borderColor: "divider" }}>
          <Typography variant="h6" fontWeight={600}>View All</Typography>
          <IconButton onClick={() => setGalleryOpen(false)} size="small" aria-label="Close">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ p: 0, display: "flex", flexDirection: "column" }}>
          <Box sx={{ position: "relative", width: "100%", minHeight: 360, bgcolor: "grey.200", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Box
              ref={galleryScrollRef}
              className={styles.galleryScroll}
              sx={{
                display: "flex",
                overflowX: "auto",
                overflowY: "hidden",
                scrollSnapType: "x mandatory",
                width: "100%",
                "& > *": { scrollSnapAlign: "start", flex: "0 0 100%" },
              }}
              onScroll={(e) => {
                const el = e.currentTarget;
                const idx = Math.round(el.scrollLeft / el.clientWidth);
                if (idx >= 0 && idx < galleryImages.length && idx !== galleryIndex) setGalleryIndex(idx);
              }}
            >
              {galleryImages.map((src, i) => (
                <Box key={i} sx={{ width: "100%", display: "flex", justifyContent: "center", p: 1 }}>
                  <img
                    src={src}
                    alt={`Venue ${i + 1}`}
                    style={{ maxWidth: "100%", height: "auto", maxHeight: "70vh", objectFit: "contain" }}
                  />
                </Box>
              ))}
            </Box>
            {galleryImages.length > 1 && (
              <>
                <Button
                  size="small"
                  onClick={() => setGalleryIndex((prev) => (prev <= 0 ? galleryImages.length - 1 : prev - 1))}
                  sx={{
                    position: "absolute",
                    left: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    minWidth: 40,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                  }}
                >
                  Prev
                </Button>
                <Button
                  size="small"
                  onClick={() => setGalleryIndex((prev) => (prev >= galleryImages.length - 1 ? 0 : prev + 1))}
                  sx={{
                    position: "absolute",
                    right: 8,
                    top: "50%",
                    transform: "translateY(-50%)",
                    minWidth: 40,
                    bgcolor: "rgba(0,0,0,0.5)",
                    color: "white",
                    "&:hover": { bgcolor: "rgba(0,0,0,0.7)" },
                  }}
                >
                  Next
                </Button>
              </>
            )}
          </Box>
          {galleryImages.length > 1 && (
            <Box
              className={styles.galleryThumbStrip}
              sx={{
                display: "flex",
                gap: 0.5,
                p: 1.5,
                overflowX: "auto",
                width: "100%",
                justifyContent: "flex-start",
                borderTop: 1,
                borderColor: "divider",
              }}
            >
              {galleryImages.map((src, i) => (
                <Box
                  key={i}
                  onClick={() => setGalleryIndex(i)}
                  sx={{
                    width: 80,
                    height: 56,
                    flexShrink: 0,
                    borderRadius: 1,
                    overflow: "hidden",
                    cursor: "pointer",
                    border: galleryIndex === i ? 2 : 1,
                    borderColor: galleryIndex === i ? "primary.main" : "divider",
                  }}
                >
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              ))}
            </Box>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

