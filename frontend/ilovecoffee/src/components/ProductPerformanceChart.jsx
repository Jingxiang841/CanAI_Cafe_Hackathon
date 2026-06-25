import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Box, Card, CardContent, Typography } from '@mui/material';

import dashboardConfig from '../config/dashboardConfig';

export default function ProductPerformanceChart({ data }) {
  const { productPerformance } = dashboardConfig.charts;
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
          {productPerformance.title}
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
            <BarChart data={data}>
              <CartesianGrid strokeDasharray={gridDash} />
              <XAxis dataKey={productPerformance.nameKey} />
              <YAxis />
              <Tooltip />
              <Bar
                dataKey={productPerformance.valueKey}
                name={productPerformance.barName}
                fill="var(--chart-product)"
                radius={[10, 10, 0, 0]}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              />
            </BarChart>
          </ResponsiveContainer>
        </Box>
      </CardContent>
    </Card>
  );
}