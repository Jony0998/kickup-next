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
  IconButton,
} from "@mui/material";
import GroupAddIcon from "@mui/icons-material/GroupAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WcIcon from "@mui/icons-material/Wc";
import PersonIcon from "@mui/icons-material/Person";
import styles from "@/styles/team.module.scss";

export default function RecruitTeammatesPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock recruitment posts
  const recruitmentPosts = [
    {
      id: 1,
      teamName: "FC Champions",
      teamLogo: "/team1.jpg",
      location: "Seoul, Yongsan",
      time: "Weekends, 20:00",
      gender: "Male",
      level: "Intermediate",
      positions: ["Goalkeeper", "Defender"],
      description: "Looking for dedicated players to join our competitive team.",
      postedDate: "2 days ago",
    },
    {
      id: 2,
      teamName: "Thunder FC",
      teamLogo: "/team2.jpg",
      location: "Seoul, Gangnam",
      time: "Weekdays, 19:00",
      gender: "Mixed",
      level: "All Levels",
      positions: ["Midfielder", "Forward"],
      description: "Friendly team looking for new members. All skill levels welcome!",
      postedDate: "5 days ago",
    },
    {
      id: 3,
      teamName: "Eagles United",
      teamLogo: "/team3.jpg",
      location: "Seoul, Mapo",
      time: "Saturdays, 18:00",
      gender: "Female",
      level: "Beginner",
      positions: ["Any Position"],
      description: "New team forming! Join us for fun and fitness.",
      postedDate: "1 week ago",
    },
  ];

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
                Recruit Teammates
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.pageSubtitle}>
              Find players or post recruitment ads for your team
            </Typography>
          </Box>
        </Container>

        {/* Search and Actions */}
        <Container maxWidth="lg">
          <Box className={styles.searchActionsSection}>
            <TextField
              placeholder="Search by team name, location, position..."
              variant="outlined"
              fullWidth
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={styles.searchField}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
            <Button
              variant="contained"
              className={styles.createPostButton}
              component={Link}
              href="/team/recruit/create"
            >
              Post Recruitment
            </Button>
          </Box>
        </Container>

        {/* Recruitment Posts List */}
        <Container maxWidth="lg">
          <Box className={styles.recruitmentList}>
            {recruitmentPosts.map((post) => (
              <Card key={post.id} className={styles.recruitmentCard}>
                <CardContent className={styles.recruitmentCardContent}>
                  <Box className={styles.recruitmentHeader}>
                    <Box className={styles.recruitmentTeamInfo}>
                      <Avatar
                        src={post.teamLogo}
                        className={styles.recruitmentTeamLogo}
                        sx={{ width: 48, height: 48 }}
                      >
                        {post.teamName[0]}
                      </Avatar>
                      <Box className={styles.recruitmentTeamDetails}>
                        <Typography variant="h6" className={styles.recruitmentTeamName}>
                          {post.teamName}
                        </Typography>
                        <Typography variant="body2" className={styles.recruitmentPostedDate}>
                          Posted {post.postedDate}
                        </Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Typography variant="body1" className={styles.recruitmentDescription}>
                    {post.description}
                  </Typography>

                  <Box className={styles.recruitmentDetails}>
                    <Chip
                      icon={<LocationOnIcon />}
                      label={post.location}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                    <Chip
                      icon={<AccessTimeIcon />}
                      label={post.time}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                    <Chip
                      icon={<WcIcon />}
                      label={post.gender}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                    <Chip
                      label={post.level}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                  </Box>

                  <Box className={styles.recruitmentPositions}>
                    <Typography variant="body2" className={styles.recruitmentPositionsLabel}>
                      Looking for:
                    </Typography>
                    <Box className={styles.recruitmentPositionsList}>
                      {post.positions.map((position, idx) => (
                        <Chip
                          key={idx}
                          label={position}
                          size="small"
                          className={styles.positionChip}
                        />
                      ))}
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
      </Box>
    </>
  );
}

