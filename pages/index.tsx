import Head from "next/head";
import Link from "next/link";
import { Box, Container, Typography, Button, Grid, Card, CardContent } from "@mui/material";
import SportsSoccerIcon from "@mui/icons-material/SportsSoccer";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import GroupsIcon from "@mui/icons-material/Groups";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

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
        <Box
          sx={{
            background: 'linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%)',
            color: 'white',
            py: { xs: 8, md: 12 },
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h2"
                component="h1"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '2.5rem', md: '3.75rem' },
                }}
              >
                Futbol o'yinlarini toping va qo'shiling
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  mb: 4,
                  color: 'rgba(255, 255, 255, 0.9)',
                  fontSize: { xs: '1.25rem', md: '1.5rem' },
                }}
              >
                Maydonlar, o'yinlar va yangi jamoalar toping. Futbol sevuvchilar
                uchun platforma
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: { xs: 'column', sm: 'row' },
                  gap: 2,
                  justifyContent: 'center',
                }}
              >
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
        <Box sx={{ py: { xs: 8, md: 12 }, bgcolor: 'grey.50' }}>
          <Container maxWidth="lg">
            <Typography
              variant="h3"
              component="h2"
              sx={{ textAlign: 'center', mb: 8, fontWeight: 700 }}
            >
              Nima uchun KickUp?
            </Typography>
            <Grid container spacing={4}>
              <Grid item xs={12} md={4}>
                <Card elevation={2}>
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.50',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <LocationOnIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
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
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.50',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <GroupsIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
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
                  <CardContent sx={{ p: 4 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        bgcolor: 'primary.50',
                        borderRadius: 2,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        mb: 3,
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 32, color: 'primary.main' }} />
                    </Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 2 }}>
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
        <Box
          sx={{
            py: { xs: 8, md: 12 },
            bgcolor: 'primary.main',
            color: 'white',
          }}
        >
          <Container maxWidth="md">
            <Box sx={{ textAlign: 'center' }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{ fontWeight: 700, mb: 2 }}
              >
                Hozir boshlang va o'yinlarda qatnashing
              </Typography>
              <Typography variant="h6" sx={{ mb: 4, color: 'rgba(255,255,255,0.9)' }}>
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
