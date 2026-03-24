import React from 'react';
import { Paper, BottomNavigation, BottomNavigationAction, Box } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import GroupIcon from '@mui/icons-material/Group';
import PlaceIcon from '@mui/icons-material/Place';
import PersonIcon from '@mui/icons-material/Person';
import { useRouter } from 'next/router';
import { useAuth } from '@/contexts/AuthContext';

const NAV_ITEMS = [
  { path: '/', label: 'Match', icon: <HomeIcon /> },
  { path: '/team', label: 'Team', icon: <GroupIcon /> },
  { path: '/rental', label: 'Stadium', icon: <PlaceIcon /> },
  { path: '/mypage', label: 'My Page', icon: <PersonIcon /> },
] as const;

export default function BottomNav() {
  const router = useRouter();
  const { isAuthenticated } = useAuth();
  const currentPath = router.pathname;

  const value = React.useMemo(() => {
    if (currentPath === '/login' || currentPath === '/register') return 3; // My Page / Login tab
    const idx = NAV_ITEMS.findIndex((item) => {
      if (item.path === '/') return currentPath === '/';
      return currentPath.startsWith(item.path);
    });
    return idx >= 0 ? idx : 0;
  }, [currentPath]);

  const handleChange = (_: React.SyntheticEvent, newValue: number) => {
    const item = NAV_ITEMS[newValue];
    if (item.path === '/mypage' && !isAuthenticated) {
      router.push('/login');
      return;
    }
    router.push(item.path);
  };

  return (
    <Box
      sx={{
        display: { xs: 'block', md: 'none' },
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        bgcolor: 'background.paper',
      }}
    >
      <Paper
        elevation={0}
        sx={{
          borderTop: '1px solid',
          borderColor: 'divider',
          borderRadius: 0,
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={handleChange}
          sx={{
            height: 56,
            bgcolor: 'background.paper',
            '& .MuiBottomNavigationAction-root': {
              color: 'text.secondary',
              minWidth: 0,
              padding: '6px 0',
              '&.Mui-selected': {
                color: '#00E377',
                fontWeight: 700,
              },
            },
            '& .MuiBottomNavigationAction-label': {
                fontSize: '0.7rem',
                '&.Mui-selected': { fontSize: '0.7rem' },
              },
          }}
        >
          {NAV_ITEMS.map((item, idx) => (
            <BottomNavigationAction
              key={item.path}
              label={item.path === '/mypage' && !isAuthenticated ? 'Login' : item.label}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Paper>
    </Box>
  );
}
