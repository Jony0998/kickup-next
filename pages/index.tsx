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
  Tabs,
  Tab,
  IconButton,
} from "@mui/material";
import GroupsIcon from "@mui/icons-material/Groups";
import PersonIcon from "@mui/icons-material/Person";
import AddIcon from "@mui/icons-material/Add";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import styles from "@/styles/home.module.scss";

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
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

export default function Home() {
  const [tabValue, setTabValue] = React.useState(0);
  const [scheduleTab, setScheduleTab] = React.useState(0);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const handleScheduleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setScheduleTab(newValue);
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
        {/* Action Buttons Section */}
        <Container maxWidth="lg">
          <Box className={styles.actionButtons}>
            <Card className={styles.actionCard} component={Link} href="/team-league">
              <CardContent className={styles.actionCardContent}>
                <Box className={`${styles.actionIcon} ${styles.teamLeagueIcon}`}>
                  <EmojiEventsIcon sx={{ fontSize: 32, color: '#10b981' }} />
                </Box>
                <Typography variant="body2" className={styles.actionText}>
                  Team League
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.actionCard} component={Link} href="/recruit-teammates">
              <CardContent className={styles.actionCardContent}>
                <Box className={`${styles.actionIcon} ${styles.recruitTeammatesIcon}`}>
                  <GroupsIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
                </Box>
                <Typography variant="body2" className={styles.actionText}>
                  Recruit Teammates
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.actionCard} component={Link} href="/recruit-guests">
              <CardContent className={styles.actionCardContent}>
                <Box className={`${styles.actionIcon} ${styles.recruitGuestsIcon}`}>
                  <PersonIcon sx={{ fontSize: 32, color: '#10b981' }} />
                </Box>
                <Typography variant="body2" className={styles.actionText}>
                  Recruit Guests
                </Typography>
              </CardContent>
            </Card>

            <Card className={styles.actionCard} component={Link} href="/create-team">
              <CardContent className={styles.actionCardContent}>
                <Box className={`${styles.actionIcon} ${styles.createTeamIcon}`}>
                  <AddIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
                </Box>
                <Typography variant="body2" className={styles.actionText}>
                  Create Team
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Container>

        {/* Promotional Banner - Team League */}
        <Box className={styles.promoBanner}>
          <Container maxWidth="lg">
            <Box className={styles.promoContent}>
              <Box className={styles.promoHeader}>
                <Box className={styles.promoIcon}>
                  <EmojiEventsIcon sx={{ fontSize: 40, color: 'white' }} />
                </Box>
                <Typography variant="h4" className={styles.promoTitle}>
                  KickUp Team League
                </Typography>
              </Box>
              <Typography variant="h6" className={styles.promoMessage}>
                Join the KickUp Team League with your team members!
              </Typography>
              <Box className={styles.promoButtons}>
                <Button
                  variant="contained"
                  className={styles.promoButton}
                  component={Link}
                  href="/team-league/details"
                >
                  View Details
                </Button>
                <Button
                  variant="contained"
                  className={styles.promoButton}
                  component={Link}
                  href="/create-team"
                >
                  Create New Team
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Match Schedule Section */}
        <Container maxWidth="lg">
          <Box className={styles.scheduleSection}>
            <Tabs
              value={scheduleTab}
              onChange={handleScheduleTabChange}
              className={styles.scheduleTabs}
            >
              <Tab label="Schedule" />
              <Tab label="Results" />
              <Tab label="Team Rankings" />
              <Tab label="Individual Rankings" />
            </Tabs>

            <TabPanel value={scheduleTab} index={0}>
              <Box className={styles.scheduleContent}>
                <Chip
                  label="All"
                  className={styles.filterChip}
                  clickable
                />
                
                {/* Match Card */}
                <Card className={styles.matchCard}>
                  <CardContent>
                    <Box className={styles.matchHeader}>
                      <Typography variant="h6" className={styles.matchDate}>
                        January 21, Wednesday 20:00
                      </Typography>
                    </Box>
                    <Typography variant="body1" className={styles.matchLocation}>
                      Seoul Yongsan Adidas The Base Field 2 / Man Utd
                    </Typography>
                    <Chip
                      label="Closed"
                      size="small"
                      className={styles.statusChip}
                    />
                    <Box className={styles.matchDetails}>
                      <Chip label="Men" size="small" className={styles.detailChip} />
                      <Chip label="6vs6" size="small" className={styles.detailChip} />
                      <Chip label="All Levels" size="small" className={styles.detailChip} />
                      <Chip label="Parking Full" size="small" className={styles.detailChip} />
                    </Box>
                    <Box className={styles.matchTeams}>
                      <Typography variant="body2" className={styles.teamName}>
                        Somang FS
                      </Typography>
                      <Box className={styles.vsIcon}>VS</Box>
                      <Typography variant="body2" className={styles.teamName}>
                        YS FC
                      </Typography>
                      <Box className={styles.vsIcon}>VS</Box>
                      <Typography variant="body2" className={styles.teamName}>
                        Aknack FC
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Box>
            </TabPanel>

            <TabPanel value={scheduleTab} index={1}>
              <Typography>Results content coming soon...</Typography>
            </TabPanel>

            <TabPanel value={scheduleTab} index={2}>
              <Typography>Team Rankings content coming soon...</Typography>
            </TabPanel>

            <TabPanel value={scheduleTab} index={3}>
              <Typography>Individual Rankings content coming soon...</Typography>
            </TabPanel>
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
