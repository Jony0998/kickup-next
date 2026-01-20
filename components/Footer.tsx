import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import styles from '@/styles/footer.module.scss';

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.container}>
        <Box className={styles.grid}>
          <Box>
            <Box className={styles.logoSection}>
              <SportsSoccerIcon className={styles.logoIcon} />
              <Typography variant="h6" className={styles.logoText}>
                KickUp
              </Typography>
            </Box>
            <Typography variant="body2">
              Futbol va futsal o'yinlarini tashkil qiluvchi platforma
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" className={styles.sectionTitle}>
              Platforma
            </Typography>
            <Box className={styles.linkList}>
              <MuiLink component={Link} href="/fields" className={styles.link}>
                Maydonlar
              </MuiLink>
              <MuiLink component={Link} href="/games" className={styles.link}>
                O'yinlar
              </MuiLink>
              <MuiLink component={Link} href="/create-game" className={styles.link}>
                O'yin yaratish
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" className={styles.sectionTitle}>
              Foydalanuvchi
            </Typography>
            <Box className={styles.linkList}>
              <MuiLink component={Link} href="/login" className={styles.link}>
                Kirish
              </MuiLink>
              <MuiLink component={Link} href="/register" className={styles.link}>
                Ro'yxatdan o'tish
              </MuiLink>
              <MuiLink component={Link} href="/profile" className={styles.link}>
                Profil
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" className={styles.sectionTitle}>
              Aloqa
            </Typography>
            <Box className={styles.linkList}>
              <MuiLink href="#" className={styles.link}>
                Yordam
              </MuiLink>
              <MuiLink href="#" className={styles.link}>
                Qoidalar
              </MuiLink>
              <MuiLink href="#" className={styles.link}>
                Biz haqimizda
              </MuiLink>
            </Box>
          </Box>
        </Box>

        <Box className={styles.divider}>
          <Typography variant="body2">
            &copy; 2024 KickUp. Barcha huquqlar himoyalangan.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

