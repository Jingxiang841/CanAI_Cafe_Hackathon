import LightbulbIcon from '@mui/icons-material/Lightbulb';
import {
  Box,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  Typography,
} from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

export default function RecommendationCard({ recommendations }) {
  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        minHeight: dashboardConfig.layout.recommendationMinHeight,
        border: '1px solid var(--border)',
        background:
          'linear-gradient(145deg, var(--surface) 0%, var(--primary-light) 100%)',
        borderRadius: 2,
        boxShadow: 'var(--shadow-sm)',
        animation: 'fadeSlideUp 0.5s ease both',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',

        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: 'var(--shadow-md)',
        },
      }}
    >
      <CardContent
        sx={{
          p: 3,

          '&:last-child': {
            pb: 3,
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.25,
            mb: 2,
          }}
        >
          <Box
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              backgroundColor: '#fff7ed',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <LightbulbIcon sx={{ color: 'var(--warning)', fontSize: 24 }} />
          </Box>

          <Typography
            variant="h6"
            sx={{
              fontWeight: 950,
              color: 'var(--text-heading)',
              letterSpacing: '-0.03em',
            }}
          >
            {dashboardConfig.charts.recommendations.title}
          </Typography>
        </Box>

        <List disablePadding>
          {recommendations.map((recommendation) => (
            <ListItem
              key={recommendation}
              sx={{
                px: 0,
                py: 0.8,
                alignItems: 'flex-start',
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 22,
                  mt: '7px',
                }}
              >
                <Box
                  sx={{
                    width: 7,
                    height: 7,
                    borderRadius: 2,
                    backgroundColor: 'var(--primary)',
                  }}
                />
              </ListItemIcon>

              <Typography
                variant="body2"
                sx={{
                  color: 'var(--text-main)',
                  fontSize: '0.98rem',
                  lineHeight: 1.65,
                }}
              >
                {recommendation}
              </Typography>
            </ListItem>
          ))}
        </List>
      </CardContent>
    </Card>
  );
}