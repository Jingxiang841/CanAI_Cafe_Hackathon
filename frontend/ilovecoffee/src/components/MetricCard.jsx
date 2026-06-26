import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import { Box, Card, CardContent, Typography } from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

export default function MetricCard({ label, value, prefix = '', suffix = '' }) {
  const formattedValue =
    typeof value === 'number' ? value.toLocaleString('en-CA') : value;

  return (
    <Card
      elevation={0}
      sx={{
        minHeight: dashboardConfig.layout.metricMinHeight,
        height: '100%',
        border: '1px solid var(--border)',
        background:
          'linear-gradient(145deg, var(--surface) 0%, var(--surface-soft) 100%)',
        borderRadius: 2,
        boxShadow: 'var(--shadow-sm)',
        animation: 'softPop 0.45s ease both',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',

        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 'var(--shadow-md)',
        },
      }}
    >
      <CardContent
        sx={{
          height: '100%',
          p: 3,

          '&:last-child': {
            pb: 3,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            gap: 2,
            mb: 2.5,
          }}
        >
          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-muted)',
              fontWeight: 900,
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
            }}
          >
            {label}
          </Typography>

          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              display: 'grid',
              placeItems: 'center',
              backgroundColor: 'var(--primary-light)',
            }}
          >
            <TrendingUpIcon
              sx={{
                color: 'var(--primary)',
                fontSize: 20,
              }}
            />
          </Box>
        </Box>

        <Typography
          variant="h4"
          sx={{
            color: 'var(--text-heading)',
            fontWeight: 950,
            letterSpacing: '-0.04em',
          }}
        >
          {prefix}
          {formattedValue}
          {suffix}
        </Typography>
      </CardContent>
    </Card>
  );
}