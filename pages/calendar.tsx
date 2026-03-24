import Head from "next/head";
import Link from "next/link";
import React, { useState, useMemo, useEffect } from "react";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  IconButton,
  Grid,
} from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import StarIcon from "@mui/icons-material/Star";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "@/styles/home.module.scss";
import MatchFilters, { FilterOptions, defaultFilters } from "@/components/MatchFilters";
import { getMatches, Match, getFieldData } from "@/lib/matchApi";
import { getSkillLevelLabel } from "@/lib/skillLevels";

export default function CalendarPage() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [filters, setFilters] = useState<FilterOptions>(defaultFilters);
  const [matches, setMatches] = useState<Match[]>([]);
  const [loading, setLoading] = useState(false);

  // Fetch all matches for the view (simplification: fetch all for now or optimize by month later)
  useEffect(() => {
    const fetchMatches = async () => {
      setLoading(true);
      try {
        const data = await getMatches(); // Fetches all mock/real matches
        setMatches(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchMatches();
  }, [currentMonth]); // In real app, pass month range to getMatches

  // Generate calendar grid for current month
  const calendarGrid = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();

    // First day of month
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);

    // Get first day of week (0 = Sunday, 6 = Saturday)
    const firstDayOfWeek = firstDay.getDay();

    // Get number of days in month
    const daysInMonth = lastDay.getDate();

    // Create grid array
    const grid: (Date | null)[] = [];

    // Add empty cells for days before month starts
    for (let i = 0; i < firstDayOfWeek; i++) {
      grid.push(null);
    }

    // Add days of month
    for (let day = 1; day <= daysInMonth; day++) {
      grid.push(new Date(year, month, day));
    }

    return grid;
  }, [currentMonth]);

  // Get matches for selected date with filters
  const selectedDateMatches = useMemo(() => {
    if (!selectedDate) return [];

    let filtered = matches.filter((match) => {
      if (!match.matchDate) return false;
      const matchDate = new Date(match.matchDate);
      if (isNaN(matchDate.getTime())) return false;
      return (
        matchDate.getDate() === selectedDate.getDate() &&
        matchDate.getMonth() === selectedDate.getMonth() &&
        matchDate.getFullYear() === selectedDate.getFullYear()
      );
    });

    // Apply filters
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filtered = filtered.filter((m) => {
        const field = getFieldData(m);
        return (
          m.matchTitle.toLowerCase().includes(query) ||
          m.location?.city?.toLowerCase().includes(query) ||
          field?.propertyName?.toLowerCase().includes(query)
        );
      });
    }

    if (filters.location !== "all") {
      filtered = filtered.filter((m) => m.location?.city === filters.location);
    }

    return filtered;
  }, [selectedDate, matches, filters]);

  // Get matches count for a specific date
  const getMatchesCount = (date: Date | null): number => {
    if (!date) return 0;
    return matches.filter((match) => {
      if (!match.matchDate) return false;
      const matchDate = new Date(match.matchDate);
      if (isNaN(matchDate.getTime())) return false;
      return (
        matchDate.getDate() === date.getDate() &&
        matchDate.getMonth() === date.getMonth() &&
        matchDate.getFullYear() === date.getFullYear()
      );
    }).length;
  };

  // Check if date is today
  const isToday = (date: Date | null): boolean => {
    if (!date) return false;
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  // Check if date is selected
  const isSelected = (date: Date | null): boolean => {
    if (!date) return false;
    return (
      date.getDate() === selectedDate.getDate() &&
      date.getMonth() === selectedDate.getMonth() &&
      date.getFullYear() === selectedDate.getFullYear()
    );
  };

  // Navigate to previous month
  const goToPreviousMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() - 1);
      return newDate;
    });
  };

  // Navigate to next month
  const goToNextMonth = () => {
    setCurrentMonth((prev) => {
      const newDate = new Date(prev);
      newDate.setMonth(prev.getMonth() + 1);
      return newDate;
    });
  };

  // Get month name
  const getMonthName = (date: Date): string => {
    return date.toLocaleString("en-US", { month: "long", year: "numeric" });
  };

  // Format date for display
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString("en-US", {
      weekday: "long",
      month: "long",
      day: "numeric",
    });
  };

  return (
    <>
      <Head>
        <title>Calendar - KickUp</title>
        <meta
          name="description"
          content="View matches and events on the calendar."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

      <Box className={styles.homePage}>
        {/* Filters */}
        <Container maxWidth="xl" sx={{ mb: 3 }}>
          <MatchFilters
            filters={filters}
            onFiltersChange={setFilters}
            onReset={() => setFilters(defaultFilters)}
          />
        </Container>
        <Container maxWidth="xl" sx={{ py: 4 }}>
          <Grid container spacing={3}>
            {/* Left Panel - Calendar Grid */}
            <Grid item xs={12} md={4}>
              <Card sx={{ mb: 2 }}>
                <CardContent>
                  {/* Month Navigation */}
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                      mb: 2,
                    }}
                  >
                    <IconButton onClick={goToPreviousMonth} size="small">
                      <ChevronLeftIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {getMonthName(currentMonth)}
                    </Typography>
                    <IconButton onClick={goToNextMonth} size="small">
                      <ChevronRightIcon />
                    </IconButton>
                  </Box>

                  {/* Day Headers */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 0.5,
                      mb: 1,
                    }}
                  >
                    {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                      (day, idx) => (
                        <Typography
                          key={idx}
                          variant="caption"
                          sx={{
                            textAlign: "center",
                            fontWeight: 500,
                            color: "text.secondary",
                            fontSize: "0.7rem",
                          }}
                        >
                          {day}
                        </Typography>
                      )
                    )}
                  </Box>

                  {/* Calendar Grid */}
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "repeat(7, 1fr)",
                      gap: 0.5,
                    }}
                  >
                    {calendarGrid.map((date, index) => {
                      if (!date) {
                        return <Box key={index} sx={{ aspectRatio: "1" }} />;
                      }

                      const matchesCount = getMatchesCount(date);
                      const isTodayDate = isToday(date);
                      const isSelectedDate = isSelected(date);

                      return (
                        <Box
                          key={index}
                          onClick={() => setSelectedDate(date)}
                          sx={{
                            aspectRatio: "1",
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            borderRadius: 1,
                            position: "relative",
                            backgroundColor: isSelectedDate
                              ? "primary.main"
                              : isTodayDate
                                ? "primary.light"
                                : "transparent",
                            color: isSelectedDate ? "white" : "text.primary",
                            transition: "all 0.2s",
                            "&:hover": {
                              backgroundColor: isSelectedDate
                                ? "primary.dark"
                                : "action.hover",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              fontWeight: isTodayDate || isSelectedDate ? 700 : 500,
                              fontSize: isTodayDate || isSelectedDate ? "1rem" : "0.875rem",
                            }}
                          >
                            {date.getDate()}
                          </Typography>
                          {matchesCount > 0 && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.65rem",
                                mt: 0.25,
                                color: isSelectedDate ? "white" : "text.secondary",
                              }}
                            >
                              {matchesCount}
                            </Typography>
                          )}
                          {isTodayDate && (
                            <Typography
                              variant="caption"
                              sx={{
                                fontSize: "0.6rem",
                                fontWeight: 700,
                                mt: 0.25,
                                color: isSelectedDate ? "white" : "primary.main",
                              }}
                            >
                              TODAY
                            </Typography>
                          )}
                        </Box>
                      );
                    })}
                  </Box>
                </CardContent>
              </Card>
            </Grid>

            {/* Right Panel - Recommended Matches */}
            <Grid item xs={12} md={8}>
              <Typography
                variant="h5"
                sx={{ mb: 2, fontWeight: 600 }}
              >
                Matches for {formatDate(selectedDate)}
              </Typography>

              {loading ? (
                <Box sx={{ p: 4, textAlign: 'center' }}>Loading...</Box>
              ) : selectedDateMatches.length === 0 ? (
                <Card>
                  <CardContent>
                    <Box
                      sx={{
                        textAlign: "center",
                        py: 4,
                        color: "text.secondary",
                      }}
                    >
                      <Typography variant="h6" sx={{ mb: 1 }}>
                        No matches scheduled
                      </Typography>
                      <Typography variant="body2">
                        There are no matches scheduled for this date.
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              ) : (
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  {selectedDateMatches.map((match) => {
                    const field = getFieldData(match);
                    return (
                      <Card
                        key={match._id}
                        component={Link}
                        href={`/match/${match._id}`}
                        sx={{
                          textDecoration: "none",
                          transition: "transform 0.2s, box-shadow 0.2s",
                          "&:hover": {
                            transform: "translateY(-2px)",
                            boxShadow: 3,
                          },
                        }}
                      >
                        <CardContent>
                          <Box
                            sx={{
                              display: "flex",
                              alignItems: "flex-start",
                              justifyContent: "space-between",
                              gap: 2,
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Typography
                                variant="h6"
                                component="div"
                                sx={{ mb: 1, fontWeight: 600 }}
                              >
                                {match.matchTitle}
                              </Typography>
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  gap: 1,
                                  mb: 1,
                                  flexWrap: "wrap",
                                }}
                              >
                                <Typography variant="body2" sx={{ color: "text.secondary", fontWeight: 500 }}>
                                  {match.matchTime}
                                </Typography>
                                {match.skillLevel && (
                                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    · {getSkillLevelLabel(match.skillLevel)}
                                  </Typography>
                                )}
                                {match.location?.city && (
                                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    · {match.location.city}
                                  </Typography>
                                )}
                                {field && (
                                  <Typography variant="body2" sx={{ color: "text.secondary" }}>
                                    · {field.propertyName}
                                  </Typography>
                                )}
                              </Box>
                            </Box>
                            <IconButton
                              size="small"
                              sx={{
                                color: "text.secondary",
                                "&:hover": { color: "error.main" },
                              }}
                            >
                              <FavoriteBorderIcon />
                            </IconButton>
                          </Box>
                        </CardContent>
                      </Card>
                    );
                  })}
                </Box>
              )}
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  );
}
