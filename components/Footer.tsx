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
              Platform for organizing football and futsal games
            </Typography>
          </Box>

          <Box>
            <Typography variant="h6" className={styles.sectionTitle}>
              Platform
            </Typography>
            <Box className={styles.linkList}>
              <MuiLink component={Link} href="/fields" className={styles.link}>
                Fields
              </MuiLink>
              <MuiLink component={Link} href="/games" className={styles.link}>
                Games
              </MuiLink>
              <MuiLink component={Link} href="/create-game" className={styles.link}>
                Create Game
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" className={styles.sectionTitle}>
              User
            </Typography>
            <Box className={styles.linkList}>
              <MuiLink component={Link} href="/login" className={styles.link}>
                Login
              </MuiLink>
              <MuiLink component={Link} href="/register" className={styles.link}>
                Sign Up
              </MuiLink>
              <MuiLink component={Link} href="/profile" className={styles.link}>
                Profile
              </MuiLink>
            </Box>
          </Box>

          <Box>
            <Typography variant="h6" className={styles.sectionTitle}>
              Contact
            </Typography>
            <Box className={styles.linkList}>
              <MuiLink href="#" className={styles.link}>
                Help
              </MuiLink>
              <MuiLink href="#" className={styles.link}>
                Rules
              </MuiLink>
              <MuiLink href="#" className={styles.link}>
                About Us
              </MuiLink>
            </Box>
          </Box>
        </Box>

        <Box className={styles.divider}>
          <Typography variant="body2">
            &copy; 2024 KickUp. All rights reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

