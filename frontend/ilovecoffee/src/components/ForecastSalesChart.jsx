import { useMemo, useState } from 'react';

import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CircularProgress,
  Typography,
} from '@mui/material';

import {
  CartesianGrid,
  LabelList,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import dashboardConfig from '../config/dashboardConfig';

function EndLineLabel({ x, y, index, dataLength, label, color }) {
  if (index !== dataLength - 1) {
    return null;
  }

  return (
    <text
      x={x + 10}
      y={y + 4}
      fill={color}
      fontSize={13}
      fontWeight={900}
      textAnchor="start"
    >
      {label}
    </text>
  );
}

export default function ForecastSalesChart({
  data,
  isForecastLoading = false,
  forecastErrorMessage = '',
  isForecastEmpty = false,
}) {
  const { forecastSales } = dashboardConfig.charts;
  const { gridDash } = dashboardConfig.chartStyles;

  const [visibleMonths, setVisibleMonths] = useState(3);

  const chartData = useMemo(() => {
    return data.slice(0, visibleMonths);
  }, [data, visibleMonths]);

  const yAxisMax = useMemo(() => {
    const values = chartData.flatMap((item) => [
      Number(item[forecastSales.actualKey]) || 0,
      Number(item[forecastSales.forecastKey]) || 0,
    ]);

    const maxValue = Math.max(...values, 0);
    const paddedMax = maxValue * 1.18;

    return Math.max(Math.ceil(paddedMax / 1000) * 1000, 100);
  }, [chartData, forecastSales.actualKey, forecastSales.forecastKey]);

  const actualColor = '#22c55e';
  const forecastColor = '#f59e0b';

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
        <Box
          sx={{
            mb: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: {
              xs: 'flex-start',
              sm: 'center',
            },
            flexDirection: {
              xs: 'column',
              sm: 'row',
            },
            gap: 1.5,
          }}
        >
          <Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 950,
                color: 'var(--text-heading)',
                letterSpacing: '-0.03em',
              }}
            >
              {forecastSales.title}
            </Typography>

            <Typography
              variant="caption"
              sx={{
                color: 'var(--text-muted)',
                fontWeight: 700,
              }}
            >
              Actual 2023 compared with forecasted 2024 sales
            </Typography>
          </Box>

          <ButtonGroup
            size="small"
            sx={{
              backgroundColor: 'var(--surface-soft)',
              borderRadius: 2,
              border: '1px solid var(--border)',
              overflow: 'hidden',

              '& .MuiButton-root': {
                textTransform: 'none',
                fontWeight: 900,
                borderColor: 'var(--border)',
                color: 'var(--text-heading)',
                px: 1.5,
              },
            }}
          >
            {forecastSales.rangeOptions.map((option) => {
              const isSelected = visibleMonths === option.value;

              return (
                <Button
                  key={option.value}
                  onClick={() => setVisibleMonths(option.value)}
                  sx={{
                    backgroundColor: isSelected
                      ? 'var(--primary)'
                      : 'transparent',
                    color: isSelected ? '#ffffff' : 'var(--text-heading)',

                    '&:hover': {
                      backgroundColor: isSelected
                        ? 'var(--primary-dark)'
                        : 'var(--primary-light)',
                    },
                  }}
                >
                  {option.label}
                </Button>
              );
            })}
          </ButtonGroup>
        </Box>

        {isForecastLoading && (
          <Box
            sx={{
              height: {
                xs: 330,
                md: dashboardConfig.layout.smallChartHeight,
              },
              display: 'grid',
              placeItems: 'center',
              gap: 1.5,
            }}
          >
            <CircularProgress sx={{ color: 'var(--primary)' }} />
            <Typography sx={{ color: 'var(--text-muted)', fontWeight: 700 }}>
              Loading forecast data...
            </Typography>
          </Box>
        )}

        {!isForecastLoading && forecastErrorMessage && (
          <Alert severity="error" sx={{ borderRadius: 2 }}>
            {forecastErrorMessage}
          </Alert>
        )}

        {!isForecastLoading && !forecastErrorMessage && isForecastEmpty && (
          <Box
            sx={{
              height: {
                xs: 330,
                md: dashboardConfig.layout.smallChartHeight,
              },
              display: 'grid',
              placeItems: 'center',
              textAlign: 'center',
              px: 2,
            }}
          >
            <Typography sx={{ color: 'var(--text-muted)', fontWeight: 700 }}>
              No forecast prediction data available for this selection.
            </Typography>
          </Box>
        )}

        {!isForecastLoading && !forecastErrorMessage && !isForecastEmpty && (
          <Box
            sx={{
              height: {
                xs: 330,
                md: dashboardConfig.layout.smallChartHeight,
              },
            }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{
                  top: 36,
                  right: 70,
                  bottom: 10,
                  left: 5,
                }}
              >
              <CartesianGrid strokeDasharray={gridDash} />

              <XAxis
                dataKey={forecastSales.xKey}
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
                domain={[0, yAxisMax]}
                tickCount={6}
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
                formatter={(value, name) => {
                  if (name === forecastSales.actualName) {
                    return [value, 'Actual 2023'];
                  }

                  return [value, 'Forecast 2024'];
                }}
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

              <Legend />

              <Line
                type="monotone"
                dataKey={forecastSales.actualKey}
                name={forecastSales.actualName}
                stroke={actualColor}
                strokeWidth={3}
                connectNulls
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: actualColor,
                  stroke: actualColor,
                }}
                activeDot={{
                  r: 7,
                  fill: actualColor,
                  stroke: actualColor,
                }}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey={forecastSales.actualKey}
                  content={(props) => (
                    <EndLineLabel
                      {...props}
                      dataLength={chartData.length}
                      label="2023"
                      color={actualColor}
                    />
                  )}
                />
              </Line>

              <Line
                type="monotone"
                dataKey={forecastSales.forecastKey}
                name={forecastSales.forecastName}
                stroke={forecastColor}
                strokeWidth={3}
                strokeDasharray="6 6"
                connectNulls
                dot={{
                  r: 4,
                  strokeWidth: 2,
                  fill: forecastColor,
                  stroke: forecastColor,
                }}
                activeDot={{
                  r: 7,
                  fill: forecastColor,
                  stroke: forecastColor,
                }}
                isAnimationActive
                animationDuration={900}
                animationEasing="ease-out"
              >
                <LabelList
                  dataKey={forecastSales.forecastKey}
                  content={(props) => (
                    <EndLineLabel
                      {...props}
                      dataLength={chartData.length}
                      label="2024"
                      color={forecastColor}
                    />
                  )}
                />
              </Line>
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}
      </CardContent>
    </Card>
  );
}