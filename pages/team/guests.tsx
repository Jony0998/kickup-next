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
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SearchIcon from "@mui/icons-material/Search";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WcIcon from "@mui/icons-material/Wc";
import styles from "@/styles/team.module.scss";

export default function RecruitGuestsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock guest recruitment posts
  const guestPosts = [
    {
      id: 1,
      teamName: "FC Warriors",
      teamLogo: "/team1.jpg",
      matchDate: "January 30, Friday",
      matchTime: "20:00",
      location: "Seoul, Yongsan",
      field: "Adidas The Base Field 2",
      gender: "Male",
      format: "6vs6",
      level: "Intermediate",
      needed: 2,
      description: "Need 2 guest players for our league match this Friday.",
      postedDate: "1 day ago",
    },
    {
      id: 2,
      teamName: "Thunder FC",
      teamLogo: "/team2.jpg",
      matchDate: "February 1, Sunday",
      matchTime: "18:00",
      location: "Seoul, Gangnam",
      field: "SKY Futsal Park A",
      gender: "Mixed",
      format: "5vs5",
      level: "All Levels",
      needed: 1,
      description: "Looking for 1 guest player. Fun and friendly match!",
      postedDate: "3 days ago",
    },
  ];

  return (
    <>
      <Head>
        <title>Recruit Guests - KickUp</title>
        <meta
          name="description"
          content="Find guest players for your matches or join as a guest player on KickUp."
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
              <PersonAddIcon className={styles.pageTitleIcon} />
              <Typography variant="h4" className={styles.pageTitle}>
                Recruit Guests
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.pageSubtitle}>
              Find guest players for your matches or join as a guest player
            </Typography>
          </Box>
        </Container>

        {/* Search and Actions */}
        <Container maxWidth="lg">
          <Box className={styles.searchActionsSection}>
            <TextField
              placeholder="Search by team name, location, date..."
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
              href="/team/guests/create"
            >
              Post Guest Request
            </Button>
          </Box>
        </Container>

        {/* Guest Posts List */}
        <Container maxWidth="lg">
          <Box className={styles.recruitmentList}>
            {guestPosts.map((post) => (
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
                    <Chip
                      label={`Need ${post.needed} player${post.needed > 1 ? 's' : ''}`}
                      size="small"
                      className={styles.neededChip}
                    />
                  </Box>

                  <Typography variant="body1" className={styles.recruitmentDescription}>
                    {post.description}
                  </Typography>

                  <Box className={styles.guestMatchInfo}>
                    <Typography variant="body2" className={styles.guestMatchDate}>
                      {post.matchDate} at {post.matchTime}
                    </Typography>
                    <Typography variant="body2" className={styles.guestMatchField}>
                      {post.field}, {post.location}
                    </Typography>
                  </Box>

                  <Box className={styles.recruitmentDetails}>
                    <Chip
                      icon={<WcIcon />}
                      label={post.gender}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                    <Chip
                      label={post.format}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                    <Chip
                      label={post.level}
                      size="small"
                      className={styles.recruitmentDetailChip}
                    />
                  </Box>

                  <Box className={styles.recruitmentActions}>
                    <Button
                      variant="outlined"
                      className={styles.recruitmentActionButton}
                      component={Link}
                      href={`/team/guests/${post.id}`}
                    >
                      View Details
                    </Button>
                    <Button
                      variant="contained"
                      className={styles.recruitmentActionButton}
                      component={Link}
                      href={`/team/guests/${post.id}/apply`}
                    >
                      Apply as Guest
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

