import Head from "next/head";
import Link from "next/link";
import React, { useState, useEffect } from "react";
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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
} from "@mui/material";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import AssessmentIcon from "@mui/icons-material/Assessment";
import LeaderboardIcon from "@mui/icons-material/Leaderboard";
import PersonIcon from "@mui/icons-material/Person";
import WcIcon from "@mui/icons-material/Wc";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import StarIcon from "@mui/icons-material/Star";
import {
  getLeagueMatches,
  getLeagueResults,
  getTeamRankings,
  getIndividualRankings,
  LeagueMatch,
  LeagueResult,
  TeamRanking,
  IndividualRanking
} from "@/lib/leagueApi";
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
  const [loading, setLoading] = useState(false);
  const [leagueMatches, setLeagueMatches] = useState<LeagueMatch[]>([]);
  const [leagueResults, setLeagueResults] = useState<LeagueResult[]>([]);
  const [teamRankings, setTeamRankings] = useState<TeamRanking[]>([]);
  const [individualRankings, setIndividualRankings] = useState<IndividualRanking[]>([]);

  useEffect(() => {
    loadData();
  }, [tabValue, filterValue]);

  const loadData = async () => {
    try {
      setLoading(true);
      const filter = filterValue !== "all" ? { gender: filterValue } : undefined;

      if (tabValue === 0) {
        const matches = await getLeagueMatches(filter);
        setLeagueMatches(matches ?? []);
      } else if (tabValue === 1) {
        const results = await getLeagueResults(filter);
        setLeagueResults(results ?? []);
      } else if (tabValue === 2) {
        const rankings = await getTeamRankings(filter);
        setTeamRankings(rankings ?? []);
      } else if (tabValue === 3) {
        const individual = await getIndividualRankings(filter);
        setIndividualRankings(individual ?? []);
      }
    } catch (error) {
      console.error("Error loading data:", error);
      if (tabValue === 0) setLeagueMatches([]);
      else if (tabValue === 1) setLeagueResults([]);
      else if (tabValue === 2) setTeamRankings([]);
      else setIndividualRankings([]);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  return (
    <>
      <Head>
        <title>Team League - KickUp</title>
        <meta
          name="description"
          content="Join team leagues and compete with your team on KickUp."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
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
                  KickUp Team League
                </Typography>
                <Typography variant="body1" className={styles.bannerText}>
                  Join Team League with your team members and compete!
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
              {loading ? (
                <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                  <CircularProgress />
                </Box>
              ) : leagueMatches.length === 0 ? (
                <Box className={styles.emptyState}>
                  <Typography variant="h6">No matches scheduled</Typography>
                  <Typography variant="body2">Check back later for upcoming matches</Typography>
                </Box>
              ) : (
                leagueMatches.map((match) => (
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
                ))
              )}

              {/* Feedback Link */}
              <Card className={styles.feedbackCard} component={Link} href="/team/league/feedback">
                <CardContent className={styles.feedbackContent}>
                  <AssessmentIcon className={styles.feedbackIcon} />
                  <Box className={styles.feedbackText}>
                    <Typography variant="body1" className={styles.feedbackTitle}>
                      How is KickUp Team League?
                    </Typography>
                    <Typography variant="body2" className={styles.feedbackSubtitle}>
                      Send your feedback
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </Box>
          </TabPanel>

          <TabPanel value={tabValue} index={1}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : leagueResults.length === 0 ? (
              <Box className={styles.emptyState}>
                <Typography variant="h6">No results available yet</Typography>
                <Typography variant="body2">Check back after matches are completed</Typography>
              </Box>
            ) : (
              <Box className={styles.matchList}>
                {leagueResults.map((result) => (
                  <Card key={result.id} className={styles.matchCard}>
                    <CardContent className={styles.matchCardContent}>
                      <Box className={styles.matchHeader}>
                        <Box className={styles.matchDateTime}>
                          <Typography variant="body1" className={styles.matchDate}>
                            {result.date}
                          </Typography>
                          <Typography variant="h6" className={styles.matchTime}>
                            {result.time}
                          </Typography>
                        </Box>
                        <Chip label="Completed" size="small" color="success" />
                      </Box>

                      <Typography variant="h6" className={styles.matchField}>
                        {result.field}
                      </Typography>

                      {/* Teams with Scores */}
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", my: 2, p: 2, bgcolor: "action.hover", borderRadius: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1 }}>
                          <Avatar src={result.team1.logo} sx={{ width: 48, height: 48 }}>
                            {result.team1.name[0]}
                          </Avatar>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {result.team1.name}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mx: 3 }}>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                            {result.team1.score}
                          </Typography>
                          <Typography variant="h6" sx={{ color: "text.secondary" }}>
                            :
                          </Typography>
                          <Typography variant="h4" sx={{ fontWeight: 700, color: "primary.main" }}>
                            {result.team2.score}
                          </Typography>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2, flex: 1, justifyContent: "flex-end" }}>
                          <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            {result.team2.name}
                          </Typography>
                          <Avatar src={result.team2.logo} sx={{ width: 48, height: 48 }}>
                            {result.team2.name[0]}
                          </Avatar>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={2}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : teamRankings.length === 0 ? (
              <Box className={styles.emptyState}>
                <Typography variant="h6">No team rankings available yet</Typography>
                <Typography variant="body2">Rankings will appear after matches are played</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Played</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Won</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Drawn</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Lost</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>GF</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>GA</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>GD</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700, color: "primary.main" }}>Points</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {teamRankings.map((team) => (
                      <TableRow key={team.teamId} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {team.rank <= 3 && (
                              <EmojiEventsIcon
                                sx={{
                                  fontSize: 20,
                                  color: team.rank === 1 ? "#FFD700" : team.rank === 2 ? "#C0C0C0" : "#CD7F32",
                                }}
                              />
                            )}
                            <Typography variant="body1" sx={{ fontWeight: team.rank <= 3 ? 700 : 400 }}>
                              {team.rank}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar src={team.teamLogo} sx={{ width: 32, height: 32 }}>
                              {team.teamName[0]}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {team.teamName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell align="center">{team.played}</TableCell>
                        <TableCell align="center" sx={{ color: "success.main", fontWeight: 600 }}>
                          {team.won}
                        </TableCell>
                        <TableCell align="center">{team.drawn}</TableCell>
                        <TableCell align="center" sx={{ color: "error.main" }}>
                          {team.lost}
                        </TableCell>
                        <TableCell align="center">{team.goalsFor}</TableCell>
                        <TableCell align="center">{team.goalsAgainst}</TableCell>
                        <TableCell align="center" sx={{ color: team.goalDifference > 0 ? "success.main" : team.goalDifference < 0 ? "error.main" : "text.secondary" }}>
                          {team.goalDifference > 0 ? "+" : ""}{team.goalDifference}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={team.points}
                            color="primary"
                            sx={{ fontWeight: 700, minWidth: 60 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>

          <TabPanel value={tabValue} index={3}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress />
              </Box>
            ) : individualRankings.length === 0 ? (
              <Box className={styles.emptyState}>
                <Typography variant="h6">No individual rankings available yet</Typography>
                <Typography variant="body2">Rankings will appear after matches are played</Typography>
              </Box>
            ) : (
              <TableContainer component={Paper} sx={{ bgcolor: "background.paper" }}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ fontWeight: 700 }}>Rank</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Player</TableCell>
                      <TableCell sx={{ fontWeight: 700 }}>Team</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Matches</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Goals</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Assists</TableCell>
                      <TableCell align="center" sx={{ fontWeight: 700 }}>Rating</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {individualRankings.map((player) => (
                      <TableRow key={player.playerId} hover>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            {player.rank <= 3 && (
                              <StarIcon
                                sx={{
                                  fontSize: 20,
                                  color: player.rank === 1 ? "#FFD700" : player.rank === 2 ? "#C0C0C0" : "#CD7F32",
                                }}
                              />
                            )}
                            <Typography variant="body1" sx={{ fontWeight: player.rank <= 3 ? 700 : 400 }}>
                              {player.rank}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                            <Avatar src={player.playerAvatar} sx={{ width: 32, height: 32 }}>
                              {player.playerName[0]}
                            </Avatar>
                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                              {player.playerName}
                            </Typography>
                          </Box>
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {player.teamName}
                          </Typography>
                        </TableCell>
                        <TableCell align="center">{player.matches}</TableCell>
                        <TableCell align="center" sx={{ color: "success.main", fontWeight: 600 }}>
                          {player.goals}
                        </TableCell>
                        <TableCell align="center" sx={{ color: "info.main", fontWeight: 600 }}>
                          {player.assists}
                        </TableCell>
                        <TableCell align="center">
                          <Chip
                            label={player.rating.toFixed(1)}
                            color="primary"
                            sx={{ fontWeight: 700, minWidth: 60 }}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </TabPanel>
        </Container>
      </Box>
    </>
  );
}

