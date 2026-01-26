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
  Avatar,
  TextField,
  InputAdornment,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  IconButton,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import PeopleIcon from "@mui/icons-material/People";
import VisibilityIcon from "@mui/icons-material/Visibility";
import HowToRegIcon from "@mui/icons-material/HowToReg";
import WcIcon from "@mui/icons-material/Wc";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import AddIcon from "@mui/icons-material/Add";
import styles from "@/styles/team.module.scss";

export default function RecruitTeammatesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [sortBy, setSortBy] = useState("popularity");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [area, setArea] = useState("my-area");
  const [event, setEvent] = useState("all");
  const [gender, setGender] = useState("all");
  const [level, setLevel] = useState("all");
  const [age, setAge] = useState("all");
  const [dayOfWeek, setDayOfWeek] = useState("all");
  const [slot, setSlot] = useState("all");

  // Category filters
  const categories = [
    "Flap Team League",
    "Self-defense",
    "Competition preparation",
    "Team Matching",
    "5vs5 futsal",
    "professional coach",
    "Growing together",
  ];

  // Mock recruitment posts
  const recruitmentPosts = [
    {
      id: 1,
      teamName: "Bundang Futsal Team",
      teamLogo: "/team1.jpg",
      members: 37,
      status: "recruiting",
      location: "Gyeonggi-do Gwangju City",
      club: "Gyeonggi-do Gwangju Dynamic Futsal Club",
      gender: "Men",
      type: "Futsal",
      age: "20s-30s",
      dayOfWeek: "Thursday-Saturday mornings",
      level: "Beginner 3",
      views: 100673,
      applications: 64,
    },
    {
      id: 2,
      teamName: "SUIN FS",
      teamLogo: "/team2.jpg",
      members: 26,
      status: "recruiting",
      location: "Gyeonggi Suwon City",
      club: "Flap Stadium Suwon",
      gender: "Men and Women",
      type: "Futsal",
      age: "20s",
      dayOfWeek: "Every evening",
      level: "Semi-professional 2",
      views: 98908,
      applications: 187,
    },
    {
      id: 3,
      teamName: "OTP FC",
      teamLogo: "/team3.jpg",
      members: 35,
      status: "recruiting",
      location: "Seoul, Gangnam",
      club: "Gangnam Futsal Center",
      gender: "Men",
      type: "Futsal",
      age: "20s-30s",
      dayOfWeek: "Weekends",
      level: "Intermediate",
      views: 87542,
      applications: 45,
    },
  ];

  const toggleSortOrder = () => {
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <>
      <Head>
        <title>Recruit Teammates - KickUp</title>
        <meta
          name="description"
          content="Find teammates or recruit players for your team on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className={styles.teamPage}>
        {/* Header */}
        <Container maxWidth="lg">
          <Box className={styles.pageHeader}>
            <Button
              component={Link}
              href="/team"
              startIcon={<ArrowBackIcon />}
              className={styles.backButton}
            >
              Back to Team
            </Button>
            <Box className={styles.pageTitleSection}>
              <GroupAddIcon className={styles.pageTitleIcon} />
              <Typography variant="h4" className={styles.pageTitle}>
                Recruiting Team Members
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.pageSubtitle}>
              Find the type of team you want
            </Typography>
          </Box>
        </Container>

        {/* Category Filters */}
        <Container maxWidth="lg">
          <Box className={styles.categoryFiltersSection}>
            <Typography variant="body2" className={styles.categoryFiltersLabel}>
              Find the type of team you want
            </Typography>
            <Box className={styles.categoryFilters}>
              {categories.map((category, idx) => (
                <Chip
                  key={idx}
                  label={category}
                  className={`${styles.categoryChip} ${
                    selectedCategory === category ? styles.categoryChipActive : ""
                  }`}
                  onClick={() =>
                    setSelectedCategory(selectedCategory === category ? "" : category)
                  }
                />
              ))}
            </Box>
          </Box>
        </Container>

        {/* Advanced Filters */}
        <Container maxWidth="lg">
          <Box className={styles.advancedFiltersSection}>
            <FormControl className={styles.filterDropdown}>
              <Select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="my-area">My area</MenuItem>
                <MenuItem value="seoul">Seoul</MenuItem>
                <MenuItem value="busan">Busan</MenuItem>
                <MenuItem value="incheon">Incheon</MenuItem>
                <MenuItem value="all">All areas</MenuItem>
              </Select>
            </FormControl>

            <Button
              className={`${styles.sortButton} ${styles.sortButtonActive}`}
              onClick={toggleSortOrder}
              endIcon={sortOrder === "asc" ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
            >
              Sort by popularity {sortOrder === "asc" ? "↑" : "↓"}
            </Button>

            <Button
              className={`${styles.filterButton} ${styles.filterButtonActive}`}
            >
              Recruiting members
            </Button>

            <FormControl className={styles.filterDropdown}>
              <Select
                value={event}
                onChange={(e) => setEvent(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">event</MenuItem>
                <MenuItem value="league">League</MenuItem>
                <MenuItem value="tournament">Tournament</MenuItem>
                <MenuItem value="friendly">Friendly</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterDropdown}>
              <Select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">gender</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterDropdown}>
              <Select
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">Level</MenuItem>
                <MenuItem value="beginner">Beginner</MenuItem>
                <MenuItem value="intermediate">Intermediate</MenuItem>
                <MenuItem value="advanced">Advanced</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterDropdown}>
              <Select
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">age</MenuItem>
                <MenuItem value="20s">20s</MenuItem>
                <MenuItem value="30s">30s</MenuItem>
                <MenuItem value="40s">40s</MenuItem>
                <MenuItem value="mixed">Mixed</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterDropdown}>
              <Select
                value={dayOfWeek}
                onChange={(e) => setDayOfWeek(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">day of the week</MenuItem>
                <MenuItem value="weekdays">Weekdays</MenuItem>
                <MenuItem value="weekends">Weekends</MenuItem>
                <MenuItem value="monday">Monday</MenuItem>
                <MenuItem value="tuesday">Tuesday</MenuItem>
                <MenuItem value="wednesday">Wednesday</MenuItem>
                <MenuItem value="thursday">Thursday</MenuItem>
                <MenuItem value="friday">Friday</MenuItem>
                <MenuItem value="saturday">Saturday</MenuItem>
                <MenuItem value="sunday">Sunday</MenuItem>
              </Select>
            </FormControl>

            <FormControl className={styles.filterDropdown}>
              <Select
                value={slot}
                onChange={(e) => setSlot(e.target.value)}
                className={styles.filterSelect}
                displayEmpty
              >
                <MenuItem value="all">slot</MenuItem>
                <MenuItem value="morning">Morning</MenuItem>
                <MenuItem value="afternoon">Afternoon</MenuItem>
                <MenuItem value="evening">Evening</MenuItem>
                <MenuItem value="night">Night</MenuItem>
              </Select>
            </FormControl>
          </Box>
        </Container>

        {/* Recruitment Posts List */}
        <Container maxWidth="lg">
          <Box className={styles.recruitmentList}>
            {recruitmentPosts.map((post) => (
              <Card key={post.id} className={styles.recruitmentCard}>
                <CardContent className={styles.recruitmentCardContent}>
                  <Box className={styles.recruitmentCardHeader}>
                    <Box className={styles.recruitmentTeamInfo}>
                      <Avatar
                        src={post.teamLogo}
                        className={styles.recruitmentTeamLogo}
                        sx={{ width: 64, height: 64 }}
                      >
                        {post.teamName[0]}
                      </Avatar>
                      <Box className={styles.recruitmentTeamDetails}>
                        <Typography variant="h6" className={styles.recruitmentTeamName}>
                          {post.teamName}
                        </Typography>
                        <Box className={styles.recruitmentTeamMeta}>
                          <Box className={styles.recruitmentMemberCount}>
                            <PeopleIcon className={styles.memberIcon} />
                            <Typography variant="body2" className={styles.memberCount}>
                              {post.members}
                            </Typography>
                          </Box>
                          <Chip
                            label="Member recruitment"
                            size="small"
                            className={styles.recruitmentStatusChip}
                          />
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box className={styles.recruitmentLocation}>
                    <LocationOnIcon className={styles.locationIcon} />
                    <Typography variant="body2" className={styles.recruitmentLocationText}>
                      {post.location} · {post.club}
                    </Typography>
                  </Box>

                  <Box className={styles.recruitmentDetailsRow}>
                    <Typography variant="body2" className={styles.recruitmentDetailItem}>
                      {post.gender}
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailItem}>
                      {post.type}
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailItem}>
                      {post.age}
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailItem}>
                      {post.dayOfWeek}
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.recruitmentDetailItem}>
                      {post.level}
                    </Typography>
                  </Box>

                  <Box className={styles.recruitmentEngagement}>
                    <Box className={styles.engagementItem}>
                      <VisibilityIcon className={styles.engagementIcon} />
                      <Typography variant="body2" className={styles.engagementText}>
                        {post.views.toLocaleString()} views
                      </Typography>
                    </Box>
                    <Typography variant="body2" className={styles.engagementSeparator}>
                      ·
                    </Typography>
                    <Box className={styles.engagementItem}>
                      <HowToRegIcon className={styles.engagementIcon} />
                      <Typography variant="body2" className={styles.engagementText}>
                        {post.applications} applications
                      </Typography>
                    </Box>
                  </Box>

                  <Box className={styles.recruitmentActions}>
                    <Button
                      variant="outlined"
                      className={styles.recruitmentActionButton}
                      component={Link}
                      href={`/team/recruit/${post.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.recruitmentActionButton}
                      component={Link}
                      href={`/team/recruit/${post.id}/apply`}
                    >
                      Apply
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </Container>

        {/* Floating Action Button */}
        <IconButton
          className={styles.floatingActionButton}
          component={Link}
          href="/team/recruit/create"
        >
          <AddIcon />
        </IconButton>
      </Box>
    </>
  );
}
