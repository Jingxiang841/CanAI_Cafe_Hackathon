import DashboardIcon from '@mui/icons-material/Dashboard';
import { AppBar, Box, Toolbar, Typography } from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

export default function Header() {
  return (
    <AppBar
      position="static"
      elevation={0}
      sx={{
        backgroundColor: 'var(--surface)',
        color: 'var(--text-heading)',
        borderBottom: '1px solid var(--border)',
      }}
    >
      <Toolbar>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
          }}
        >
          <DashboardIcon sx={{ color: 'var(--primary)' }} />

          <Typography
            variant="h6"
            component="h1"
            sx={{
              fontWeight: 800,
            }}
          >
            {dashboardConfig.appName}
          </Typography>
        </Box>
      </Toolbar>
    </AppBar>
  );
}