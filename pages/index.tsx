import Head from "next/head";
import Link from "next/link";
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import styles from "@/styles/home.module.scss";

export default function Home() {
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
        {/* Hero Section */}
        <Box className={styles.hero}>
          <Container maxWidth="lg">
            <Box className={styles.heroContent}>
              <Typography
                variant="h2"
                component="h1"
                className={styles.heroTitle}
              >
                Futbol o'yinlarini toping va qo'shiling
              </Typography>
              <Typography
                variant="h5"
                className={styles.heroSubtitle}
              >
                Maydonlar, o'yinlar va yangi jamoalar toping. Futbol sevuvchilar
                uchun platforma
              </Typography>
              <Box className={styles.heroButtons}>
                <Button
                  component={Link}
                  href="/games"
                  variant="contained"
                  size="large"
                  sx={{
                    bgcolor: 'white',
                    color: 'primary.main',
                    '&:hover': { bgcolor: 'grey.100' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  O'yinlarni ko'rish
                </Button>
                <Button
                  component={Link}
                  href="/create-game"
                  variant="outlined"
                  size="large"
                  sx={{
                    borderColor: 'white',
                    color: 'white',
                    '&:hover': { borderColor: 'white', bgcolor: 'rgba(255,255,255,0.1)' },
                    px: 4,
                    py: 1.5,
                  }}
                >
                  O'yin yaratish
                </Button>
              </Box>
            </Box>
          </Container>
        </Box>

        {/* Features Section */}
        <Box className={styles.features}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              className={styles.featuresTitle}
            >
              Nima uchun KickUp?
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent className={styles.featureCard}>
                    <Box className={styles.featureIcon}>
                      <LocationOnIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" className={styles.featureTitle}>
                      Maydonlar topish
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Shahr bo'ylab eng yaxshi futsal va futbol maydonlarini
                      toping va band qiling
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent className={styles.featureCard}>
                    <Box className={styles.featureIcon}>
                      <GroupsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" className={styles.featureTitle}>
                      Jamoalar tuzish
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      O'zingizga mos o'yinlarni toping yoki yangi jamoalar
                      tuzing
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>

              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent className={styles.featureCard}>
                    <Box className={styles.featureIcon}>
                      <CheckCircleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" className={styles.featureTitle}>
                      Oson boshqarish
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      O'yin menejerlari bilan oson boshqarish va tashkil etish
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Container>
        </Box>

        {/* CTA Section */}
        <Box className={styles.cta}>
          <Container maxWidth="md">
            <Box className={styles.ctaContent}>
              <Typography
                variant="h3"
                component="h2"
                className={styles.ctaTitle}
              >
                Hozir boshlang va o'yinlarda qatnashing
              </Typography>
              <Typography variant="h6" className={styles.ctaSubtitle}>
                Ro'yxatdan o'ting va birinchi o'yiningizni toping
              </Typography>
              <Button
                component={Link}
                href="/register"
                variant="contained"
                size="large"
                sx={{
                  bgcolor: 'white',
                  color: 'primary.main',
                  '&:hover': { bgcolor: 'grey.100' },
                  px: 6,
                  py: 1.5,
                }}
              >
                Ro'yxatdan o'tish
              </Button>
            </Box>
          </Container>
        </Box>
      </Box>
    </>
  );
}
