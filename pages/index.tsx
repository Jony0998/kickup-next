import Head from "next/head";
import Link from "next/link";
import React from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FilterListIcon from "@mui/icons-material/FilterList";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WbTwilightIcon from "@mui/icons-material/WbTwilight";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import WcIcon from "@mui/icons-material/Wc";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import HomeIcon from "@mui/icons-material/Home";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import styles from "@/styles/home.module.scss";

export default function Home() {
  // Generate dates for calendar (14 days)
  const today = new Date();
  const dates = Array.from({ length: 14 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const getDayName = (date: Date) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    return days[date.getDay()];
  };

  const getShortDayName = (date: Date) => {
    const days = ["S", "M", "T", "W", "T", "F", "S"];
    return days[date.getDay()];
  };

  return (
    <>
      <Head>
        <title>KickUp - Football and Futsal Games Platform</title>
        <meta
          name="description"
          content="Platform for organizing football and futsal games. Find fields, games and teams."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className={styles.homePage}>
        {/* Banner/Carousel Section */}
        <Box className={styles.bannerSection}>
          <Container maxWidth="lg">
            <Box className={styles.bannerContent}>
              <Typography variant="h4" className={styles.bannerTitle}>
                Find Your Perfect Match
              </Typography>
              <Typography variant="body1" className={styles.bannerSubtitle}>
                Join social matches, create teams, and book fields
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Quick Menu Buttons */}
        <Container maxWidth="lg">
          <Box className={styles.quickMenu}>
            <Card className={styles.quickMenuItem} component={Link} href="/menu">
              <CardContent className={styles.quickMenuContent}>
                <MenuIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  All Menu
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/football-match">
              <CardContent className={styles.quickMenuContent}>
                <SportsSoccerIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Football Match
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/beginner">
              <CardContent className={styles.quickMenuContent}>
                <LocalFloristIcon sx={{ fontSize: 32, color: '#10b981' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Beginner
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team-league">
              <CardContent className={styles.quickMenuContent}>
                <EmojiEventsIcon sx={{ fontSize: 32, color: '#10b981' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Team League
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/get-started">
              <CardContent className={styles.quickMenuContent}>
                <PlayArrowIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Get Started
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>

        {/* Calendar and Filters Section */}
        <Container maxWidth="lg">
          <Box className={styles.calendarFiltersSection}>
            {/* Calendar Dates */}
            <Box className={styles.calendarDates}>
              {dates.map((date, index) => (
                <Box
                  key={index}
                  className={`${styles.dateItem} ${index === 0 ? styles.dateItemActive : ''}`}
                >
                  <Typography variant="body2" className={styles.dateNumber}>
                    {date.getDate()}
                  </Typography>
                  <Typography variant="caption" className={styles.dateDay}>
                    {getShortDayName(date)}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Filters */}
            <Box className={styles.filters}>
              <Chip
                icon={<LocationOnIcon />}
                label="Seoul"
                className={styles.filterChip}
                clickable
              />
              <Chip
                label="Hide Closed"
                className={styles.filterChip}
                clickable
              />
              <Chip
                icon={<WbTwilightIcon />}
                label="Evening Match"
                className={styles.filterChip}
                clickable
              />
              <Chip
                icon={<LocalOfferIcon />}
                label="Benefits"
                className={styles.filterChip}
                clickable
              />
              <Chip
                icon={<WcIcon />}
                label="Gender"
                className={styles.filterChip}
                clickable
              />
              <Chip
                icon={<TrendingUpIcon />}
                label="Level"
                className={styles.filterChip}
                clickable
              />
              <Chip
                icon={<HomeIcon />}
                label="Indoor/Shade"
                className={styles.filterChip}
                clickable
              />
            </Box>
          </Box>
        </Container>

        {/* Match List Section */}
        <Container maxWidth="lg">
          <Box className={styles.matchListSection}>
            <Box className={styles.emptyState}>
              <Typography variant="h5" className={styles.emptyStateTitle}>
                No matches available to apply for today
              </Typography>
              <Typography variant="body1" className={styles.emptyStateSubtitle}>
                Check other dates
              </Typography>
              <Button
                variant="outlined"
                className={styles.viewScheduleButton}
                component={Link}
                href="/schedule"
              >
                View Next Tuesday Schedule
              </Button>
            </Box>
          </Box>
        </Container>

        {/* Recommendation Section */}
        <Container maxWidth="lg">
          <Box className={styles.recommendationSection}>
            <Box className={styles.recommendationContent}>
              <Box className={styles.recommendationText}>
                <Typography variant="h6" className={styles.recommendationTitle}>
                  Can't find the match you want?
                </Typography>
                <Typography variant="body1" className={styles.recommendationSubtitle}>
                  Recommend a place where you want to play.
                </Typography>
                <Button
                  variant="contained"
                  className={styles.recommendButton}
                  startIcon={<ThumbUpIcon />}
                  component={Link}
                  href="/recommend"
                >
                  Recommend
                </Button>
              </Box>
              <Box className={styles.recommendationImage}>
                <Typography variant="body2" className={styles.recommendationImageText}>
                  Can't find a match that fits you?
                </Typography>
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>
    </>
  );
}
