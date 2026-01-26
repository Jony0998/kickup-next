import Head from "next/head";
import Link from "next/link";
import React, { useState } from "react";
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
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import WarningIcon from "@mui/icons-material/Warning";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import styles from "@/styles/home.module.scss";

export default function Home() {
  const [bannerIndex, setBannerIndex] = useState(0);
  const [selectedDate, setSelectedDate] = useState(0);

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

  // Mock match data
  const matches = [
    {
      time: "23:00",
      badge: "AI Team Assignment",
      field: "KickUp Stadium Gasan Digital Empire Field 2",
      details: ["All Genders", "5vs5", "18 Parking Spaces"],
      image: "/field1.jpg",
    },
    {
      time: "23:00",
      badge: "AI Team Assignment",
      field: "KickUp Stadium Gasan Kolon Techno Valley Field 1 (Black)",
      details: ["All Genders", "6vs6", "17 Parking Spaces"],
      image: "/field2.jpg",
    },
    {
      time: "23:00",
      field: "Seoul Yeongdeungpo Nams Seoul Shopping Center SKY Futsal Park Field 1 N",
      details: ["All Genders", "5vs5"],
      image: "/field3.jpg",
    },
    {
      time: "23:59",
      field: "Seoul Eunpyeong Lotte Mall Field B",
      details: ["All Genders", "6vs6"],
      image: "/field4.jpg",
    },
    {
      time: "23:59",
      closingSoon: true,
      field: "Seoul Eunpyeong Lotte Mall Field A",
      details: ["All Genders", "6vs6"],
      image: "/field5.jpg",
    },
    {
      time: "23:59",
      field: "Seoul Yongsan Adidas The Base Field 2 / Man Utd",
      details: ["All Genders", "6vs6", "Parking Full"],
      image: "/field6.jpg",
    },
    {
      time: "23:59",
      field: "Seoul Gangdong Songpa Futsal Field",
      details: ["All Genders", "5vs5"],
      image: "/field7.jpg",
    },
    {
      time: "23:59",
      field: "Seoul Gangbuk Arc Futsal Stadium Indoor",
      details: ["All Genders", "5vs5"],
      image: "/field8.jpg",
    },
  ];

  const banners = [
    {
      id: 1,
      title: "Respect, encourage, and enjoy together",
      subtitle: "Join the KickUp community and play football with respect",
      color: "#0ea5e9",
      images: [
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80",
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&q=80",
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&q=80",
      ],
    },
    {
      id: 2,
      title: "Starter Match - Perfect for Beginners",
      subtitle: "New to football? Join our beginner-friendly matches",
      color: "#10b981",
      images: [
        "https://images.unsplash.com/photo-1575361204480-aadea25e6e68?w=1200&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&q=80",
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80",
      ],
    },
    {
      id: 3,
      title: "Team League - Compete with Your Team",
      subtitle: "Form a team and compete in our league tournaments",
      color: "#f59e0b",
      images: [
        "https://images.unsplash.com/photo-1579952363873-27f3bade9f55?w=1200&q=80",
        "https://images.unsplash.com/photo-1576678927484-cc907957088c?w=1200&q=80",
        "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&q=80",
        "https://images.unsplash.com/photo-1518611012118-696072aa579a?w=1200&q=80",
        "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&q=80",
      ],
    },
  ];

  const [imageIndices, setImageIndices] = useState<{ [key: number]: number }>({
    1: 0,
    2: 0,
    3: 0,
  });

  const nextBanner = () => {
    setBannerIndex((prev) => (prev + 1) % banners.length);
  };

  const prevBanner = () => {
    setBannerIndex((prev) => (prev - 1 + banners.length) % banners.length);
  };

  const handleBannerImageClick = (bannerId: number) => {
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
            <Box className={styles.bannerWrapper}>
              <IconButton
                className={styles.bannerNavButton}
                onClick={prevBanner}
                sx={{ left: -24 }}
              >
                <ChevronLeftIcon />
              </IconButton>
              
              <Box className={styles.bannerContainer}>
                <Box className={styles.bannerContent}>
                  <Box
                    className={styles.bannerSlide}
                    sx={{
                      transform: `translateX(-${bannerIndex * 100}%)`,
                      transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}
                  >
                    {banners.map((banner) => {
                      const currentImageIndex = imageIndices[banner.id] || 0;
                      const currentImage = banner.images[currentImageIndex];
                      
                      return (
                        <Box key={banner.id} className={styles.bannerItem}>
                          <Box
                            className={styles.bannerPlaceholder}
                            sx={{
                              background: `linear-gradient(135deg, ${banner.color}cc 0%, ${banner.color}99 100%)`,
                              position: 'relative',
                              overflow: 'hidden',
                              cursor: 'pointer',
                            }}
                            onClick={() => handleBannerImageClick(banner.id)}
                          >
                            {/* Background Image with transition */}
                            <Box
                              className={styles.bannerImage}
                              sx={{
                                backgroundImage: `url("${currentImage}")`,
                                transition: 'opacity 0.5s ease-in-out',
                              }}
                            />
                            <Box className={styles.bannerOverlay} />
                            
                            {/* Image indicators */}
                            <Box className={styles.bannerImageIndicators}>
                              {banner.images.map((_, imgIndex) => (
                                <Box
                                  key={imgIndex}
                                  className={`${styles.bannerImageDot} ${
                                    imgIndex === currentImageIndex ? styles.bannerImageDotActive : ''
                                  }`}
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setImageIndices((prev) => ({
                                      ...prev,
                                      [banner.id]: imgIndex,
                                    }));
                                  }}
                                />
                              ))}
                            </Box>

                            <Box className={styles.bannerInner}>
                              <Box className={styles.bannerIcon}>
                                {banner.id === 1 && (
                                  <SportsSoccerIcon sx={{ fontSize: 80, color: 'white' }} />
                                )}
                                {banner.id === 2 && (
                                  <LocalFloristIcon sx={{ fontSize: 80, color: 'white' }} />
                                )}
                                {banner.id === 3 && (
                                  <EmojiEventsIcon sx={{ fontSize: 80, color: 'white' }} />
                                )}
                              </Box>
                              <Typography variant="h4" className={styles.bannerTitle}>
                                {banner.title}
                              </Typography>
                              <Typography variant="h6" className={styles.bannerSubtitle}>
                                {banner.subtitle}
                              </Typography>
                              <Button
                                variant="contained"
                                className={styles.bannerButton}
                                component={Link}
                                href={banner.id === 1 ? "/games" : banner.id === 2 ? "/beginner" : "/team-league"}
                                onClick={(e) => e.stopPropagation()}
                                sx={{
                                  bgcolor: 'white',
                                  color: banner.color,
                                  '&:hover': { bgcolor: 'rgba(255,255,255,0.9)' },
                                }}
                              >
                                {banner.id === 1 ? "Join Now" : banner.id === 2 ? "Get Started" : "Join League"}
                              </Button>
                            </Box>
                          </Box>
                        </Box>
                      );
                    })}
                  </Box>
                </Box>
                <Box className={styles.bannerIndicators}>
                  <Typography variant="body2" className={styles.bannerIndicator}>
                    {bannerIndex + 1} | {banners.length}
                  </Typography>
                </Box>
              </Box>

              <IconButton
                className={styles.bannerNavButton}
                onClick={nextBanner}
                sx={{ right: -24 }}
              >
                <ChevronRightIcon />
              </IconButton>
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
                  className={`${styles.dateItem} ${index === selectedDate ? styles.dateItemActive : ''}`}
                  onClick={() => setSelectedDate(index)}
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

        {/* Closing Soon Banner */}
        <Container maxWidth="lg">
          <Box className={styles.closingSoonBanner}>
            <Box className={styles.closingSoonContent}>
              <WarningIcon className={styles.closingSoonIcon} />
              <Typography variant="body1" className={styles.closingSoonText}>
                Closing Soon! Applications close in a moment of hesitation
              </Typography>
            </Box>
            <Card className={styles.closingSoonCard} component={Link} href="/match/1">
              <CardContent className={styles.closingSoonCardContent}>
                <Box className={styles.closingSoonTime}>
                  <Typography variant="h6" className={styles.closingSoonTimeText}>
                    23:59
                  </Typography>
                  <Chip
                    label="Closing Soon"
                    size="small"
                    className={styles.closingSoonChip}
                  />
                </Box>
                <Typography variant="body1" className={styles.closingSoonField}>
                  Seoul Eunpyeong Lotte Mall Field A
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>

        {/* Match List Section */}
        <Container maxWidth="lg">
          <Box className={styles.matchListSection}>
            {matches.map((match, index) => (
              <Card
                key={index}
                className={styles.matchCard}
                component={Link}
                href={`/match/${index + 1}`}
              >
                <CardContent className={styles.matchCardContent}>
                  <Box className={styles.matchLeft}>
                    <Typography variant="h6" className={styles.matchTime}>
                      {match.time}
                    </Typography>
                    {match.badge && (
                      <Box className={styles.matchBadge}>
                        <AutoAwesomeIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" className={styles.matchBadgeText}>
                          {match.badge}
                        </Typography>
                      </Box>
                    )}
                    {match.closingSoon && (
                      <Box className={styles.matchBadge}>
                        <WarningIcon sx={{ fontSize: 16 }} />
                        <Typography variant="caption" className={styles.matchBadgeText}>
                          Closing Soon
                        </Typography>
                      </Box>
                    )}
                    <Typography variant="h6" className={styles.matchField}>
                      {match.field}
                    </Typography>
                    <Box className={styles.matchDetails}>
                      {match.details.map((detail, idx) => (
                        <React.Fragment key={idx}>
                          {idx > 0 && <span className={styles.detailSeparator}>·</span>}
                          <Typography variant="body2" className={styles.matchDetail}>
                            {detail}
                          </Typography>
                        </React.Fragment>
                      ))}
                    </Box>
                  </Box>
                  <Box className={styles.matchRight}>
                    <Avatar
                      variant="rounded"
                      className={styles.matchImage}
                      sx={{ width: 120, height: 120 }}
                    >
                      <SportsSoccerIcon sx={{ fontSize: 48 }} />
                    </Avatar>
                  </Box>
                </CardContent>
              </Card>
            ))}

            <Box className={styles.viewScheduleButton}>
              <Button
                variant="outlined"
                className={styles.scheduleButton}
                component={Link}
                href="/schedule"
              >
                View Next Monday Schedule
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

        {/* Support Chat Button */}
        <IconButton
          className={styles.supportButton}
          component={Link}
          href="/support"
        >
          <SupportAgentIcon sx={{ fontSize: 32, color: 'white' }} />
        </IconButton>
      </Box>
    </>
  );
}
