import { ReactNode } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import Link from 'next/link';
import { useState } from 'react';
import Footer from './Footer';
import styles from '@/styles/layout.module.scss';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const navItems = [
    { label: 'Maydonlar', href: '/fields' },
    { label: "O'yinlar", href: '/games' },
    { label: "O'yin yaratish", href: '/create-game' },
  ];

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        KickUp
      </Typography>
      <List>
        {navItems.map((item) => (
          <ListItem key={item.label} disablePadding>
            <ListItemButton
              component={Link}
              href={item.href}
              sx={{ textAlign: 'center' }}
            >
              <ListItemText primary={item.label} />
            </ListItemButton>
          </ListItem>
        ))}
        <ListItem disablePadding>
          <ListItemButton component={Link} href="/login" sx={{ textAlign: 'center' }}>
            <ListItemText primary="Kirish" />
          </ListItemButton>
        </ListItem>
        <ListItem disablePadding>
          <ListItemButton
            component={Link}
            href="/register"
            sx={{ textAlign: 'center', bgcolor: 'primary.main', color: 'white', '&:hover': { bgcolor: 'primary.dark' } }}
          >
            <ListItemText primary="Ro'yxatdan o'tish" />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box className={styles.layout}>
      <AppBar position="sticky" elevation={2} className={styles.appBar}>
        <Toolbar className={styles.toolbar}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            className={styles.menuButton}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Box
            component={Link}
            href="/"
            className={styles.logoContainer}
          >
            <SportsSoccerIcon className={styles.logoIcon} />
            <Typography variant="h6" component="div" className={styles.logoText}>
              KickUp
            </Typography>
          </Box>
          <Box className={styles.navButtons}>
            {navItems.map((item) => (
              <Button
                key={item.label}
                component={Link}
                href={item.href}
                sx={{ color: 'white' }}
              >
                {item.label}
              </Button>
            ))}
          </Box>
          <Box className={styles.authButtons}>
            <Button
              component={Link}
              href="/login"
              sx={{ color: 'white' }}
            >
              Kirish
            </Button>
            <Button
              component={Link}
              href="/register"
              variant="contained"
              sx={{ bgcolor: 'white', color: 'primary.main', '&:hover': { bgcolor: 'grey.100' } }}
            >
              Ro'yxatdan o'tish
            </Button>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 240 },
        }}
      >
        <Box onClick={handleDrawerToggle} className={styles.drawerContent}>
          <Typography variant="h6" className={styles.drawerTitle}>
            KickUp
          </Typography>
          <List className={styles.drawerList}>
            {navItems.map((item) => (
              <ListItem key={item.label} disablePadding className={styles.drawerListItem}>
                <ListItemButton
                  component={Link}
                  href={item.href}
                  className={styles.drawerListItemButton}
                >
                  <ListItemText primary={item.label} />
                </ListItemButton>
              </ListItem>
            ))}
            <ListItem disablePadding className={styles.drawerListItem}>
              <ListItemButton component={Link} href="/login" className={styles.drawerListItemButton}>
                <ListItemText primary="Kirish" />
              </ListItemButton>
            </ListItem>
            <ListItem disablePadding className={styles.drawerListItem}>
              <ListItemButton
                component={Link}
                href="/register"
                className={`${styles.drawerListItemButton} ${styles.drawerAuthButton}`}
              >
                <ListItemText primary="Ro'yxatdan o'tish" />
              </ListItemButton>
            </ListItem>
          </List>
        </Box>
      </Drawer>

      <Box component="main" className={styles.main}>
        {children}
      </Box>

      <Footer />
    </Box>
  );
}

