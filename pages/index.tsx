import Head from "next/head";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  TextField,
  InputAdornment,
  Chip,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import MenuIcon from "@mui/icons-material/Menu";
import EmojiEventsIcon from "@mui/icons-material/EmojiEvents";
import LocalFloristIcon from "@mui/icons-material/LocalFlorist";
import BoltIcon from "@mui/icons-material/Bolt";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import FavoriteIcon from "@mui/icons-material/Favorite";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import RefreshIcon from "@mui/icons-material/Refresh";
import styles from "@/styles/home.module.scss";

export default function Home() {
  // Generate dates for calendar
  const today = new Date();
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    return date;
  });

  const getDayName = (date: Date) => {
    const days = ["Yak", "Du", "Se", "Cho", "Pay", "Ju", "Sha"];
    return days[date.getDay()];
  };

  return (
    <>
      <Head>
        <title>KickUp - Futbol va Futsal O'yinlar Platformasi</title>
        <meta
          name="description"
          content="Futbol va futsal o'yinlarini tashkil qiluvchi platforma. Maydonlar, o'yinlar va jamoalar toping."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Box>
        {/* Hero Section - Plab style */}
        <Box className={styles.hero}>
          <Container maxWidth="lg">
            <Box className={styles.heroContent}>
              <Box className={styles.heroIllustration}>
                <Box className={styles.heroPeople}>
                  <Box className={styles.person}>
                    <Box className={styles.personBody}></Box>
                    <Box className={styles.personHead}></Box>
                  </Box>
                  <Box className={styles.person}>
                    <Box className={styles.personBody}></Box>
                    <Box className={styles.personHead}></Box>
                  </Box>
                </Box>
                <Box className={styles.heroBubbles}>
                  <Box className={styles.bubble}>
                    <FavoriteIcon sx={{ fontSize: 20, color: '#ff6b6b' }} />
                  </Box>
                  <Box className={styles.bubble}>
                    <ThumbUpIcon sx={{ fontSize: 20, color: '#4ecdc4' }} />
                  </Box>
                </Box>
              </Box>
              <Typography variant="h3" className={styles.heroTitle}>
                Hurmat qiling, rag'batlantiring va birga zavqlaning
              </Typography>
            </Box>
          </Container>
        </Box>

        {/* Feature Blocks - 4 cards */}
        <Box className={styles.featureBlocks}>
          <Container maxWidth="lg">
            <Grid container spacing={3}>
              <Grid item xs={6} sm={3}>
                <Card className={styles.featureBlock} elevation={0}>
                  <CardContent className={styles.featureBlockContent}>
                    <Box className={styles.featureBlockIcon}>
                      <MenuIcon sx={{ fontSize: 32, color: '#0ea5e9' }} />
                    </Box>
                    <Typography variant="body1" className={styles.featureBlockText}>
                      Barcha menyu
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className={styles.featureBlock} elevation={0}>
                  <CardContent className={styles.featureBlockContent}>
                    <Box className={styles.featureBlockIcon}>
                      <LocalFloristIcon sx={{ fontSize: 32, color: '#10b981' }} />
                    </Box>
                    <Typography variant="body1" className={styles.featureBlockText}>
                      Boshlang'ich
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className={styles.featureBlock} elevation={0}>
                  <CardContent className={styles.featureBlockContent}>
                    <Box className={styles.featureBlockIcon}>
                      <BoltIcon sx={{ fontSize: 32, color: '#f59e0b' }} />
                    </Box>
                    <Typography variant="body1" className={styles.featureBlockText}>
                      Jamoa ligasi
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={6} sm={3}>
                <Card className={styles.featureBlock} elevation={0}>
                  <CardContent className={styles.featureBlockContent}>
                    <Box className={styles.featureBlockIcon}>
                      <PlayArrowIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
                    </Box>
                    <Typography variant="body1" className={styles.featureBlockText}>
                      Boshlash
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* Calendar Section */}
        <Box className={styles.calendarSection}>
          <Container maxWidth="lg">
            <Box className={styles.calendarDates}>
              {dates.map((date, index) => (
                <Chip
                  key={index}
                  label={
                    <Box className={styles.dateChip}>
                      <Typography variant="body2" className={styles.dateNumber}>
                        {date.getDate()}
                      </Typography>
                      <Typography variant="caption" className={styles.dateDay}>
                        {getDayName(date)}
                      </Typography>
                    </Box>
                  }
                  className={`${styles.dateChip} ${index === 0 ? styles.dateChipActive : ''}`}
                  clickable
                />
              ))}
            </Box>
            <Box className={styles.favoriteFieldButton}>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                className={styles.favoriteFieldBtn}
                component={Link}
                href="/fields"
              >
                Tez-tez boradigan maydonni tanlang
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
