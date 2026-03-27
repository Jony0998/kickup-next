import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  CardMedia,
  Avatar,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WcIcon from "@mui/icons-material/Wc";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HomeIcon from "@mui/icons-material/Home";
import GroupIcon from "@mui/icons-material/Group";
import BoltIcon from "@mui/icons-material/Bolt";
import CheckroomIcon from "@mui/icons-material/Checkroom";
import WbSunnyIcon from "@mui/icons-material/WbSunny";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import WarningIcon from "@mui/icons-material/Warning";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "@/styles/home.module.scss";
import MatchFilters, { FilterOptions, defaultFilters } from "@/components/MatchFilters";
import { getBanners, Banner } from "@/lib/bannerApi";
import { getMatches, Match } from "@/lib/matchApi";
import { useAuth } from "@/contexts/AuthContext";
import MatchCard from "@/components/MatchCard";
import SeoHead from "@/components/SeoHead";
import Image from "next/image";
import { useSearch } from "@/contexts/SearchContext";
import { useDebounce } from "@/hooks/useDebounce";

export default function Home() {
  const router = useRouter();
  const { isAdmin, isAgent } = useAuth();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(-1); // -1 = no date filter (show all)
  const [mounted, setMounted] = useState(false);
  const [dates, setDates] = useState<Date[]>([]);
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loadingMatches, setLoadingMatches] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const { searchQuery, setSearchMatches } = useSearch();
  const debouncedSearch = useDebounce(searchQuery, 150);

  // Sync category with URL
  useEffect(() => {
    const { cat } = router.query;
    if (cat && typeof cat === "string") {
      setActiveCategory(cat);
    } else {
      setActiveCategory("all");
    }
  }, [router.query]);

  // Fetch banners
  useEffect(() => {
    let cancelled = false;
    const fetchBanners = async () => {
      try {
        const data = await getBanners();
        if (!cancelled) setBanners(data);
      } catch (error) {
        console.error("Failed to load banners", error);
      }
    };
    fetchBanners();
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-slide banners
  useEffect(() => {
    if (banners.length <= 1) return;
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [banners.length]);

  // Handle query parameters from URL (e.g. from All Menu or deep links)
  useEffect(() => {
    const { gender, level, fieldType, sport, format, earlyBird, tShirt, time } = router.query;

    if (gender || level || fieldType || sport || format || earlyBird || tShirt || time) {
      const newFilters = { ...defaultFilters };

      if (gender === "women") newFilters.gender = "Women Only";
      if (gender === "mixed") newFilters.gender = "All Genders";
      if (level === "starter") newFilters.level = "STARTER";
      if (level === "rookie") newFilters.level = "ROOKIE";
      if (level === "amateur") newFilters.level = "AMATEUR";
      if (level === "semi_pro") newFilters.level = "SEMI_PRO";
      if (level === "pro") newFilters.level = "PRO";
      if (level === "elite") newFilters.level = "ELITE";
      if (fieldType === "indoor") newFilters.fieldType = "Indoor";
      if (fieldType === "outdoor") newFilters.fieldType = "Outdoor";
      if (time === "morning") newFilters.timeRange = "morning";
      // All Menu: format=4vs4 etc. -> teamSize filter
      if (format === "4vs4") newFilters.teamSize = "4vs4";
      else if (format === "5vs5") newFilters.teamSize = "5vs5";
      else if (format === "6vs6") newFilters.teamSize = "6vs6";
      else if (format === "7vs7") newFilters.teamSize = "7vs7";

      setFilters(newFilters);
    }
  }, [router.query]);

  // Store additional filter params
  const [additionalFilters, setAdditionalFilters] = useState<{
    sport?: string;
    format?: string;
    earlyBird?: boolean;
    tShirt?: boolean;
  }>({});

  useEffect(() => {
    const { sport, format, earlyBird, tShirt } = router.query;
    setAdditionalFilters({
      sport: sport as string,
      format: format as string,
      earlyBird: earlyBird === "true",
      tShirt: tShirt === "true",
    });
  }, [router.query]);

  // When landing from All Menu (or any URL with filter params), scroll to match list
  useEffect(() => {
    const q = router.query;
    const hasFilter = q.gender || q.level || q.fieldType || q.time || q.format || q.earlyBird || q.tShirt || q.sport;
    if (!hasFilter) return;
    const t = setTimeout(() => {
      document.getElementById("match-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 300);
    return () => clearTimeout(t);
  }, [router.query]);

  // Generate dates for calendar (14 days) — client-only to avoid hydration mismatch (timezone/locale)
  useEffect(() => {
    setMounted(true);
    const today = new Date();
    const next14 = Array.from({ length: 14 }, (_, i) => {
      const d = new Date(today);
      d.setDate(today.getDate() + i);
      return d;
    });
    setDates(next14);
  }, []);

  const getDayName = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const getShortDayName = (date: Date) => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days[date.getDay()];
  };

  // Fetch matches from API
  useEffect(() => {
    // Dates hali tayyor bo‘lmasa, birinchi renderda ortiqcha fetch qilmaymiz.
    if (!mounted) return;
    if (selectedDate >= 0 && !dates[selectedDate]) return;

    let cancelled = false;
    const fetchMatches = async () => {
      setLoadingMatches(true);
      try {
        const params: any = { status: 'UPCOMING' };

        // Only pass date filter if user has selected a specific date
        if (selectedDate >= 0 && dates[selectedDate]) {
          params.date = dates[selectedDate].toISOString().split('T')[0];
        }

        const data = await getMatches(params);
        if (!cancelled) {
          setMatches(data);
          setSearchMatches(data); // share with navbar autocomplete
        }
      } catch (error) {
        console.error("Failed to load matches", error);
      } finally {
        if (!cancelled) setLoadingMatches(false);
      }
    };

    fetchMatches();
    return () => {
      cancelled = true;
    };
  }, [selectedDate, dates, mounted, setSearchMatches]);

  // Client-side filtering — all filter chips (Date, Gender, Level, Size, Location) apply here
  const filteredMatches = useMemo(() => {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);
    const weekEnd = new Date(todayStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    return matches.filter((match) => {
      // Date filter (chip: Today / Tomorrow / This Week) — compare by calendar day (local)
      if (filters.dateRange !== "all") {
        const d = new Date(match.matchDate);
        const matchDay = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        if (filters.dateRange === "today") {
          if (matchDay !== todayStart.getTime()) return false;
        } else if (filters.dateRange === "tomorrow") {
          if (matchDay !== tomorrowStart.getTime()) return false;
        } else if (filters.dateRange === "week") {
          if (matchDay < todayStart.getTime() || matchDay >= weekEnd.getTime()) return false;
        }
      }

      // Calendar date strip — when user taps a date (24, 25, …) or "All"
      if (selectedDate >= 0 && dates[selectedDate]) {
        const d = new Date(match.matchDate);
        const matchDayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
        const targetDayStart = new Date(
          dates[selectedDate].getFullYear(),
          dates[selectedDate].getMonth(),
          dates[selectedDate].getDate()
        ).getTime();
        if (matchDayStart !== targetDayStart) return false;
      }

      // Filter by time range
      if (filters.timeRange !== "all") {
        const hour = parseInt(String(match.matchTime || "0").split(":")[0], 10);
        if (filters.timeRange === "morning" && hour >= 12) return false;
        if (filters.timeRange === "afternoon" && (hour < 12 || hour >= 18)) return false;
        if (filters.timeRange === "evening" && hour < 18) return false;
      }

      // Search (debounced)
      if (debouncedSearch) {
        const q = debouncedSearch.toLowerCase();
        const title = (match.matchTitle || "").toLowerCase();
        const city = (match.location?.city || "").toLowerCase();
        const fieldObj = typeof match.fieldId === "object" && match.fieldId !== null ? match.fieldId : null;
        const fieldName = ((fieldObj as any)?.propertyName || "").toLowerCase();
        const description = (match.matchDescription || "").toLowerCase();
        if (!title.includes(q) && !city.includes(q) && !fieldName.includes(q) && !description.includes(q)) return false;
      }

      // Location (chip) — match by city or address
      if (filters.location !== "all") {
        const city = (match.location?.city || "").trim();
        const address = (match.location?.address || "").toLowerCase();
        const locLower = filters.location.toLowerCase();
        if (city.toLowerCase() !== locLower && !address.includes(locLower)) return false;
      }

      // Filter by price
      const fee = match.matchFee || 0;
      if (fee < filters.priceRange[0] || fee > filters.priceRange[1]) return false;

      // Gender (chip) — Men Only / Women Only / Mixed
      if (filters.gender !== "all") {
        const g = (match.gender || "").toUpperCase();
        if (filters.gender === "Men Only" && g !== "MALE") return false;
        if (filters.gender === "Women Only" && g !== "FEMALE") return false;
        if (filters.gender === "All Genders" && g !== "MIXED" && g !== "") return false;
      }

      // Level (chip) — skill level (STARTER from All Menu = ROOKIE or STARTER)
      if (filters.level !== "all") {
        const matchLevel = (match.skillLevel || "").toUpperCase();
        if (filters.level === "STARTER") {
          if (matchLevel !== "ROOKIE" && matchLevel !== "STARTER") return false;
        } else if (matchLevel !== filters.level) return false;
      }

      // Category Filter (quick menu: social / beginner / team)
      if (activeCategory === "social") {
        if (match.matchType !== "FRIENDLY") return false;
      } else if (activeCategory === "beginner") {
        const level = (match.skillLevel || "").toUpperCase();
        if (level !== "STARTER" && level !== "ROOKIE" && level !== "AMATEUR") return false;
      } else if (activeCategory === "team") {
        if (match.matchType !== "TOURNAMENT" && match.matchType !== "LEAGUE") return false;
      }

      // Size (chip) — team size 4vs4, 5vs5, 6vs6, etc. (from All Menu format param)
      if (filters.teamSize && filters.teamSize !== "all") {
        const half = Math.ceil((match.maxPlayers || 0) / 2);
        const matchTeamSize = `${half}vs${half}`;
        if (matchTeamSize !== filters.teamSize) return false;
      }

      // All Menu: Early Bird — early morning matches (before 12:00)
      if (additionalFilters.earlyBird) {
        const hour = parseInt(String(match.matchTime || "0").split(":")[0], 10);
        if (hour >= 12) return false;
      }

      // All Menu: T-shirt — match title/description mentions t-shirt
      if (additionalFilters.tShirt) {
        const text = ((match.matchTitle || "") + " " + (match.matchDescription || "")).toLowerCase();
        if (!text.includes("t-shirt") && !text.includes("tshirt") && !text.includes("t shirt")) return false;
      }

      // All Menu: Sport (e.g. football) — matchType FRIENDLY or all if no sport field
      if (additionalFilters.sport && String(additionalFilters.sport).toLowerCase() === "football") {
        // We only have football/futsal; include all match types
      }

      return true;
    })
    // Sort by likes descending — popular matches at the top
    .sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
  }, [matches, filters, selectedDate, dates, activeCategory, debouncedSearch, additionalFilters]);


  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerImageClick = (bannerId: string) => {
    setImageIndices((prev) => {
      const currentIndex = prev[bannerId] || 0;
      const banner = banners.find((b) => b.id === bannerId);
      const nextIndex = banner ? (currentIndex + 1) % banner.images.length : 0;
      return {
        ...prev,
        [bannerId]: nextIndex,
      };
    });
  };

  return (
    <>
      <SeoHead
        description="KickUp - Futbol va futzal platformasi. O'zingizga mos match toping."
      />

      <Box className={styles.homePage}>
        {/* Banner/Carousel Section */}
        <Box className={styles.bannerSection}>
          <Box className={styles.bannerContainer}>
            <Box
              className={styles.bannerSlide}
              sx={{
                transform: `translateX(-${bannerIndex * 100}%)`,
              }}
            >
              {banners.map((banner) => (
                <Box key={banner.id} className={styles.bannerItem}>
                  {banner.videoUrl ? (
                    <video
                      autoPlay
                      muted
                      loop
                      playsInline
                      className={styles.bannerVideo}
                      poster={banner.images[0]}
                    >
                      <source src={banner.videoUrl} type="video/mp4" />
                    </video>
                  ) : (
                    <Box className={styles.bannerImage}>
                      <Image
                        src={banner.images[0]}
                        alt={banner.title}
                        fill
                        style={{ objectFit: 'cover' }}
                        priority={bannerIndex === 0}
                        sizes="(max-width: 768px) 100vw, 85vw"
                      />
                    </Box>
                  )}
                  <Box className={styles.bannerOverlay} />
                  <Box className={styles.bannerContent}>
                    <Typography className={styles.bannerTitle}>{banner.title}</Typography>
                    <Typography className={styles.bannerSubtitle}>{banner.subtitle}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
            <Box className={styles.bannerIndicators}>
              {bannerIndex + 1} / {banners.length}
            </Box>
          </Box>
        </Box>

        {/* Quick Menu — Matches/Beginner apply filter via URL and stay on home; Team/Menu navigate */}
        <Box className={styles.quickMenu}>
          <Box
            className={styles.quickMenuItem}
            onClick={() => {
              router.push("/");
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => {
                document.getElementById("match-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 120);
            }}
            sx={{ cursor: "pointer" }}
            role="link"
            aria-label="Show all matches"
          >
            <Box className={`${styles.quickMenuIconBox} ${activeCategory === "all" || activeCategory === "social" ? styles.active : ""}`}>
              <SportsSoccerIcon sx={{ fontSize: 24, color: "var(--plab-black)" }} />
            </Box>
            <Typography className={styles.quickMenuText}>Matches</Typography>
          </Box>
          <Box
            className={styles.quickMenuItem}
            onClick={() => {
              router.push({ pathname: "/", query: { cat: "beginner" } });
              window.scrollTo({ top: 0, behavior: "smooth" });
              setTimeout(() => {
                document.getElementById("match-list")?.scrollIntoView({ behavior: "smooth", block: "start" });
              }, 120);
            }}
            sx={{ cursor: "pointer" }}
            role="link"
            aria-label="Show beginner matches"
          >
            <Box className={`${styles.quickMenuIconBox} ${activeCategory === "beginner" ? styles.active : ""}`}>
              <LocalFloristIcon sx={{ fontSize: 24, color: "#00E377" }} />
            </Box>
            <Typography className={styles.quickMenuText}>Beginner</Typography>
          </Box>
          <Link href="/team" className={styles.quickMenuItem} scroll>
            <Box className={`${styles.quickMenuIconBox} ${activeCategory === "team" ? styles.active : ""}`}>
              <GroupIcon sx={{ fontSize: 24, color: "var(--plab-blue)" }} />
            </Box>
            <Typography className={styles.quickMenuText}>Team</Typography>
          </Link>
          <Link href="/menu" className={styles.quickMenuItem} scroll>
            <Box className={styles.quickMenuIconBox}>
              <MenuIcon sx={{ fontSize: 24, color: "var(--plab-gray)" }} />
            </Box>
            <Typography className={styles.quickMenuText}>Menu</Typography>
          </Link>
        </Box>

        {/* Filters (Clean) */}
        <Container maxWidth="lg" sx={{ mb: 2 }}>
          <MatchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => {
              setFilters(defaultFilters);
              setSelectedDate(-1);
            }}
            selectedDateValue={selectedDate >= 0 && dates[selectedDate] ? dates[selectedDate] : null}
            onDateSelect={(date) => {
              if (!date) {
                setSelectedDate(-1);
                return;
              }
              if (!dates.length) {
                setSelectedDate(-1);
                return;
              }
              const idx = dates.findIndex(
                (d) =>
                  d.getFullYear() === date.getFullYear() &&
                  d.getMonth() === date.getMonth() &&
                  d.getDate() === date.getDate()
              );
              setSelectedDate(idx >= 0 ? idx : -1);
            }}
          />
        </Container>

        {/* Sticky Date Slider */}
        <Box className={styles.dateSection}>
          <Box className={styles.dateSlider}>
            {/* "All" option to clear date filter */}
            <div
              className={`${styles.dateItem} ${selectedDate === -1 ? styles.active : ''}`}
              onClick={() => setSelectedDate(-1)}
            >
              <span className={styles.dateDay}>All</span>
              <span className={styles.dateNumber}>★</span>
            </div>
            {mounted &&
              dates.map((date, index) => {
                const isSelected = selectedDate === index;
                return (
                  <div
                    key={index}
                    className={`${styles.dateItem} ${isSelected ? styles.active : ''}`}
                    onClick={() => setSelectedDate(isSelected ? -1 : index)}
                  >
                    <span className={styles.dateDay}>{getShortDayName(date)}</span>
                    <span className={styles.dateNumber}>{date.getDate()}</span>
                  </div>
                );
              })}
          </Box>
        </Box>

        {/* Match List — scroll target when Matches/Beginner is clicked */}
        <Box id="match-list" className={styles.matchList}>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
            <div className={styles.sectionTitle}>
              <LocalOfferIcon fontSize="small" sx={{ color: 'var(--plab-green)' }} />
              {filteredMatches.length} Matches Found
            </div>
            {(isAdmin || isAgent) && (
              <Button
                variant="contained"
                size="small"
                onClick={() => router.push('/match/create')}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  bgcolor: 'var(--plab-green)',
                  '&:hover': { bgcolor: 'var(--plab-green-dark)' }
                }}
              >
                + Create Match
              </Button>
            )}
          </Box>

          {loadingMatches ? (
            <Box sx={{ p: 4, textAlign: 'center' }}>Loading matches...</Box>
          ) : filteredMatches.length === 0 ? (
            <Box sx={{ p: 4, textAlign: 'center', color: 'text.secondary' }}>
              <SportsSoccerIcon sx={{ fontSize: 48, opacity: 0.3, mb: 1 }} />
              <div>No matches found</div>
              <div style={{ fontSize: 12, marginTop: 4 }}>Try different filters or check back later</div>
            </Box>
          ) : (
            filteredMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))
          )}
        </Box>

      </Box >
    </>
  );
}
