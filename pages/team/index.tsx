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
  InputLabel,
  Avatar,
  IconButton,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WcIcon from "@mui/icons-material/Wc";
import FeedbackIcon from "@mui/icons-material/Feedback";
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
      id={`team-tabpanel-${index}`}
      aria-labelledby={`team-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function TeamPage() {
  const [tabValue, setTabValue] = useState(0);
  const [filterValue, setFilterValue] = useState("all");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  // Mock match data
  const matches = [
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
        { name: "Ares", logo: "/team1.jpg" },
        { name: "FC Chabuka", logo: "/team2.jpg" },
        { name: "Matmanba", logo: "/team3.jpg" },
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
      teams: [{ name: "FC Westfrom", logo: "/team4.jpg" }],
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
        { name: "FC MMM", logo: "/team5.jpg" },
        { name: "DASH", logo: "/team6.jpg" },
      ],
    },
    {
      id: 6,
      date: "January 30, Friday",
      time: "20:00",
      field: "Seoul Eunpyeong Lotte Mall Field B",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      teams: [
        { name: "Coward FC", logo: "/team7.jpg" },
        { name: "Kim Chukdan (KJFC)", logo: "/team8.jpg" },
      ],
    },
    {
      id: 7,
      date: "January 30, Friday",
      time: "21:00",
      field: "Seoul Yeongdeungpo The F Field A",
      status: "closed",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "2 Parking Spaces",
      teams: [
        { name: "FC Chabuka", logo: "/team2.jpg" },
        { name: "FC Lacrima", logo: "/team9.jpg" },
        { name: "Jongjeom FS", logo: "/team10.jpg" },
      ],
    },
  ];

  return (
    <>
      <Head>
        <title>Team - KickUp</title>
        <meta
          name="description"
          content="Join team leagues, recruit teammates, and create your own team on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box className={styles.teamPage}>
        {/* Quick Menu Buttons */}
        <Container maxWidth="lg">
          <Box className={styles.quickMenu}>
            <Card className={styles.quickMenuItem} component={Link} href="/team/league">
              <CardContent className={styles.quickMenuContent}>
                <EmojiEventsIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Team League
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team/recruit">
              <CardContent className={styles.quickMenuContent}>
                <GroupAddIcon sx={{ fontSize: 32, color: '#10b981' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Recruit Teammates
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team/guests">
              <CardContent className={styles.quickMenuContent}>
                <PersonAddIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Recruit Guests
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.quickMenuItem} component={Link} href="/team/create">
              <CardContent className={styles.quickMenuContent}>
                <AddCircleIcon sx={{ fontSize: 32, color: '#ef4444' }} />
                <Typography variant="body2" className={styles.quickMenuText}>
                  Create Team
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>

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
              {matches.map((match) => (
                <Card key={match.id} className={styles.matchCard} component={Link} href={`/team/match/${match.id}`}>
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
                              sx={{ width: 32, height: 32 }}
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
                  </CardContent>
                </Card>
              ))}

              {/* Feedback Link */}
              <Card className={styles.feedbackCard} component={Link} href="/team/feedback">
                <CardContent className={styles.feedbackContent}>
                  <FeedbackIcon className={styles.feedbackIcon} />
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

