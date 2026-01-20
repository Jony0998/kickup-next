import { Box, Typography, Link as MuiLink } from '@mui/material';
import Link from 'next/link';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import InstagramIcon from '@mui/icons-material/Instagram';
import YouTubeIcon from '@mui/icons-material/YouTube';
import EmailIcon from '@mui/icons-material/Email';
import styles from '@/styles/footer.module.scss';

export default function Footer() {
  return (
    <Box component="footer" className={styles.footer}>
      <Box className={styles.container}>
        <Box className={styles.footerTop}>
          <Box className={styles.logoSection}>
            <SportsSoccerIcon className={styles.logoIcon} />
            <Typography variant="h6" className={styles.logoText}>
              KickUp
            </Typography>
          </Box>
          <Box className={styles.footerLinks}>
            <MuiLink component={Link} href="/terms" className={styles.footerLink}>
              Terms of Service
            </MuiLink>
            <span className={styles.separator}>|</span>
            <MuiLink component={Link} href="/privacy" className={styles.footerLink}>
              Privacy Policy
            </MuiLink>
            <span className={styles.separator}>|</span>
            <MuiLink component={Link} href="/business" className={styles.footerLink}>
              Business Info
            </MuiLink>
            <span className={styles.separator}>|</span>
            <MuiLink component={Link} href="/careers" className={styles.footerLink}>
              Careers
            </MuiLink>
          </Box>
          <Box className={styles.socialLinks}>
            <MuiLink href="https://instagram.com" target="_blank" className={styles.socialLink}>
              <InstagramIcon />
            </MuiLink>
            <MuiLink href="https://youtube.com" target="_blank" className={styles.socialLink}>
              <YouTubeIcon />
            </MuiLink>
          </Box>
        </Box>

        <Box className={styles.footerMiddle}>
          <Typography variant="body2" className={styles.address}>
            KickUp | 123 Main Street, Building 2F | 02-123-4567
          </Typography>
          <Box className={styles.emailSection}>
            <Typography variant="body2" component="span" className={styles.emailLabel}>
              Contact Email:{' '}
            </Typography>
            <MuiLink href="mailto:contact@kickup.com" className={styles.emailLink}>
              contact@kickup.com
            </MuiLink>
            <Typography variant="body2" component="span" className={styles.emailLabel}>
              {' '}Marketing:{' '}
            </Typography>
            <MuiLink href="mailto:marketing@kickup.com" className={styles.emailLink}>
              marketing@kickup.com
            </MuiLink>
            <Typography variant="body2" component="span" className={styles.emailLabel}>
              {' '}Press:{' '}
            </Typography>
            <MuiLink href="mailto:press@kickup.com" className={styles.emailLink}>
              press@kickup.com
            </MuiLink>
          </Box>
          <Typography variant="body2" className={styles.businessInfo}>
            KickUp Company | Business No. 123-45-67890 | CEO John Doe | E-commerce Registration 2024-Seoul-1234
          </Typography>
        </Box>

        <Box className={styles.footerBottom}>
          <Typography variant="body2" className={styles.copyright}>
            Copyright © KickUp Company All Rights Reserved.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}

