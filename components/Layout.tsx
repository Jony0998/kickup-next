import { ReactNode, useRef, useState as useLocalState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Container,
  Avatar,
  Menu,
  MenuItem,
  InputBase,
  Link as MuiLink,
  useMediaQuery,
  useTheme as useMuiTheme,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PersonIcon from '@mui/icons-material/Person';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/router';
import Footer from './Footer';
import BottomNav from './BottomNav';
import NotificationBell from './NotificationBell';
import SeoHead from './SeoHead';
import SupportPanel from './SupportPanel';
import { useAuth } from '@/contexts/AuthContext';
import styles from '@/styles/layout.module.scss';
import { useTheme } from '@/contexts/ThemeContext';
import { useSearch } from '@/contexts/SearchContext';
import { useErrorNotification } from '@/contexts/ErrorNotificationContext';
import { normalizeImageUrl } from '@/lib/imageUrl';

interface LayoutProps {
  children?: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const router = useRouter();
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const { showSuccess } = useErrorNotification();
  const theme = useTheme(); // Use custom theme context
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const isDark = theme.theme === 'dark';

  const { searchQuery, setSearchQuery, searchMatches, setSearchMatches } = useSearch();
  const searchRef = useRef<HTMLInputElement>(null);
  const [searchFocused, setSearchFocused] = useLocalState(false);
  const isHomePage = router.pathname === '/';
  const isAdminPanel = router.pathname.startsWith('/admin');

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [supportPanelOpen, setSupportPanelOpen] = useState(false);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogoutClick = () => {
    handleClose();
    setLogoutDialogOpen(true);
  };

  const handleLogoutConfirm = () => {
    setLogoutDialogOpen(false);
    showSuccess('You have been logged out.');
    logout();
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: 'var(--plab-bg)' }}>
      <SeoHead />
      {/* Desktop Navbar */}
      <AppBar
        position="sticky"
        elevation={0}
        sx={{
          bgcolor: 'background.paper',
          borderBottom: isDark ? '1px solid rgba(255,255,255,0.1)' : '1px solid var(--plab-light-gray)',
          color: 'text.primary',
          transition: 'background-color 0.3s ease, border-color 0.3s ease, color 0.3s ease'
        }}
      >
        <Container maxWidth="lg">
          <Toolbar disableGutters sx={{ height: 60, display: 'flex', justifyContent: 'space-between' }}>

            {/* Logo — modern mark + wordmark */}
            <Box
              component={Link}
              href="/"
              sx={{
                display: 'flex',
                alignItems: 'center',
                textDecoration: 'none',
                color: 'inherit',
                gap: 1.25
              }}
            >
              <Box
                sx={{
                  width: 36,
                  height: 36,
                  borderRadius: 10,
                  background: 'linear-gradient(135deg, #00E377 0%, #00C466 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--plab-black)',
                  boxShadow: '0 2px 8px rgba(0, 227, 119, 0.35)',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  '&:hover': { transform: 'scale(1.03)', boxShadow: '0 4px 12px rgba(0, 227, 119, 0.4)' },
                  '&:active': { transform: 'scale(0.98)' }
                }}
              >
                <SportsSoccerIcon sx={{ fontSize: 20 }} />
              </Box>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 800,
                  letterSpacing: '-0.03em',
                  fontSize: '1.35rem',
                  fontFamily: '"Inter", "SF Pro Display", "Roboto", sans-serif',
                  background: isDark ? undefined : 'linear-gradient(135deg, #191F28 0%, #333D4B 100%)',
                  backgroundClip: isDark ? undefined : 'text',
                  WebkitBackgroundClip: isDark ? undefined : 'text',
                  color: isDark ? 'inherit' : 'transparent',
                  textTransform: 'none'
                }}
              >
                KickUp
              </Typography>
            </Box>

            {/* ── Plab-style Autocomplete Search ── */}
            {isHomePage && (
              <Box sx={{ flex: 1, mx: { xs: 1, md: 3 }, maxWidth: { xs: 'none', md: 460 }, position: 'relative' }}>
                {/* Input row */}
                <Box sx={{
                  display: 'flex', alignItems: 'center', gap: 1,
                  px: 1.5, py: 0.6, borderRadius: '12px',
                  bgcolor: isDark ? 'rgba(255,255,255,0.07)' : 'rgba(0,0,0,0.05)',
                  border: searchFocused ? '1.5px solid #00E377' : isDark ? '1.5px solid rgba(255,255,255,0.1)' : '1.5px solid rgba(0,0,0,0.1)',
                  transition: 'border-color 0.2s',
                }}>
                  <SearchIcon sx={{ fontSize: 18, color: searchFocused ? '#00E377' : 'text.secondary', flexShrink: 0, transition: 'color 0.2s' }} />
                  <InputBase
                    inputRef={searchRef}
                    placeholder="Search match, venue, time..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setSearchFocused(true)}
                    onBlur={() => setTimeout(() => setSearchFocused(false), 160)}
                    fullWidth
                    sx={{ fontSize: '13.5px', fontWeight: 500, color: 'text.primary', '& input::placeholder': { color: 'text.secondary', opacity: 1 } }}
                  />
                  {searchQuery && (
                    <IconButton size="small" onMouseDown={(e) => e.preventDefault()}
                      onClick={() => { setSearchQuery(''); searchRef.current?.focus(); }}
                      sx={{ color: 'text.secondary', p: 0.3 }}>
                      <ClearIcon sx={{ fontSize: 15 }} />
                    </IconButton>
                  )}
                </Box>

                {/* Autocomplete Dropdown */}
                {searchFocused && searchQuery.trim().length >= 1 && (() => {
                  const q = searchQuery.toLowerCase();
                  const hits = searchMatches.filter(m => {
                    const title = m.matchTitle?.toLowerCase() || '';
                    const city = m.location?.city?.toLowerCase() || '';
                    const addr = m.location?.address?.toLowerCase() || '';
                    const field = typeof m.fieldId === 'object' && m.fieldId !== null
                      ? ((m.fieldId as any)?.propertyName?.toLowerCase() || '') : '';
                    return title.includes(q) || city.includes(q) || addr.includes(q) || field.includes(q) || (m.matchTime || '').includes(q);
                  }).slice(0, 6);
                  return (
                    <Box sx={{
                      position: 'absolute', top: 'calc(100% + 6px)', left: 0, right: 0,
                      bgcolor: 'background.paper', borderRadius: '12px',
                      border: '1px solid', borderColor: isDark ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.1)',
                      boxShadow: '0 8px 32px rgba(0,0,0,0.18)', overflow: 'hidden', zIndex: 9999,
                    }}>
                      {hits.length === 0 ? (
                        <Box sx={{ p: 2, textAlign: 'center', fontSize: '13px', color: 'text.secondary' }}>
                          No results for "{searchQuery}"
                        </Box>
                      ) : hits.map((match) => (
                        <Box key={match._id}
                          onMouseDown={(e) => {
                            e.preventDefault();
                            setSearchQuery('');
                            setSearchFocused(false);
                            router.push(`/match/${match._id}`);
                          }}
                          sx={{
                            display: 'flex', alignItems: 'center', gap: 1.5, px: 2, py: 1.2,
                            cursor: 'pointer', borderBottom: '1px solid',
                            borderColor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)',
                            '&:last-child': { borderBottom: 'none' },
                            '&:hover': { bgcolor: isDark ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.04)' },
                            transition: 'background 0.12s',
                          }}
                        >
                          <Box sx={{ bgcolor: 'rgba(0,227,119,0.12)', color: '#00E377', fontSize: '11px', fontWeight: 800, borderRadius: '6px', px: 1, py: 0.3, whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {(match.matchTime || '--:--').slice(0, 5)}
                          </Box>
                          <Box sx={{ flex: 1, minWidth: 0 }}>
                            <Box sx={{ fontSize: '13.5px', fontWeight: 700, color: 'text.primary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {match.matchTitle}
                            </Box>
                            <Box sx={{ fontSize: '11.5px', color: 'text.secondary', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                              {match.location?.city || match.location?.address || 'No location'}
                            </Box>
                          </Box>
                          <Box sx={{ color: 'text.secondary', fontSize: '18px', lineHeight: 1 }}>›</Box>
                        </Box>
                      ))}
                    </Box>
                  );
                })()}
              </Box>
            )}

            {!isMobile && (
              <Box sx={{ display: 'flex', gap: 4 }}>
                <MuiLink
                  component={Link}
                  href="/"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: router.pathname === '/' ? '#00E377' : (isDark ? 'var(--plab-dark-gray)' : 'var(--plab-gray)'),
                    transition: 'color 0.2s ease, opacity 0.15s ease',
                    textDecoration: 'none',
                    '&:active': { opacity: 0.7 },
                  }}
                >
                  Match
                </MuiLink>
                <MuiLink
                  component={Link}
                  href="/team"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: router.pathname.startsWith('/team') ? '#00E377' : (isDark ? 'var(--plab-dark-gray)' : 'var(--plab-gray)'),
                    transition: 'color 0.2s ease, opacity 0.15s ease',
                    textDecoration: 'none',
                    '&:active': { opacity: 0.7 },
                  }}
                >
                  Team
                </MuiLink>
                <MuiLink
                  component={Link}
                  href="/rental"
                  sx={{
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    color: router.pathname.startsWith('/rental') ? '#00E377' : (isDark ? 'var(--plab-dark-gray)' : 'var(--plab-gray)'),
                    transition: 'color 0.2s ease, opacity 0.15s ease',
                    textDecoration: 'none',
                    '&:active': { opacity: 0.7 },
                  }}
                >
                  Stadium
                </MuiLink>
                {isAdmin && (
                  <MuiLink
                    component={Link}
                    href="/admin/dashboard"
                    sx={{
                      fontWeight: 600,
                      fontSize: '0.95rem',
                      color: router.pathname.startsWith('/admin') ? '#00E377' : (isDark ? 'var(--plab-dark-gray)' : 'var(--plab-gray)'),
                      transition: 'color 0.2s ease, opacity 0.15s ease',
                      textDecoration: 'none',
                      '&:active': { opacity: 0.7 },
                    }}
                  >
                    Admin
                  </MuiLink>
                )}
              </Box>
            )}

            {/* Auth / Menu */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              {/* Dark Mode Toggle */}
              <IconButton
                onClick={theme.toggleTheme}
                sx={{ color: 'inherit' }}
              >
                {theme.theme === 'dark' ? <LightModeIcon /> : <DarkModeIcon />}
              </IconButton>

              {/* Calendar - Always visible on Desktop */}
              {!isMobile && (
                <IconButton
                  component={Link}
                  href="/calendar"
                  sx={{ color: 'inherit' }}
                >
                  <CalendarTodayIcon />
                </IconButton>
              )}

              {/* Notification Bell */}
              {isAuthenticated && <NotificationBell />}

              {isAuthenticated ? (
                <>
                  {/* My Page - Icon for fast access */}
                  {!isMobile && (
                    <IconButton
                      component={Link}
                      href="/mypage"
                      sx={{ color: 'inherit' }}
                    >
                      <AccountCircleIcon />
                    </IconButton>
                  )}

                  <IconButton onClick={handleMenu} size="small">
                    <Avatar
                      src={normalizeImageUrl(user?.memberImage) || undefined}
                      sx={{
                        width: 32,
                        height: 32,
                        bgcolor: 'var(--plab-dark-gray)',
                        color: 'background.paper',
                      }}
                    >
                      {user?.memberImage ? (user?.memberNick?.[0]?.toUpperCase() || 'U') : <PersonIcon sx={{ fontSize: 20 }} />}
                    </Avatar>
                  </IconButton>
                  <Menu
                    anchorEl={anchorEl}
                    open={Boolean(anchorEl)}
                    onClose={handleClose}
                    anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                  >
                    <MenuItem onClick={() => router.push('/mypage')}>My Page</MenuItem>
                    <MenuItem onClick={handleLogoutClick}>Logout</MenuItem>
                  </Menu>
                </>
              ) : (
                <>
                  <Button
                    component={Link}
                    href="/login"
                    sx={{
                      fontWeight: 700,
                      color: 'var(--text-main)',
                      fontSize: '0.9rem'
                    }}
                  >
                    Login
                  </Button>
                  <Button
                    component={Link}
                    href="/register"
                    variant="contained"
                    sx={{
                      fontWeight: 700,
                      bgcolor: 'var(--plab-green)',
                      color: 'var(--plab-black)',
                      fontSize: '0.9rem',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: 'var(--plab-green)', opacity: 0.9 }
                    }}
                  >
                    Sign Up
                  </Button>
                </>
              )}
            </Box>

          </Toolbar>
        </Container>
      </AppBar>

      {/* Main Content — extra padding on mobile so content is not hidden behind BottomNav */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          paddingBottom: { xs: 'calc(56px + env(safe-area-inset-bottom, 0px))', md: 0 },
        }}
      >
        {children}
      </Box>

      {/* Footer & Mobile Nav — hidden on admin panel */}
      {!isAdminPanel && <Footer />}
      {!isAdminPanel && <BottomNav />}

      {/* Global Support FAB */}
      <button
        type="button"
        className={styles.supportFab}
        onClick={() => setSupportPanelOpen(true)}
        aria-label="Help & Support"
      >
        <SupportAgentIcon sx={{ fontSize: 28 }} />
      </button>
      <SupportPanel open={supportPanelOpen} onClose={() => setSupportPanelOpen(false)} />

      <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Log out</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to log out?</Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setLogoutDialogOpen(false)} color="inherit" sx={{ textTransform: 'none' }}>
            Cancel
          </Button>
          <Button onClick={handleLogoutConfirm} variant="contained" color="error" sx={{ textTransform: 'none' }}>
            Log out
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

