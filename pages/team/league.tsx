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
  Tabs,
  Tab,
  Select,
  MenuItem,
  FormControl,
  Avatar,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import styles from "@/styles/team.module.scss";

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
      id={`league-tabpanel-${index}`}
      aria-labelledby={`league-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TeamLeaguePage() {
  const [tabValue, setTabValue] = useState(0);
  const [filterValue, setFilterValue] = useState("all");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock league matches data
  const leagueMatches = [
    {
      id: 1,
      date: "January 27, Tuesday",
      time: "20:00",
      field: "Seoul Yongsan Adidas The Base Field 2 / Man Utd",
      status: "closed",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "Parking Full",
      teams: [
        { name: "Ares", logo: "/team1.jpg", score: null },
        { name: "FC Chabuka", logo: "/team2.jpg", score: null },
        { name: "Matmanba", logo: "/team3.jpg", score: null },
      ],
    },
    {
      id: 2,
      date: "January 28, Wednesday",
      time: "20:00",
      field: "Seoul Yongsan Adidas The Base Field 2 / Man Utd",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "Parking Full",
      teams: [{ name: "FC Westfrom", logo: "/team4.jpg", score: null }],
    },
    {
      id: 3,
      date: "January 28, Wednesday",
      time: "22:00",
      field: "Seoul Eunpyeong Lotte Mall Field A",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      teams: [],
    },
    {
      id: 4,
      date: "January 29, Thursday",
      time: "20:00",
      field: "Seoul Yongsan Adidas The Base Field 2 / Man Utd",
      gender: "Female",
      format: "6vs6",
      level: "All Levels",
      parking: "2 Parking Spaces",
      teams: [],
    },
    {
      id: 5,
      date: "January 29, Thursday",
      time: "21:00",
      field: "Seoul Yeongdeungpo The F Field A",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "2 Parking Spaces",
      teams: [
        { name: "FC MMM", logo: "/team5.jpg", score: null },
        { name: "DASH", logo: "/team6.jpg", score: null },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Team League - KickUp</title>
        <meta
          name="description"
          content="Join team leagues and compete with your team on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className={styles.teamPage}>
        {/* Banner Section */}
        <Container maxWidth="lg">
          <Box className={styles.bannerSection}>
            <Box className={styles.bannerContent}>
              <Box className={styles.bannerLeft}>
                <Box className={styles.bannerIconWrapper}>
                  <EmojiEventsIcon className={styles.bannerIcon} />
                </Box>
                <Typography variant="h4" className={styles.bannerTitle}>
                  Plab Team League
                </Typography>
                <Typography variant="body1" className={styles.bannerText}>
                  Join Plab Team League with your team members!
                </Typography>
                <Box className={styles.bannerButtons}>
                  <Button
                    variant="outlined"
                    className={styles.bannerButton}
                    component={Link}
                    href="/team/league/details"
                  >
                    View Details
                  </Button>
                  <Button
                    variant="contained"
                    className={styles.bannerButton}
                    component={Link}
                    href="/team/create"
                  >
                    Create New Team
                  </Button>
                </Box>
              </Box>
              <Box className={styles.bannerRight}>
                <Box className={styles.bannerImage} />
              </Box>
            </Box>
          </Box>
        </Container>

        {/* Tabs Section */}
        <Container maxWidth="lg">
          <Box className={styles.tabsSection}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              className={styles.tabs}
              indicatorColor="primary"
              textColor="primary"
            >
              <Tab
                icon={<CalendarTodayIcon />}
                iconPosition="start"
                label="Schedule"
                className={styles.tab}
              />
              <Tab
                icon={<AssessmentIcon />}
                iconPosition="start"
                label="Results"
                className={styles.tab}
              />
              <Tab
                icon={<LeaderboardIcon />}
                iconPosition="start"
                label="Team Rankings"
                className={styles.tab}
              />
              <Tab
                icon={<PersonIcon />}
                iconPosition="start"
                label="Individual Rankings"
                className={styles.tab}
              />
            </Tabs>

            {/* Filter */}
            <Box className={styles.filterSection}>
              <FormControl className={styles.filterControl}>
                <Select
                  value={filterValue}
                  onChange={(e) => setFilterValue(e.target.value)}
                  className={styles.filterSelect}
                  displayEmpty
                >
                  <MenuItem value="all">All</MenuItem>
                  <MenuItem value="male">Male</MenuItem>
                  <MenuItem value="female">Female</MenuItem>
                  <MenuItem value="mixed">Mixed</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </Box>
        </Container>

        {/* Match List */}
        <Container maxWidth="lg">
          <TabPanel value={tabValue} index={0}>
            <Box className={styles.matchList}>
              {leagueMatches.map((match) => (
                <Card key={match.id} className={styles.matchCard} component={Link} href={`/team/league/match/${match.id}`}>
                  <CardContent className={styles.matchCardContent}>
                    <Box className={styles.matchHeader}>
                      <Box className={styles.matchDateTime}>
                        <Typography variant="body1" className={styles.matchDate}>
                          {match.date}
                        </Typography>
                        <Typography variant="h6" className={styles.matchTime}>
                          {match.time}
                        </Typography>
                      </Box>
                      {match.status === "closed" && (
                        <Chip
                          label="Closed"
                          size="small"
                          className={styles.statusChip}
                        />
                      )}
                    </Box>

                    <Typography variant="h6" className={styles.matchField}>
                      {match.field}
                    </Typography>

                    <Box className={styles.matchDetails}>
                      <Chip
                        icon={<WcIcon />}
                        label={match.gender}
                        size="small"
                        className={styles.detailChip}
                      />
                      <Typography variant="body2" className={styles.detailSeparator}>
                        ·
                      </Typography>
                      <Typography variant="body2" className={styles.detailText}>
                        {match.format}
                      </Typography>
                      <Typography variant="body2" className={styles.detailSeparator}>
                        ·
                      </Typography>
                      <Typography variant="body2" className={styles.detailText}>
                        {match.level}
                      </Typography>
                      {match.parking && (
                        <>
                          <Typography variant="body2" className={styles.detailSeparator}>
                            ·
                          </Typography>
                          <Typography variant="body2" className={styles.detailText}>
                            {match.parking}
                          </Typography>
                        </>
                      )}
                    </Box>

                    {match.teams.length > 0 && (
                      <Box className={styles.teamsSection}>
                        {match.teams.map((team, idx) => (
                          <Box key={idx} className={styles.teamItem}>
                            <Avatar
                              src={team.logo}
                              className={styles.teamLogo}
                              sx={{ width: 40, height: 40 }}
                            >
                              {team.name[0]}
                            </Avatar>
                            <Typography variant="body2" className={styles.teamName}>
                              {team.name}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    )}

                    {match.teams.length === 0 && (
                      <Box className={styles.emptyTeamsSection}>
                        <Typography variant="body2" className={styles.emptyTeamsText}>
                          No teams registered yet
                        </Typography>
                      </Box>
                    )}
                  </CardContent>
                </Card>
              ))}

              {/* Feedback Link */}
              <Card className={styles.feedbackCard} component={Link} href="/team/league/feedback">
                <CardContent className={styles.feedbackContent}>
                  <AssessmentIcon className={styles.feedbackIcon} />
                  <Box className={styles.feedbackText}>
                    <Typography variant="body1" className={styles.feedbackTitle}>
                      How is Plab Team League?
                    </Typography>
                    <Typography variant="body2" className={styles.feedbackSubtitle}>
                      Send feedback to Plab
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            <Box className={styles.emptyState}>
              <Typography variant="h6">No results available yet</Typography>
              <Typography variant="body2">Check back after matches are completed</Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            <Box className={styles.emptyState}>
              <Typography variant="h6">Team Rankings</Typography>
              <Typography variant="body2">Rankings will be displayed here</Typography>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            <Box className={styles.emptyState}>
              <Typography variant="h6">Individual Rankings</Typography>
              <Typography variant="body2">Individual rankings will be displayed here</Typography>
            </Box>
          </TabPanel>
        </Container>
      </Box>
    </>
  );
}

