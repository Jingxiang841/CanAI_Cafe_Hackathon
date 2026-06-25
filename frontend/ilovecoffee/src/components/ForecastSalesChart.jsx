import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Box, Card, CardContent, Typography } from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

export default function ForecastSalesChart({ data }) {
  const { forecastSales } = dashboardConfig.charts;
  const { gridDash } = dashboardConfig.chartStyles;

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
          {forecastSales.title}
        </Typography>

        <Box
          sx={{
            height: {
              xs: 330,
              md: dashboardConfig.layout.smallChartHeight,
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data}>
              <CartesianGrid strokeDasharray={gridDash} />
              <XAxis dataKey={forecastSales.xKey} />
              <YAxis />
              <Tooltip />
              <Legend />

              <Line
                type="monotone"
                dataKey={forecastSales.actualKey}
                name={forecastSales.actualName}
                stroke="var(--chart-actual)"
                strokeWidth={3}
                connectNulls
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />

              <Line
                type="monotone"
                dataKey={forecastSales.forecastKey}
                name={forecastSales.forecastName}
                stroke="var(--chart-forecast)"
                strokeWidth={3}
                strokeDasharray="6 6"
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