import { Box, Container, Grid, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: 'grey.900',
        color: 'grey.300',
        py: 6,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <SportsSoccerIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" sx={{ fontWeight: 'bold', color: 'white' }}>
                KickUp
              </Typography>
            </Box>
            <Typography variant="body2">
              Futbol va futsal o'yinlarini tashkil qiluvchi platforma
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Platforma
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/fields" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Maydonlar
              </MuiLink>
              <MuiLink component={Link} href="/games" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                O'yinlar
              </MuiLink>
              <MuiLink component={Link} href="/create-game" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                O'yin yaratish
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Foydalanuvchi
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink component={Link} href="/login" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Kirish
              </MuiLink>
              <MuiLink component={Link} href="/register" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Ro'yxatdan o'tish
              </MuiLink>
              <MuiLink component={Link} href="/profile" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Profil
              </MuiLink>
            </Box>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" sx={{ color: 'white', mb: 2, fontWeight: 600 }}>
              Aloqa
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              <MuiLink href="#" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Yordam
              </MuiLink>
              <MuiLink href="#" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Qoidalar
              </MuiLink>
              <MuiLink href="#" color="inherit" sx={{ '&:hover': { color: 'white' } }}>
                Biz haqimizda
              </MuiLink>
            </Box>
          </Grid>
        </Grid>

        <Box
          sx={{
            mt: 4,
            pt: 4,
            borderTop: '1px solid',
            borderColor: 'grey.800',
            textAlign: 'center',
          }}
        >
          <Typography variant="body2">
            &copy; 2024 KickUp. Barcha huquqlar himoyalangan.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}

