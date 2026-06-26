import { Box } from '@mui/material';

import Header from './Header';

export default function MainLayout({ children }) {
  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundColor: 'var(--page-bg)',
        color: 'var(--text-main)',
      }}
    >
      <Header />

      <Box
        component="main"
        sx={{
          maxWidth: '1500px',
          mx: 'auto',
          px: {
            xs: 2,
            sm: 3,
            md: 5,
          },
          py: 4,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}