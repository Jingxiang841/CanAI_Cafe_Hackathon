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

export default function OrderTypePerformanceChart({ data }) {
  const { orderTypePerformance } = dashboardConfig.charts;
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
          {orderTypePerformance.title}
        </Typography>

        <Box
          sx={{
            height: {
              xs: 300,
              md: dashboardConfig.layout.chartHeight,
            },
          }}
        >
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} layout="vertical">
              <CartesianGrid strokeDasharray={gridDash} />
              <XAxis type="number" />
              <YAxis
                type="category"
                dataKey={orderTypePerformance.nameKey}
                width={100}
              />
              <Tooltip
              cursor={false}
              contentStyle={{
                borderRadius: '10px',
                border: '1px solid var(--border)',
                background: 'var(--surface)',
                color: 'var(--text-heading)',
                boxShadow: 'var(--shadow-md)',
                fontWeight: 700,
              }}
              labelStyle={{
                color: 'var(--text-heading)',
                fontWeight: 900,
              }}
            />
            <Bar
              dataKey={orderTypePerformance.valueKey}
              name={orderTypePerformance.barName}
              fill="var(--chart-order-type)"
              radius={[0, 8, 8, 0]}
              activeBar={{
                fill: 'var(--primary)',
                stroke: 'var(--primary-dark)',
                strokeWidth: 2,
              }}
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