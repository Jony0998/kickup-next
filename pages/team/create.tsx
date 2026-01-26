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
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Avatar,
  Chip,
  IconButton,
} from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import DeleteIcon from "@mui/icons-material/Delete";
import styles from "@/styles/team.module.scss";

export default function CreateTeamPage() {
  const [teamName, setTeamName] = useState("");
  const [teamDescription, setTeamDescription] = useState("");
  const [gender, setGender] = useState("");
  const [level, setLevel] = useState("");
  const [location, setLocation] = useState("");
  const [teamLogo, setTeamLogo] = useState<string | null>(null);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setTeamLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission
    console.log("Team created:", {
      teamName,
      teamDescription,
      gender,
      level,
      location,
      teamLogo,
    });
  };

  return (
    <>
      <Head>
        <title>Create Team - KickUp</title>
        <meta
          name="description"
          content="Create your own team on KickUp and start competing."
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
              <AddCircleIcon className={styles.pageTitleIcon} />
              <Typography variant="h4" className={styles.pageTitle}>
                Create New Team
              </Typography>
            </Box>
            <Typography variant="body1" className={styles.pageSubtitle}>
              Start your own team and compete in leagues
            </Typography>
          </Box>
        </Container>

        {/* Create Team Form */}
        <Container maxWidth="md">
          <Card className={styles.createTeamCard}>
            <CardContent className={styles.createTeamCardContent}>
              <form onSubmit={handleSubmit}>
                {/* Team Logo */}
                <Box className={styles.logoUploadSection}>
                  <Typography variant="h6" className={styles.formSectionTitle}>
                    Team Logo
                  </Typography>
                  <Box className={styles.logoUploadBox}>
                    <Avatar
                      src={teamLogo || undefined}
                      className={styles.teamLogoPreview}
                      sx={{ width: 120, height: 120 }}
                    >
                      {teamName[0] || "T"}
                    </Avatar>
                    <Box className={styles.logoUploadActions}>
                      <input
                        accept="image/*"
                        style={{ display: "none" }}
                        id="logo-upload"
                        type="file"
                        onChange={handleLogoUpload}
                      />
                      <label htmlFor="logo-upload">
                        <Button
                          variant="outlined"
                          component="span"
                          startIcon={<PhotoCameraIcon />}
                          className={styles.uploadButton}
                        >
                          Upload Logo
                        </Button>
                      </label>
                      {teamLogo && (
                        <IconButton
                          onClick={() => setTeamLogo(null)}
                          className={styles.deleteLogoButton}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </Box>
                  </Box>
                </Box>

                {/* Team Name */}
                <Box className={styles.formSection}>
                  <Typography variant="h6" className={styles.formSectionTitle}>
                    Team Name *
                  </Typography>
                  <TextField
                    fullWidth
                    required
                    value={teamName}
                    onChange={(e) => setTeamName(e.target.value)}
                    placeholder="Enter your team name"
                    className={styles.formField}
                  />
                </Box>

                {/* Team Description */}
                <Box className={styles.formSection}>
                  <Typography variant="h6" className={styles.formSectionTitle}>
                    Team Description
                  </Typography>
                  <TextField
                    fullWidth
                    multiline
                    rows={4}
                    value={teamDescription}
                    onChange={(e) => setTeamDescription(e.target.value)}
                    placeholder="Tell us about your team..."
                    className={styles.formField}
                  />
                </Box>

                {/* Team Details */}
                <Box className={styles.formSection}>
                  <Typography variant="h6" className={styles.formSectionTitle}>
                    Team Details
                  </Typography>
                  <Box className={styles.formRow}>
                    <FormControl fullWidth className={styles.formField}>
                      <InputLabel>Gender</InputLabel>
                      <Select
                        value={gender}
                        onChange={(e) => setGender(e.target.value)}
                        label="Gender"
                      >
                        <MenuItem value="male">Male</MenuItem>
                        <MenuItem value="female">Female</MenuItem>
                        <MenuItem value="mixed">Mixed</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl fullWidth className={styles.formField}>
                      <InputLabel>Level</InputLabel>
                      <Select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        label="Level"
                      >
                        <MenuItem value="beginner">Beginner</MenuItem>
                        <MenuItem value="intermediate">Intermediate</MenuItem>
                        <MenuItem value="advanced">Advanced</MenuItem>
                        <MenuItem value="all">All Levels</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>

                  <FormControl fullWidth className={styles.formField}>
                    <InputLabel>Location</InputLabel>
                    <Select
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      label="Location"
                    >
                      <MenuItem value="seoul">Seoul</MenuItem>
                      <MenuItem value="busan">Busan</MenuItem>
                      <MenuItem value="incheon">Incheon</MenuItem>
                      <MenuItem value="other">Other</MenuItem>
                    </Select>
                  </FormControl>
                </Box>

                {/* Form Actions */}
                <Box className={styles.formActions}>
                  <Button
                    variant="outlined"
                    component={Link}
                    href="/team"
                    className={styles.formActionButton}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    variant="contained"
                    className={styles.formActionButton}
                  >
                    Create Team
                  </Button>
                </Box>
              </form>
            </CardContent>
          </Card>
        </Container>
      </Box>
    </>
  );
}

