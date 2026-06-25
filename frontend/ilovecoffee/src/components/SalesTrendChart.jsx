import {
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Box, Card, CardContent, Typography } from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

export default function SalesTrendChart({ data }) {
  const { salesTrend } = dashboardConfig.charts;
  const { gridDash, salesColor } = dashboardConfig.chartStyles;

  return (
    <Card
      elevation={0}
      sx={{
        height: '100%',
        border: '1px solid var(--border)',
        backgroundColor: 'var(--surface)',
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 950,
            mb: 2,
            color: 'var(--text-heading)',
            letterSpacing: '-0.03em',
          }}
        >
          {salesTrend.title}
        </Typography>

        <Box sx={{ height: { xs: 340, md: dashboardConfig.layout.chartHeight } }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray={gridDash} />
              <XAxis dataKey={salesTrend.xKey} />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey={salesTrend.yKey}
                name={salesTrend.lineName}
                stroke="var(--chart-sales)"
                strokeWidth={3}
                dot={{ r: 4 }}
                activeDot={{ r: 7 }}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />
            </LineChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}