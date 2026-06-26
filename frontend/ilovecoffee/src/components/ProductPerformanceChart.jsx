import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
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

  const formatOrders = (value) =>
    `${Number(value || 0).toLocaleString('en-CA')} orders`;

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
            mb: 0.5,
            color: 'var(--text-heading)',
            letterSpacing: '-0.03em',
          }}
        >
          {productPerformance.title}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            display: 'block',
            color: 'var(--text-muted)',
            fontWeight: 700,
            mb: 2,
          }}
        >
          Food and drink items ranked by order count
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
            <BarChart
              data={data}
              margin={{
                top: 10,
                right: 20,
                bottom: 8,
                left: 8,
              }}
            >
              <CartesianGrid strokeDasharray={gridDash} />

              <XAxis
                dataKey={productPerformance.nameKey}
                tick={{
                  fill: 'var(--text-muted)',
                  fontWeight: 700,
                }}
                axisLine={{
                  stroke: 'var(--border)',
                }}
                tickLine={false}
              />

              <YAxis
                tickFormatter={(value) => Number(value).toLocaleString('en-CA')}
                tick={{
                  fill: 'var(--text-muted)',
                  fontWeight: 700,
                }}
                axisLine={{
                  stroke: 'var(--border)',
                }}
                tickLine={false}
              />

              <Tooltip
                cursor={false}
                formatter={(value) => [
                  formatOrders(value),
                  productPerformance.barName,
                ]}
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

              <Legend
                verticalAlign="bottom"
                formatter={(value) => (
                  <span
                    style={{
                      color: 'var(--text-heading)',
                      fontWeight: 800,
                    }}
                  >
                    {value}
                  </span>
                )}
              />

              <Bar
                dataKey={productPerformance.valueKey}
                name={productPerformance.barName}
                fill="var(--chart-product)"
                radius={[8, 8, 0, 0]}
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