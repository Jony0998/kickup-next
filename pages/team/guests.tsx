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
  Select,
  MenuItem,
  FormControl,
  IconButton,
} from "@mui/material";
import PersonAddIcon from "@mui/icons-material/PersonAdd";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WcIcon from "@mui/icons-material/Wc";
import PeopleIcon from "@mui/icons-material/People";
import AddIcon from "@mui/icons-material/Add";
import styles from "@/styles/team.module.scss";

export default function RecruitGuestsPage() {
  const [filterValue, setFilterValue] = useState("all");

  // Mock guest recruitment posts
  const guestPosts = [
    {
      id: 1,
      teamName: "FC Warriors",
      teamLogo: "/team1.jpg",
      matchDate: "January 30, Friday",
      matchTime: "20:00",
      location: "Seoul, Yongsan",
      field: "Adidas The Base Field 2 / Man Utd",
      gender: "Male",
      format: "6vs6",
      level: "All Levels",
      parking: "Parking Full",
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
    {
      id: 3,
      teamName: "Eagles United",
      teamLogo: "/team3.jpg",
      matchDate: "February 2, Monday",
      matchTime: "21:00",
      location: "Seoul, Mapo",
      field: "Mapo Futsal Center",
      gender: "Female",
      format: "6vs6",
      level: "Beginner",
      needed: 3,
      description: "Need 3 guest players for our friendly match.",
      postedDate: "5 days ago",
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

        {/* Filter */}
        <Container maxWidth="lg">
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
        </Container>

        {/* Guest Posts List */}
        <Container maxWidth="lg">
          <Box className={styles.matchList}>
            {guestPosts.map((post) => (
              <Card key={post.id} className={styles.matchCard} component={Link} href={`/team/guests/${post.id}`}>
                <CardContent className={styles.matchCardContent}>
                  <Box className={styles.matchHeader}>
                    <Box className={styles.matchDateTime}>
                      <Typography variant="body1" className={styles.matchDate}>
                        {post.matchDate}
                      </Typography>
                      <Typography variant="h6" className={styles.matchTime}>
                        {post.matchTime}
                      </Typography>
                    </Box>
                    <Chip
                      label={`Need ${post.needed} player${post.needed > 1 ? 's' : ''}`}
                      size="small"
                      className={styles.neededChip}
                    />
                  </Box>

                  <Box className={styles.guestTeamInfo}>
                    <Avatar
                      src={post.teamLogo}
                      className={styles.teamLogo}
                      sx={{ width: 40, height: 40 }}
                    >
                      {post.teamName[0]}
                    </Avatar>
                    <Typography variant="h6" className={styles.matchField}>
                      {post.teamName} - {post.field}
                    </Typography>
                  </Box>

                  <Box className={styles.matchDetails}>
                    <Chip
                      icon={<WcIcon />}
                      label={post.gender}
                      size="small"
                      className={styles.detailChip}
                    />
                    <Typography variant="body2" className={styles.detailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.detailText}>
                      {post.format}
                    </Typography>
                    <Typography variant="body2" className={styles.detailSeparator}>
                      ·
                    </Typography>
                    <Typography variant="body2" className={styles.detailText}>
                      {post.level}
                    </Typography>
                    {post.parking && (
                      <>
                        <Typography variant="body2" className={styles.detailSeparator}>
                          ·
                        </Typography>
                        <Typography variant="body2" className={styles.detailText}>
                          {post.parking}
                        </Typography>
                      </>
                    )}
                  </Box>

                  <Typography variant="body2" className={styles.guestDescription}>
                    {post.description}
                  </Typography>

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

        {/* Floating Action Button */}
        <IconButton
          className={styles.floatingActionButton}
          component={Link}
          href="/team/guests/create"
        >
          <AddIcon />
        </IconButton>
      </Box>
    </>
  );
}
